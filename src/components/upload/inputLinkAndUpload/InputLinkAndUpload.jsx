import { useState } from "react";
import axios from "axios";
import validator from "validator";

import AudioUploaded from "../../AudioUploaded/AudioUploaded";
import { convertTimeToSeconds } from "../../../helpers/TimeFunctions";
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validate the link.
        if (!validator.isURL(link)) {
            alert("لینک وارد شده صحیح نیست!");
            return;
        }
        // Check if the link has a .mp3 or .wav extension.
        const isValidLink = link.endsWith(".mp3") || link.endsWith(".mp4") || link.endsWith(".mpeg") || link.endsWith(".wav");
        if (!isValidLink) {
            alert("لینک وارد شده صحیح نیست! لطفا لینک با پسوندهای .mp3, .mp4, .mpeg یا .wav وارد کنید. ");
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
            alert("خطا در سرور دوباره تلاش کنید!");
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