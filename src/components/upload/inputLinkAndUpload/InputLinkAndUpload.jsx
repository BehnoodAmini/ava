import { useState } from "react";
import axios from "axios";

import AudioUploaded from "../../AudioUploaded/AudioUploaded";
import './InputLinkAndUpload.css';

import linkIconWhite from "../../assets/images/chain-icon-white.svg";

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
        audioRef
    }) => {

    const [link, setLink] = useState(null)
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



    const postAudio = async (file) => {
        try {
            const formData = new FormData();
            formData.append("language", "fa");
            formData.append("media", file, `upload-${file.name}`);

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
                isShownUpload={isShownLink}
                setFileAudio={setFileAudio}
                audio={audio}
                duration={duration}
                audioRef={audioRef}
                dataFromApi={dataFromApi}
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