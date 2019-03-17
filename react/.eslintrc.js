module.exports = {
	extends: [
		// https://eslint.org/docs/rules/
		'eslint:recommended',
		// react\node_modules\eslint-config-react-app\index.js
		'react-app'
	],
	rules: {
		// disable rules from base configurations
		'no-console': 'off',
		'comma-dangle': ['error', 'never']
	}
};
