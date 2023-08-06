import React, { useState } from "react";

import "./LanguageDropdown.css";

import DropIcon from "../../assets/images/drop-icon.svg";
import UpDropIcon from "../../assets/images/up-drop-Icon.png";
import Seprator from "../../assets/images/Seperator.png";


const Dropdown = () => {

    const [open, setOpen] = useState(false);
    const [isFarsi, setIsFarsi] = useState(true);
    const [isEng, setIsEng] = useState(false);

    const handleEng = () => {
        setIsEng(true);
        setIsFarsi(false);
    }
    const handleFarsi = () => {
        setIsEng(false);
        setIsFarsi(true);
    }

    const handleOpen = () => {
        setOpen(!open);
    }

    return (
        <div className="language">
            <div className="language-dropdown">
                {isFarsi &&
                    <button onClick={handleOpen} className="buttons-group">
                        {open ?
                            (
                                <div className="open-border">
                                    <div className="logout">
                                        <button className="logout-button" onClick={handleEng}>انگلیسی</button>
                                    </div>
                                    <img className="seperator" alt="Seperator" src={Seprator} />
                                    <div className="text">فارسی</div>
                                    <img
                                        className="drop-icon"
                                        alt="Drop icon"
                                        src={UpDropIcon} />
                                </div>
                            ) :
                            (
                                <div className="farsi-border">
                                    <div className="text-wrapper">فارسی</div>
                                    <img
                                        className="drop-icon"
                                        alt="Drop icon"
                                        src={DropIcon}
                                    />
                                </div>
                            )
                        }
                    </button>
                }
                {isEng &&
                    <button onClick={handleOpen} className="buttons-group">
                        {open ?
                            (
                                <div className="open-border">
                                    <div className="logout">
                                        <button className="logout-button" onClick={handleFarsi}>فارسی</button>
                                    </div>
                                    <img className="seperator" alt="Seperator" src={Seprator} />
                                    <div className="text">انگلیسی</div>
                                    <img
                                        className="drop-icon"
                                        alt="Drop icon"
                                        src={UpDropIcon} />
                                </div>
                            ) :
                            (
                                <div className="default-border">
                                    <div className="text-wrapper">انگلیسی</div>
                                    <img
                                        className="drop-icon"
                                        alt="Drop icon"
                                        src={DropIcon}
                                    />
                                </div>
                            )
                        }
                    </button>
                }
            </div>
        </div>
    );
};

export default Dropdown;