import React from 'react';

export default function NotFoundComponent() {
	const textStyle = {
		fontWeight: 'bold',
		paddingLeft: '15px'
	};
	return (
		<h1 className="brighter-color text-center" style={textStyle}>404 Not Found</h1>
	);
}
