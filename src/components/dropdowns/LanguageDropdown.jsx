import React, { useState } from "react";

import "./LanguageDropdown.css";

import DropIcon from "../../assets/images/drop-icon.svg";
import UpDropIcon from "../../assets/images/up-drop-Icon.png";
import Seprator from "../../assets/images/Seperator.png";


const Dropdown = ({ fileAudio, setLanguage }) => {

    const [open, setOpen] = useState(false);
    const [isFarsi, setIsFarsi] = useState(true);
    const [isEng, setIsEng] = useState(false);

    const handleEng = () => {
        setIsEng(true);
        setIsFarsi(false);
        setLanguage("en");
    }
    const handleFarsi = () => {
        setIsEng(false);
        setIsFarsi(true);
        setLanguage("fa");
    }

    const handleOpen = () => {
        setOpen(!open);
    }

    return (
        <>
            <div className="zaban-goftar" style={fileAudio ? { opacity: "50%" } : { opacity: "100" }}>زبان گفتار:</div>
            <div className="language">
                <div className="language-dropdown">
                    {isFarsi &&
                        <button
                            onClick={handleOpen}
                            disabled={fileAudio ? true : false}
                            className="language-buttons-group"
                        >
                            {open ?
                                (
                                    <div className="language-open-border">
                                        <div className="down">
                                            <button className="down-button" onClick={handleEng}>انگلیسی</button>
                                        </div>
                                        <img className="language-seperator" alt="Seperator" src={Seprator} />
                                        <div className="language-text">فارسی</div>
                                        <img
                                            className="language-drop-icon"
                                            alt="Drop icon"
                                            src={UpDropIcon} />
                                    </div>
                                ) :
                                (
                                    <div className="language-close-border" style={fileAudio ? { opacity: "50%" } : { opacity: "100" }}>
                                        <div className="language-text-wrapper">فارسی</div>
                                        <img
                                            className="language-drop-icon"
                                            alt="Drop icon"
                                            src={DropIcon}
                                        />
                                    </div>
                                )
                            }
                        </button>
                    }
                    {isEng &&
                        <button onClick={handleOpen} className="language-buttons-group">
                            {open ?
                                (
                                    <div className="language-open-border">
                                        <div className="down">
                                            <button className="down-button" onClick={handleFarsi}>فارسی</button>
                                        </div>
                                        <img className="language-seperator" alt="Seperator" src={Seprator} />
                                        <div className="language-text">انگلیسی</div>
                                        <img
                                            className="language-drop-icon"
                                            alt="Drop icon"
                                            src={UpDropIcon} />
                                    </div>
                                ) :
                                (
                                    <div className="language-close-border" style={fileAudio ? { opacity: "50%" } : { opacity: "100" }}>
                                        <div className="language-text-wrapper">انگلیسی</div>
                                        <img
                                            className="language-drop-icon"
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
        </>
    );
};

export default Dropdown;