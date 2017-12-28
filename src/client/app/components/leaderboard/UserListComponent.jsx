import React from 'react';
import './css/userList.css';

export default function UserListComponent(props) {
	return (
		<div>
			{props.data.map(user =>
				<div key={user.username}>
					{ user.title && <div className="title-color title">{user.title}</div> }
					<div className="brighter-color name">{user.username}</div>
					<div className="brighter-color rating">{Math.round(user[props.ratingType])}</div>
				</div>
			)}
		</div>
	);
}
