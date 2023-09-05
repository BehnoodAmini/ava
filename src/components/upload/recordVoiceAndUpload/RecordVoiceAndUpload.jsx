import { useState, useRef, useEffect } from "react";
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
    const [segments, setSegments] = useState([]);
    const ws = useRef();

    // FOR CONVERT TIME THAT API GIVES TO SECONDS FOR VOICEBAR SLIDER
    function convertTimeToSeconds(timeString) {
        // Split the time string into an array of hours, minutes, and seconds.
        const timeArray = timeString.split(":");
        // Convert the hours, minutes, and seconds to numbers.
        const hours = parseInt(timeArray[0]);
        const minutes = parseInt(timeArray[1]);
        const seconds = parseInt(timeArray[2]);
        const hoursInSeconds = hours * 3600;
        const minutesInSeconds = minutes * 60;
        const secondsInSeconds = seconds * 1;
        const totalSeconds = hoursInSeconds + minutesInSeconds + secondsInSeconds;

        return totalSeconds;
    }

    const onSocketOpen = () => {
        console.log("connected");
    };

    const onSocketMessage = (event) => {
        console.log(event.data);
        const { segment_id, text, start, end } = JSON.parse(event.data);
		const data = { text: text, start: convertTimeToSeconds(start), end: convertTimeToSeconds(end) };
		setSegments(prev => {
			const prevData = [...prev];
			prevData[segment_id] = data;
			return prevData;
		});
        console.log(`segments: ${segments}`);

    };

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
            alert("The MediaRecorder API is not supported in your browser.");
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
                <div className="center-mic">
                    {!permission ? (
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
                    ) : null}
                    {permission && recordingStatus === "inactive" ? (
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
                    ) : null}
                    {recordingStatus === "recording" ? (
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
                    <div className="center-mic-text">
                        برای شروع به صحبت، دکمه را فشار دهید <br />
                        متن پیاده شده آن، در اینجا ظاهر شود
                    </div>
                    {segments.map((text, k) => (
                        <div
                            key={k}
                        >
                            <div className="mr-4">{text.text}</div>
                        </div>
                    ))}
                </div>
            )
    );
}

export default RecordVoiceAndUpload;