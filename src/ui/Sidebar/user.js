import React from "react";

export const UserCard = ({ user }) => (
  <div className="user">
    <div className="user__avatar">
      <div className="user__avatar-wrap">
        {user.avatar ? <img src={user.avatar} alt="" /> : null}
      </div>
    </div>
    <div className="user__data">
      <div className="user__data-text">
        <p className="user__name">{user.name}</p>
        {user.job ? <p className="user__info">{user.job}</p> : null}
      </div>
    </div>
  </div>
);
