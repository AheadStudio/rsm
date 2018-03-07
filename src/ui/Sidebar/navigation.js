import React from "react";
import { Link } from "react-router";

const NavItem = ({ item, inActive }) => {
  return (
    <div className={inActive ? "sidebar__item active" : "sidebar__item"}>
      <Link to={item.src}>
        <span className="icon">
          <img className={`ic ${item.classIcon}`} src={item.img} alt="" />
        </span>
        <span className="sidebar__item-text">
          <font>{item.name}</font>
        </span>
      </Link>
    </div>
  );
};


export const Navigaion = ({ nav, activeRouter }) => {
  return (
    <div className="sidebar__navigation">
      {nav.map((item, index) => 
        <NavItem
          key={index}
          item={item}
          inActive={item.src === activeRouter}
        />
      )}
    </div>
  );
};