import React from "react";
import { useState, useRef } from "react";

import AudioUploaded from "../AudioUploaded/AudioUploaded";
import LanguageDropdown from "../dropdowns/LanguageDropdown";
import "./Upload.css";

import micIconWhite from "../../assets/images/mic-icon-white.svg";
import micIconGray from "../../assets/images/mic-icon-gray.svg";
import uploadIconWhite from "../../assets/images/upload-icon-white.svg";
import uploadIconGray from "../../assets/images/upload-icon-gray.svg";
import linkIconWhite from "../../assets/images/chain-icon-white.svg";
import linkIconGray from "../../assets/images/chain-icon-gray.svg";

const mimeType = "audio/webm";

const Upload = (props) => {

    const [isShownRecord, setIsShownRecord] = useState(true);
    const [isShownUpload, setIsShownUpload] = useState(false);
    const [isShownLink, setIsShownLink] = useState(false);
    const [fileAudio, setFileAudio] = useState(false);
    //const [isUploaded, setIsUploaded] = useState(false)

    // for RECORDING
    const [permission, setPermission] = useState(false);
    const mediaRecorder = useRef(null);
    const [recordingStatus, setRecordingStatus] = useState("inactive");
    const [stream, setStream] = useState(null);
    const [audio, setAudio] = useState(null);
    const [audioChunks, setAudioChunks] = useState([]);
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

    // FOR RECORDING
    const getMicrophonePermission = async () => {
        if ("MediaRecorder" in window) {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: false,
                });
                setPermission(true);
                setStream(mediaStream);
            } catch (err) {
                alert(err.message);
            }
        } else {
            alert("The MediaRecorder API is not supported in your browser.");
        }
    };

    const startRecording = async () => {
        setRecordingStatus("recording");
        const media = new MediaRecorder(stream, { type: mimeType });

        mediaRecorder.current = media;

        mediaRecorder.current.start();

        let localAudioChunks = [];

        mediaRecorder.current.ondataavailable = (event) => {
            if (typeof event.data === "undefined") return;
            if (event.data.size === 0) return;
            localAudioChunks.push(event.data);
        };

        setAudioChunks(localAudioChunks);
    };

    const stopRecording = () => {
        setRecordingStatus("inactive");
        mediaRecorder.current.stop();

        mediaRecorder.current.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: mimeType });
            const audioUrl = URL.createObjectURL(audioBlob);

            setAudio(audioUrl);

            setAudioChunks([]);

            setFileAudio(true);

            // FOR DURATION OF RECORDED VOICE
            const fileReader = new FileReader();
            fileReader.onloadend = () => {
                const audioContext = new window.AudioContext();
                const arrayBuffer = fileReader.result;

                audioContext.decodeAudioData(arrayBuffer, (buffer) => {
                    const durationInSeconds = buffer.duration;
                    setDuration(durationInSeconds);
                });
            };

            fileReader.readAsArrayBuffer(audioBlob);
        };
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

                {isShownRecord && (
                    fileAudio
                        ? <div><AudioUploaded
                            isShownRecord={isShownRecord}
                            setFileAudio={setFileAudio}
                            color="#00BA9F"
                            audio={audio}
                            duration={duration}
                            audioRef={audioRef}
                        /></div>
                        : (
                            <div className="center-mic">
                                {!permission ? (
                                    <button className="permission" onClick={getMicrophonePermission}>
                                        به میکروفون اجازه دسترسی دهید.<br />
                                        (اگر قبلا اجازه داده اید فقط کلیک کنید!)
                                    </button>
                                ) : null}
                                {permission && recordingStatus === "inactive" ? (
                                    <button className="center-mic-icon" onClick={startRecording}>
                                        <img
                                            className="center-micIcon"
                                            src={micIconWhite}
                                            alt="micIcon"
                                        />
                                    </button>
                                ) : null}
                                {recordingStatus === "recording" ? (
                                    <button className="center-mic-icon-recording" onClick={stopRecording}>
                                        <img
                                            className="center-micIcon"
                                            src={micIconWhite}
                                            alt="micIcon"
                                        />
                                    </button>
                                ) : null}
                                <div className="center-mic-text">
                                    برای شروع به صحبت، دکمه را فشار دهید <br />
                                    متن پیاده شده آن، در اینجا ظاهر شود
                                </div>
                            </div>
                        )
                )}

                {isShownUpload && (
                    fileAudio
                        ? <div><AudioUploaded
                            color="#118AD3"
                            isShownUpload={isShownUpload}
                            setFileAudio={setFileAudio}
                        /></div>
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
            <LanguageDropdown fileAudio={fileAudio} />
        </div >
    );
};

export default Upload;