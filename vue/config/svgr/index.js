function template({ template }, opts, { imports, componentName, props, jsx, exports }) {
	componentName.name = componentName.name.replace(/Svg/g, '');
	return template.ast`
	  import * as React from 'react';
	  const ${componentName} = (props) => ${jsx};
	  export default ${componentName};
	`;
}
module.exports = template;
