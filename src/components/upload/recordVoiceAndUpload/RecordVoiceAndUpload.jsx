import { useState, useRef } from "react";

import AudioUploaded from "../../AudioUploaded/AudioUploaded";
import './RecordVoiceAndUpload.css';

import micIconWhite from "../../../assets/images/mic-icon-white.svg";

const mimeType = "audio/webm";

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

    return (
        fileAudio
            ? <div><AudioUploaded
                isShownRecord={isShownRecord}
                setFileAudio={setFileAudio}
                audio={audio}
                duration={duration}
                audioRef={audioRef}
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