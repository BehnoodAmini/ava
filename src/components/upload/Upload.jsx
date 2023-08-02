import React from "react";
import { useState } from "react";

import AudioUploaded from "./AudioUploaded";
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
    //const [isUploaded, setIsUploaded] = useState(false)

    const handleClickRecord = event => {
        setIsShownRecord(true);
        setIsShownUpload(false);
        setIsShownLink(false);
    };
    const handleClickUpload = event => {
        setIsShownRecord(false);
        setIsShownUpload(true);
        setIsShownLink(false);
    };
    const handleClickLink = event => {
        setIsShownRecord(false);
        setIsShownUpload(false);
        setIsShownLink(true);
    };

    //  FOR USING A BUTTON AS AN FILE INPUT
    const hiddenFileInput = React.useRef(null);
    const handleClick = event => {
        hiddenFileInput.current.click();
    };
    const handleChangeUpload = event => {
        const fileUploaded = event.target.files[0];
        setFileAudio(fileUploaded);
        //props.handleFile(fileUploaded);
        //setIsUploaded(true);
    };

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

                {isShownRecord &&
                    <div className="center-mic">
                        <button className="center-mic-icon">
                            <img
                                className="center-micIcon"
                                src={micIconWhite}
                                alt="micIcon"
                            />
                        </button>
                        <div className="center-mic-text">
                            برای شروع به صحبت، دکمه را فشار دهید <br />
                            متن پیاده شده آن، در اینجا ظاهر شود
                        </div>
                    </div>
                }
                {isShownUpload && (
                    fileAudio
                        ? <div><AudioUploaded color="#118AD3"/></div>
                        : (
                            <div className="center-upload">
                                <button className="center-upload-icon" onClick={handleClick}>
                                    <img
                                        className="center-uploadIcon"
                                        src={uploadIconWhite}
                                        alt="uploadIcon"
                                    />
                                </button>
                                <input type="file"
                                    ref={hiddenFileInput}
                                    onChange={event => handleChangeUpload(event)}
                                    //onChange={handleChangeUpload}
                                    style={{ display: 'none' }}
                                />
                                <div className="center-upload-text">
                                    برای بارگذاری فایل گفتاری (صوتی/تصویری)، دکمه را فشار دهید <br />
                                    متن پیاده شده آن، در اینجا ظاهر شود
                                </div>
                            </div>
                        ))}


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
        </div >
    );
};

export default Upload;