import React from 'react';

function Button(props) {
	return (
		<button type="button" name="test">
			{props.text}
		</button>
	);
}

Button.defaultProps = {
	text: 'Default Text',
};

export default Button;
