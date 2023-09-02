import { useState, useEffect } from "react";

import "./AudioUploaded.css"

import VoiceBar from "../voiceBar/VoiceBar";

import SimpleBarReact from "simplebar-react";
import "../../../node_modules/simplebar-react/dist/simplebar.min.css";

import simpleTextIconGray from "../../assets/images/simple-text-icon-gray.svg"
import simpleTextIconBlack from "../../assets/images/simple-text-icon-black.svg";
import timedTextIconGray from "../../assets/images/timed-text-icon-gray.svg"
import timedTextIconBlack from "../../assets/images/timed-text-icon-black.svg"
import downloadIcon from "../../assets/images/gray-download-icon.svg";
import copyIcon from "../../assets/images/gray-copy-icon.svg";
import refreshIcon from "../../assets/images/refresh-icon.svg";
import hr from "../../assets/images/horizontal-line.svg"

const AudioUploaded = (props) => {

    const [simpleIsShown, setSimpleIsShown] = useState(true);
    const [timeIsShown, setTimeIsShown] = useState(false);

    const [dataText, setDataText] = useState(props.dataFromApi);

    const handleClickSimple = event => {
        setSimpleIsShown(true);
        setTimeIsShown(false);
    }
    const handleClickTimed = event => {
        setSimpleIsShown(false);
        setTimeIsShown(true);
    }

    // FOR REFRESH BUTTON
    const handleRefresh = event => {
        props.setFileAudio(false);
    }

    const formatDuration = (value) => {
        const timeIndex = value.split(":");
        const hours = parseInt(timeIndex[0]);
        const minutes = parseInt(timeIndex[1]);
        const seconds = parseInt(timeIndex[2]);

        if (hours === 0) {
            let time = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
            return time;
        } else {
            let time = `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
            return time;
        }
    };

    // FOR BORDER OF RECORD, UPLOAD AND LINK
    const styles = props.isShownRecord ? {
        border: `1px solid ${props.color}`,
        borderRadius: '25px 0 25px 25px',
    } : props.isShownUpload ? {
        border: `1px solid ${props.color}`,
        borderRadius: '25px',
    } : props.isShownLink ? {
        border: `1px solid ${props.color}`,
        borderRadius: '25px',
    } : null;

    useEffect(() => {
        setDataText(props.dataFromApi);
    }, [props.dataFromApi]);

    return (
        <div
            className="center-uploaded"
            style={styles}
        >
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
                    <button
                        className="refresh-button"
                        onClick={handleRefresh}
                        style={{ backgroundColor: props.color }}
                    >
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


            <SimpleBarReact
                style={{
                    maxHeight: 300,
                    direction: 'rtl',
                    scrollbarMinSize: 1
                }}
                data-simplebar-direction='rtl'
            >
                <div className="center-box">
                    {simpleIsShown
                        ? (<div className={props.language === "fa" ? "text-box-fa" : "text-box-en"}>
                            {dataText.map((data, key) => (
                                <span key={key}>
                                    {data.text}{" "}
                                </span>
                            ))}
                        </div>)
                        : (
                            dataText.map((data, key) => {
                                return (
                                    <div
                                        className="data-row"
                                        key={key}
                                        style={key % 2 === 0 ? { backgroundColor: "rgb(242, 242, 242)" } : { backgroundColor: "#ffffff" }}
                                    >
                                        <div className="end-time">{formatDuration(data.end)}</div>
                                        <div className="start-time">{formatDuration(data.start)}</div>
                                        <div className={props.language === "fa" ? "data-text-fa" : "data-text-en"}>{data.text}</div>
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

export default AudioUploaded;