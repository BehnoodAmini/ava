import React from "react";
import { useState, useRef } from "react";

import RecordVoiceAndUpload from "./recordVoiceAndUpload/RecordVoiceAndUpload";
import InputFileAndUpload from "./inputFileAndUpload/InputFileAndUpload";
import LanguageDropdown from "../dropdowns/LanguageDropdown";
import "./Upload.css";

import micIconWhite from "../../assets/images/mic-icon-white.svg";
import micIconGray from "../../assets/images/mic-icon-gray.svg";
import uploadIconWhite from "../../assets/images/upload-icon-white.svg";
import uploadIconGray from "../../assets/images/upload-icon-gray.svg";
import linkIconWhite from "../../assets/images/chain-icon-white.svg";
import linkIconGray from "../../assets/images/chain-icon-gray.svg";

const Upload = (props) => {

    const [isShownRecord, setIsShownRecord] = useState(true);
    const [isShownUpload, setIsShownUpload] = useState(false);
    const [isShownLink, setIsShownLink] = useState(false);
    const [fileAudio, setFileAudio] = useState(false);

    // STATES FOR AUDIO
    const [audio, setAudio] = useState(null);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef(null);

    const handleClickRecord = event => {
        setIsShownRecord(true);
        setIsShownUpload(false);
        setIsShownLink(false);

        if (!isShownRecord) {
            setFileAudio(false);
        }
    };
    const handleClickUpload = event => {
        setIsShownRecord(false);
        setIsShownUpload(true);
        setIsShownLink(false);

        if (!isShownUpload) {
            setFileAudio(false);
        }
    };
    const handleClickLink = event => {
        setIsShownRecord(false);
        setIsShownUpload(false);
        setIsShownLink(true);

        if (!isShownLink) {
            setFileAudio(false);
        }
    };

    //  FOR USING A BUTTON AS AN FILE INPUT
    /*const hiddenFileInput = React.useRef(null);
    const handleClick = event => {
        hiddenFileInput.current.click();
    };
    const handleChangeUpload = event => {
        const fileUploaded = event.target.files[0];
        setFileAudio(fileUploaded);
    };*/

    return (
        <div className="box">
            <div className="upload-box">
                <div className="navbar">
                    <button
                        className="record-btn"
                        onClick={handleClickRecord}
                        style={isShownRecord ? { backgroundColor: "#00BA9F" } : { backgroundColor: "#ffffff" }}
                    >
                        <img
                            className="mic-icon"
                            src={isShownRecord ? micIconWhite : micIconGray}
                            alt="micIcon"
                        />
                        <div className="mic-text" style={isShownRecord ? { color: "#ffffff" } : { color: "#969696" }}>
                            ضبط صدا
                        </div>
                    </button>
                    <button
                        className="upload-button"
                        onClick={handleClickUpload}
                        style={isShownUpload ? { backgroundColor: "#118AD3" } : { backgroundColor: "#ffffff" }}
                    >
                        <img
                            className="upload-icon"
                            src={isShownUpload ? uploadIconWhite : uploadIconGray}
                            alt="uploadIcon"
                        />
                        <div className="upload-text" style={isShownUpload ? { color: "#ffffff" } : { color: "#969696" }}>
                            بارگذاری فایل
                        </div>
                    </button>
                    <button
                        className="link-button"
                        onClick={handleClickLink}
                        style={isShownLink ? { backgroundColor: "#FF1654" } : { backgroundColor: "#ffffff" }}
                    >
                        <img
                            className="link-icon"
                            src={isShownLink ? linkIconWhite : linkIconGray}
                            alt="linkIcon"
                        />
                        <div className="link-text" style={isShownLink ? { color: "#ffffff" } : { color: "#969696" }}>
                            لینک
                        </div>
                    </button>
                </div>

                {isShownRecord && (
                    <RecordVoiceAndUpload
                        isShownRecord={isShownRecord}
                        fileAudio={fileAudio}
                        setFileAudio={setFileAudio}
                        audio={audio}
                        setAudio={setAudio}
                        duration={duration}
                        setDuration={setDuration}
                        audioRef={audioRef}
                    />
                )}

                {isShownUpload && (
                    <InputFileAndUpload
                        isShownRecord={isShownRecord}
                        fileAudio={fileAudio}
                        setFileAudio={setFileAudio}
                        audio={audio}
                        setAudio={setAudio}
                        duration={duration}
                        setDuration={setDuration}
                        audioRef={audioRef}
                    />
                )}

                {isShownLink &&
                    <div className="center-link">
                        <div className="input-box">
                            <input className="link-input" placeholder="example.com/sample.mp3"></input>
                            <button className="center-link-icon">
                                <img
                                    className="center-linkIcon"
                                    src={linkIconWhite}
                                    alt="linkIcon"
                                />
                            </button>
                        </div>
                        <div className="center-link-text">
                            نشان اینترنتی فایل حاوی گفتار (صوتی/تصویری) را وارد<br />
                            و دکمه را فشار دهید
                        </div>
                    </div>
                }
            </div>
            <LanguageDropdown fileAudio={fileAudio} />
        </div >
    );
};

export default Upload;