import { useState, useRef, useEffect } from "react";
import axios from "axios";

import AudioUploaded from "../../AudioUploaded/AudioUploaded";
import { convertTimeToSeconds } from "../../../helpers/TimeFunctions";
import './RecordVoiceAndUpload.css';

import micIconWhite from "../../../assets/images/mic-icon-white.svg";

const mimeType = "audio/webm;codecs=opus";
const url = "https://harf.roshan-ai.ir/api/transcribe_files/";
const token = process.env.REACT_APP_SECRET;

const RecordVoiceAndUpload = (
    { isShownRecord,
        fileAudio,
        setFileAudio,
        audio,
        setAudio,
        duration,
        setDuration,
        audioRef,
        language
    }) => {

    const [permission, setPermission] = useState(false);
    const mediaRecorder = useRef(null);
    const [recordingStatus, setRecordingStatus] = useState("inactive");
    const [stream, setStream] = useState(null);
    const [audioChunks, setAudioChunks] = useState([]);

    const [dataFromApi, setDataFromApi] = useState([
        { start: "0:00:00", end: "0:00:00", text: "" },
    ]);
    const [dataFromWs, setDataFromWs] = useState([]);
    const ws = useRef();

    const onSocketOpen = () => {
        console.log("connected");
    };

    // CONVERTING JSON MESSAGE FROM WEBSOCKET TO OBJECT
    const onSocketMessage = (event) => {
        console.log(event.data);
        const { segment_id, text } = JSON.parse(event.data);
        const data = { text: text };
        setDataFromWs(obj => {
            const lastData = [...obj];
            lastData[segment_id] = data;
            return lastData;
        });
        console.log(`segments: ${dataFromWs}`);
    };

    // WEBSOCKET
    useEffect(() => {
        ws.current = new WebSocket('wss://harf.roshan-ai.ir/ws_api/transcribe_files/');
        ws.current.addEventListener('open', onSocketOpen);
        ws.current.addEventListener('message', onSocketMessage);

        return () => {
            if (ws.current) {
                ws.current.close = (event) => {
                    console.log("The connection has been closed successfully.");
                };
            }
        }
        // eslint-disable-next-line
    }, [ws])

    //GETTING RECORDING PERMISSION FOR DOMAIN IN BROWSER
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
            alert("به میکروفون اجازه دسترسی دهید یا مرورگر خود را بروزرسانی کنید!");
        }
    };

    const startRecording = async () => {
        setRecordingStatus("recording");
        const media = new MediaRecorder(stream, { type: mimeType });

        mediaRecorder.current = media;

        mediaRecorder.current.start(1000);

        let localAudioChunks = [];

        mediaRecorder.current.ondataavailable = (event) => {
            if (typeof event.data === "undefined") return;
            if (event.data.size === 0) return;
            localAudioChunks.push(event.data);
            ws.current.send(event.data);
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

            postAudio(audioBlob)
        };
    };

    const postAudio = async (file) => {
        try {
            const formData = new FormData();
            formData.append("language", language);
            formData.append("media", file, `record_name.mp3`);

            const res = await axios.post(url, formData, {
                headers: {
                    Authorization: `Token ${token}`,
                    "Content-Type": `multipart/form-data`,
                },
            });
            console.log(res.data[0].segments[0]);

            setDuration(convertTimeToSeconds(res.data[0].duration));
            setDataFromApi(res.data[0].segments);

            setFileAudio(true);
        } catch (err) {
            console.log(err);
            alert("خطا در سرور دوباره تلاش کنید!");
        }
    };

    return (
        fileAudio
            ? <div><AudioUploaded
                isShownRecord={isShownRecord}
                setFileAudio={setFileAudio}
                audio={audio}
                duration={duration}
                audioRef={audioRef}
                dataFromApi={dataFromApi}
                language={language}
                color="#00BA9F"
            /></div>
            : (
                <div className={recordingStatus === "recording" ? "center-mic-recording" : "center-mic"}>
                    {!permission ? (
                        <>
                            <button
                                className="center-mic-icon"
                                onClick={getMicrophonePermission}
                            >
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
                        </>
                    ) : null}
                    {permission && recordingStatus === "inactive" ? (
                        <>
                            <button
                                className="center-mic-icon"
                                onClick={startRecording}
                            >
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
                        </>
                    ) : null}

                    {/* USING WEBSOCKET IF LANGUAGE IS FARSI */}
                    {(recordingStatus === "recording" && language === "fa") ? (
                        <>
                            {dataFromWs.map((text, k) => {
                                return (
                                    <div key={k}>
                                        <div className="webSocket-text">{text.text}{" "}</div>
                                    </div>
                                )
                            }
                            )}
                            <button
                                className="center-mic-icon-recording"
                                onClick={stopRecording}
                            >
                                <img
                                    className="center-micIcon"
                                    src={micIconWhite}
                                    alt="micIcon"
                                />
                            </button>
                        </>
                    ) : null}

                    {/* DO NOT USE WEBSOCKET IF LANGUAGE IS ENGLISH AND JUST POST AUDIO */}
                    {(recordingStatus === "recording" && language === "en") ? (
                        <button
                            className="center-mic-icon-recording"
                            onClick={stopRecording}
                        >
                            <img
                                className="center-micIcon"
                                src={micIconWhite}
                                alt="micIcon"
                            />
                        </button>
                    ) : null}
                </div>
            )
    );
}

export default RecordVoiceAndUpload;