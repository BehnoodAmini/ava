import { useState, useRef } from "react";
import axios from "axios";

import AudioUploaded from "../../AudioUploaded/AudioUploaded";
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
        audioRef
    }) => {

    const [permission, setPermission] = useState(false);
    const mediaRecorder = useRef(null);
    const [recordingStatus, setRecordingStatus] = useState("inactive");
    const [stream, setStream] = useState(null);
    const [audioChunks, setAudioChunks] = useState([]);

    const [dataFromApi, setDataFromApi] = useState([
        { start: "0:00:00", end: "0:00:00", text: "" },
    ]);

    // FOR CONVERT TIME THAT API GIVES TO SECONDS FOR VOICEBAR SLIDER
    const convertToSeconds = (value) => {
        const timeIndex = value.split(":");
        const hours = parseInt(timeIndex[0]);
        const minutes = parseInt(timeIndex[1]);
        const seconds = parseInt(timeIndex[2]);
        const sumOfSeconds = hours * 3600 + minutes * 60 + seconds;

        return sumOfSeconds;
    };

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

            postAudio(audioBlob)

            //setFileAudio(true);

            // FOR DURATION OF RECORDED VOICE
            /*const fileReader = new FileReader();
            fileReader.onloadend = () => {
                const audioContext = new window.AudioContext();
                const arrayBuffer = fileReader.result;

                audioContext.decodeAudioData(arrayBuffer, (buffer) => {
                    const durationInSeconds = buffer.duration;
                    setDuration(durationInSeconds);
                });
            };

            fileReader.readAsArrayBuffer(audioBlob);*/
        };
    };


    const postAudio = async (file) => {
        try {
            const formData = new FormData();
            formData.append("language", "fa");
            formData.append("media", file, `record_name.mp3`);

            const res = await axios.post(url, formData, {
                headers: {
                    Authorization: `Token ${token}`,
                    "Content-Type": `multipart/form-data`,
                },
            });
            console.log(res.data[0].segments[0]);

            
            setDuration(convertToSeconds(res.data[0].duration));
            setDataFromApi(res.data[0].segments);

            setFileAudio(true);
        } catch (err) {
            console.log(err);
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
                color="#00BA9F"
            /></div>
            : (
                <div className="center-mic">
                    {!permission ? (
                        <button className="center-mic-icon" onClick={getMicrophonePermission}>
                            <img
                                className="center-micIcon"
                                src={micIconWhite}
                                alt="micIcon"
                            />
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
    );
}

export default RecordVoiceAndUpload;