const _module = require('./webpack-config/module');
const plugins = require('./webpack-config/plugins');
const optimization = require('./webpack-config/optimization');

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const resolve = require('resolve');
const PnpWebpackPlugin = require('pnp-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const safePostCssParser = require('postcss-safe-parser');
const ManifestPlugin = require('webpack-manifest-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');
const paths = require('./paths');
const getClientEnvironment = require('./env');
const ModuleNotFoundPlugin = require('react-dev-utils/ModuleNotFoundPlugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin-alt');
const typescriptFormatter = require('react-dev-utils/typescriptFormatter');

// Source maps are resource heavy and can cause out of memory issue for large source files.
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
// Some apps do not need the benefits of saving a web request, so not inlining the chunk
// makes for a smoother build process.
const shouldInlineRuntimeChunk = process.env.INLINE_RUNTIME_CHUNK !== 'false';

// Check if TypeScript is setup
const useTypeScript = fs.existsSync(paths.appTsConfig);

// style files regexes
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

// This is the production and development configuration.
// It is focused on developer experience, fast rebuilds, and a minimal bundle.
module.exports = function(webpackEnv) {
	const isEnvDevelopment = webpackEnv === 'development';
	const isEnvProduction = webpackEnv === 'production';

	// Webpack uses `publicPath` to determine where the app is being served from.
	// It requires a trailing slash, or the file assets will get an incorrect path.
	// In development, we always serve from the root. This makes config easier.
	const publicPath = isEnvProduction ? paths.servedPath : isEnvDevelopment && '/';
	// Some apps do not use client-side routing with pushState.
	// For these, "homepage" can be set to "." to enable relative asset paths.
	const shouldUseRelativeAssetPaths = publicPath === './';

	// `publicUrl` is just like `publicPath`, but we will provide it to our app
	// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
	// Omit trailing slash as %PUBLIC_URL%/xyz looks better than %PUBLIC_URL%xyz.
	const publicUrl = isEnvProduction ? publicPath.slice(0, -1) : isEnvDevelopment && '';
	// Get environment variables to inject into our app.
	const env = getClientEnvironment(publicUrl);

	// common function to get style loaders
	const getStyleLoaders = (cssOptions, preProcessor) => {
		const loaders = [
			isEnvDevelopment && require.resolve('style-loader'),
			isEnvProduction && {
				loader: MiniCssExtractPlugin.loader,
				options: Object.assign(
					{},
					shouldUseRelativeAssetPaths
						? {
								publicPath: '../../',
						  }
						: undefined
				),
			},
			{
				loader: require.resolve('css-loader'),
				options: cssOptions,
			},
			{
				// Options for PostCSS as we reference these options twice
				// Adds vendor prefixing based on your specified browser support in
				// package.json
				loader: require.resolve('postcss-loader'),
				options: {
					// Necessary for external CSS imports to work
					// https://github.com/facebook/create-react-app/issues/2677
					ident: 'postcss',
					plugins: () => [
						require('postcss-flexbugs-fixes'),
						require('postcss-preset-env')({
							autoprefixer: {
								flexbox: 'no-2009',
							},
							stage: 3,
						}),
					],
					sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
				},
			},
		].filter(Boolean);
		if (preProcessor) {
			loaders.push({
				loader: require.resolve(preProcessor),
				options: {
					sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
				},
			});
		}
		return loaders;
	};

	return {
		mode: isEnvProduction ? 'production' : isEnvDevelopment && 'development',
		// Stop compilation early in production
		bail: isEnvProduction,
		devtool: isEnvProduction ? (shouldUseSourceMap ? 'source-map' : false) : isEnvDevelopment && 'eval-source-map',
		// These are the "entry points" to our application.
		// This means they will be the "root" imports that are included in JS bundle.
		entry: [
			// Include an alternative client for WebpackDevServer. A client's job is to
			// connect to WebpackDevServer by a socket and get notified about changes.
			// When you save a file, the client will either apply hot updates (in case
			// of CSS changes), or refresh the page (in case of JS changes). When you
			// make a syntax error, this client will display a syntax error overlay.
			// Note: instead of the default WebpackDevServer client, we use a custom one
			// to bring better experience for Create React App users. You can replace
			// the line below with these two lines if you prefer the stock client:
			// require.resolve('webpack-dev-server/client') + '?/',
			// require.resolve('webpack/hot/dev-server'),
			isEnvDevelopment && require.resolve('react-dev-utils/webpackHotDevClient'),
			// Finally, this is your app's code:
			paths.appIndexJs,
			// We include the app code last so that if there is a runtime error during
			// initialization, it doesn't blow up the WebpackDevServer client, and
			// changing JS code would still trigger a refresh.
		].filter(Boolean),
		output: {
			// The build folder.
			path: isEnvProduction ? paths.appBuild : undefined,
			// Add /* filename */ comments to generated require()s in the output.
			pathinfo: isEnvDevelopment,
			// There will be one main bundle, and one file per asynchronous chunk.
			// In development, it does not produce real files.
			filename: isEnvProduction ? 'static/js/[name].[chunkhash:8].js' : isEnvDevelopment && 'static/js/bundle.js',
			// There are also additional JS chunk files if you use code splitting.
			chunkFilename: isEnvProduction
				? 'static/js/[name].[chunkhash:8].chunk.js'
				: isEnvDevelopment && 'static/js/[name].chunk.js',
			// We inferred the "public path" (such as / or /my-project) from homepage.
			// We use "/" in development.
			publicPath: publicPath,
			// Point sourcemap entries to original disk location (format as URL on Windows)
			devtoolModuleFilenameTemplate: isEnvProduction
				? info => path.relative(paths.appSrc, info.absoluteResourcePath).replace(/\\/g, '/')
				: isEnvDevelopment && (info => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')),
		},

		optimization: optimization(
			isEnvProduction,
			TerserPlugin,
			shouldUseSourceMap,
			OptimizeCSSAssetsPlugin,
			safePostCssParser
		),
		resolve: {
			// This allows you to set a fallback for where Webpack should look for modules.
			// We placed these paths second because we want `node_modules` to "win"
			// if there are any conflicts. This matches Node resolution mechanism.
			// https://github.com/facebook/create-react-app/issues/253
			modules: ['node_modules'].concat(
				// It is guaranteed to exist because we tweak it in `env.js`
				process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
			),
			// These are the reasonable defaults supported by the Node ecosystem.
			// We also include JSX as a common component filename extension to support
			// some tools, although we do not recommend using it, see:
			// https://github.com/facebook/create-react-app/issues/290
			// `web` extension prefixes have been added for better support
			// for React Native Web.
			extensions: paths.moduleFileExtensions
				.map(ext => `.${ext}`)
				.filter(ext => useTypeScript || !ext.includes('ts')),
			alias: {
				// Support React Native Web
				// https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
				'react-native': 'react-native-web',
				ui: path.resolve(paths.appSrc, 'components/ui/'),
			},
			plugins: [
				// Adds support for installing with Plug'n'Play, leading to faster installs and adding
				// guards against forgotten dependencies and such.
				PnpWebpackPlugin,
				// Prevents users from importing files from outside of src/ (or node_modules/).
				// This often causes confusion because we only process files within src/ with babel.
				// To fix this, we prevent you from importing files out of src/ -- if you'd like to,
				// please link the files into your node_modules/ and let module-resolution kick in.
				// Make sure your source files are compiled, as they will not be processed in any way.
				new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson]),
			],
		},
		resolveLoader: {
			plugins: [
				// Also related to Plug'n'Play, but this time it tells Webpack to load its loaders
				// from the current package.
				PnpWebpackPlugin.moduleLoader(module),
			],
		},

		module: _module(
			paths,
			isEnvProduction,
			isEnvDevelopment,
			cssRegex,
			cssModuleRegex,
			sassRegex,
			sassModuleRegex,
			getStyleLoaders,
			getCSSModuleLocalIdent
		),

		plugins: plugins(
			env,
			isEnvProduction,
			isEnvDevelopment,
			publicPath,
			paths,
			webpack,
			useTypeScript,
			HtmlWebpackPlugin,
			InterpolateHtmlPlugin,
			ModuleNotFoundPlugin,
			CaseSensitivePathsPlugin,
			WatchMissingNodeModulesPlugin,
			ManifestPlugin
		),

		// Some libraries import Node modules but don't use them in the browser.
		// Tell Webpack to provide empty mocks for them so importing them works.
		node: {
			module: 'empty',
			dgram: 'empty',
			dns: 'mock',
			fs: 'empty',
			net: 'empty',
			tls: 'empty',
			child_process: 'empty',
		},
		// Turn off performance processing because we utilize
		// our own hints via the FileSizeReporter
		performance: false,
	};
};
