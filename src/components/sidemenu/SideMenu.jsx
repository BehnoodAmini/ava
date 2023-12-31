import React from "react";
import { NavLink } from "react-router-dom";

import "./SideMenu.css";

import alefba from '../../assets/images/alefba-group-1.png';
import archiveIcon from '../../assets/images/archive-icon-1@2x.png';
import speechIcon from '../../assets/images/speech-icon-1@2x.png';
import line1Icon from '../../assets/images/line-1-1.svg';
import line2Icon from '../../assets/images/line-2-1.svg';

const SideMenu = ({ className }) => {
  return (
    <div className={`side-menu ${className}`}>
      <div className="overlap">
        <div className="back">
          <div className="overlap-group">
            <div className="div" />
            <img
              className="alefba-group"
              alt="Alefba group"
              src={alefba}
            />
          </div>
        </div>
        <div className="site-title">
          <div className="element">آوا</div>
          <div className="icon">
            <img
              className="line"
              alt="Line"
              src={line1Icon}
            />
            <img
              className="img"
              alt="Line"
              src={line2Icon}
            />
            <img
              className="line-2"
              alt="Line"
              src={line2Icon}
            />
          </div>
        </div>
        <NavLink
          className={({ isActive }) => (isActive ? 'goftar-active' : 'goftar-inactive')}
          to={'/'}
        >
              <img
                className="speech-icon"
                alt="Speech icon"
                src={speechIcon}
              />
              <div className="goftar-text">تبدیل گفتار</div>
        </NavLink>
        <NavLink
          className={({ isActive }) => (isActive ? 'archive-active' : 'archive-inactive')}
          to={'/archive'}
        >
              <img
                className="archive-icon"
                alt="Archive icon"
                src={archiveIcon}
              />
              <div className="archive-text">آرشیو</div>
        </NavLink>
      </div>
    </div >
  );
};

export default SideMenu;