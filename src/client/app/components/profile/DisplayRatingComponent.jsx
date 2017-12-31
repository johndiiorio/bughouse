import React from 'react';

export default function DisplayRatingComponent(props) {
	return (
		<div>
			<h3>{props.ratingType}</h3>
			<h5>Rating: {props.rating}</h5>
			<h5>Rating Deviation: {props.rd}</h5>
		</div>
	);
}
