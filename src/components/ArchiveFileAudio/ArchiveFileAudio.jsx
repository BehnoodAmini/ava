import { useState } from "react";

import "./ArchiveFileAudio.css"

import VoiceBar from "../voiceBar/VoiceBar";
import { testList } from "./testData";

import SimpleBarReact from "simplebar-react";
import "../../../node_modules/simplebar-react/dist/simplebar.min.css";

import simpleTextIconGray from "../../assets/images/simple-text-icon-gray.svg"
import simpleTextIconBlack from "../../assets/images/simple-text-icon-black.svg";
import timedTextIconGray from "../../assets/images/timed-text-icon-gray.svg"
import timedTextIconBlack from "../../assets/images/timed-text-icon-black.svg"
import hr from "../../assets/images/short-horizontal-line.svg"

const ArchiveFileAudio = (props) => {

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

    function formatDuration(value) {
        const minute = Math.floor(value / 60);
        const secondLeft = value - minute * 60;
        return `${minute < 10 ? `0${minute}` : minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
    }

    return (
        <div className="archive-center-uploaded">
            <div className="archive-upload-navbar">
                    <button
                        className="archive-simple-text-button"
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
            <img className="hr" src={hr} alt="hr" />


            <SimpleBarReact style={{ maxHeight: 150, direction: 'rtl', scrollbarMinSize: 1, marginTop: -10 }} data-simplebar-direction='rtl' >
                <div className="archive-center-box">
                    {simpleIsShown
                        ? (<div className="text-box"></div>)
                        : (
                            testList.map((data, key) => {
                                return (
                                    <div
                                        className="data-row"
                                        key={key}
                                        style={key % 2 === 0 ? { backgroundColor: "rgb(242, 242, 242)" } : { backgroundColor: "#ffffff" }}
                                    >
                                        <div className="end-time">{formatDuration(data.endTime)}</div>
                                        <div className="start-time">{formatDuration(data.startTime)}</div>
                                        <div className="data-text">{data.text}</div>
                                    </div>
                                );
                            }
                            )
                        )
                    }
                </div>
            </SimpleBarReact>
            <div className="footer">
                <div className="voice-bar">
                    <VoiceBar {...props} />
                </div>
            </div>
        </div >
    );
}

export default ArchiveFileAudio;