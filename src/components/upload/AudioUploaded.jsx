import { useState } from "react";

import "./AudioUploaded.css"

import simpleTextIconGray from "../../assets/images/simple-text-icon-gray.svg"
import simpleTextIconBlack from "../../assets/images/simple-text-icon-black.svg";
import timedTextIconGray from "../../assets/images/timed-text-icon-gray.svg"
import timedTextIconBlack from "../../assets/images/timed-text-icon-black.svg"
import downloadIcon from "../../assets/images/download-icon.svg";
import copyIcon from "../../assets/images/copy-icon.svg";
import refreshIcon from "../../assets/images/refresh-icon.svg";
import hr from "../../assets/images/horizontal-line.svg"

const AudioUploaded = props => {

    const [simpleIsShown, setSimpleIsShown] = useState(true);
    const [timeIsShown, setTimeIsShown] = useState(false);

    const handleClickSimple = event => {
        setSimpleIsShown(true);
        setTimeIsShown(false);
    }
    const handleClickTimed = event => {
        setSimpleIsShown(false);
        setTimeIsShown(true);
    }

    return (
        <div className="center-uploaded">
            <div className="upload-navbar">
                <div className="upload-navbar-right">
                    <button
                        className="simple-text-button"
                        onClick={handleClickSimple}
                        style={simpleIsShown ? { borderBottomColor: "black" } : { borderColor: "transparent" }}
                    >
                        {simpleIsShown ?
                            (
                                <>
                                    <img
                                        className="simple-text-icon"
                                        src={simpleTextIconBlack}
                                        alt="simple-text-icon"
                                    />
                                    <div className="simple-text" style={{ fontWeight: "bold" }}>متن ساده</div>
                                </>
                            )
                            : (
                                <>
                                    <img
                                        className="simple-text-icon"
                                        src={simpleTextIconGray}
                                        alt="simple-text-icon"
                                    />
                                    <div className="simple-text" style={{ fontWeight: "lighter" }}>متن ساده</div>
                                </>
                            )
                        }
                    </button>
                    <button
                        className="timed-text-button"
                        onClick={handleClickTimed}
                        style={timeIsShown ? { borderBottomColor: "black" } : { borderColor: "transparent" }}
                    >
                        {timeIsShown ?
                            (
                                <>
                                    <img
                                        className="timed-text-icon"
                                        src={timedTextIconBlack}
                                        alt="timed-text-icon"
                                    />
                                    <div className="timed-text" style={{ fontWeight: "bold" }}>متن زمان بندی شده</div>
                                </>
                            )
                            : (
                                <>
                                    <img
                                        className="timed-text-icon"
                                        src={timedTextIconGray}
                                        alt="timed-text-icon"
                                    />
                                    <div className="timed-text" style={{ fontWeight: "lighter" }}>متن زمان بندی شده</div>
                                </>
                            )
                        }
                    </button>
                </div>
                <div className="upload-navbar-left">
                    <button className="download">
                        <img
                            className="download-icon"
                            src={downloadIcon}
                            alt="download-icon"
                        />
                    </button>
                    <button className="copy">
                        <img
                            className="copy-icon"
                            src={copyIcon}
                            alt="copy-icon"
                        />
                    </button>
                    <button className="refresh-button" style={{ backgroundColor: props.color }}>
                        <img
                            className="refresh-icon"
                            src={refreshIcon}
                            alt="refresh-icon"
                        />
                        <div className="refresh-text">شروع دوباره</div>
                    </button>
                </div>
            </div>
            <img className="hr" src={hr} alt="hr" />
            <div className="text-box">

            </div>
            <div className="voice-bar">
                <audio controls className="audio" />
            </div>
        </div >
    );
}

export default AudioUploaded;