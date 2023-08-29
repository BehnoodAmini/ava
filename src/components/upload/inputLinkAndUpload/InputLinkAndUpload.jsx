import { useState } from "react";
import axios from "axios";
import validator from "validator";

import AudioUploaded from "../../AudioUploaded/AudioUploaded";
import './InputLinkAndUpload.css';

import linkIconWhite from "../../../assets/images/chain-icon-white.svg";

const url = "https://harf.roshan-ai.ir/api/transcribe_files/";
const token = process.env.REACT_APP_SECRET;

const InputLinkAndUpload = (
    { isShownLink,
        fileAudio,
        setFileAudio,
        audio,
        setAudio,
        duration,
        setDuration,
        audioRef,
        language
    }) => {

    const [link, setLink] = useState("")
    const [dataFromApi, setDataFromApi] = useState([
        { start: "0:00:00", end: "0:00:00", text: "" },
    ]);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validate the link.
        if (!validator.isURL(link)) {
            alert("Invalid URL.");
            return;
        }
        // Check if the link has a .mp3 or .wav extension.
        const isValidLink = link.endsWith(".mp3") || link.endsWith(".mp4") || link.endsWith(".mpeg") || link.endsWith(".wav");
        if (!isValidLink) {
            alert("Invalid link. Please enter a link to an .mp3, .mp4, .mpeg or .wav file.");
            return;
        }

        // FOR SETTING AUDIO TO PLAY
        setAudio(link);

        // SEND TO API
        try {
            const mediaUrls = [link];
            const data = {
                media_urls: mediaUrls,
                language: language,
            };

            const res = await axios.post(url, data, {
                headers: {
                    Authorization: `Token ${token}`,
                    "Content-Type": "application/json",
                },
            });
            console.log(res.data[0].segments[0]);

            setDuration(convertTimeToSeconds(res.data[0].duration));
            setDataFromApi(res.data[0].segments);

            setFileAudio(true);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        fileAudio
            ? <div><AudioUploaded
                isShownUpload={isShownLink}
                setFileAudio={setFileAudio}
                audio={audio}
                duration={duration}
                audioRef={audioRef}
                dataFromApi={dataFromApi}
                language={language}
                color="#FF1654"
            /></div>
            : (
                <div className="center-link">
                    <div className="input-box">
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                className="link-input"
                                placeholder="example.com/sample.mp3"
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                            />
                            <button type="submit" className="center-link-icon">
                                <img
                                    className="center-linkIcon"
                                    src={linkIconWhite}
                                    alt="linkIcon"
                                />
                            </button>
                        </form>
                    </div>
                    <div className="center-link-text">
                        نشان اینترنتی فایل حاوی گفتار (صوتی/تصویری) را وارد<br />
                        و دکمه را فشار دهید
                    </div>
                </div>
            )
    );
}

export default InputLinkAndUpload;