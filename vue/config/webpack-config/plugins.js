module.exports = function(
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
	ManifestPlugin,
	VueLoaderPlugin
) {
	return [
		// Generates an `index.html` file with the <script> injected.
		new HtmlWebpackPlugin(
			Object.assign(
				{},
				{
					inject: true,
					template: paths.appHtml
				},
				isEnvProduction
					? {
							minify: {
								removeComments: true,
								collapseWhitespace: true,
								removeRedundantAttributes: true,
								useShortDoctype: true,
								removeEmptyAttributes: true,
								removeStyleLinkTypeAttributes: true,
								keepClosingSlash: true,
								minifyJS: true,
								minifyCSS: true,
								minifyURLs: true
							}
					  }
					: undefined
			)
		),
		// Inlines the webpack runtime script. This script is too small to warrant
		// a network request.
		isEnvProduction &&
			shouldInlineRuntimeChunk &&
			new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime~.+[.]js/]),
		// Makes some environment variables available in index.html.
		// The public URL is available as %PUBLIC_URL% in index.html, e.g.:
		// <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
		// In production, it will be an empty string unless you specify "homepage"
		// in `package.json`, in which case it will be the pathname of that URL.
		// In development, this will be an empty string.
		new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw),
		// This gives some necessary context to module not found errors, such as
		// the requesting resource.
		new ModuleNotFoundPlugin(paths.appPath),
		// Makes some environment variables available to the JS code, for example:
		// if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
		// It is absolutely essential that NODE_ENV is set to production
		// during a production build.
		// Otherwise React will be compiled in the very slow development mode.
		new webpack.DefinePlugin(env.stringified),
		// This is necessary to emit hot updates (currently CSS only):
		isEnvDevelopment && new webpack.HotModuleReplacementPlugin(),
		// Watcher doesn't work well if you mistype casing in a path so we use
		// a plugin that prints an error when you attempt to do this.
		// See https://github.com/facebook/create-react-app/issues/240
		isEnvDevelopment && new CaseSensitivePathsPlugin(),
		// If you require a missing module and then `npm install` it, you still have
		// to restart the development server for Webpack to discover it. This plugin
		// makes the discovery automatic so you don't have to restart.
		// See https://github.com/facebook/create-react-app/issues/186
		isEnvDevelopment && new WatchMissingNodeModulesPlugin(paths.appNodeModules),
		isEnvProduction &&
			new MiniCssExtractPlugin({
				// Options similar to the same options in webpackOptions.output
				// both options are optional
				filename: 'static/css/[name].[contenthash:8].css',
				chunkFilename: 'static/css/[name].[contenthash:8].chunk.css'
			}),
		// Generate a manifest file which contains a mapping of all asset filenames
		// to their corresponding output file so that tools can pick it up without
		// having to parse `index.html`.
		new ManifestPlugin({
			fileName: 'asset-manifest.json',
			publicPath: publicPath
		}),
		// Moment.js is an extremely popular library that bundles large locale files
		// by default due to how Webpack interprets its code. This is a practical
		// solution that requires the user to opt into importing specific locales.
		// https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
		// You can remove this if you don't use Moment.js:
		new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
		// Generate a service worker script that will precache, and keep up to date,
		// the HTML & assets that are part of the Webpack build.
		isEnvProduction &&
			new WorkboxWebpackPlugin.GenerateSW({
				clientsClaim: true,
				exclude: [/\.map$/, /asset-manifest\.json$/],
				importWorkboxFrom: 'cdn',
				navigateFallback: publicUrl + '/index.html',
				navigateFallbackBlacklist: [
					// Exclude URLs starting with /_, as they're likely an API call
					new RegExp('^/_'),
					// Exclude URLs containing a dot, as they're likely a resource in
					// public/ and not a SPA route
					new RegExp('/[^/]+\\.[^/]+$')
				]
			}),
		// TypeScript type checking
		useTypeScript &&
			new ForkTsCheckerWebpackPlugin({
				typescript: resolve.sync('typescript', {
					basedir: paths.appNodeModules
				}),
				async: false,
				checkSyntacticErrors: true,
				tsconfig: paths.appTsConfig,
				compilerOptions: {
					module: 'esnext',
					moduleResolution: 'node',
					resolveJsonModule: true,
					isolatedModules: true,
					noEmit: true,
					jsx: 'preserve'
				},
				reportFiles: [
					'**',
					'!**/*.json',
					'!**/__tests__/**',
					'!**/?(*.)(spec|test).*',
					'!**/src/setupProxy.*',
					'!**/src/setupTests.*'
				],
				watch: paths.appSrc,
				silent: true,
				formatter: typescriptFormatter
			}),
		new VueLoaderPlugin()
	].filter(Boolean);
};
