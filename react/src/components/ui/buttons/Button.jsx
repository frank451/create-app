import React from 'react';

import * as styles from './button.scss';
console.log('styles', styles);

function Button(props) {
	return (
		<button type="button" className={styles.button}>
			{props.text}
		</button>
	);
}

Button.defaultProps = {
	text: 'Default Text',
};

export default Button;
