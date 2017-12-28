import React from 'react';
import { Link } from 'react-router';
import './css/userLink.css';

export default function UserLinkComponent(props) {
	return (
		<div>
			<Link to={`/user/${props.user.username}`}>
				{ props.user.title && <div className="title">{props.user.title}</div> }
				<div className="brighter-color username">{props.user.username}</div>
				{ props.rating &&
					<div className="brighter-color rating">
						({Math.round(props.rating)})
					</div>
				}
			</Link>
		</div>
	);
}
