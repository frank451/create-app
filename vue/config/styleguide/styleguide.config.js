const webpackConfig = require('../webpack.config.js');
module.exports = {
	webpackConfig: webpackConfig,

	sections: [
		{
			name: 'UI elements',
			content: '../../src/components/ui/ui.md',
			components: '../../src/components/ui/*.jsx',
		},
	],
};
