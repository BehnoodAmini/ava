import React, { useState } from "react";

import "./Dropdown.css";

import DropIcon from "../assets/images/drop-icon.svg";
import UserIcon from "../assets/images/user-icon.svg";
import UpDropIcon from "../assets/images/up-drop-Icon.png";
import LogoutIcon from "../assets/images/logout.png";
import Seprator from "../assets/images/Seperator.png";


const Dropdown = () => {

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(!open);
  }

  return (
    <div className="box">
      <div className="dropdown">
        <button onClick={handleOpen} className="buttons-group">
          {open ?
            (
              <div className="open-border">
                <div className="logout">
                  <button className="logout-button">خروج</button>
                  <img className="logout-icon" alt="Logout" src={LogoutIcon} />
                </div>
                <img className="seperator" alt="Seperator" src={Seprator} />
                <div className="text">مهمان</div>
                <img
                  className="drop-icon"
                  alt="Drop icon"
                  src={UpDropIcon} />
                <img
                  className="user-icon"
                  alt="User icon"
                  src={UserIcon} />
              </div>
            ) :
            (
              <div className="default-border">
                <div className="text-wrapper">مهمان</div>
                <img
                  className="drop-icon"
                  alt="Drop icon"
                  src={DropIcon}
                />
                <img
                  className="user-icon"
                  alt="User icon"
                  src={UserIcon}
                />
              </div>
            )
          }
        </button>
      </div>
    </div>
  );
};

export default Dropdown;