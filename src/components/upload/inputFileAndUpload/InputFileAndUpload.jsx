import { useState, useEffect, useRef } from "react";
import axios from "axios";

import AudioUploaded from "../../AudioUploaded/AudioUploaded";
import { convertTimeToSeconds } from "../../../helpers/TimeFunctions";
import './InputFileAndUpload.css';

import uploadIconWhite from "../../../assets/images/upload-icon-white.svg";

const url = "https://harf.roshan-ai.ir/api/transcribe_files/";
const token = process.env.REACT_APP_SECRET;

const InputFileAndUpload = (
    { isShownUpload,
        fileAudio,
        setFileAudio,
        audio,
        setAudio,
        duration,
        setDuration,
        audioRef,
        language
    }) => {

    const [file, setFile] = useState(null)
    const [dataFromApi, setDataFromApi] = useState([
        { start: "0:00:00", end: "0:00:00", text: "" },
    ]);

    //  FOR USING A BUTTON AS AN FILE INPUT
    const hiddenFileInput = useRef(null);
    const handleClick = event => {
        hiddenFileInput.current.click();
    };

    // FOR HANDLING INPUT
    const handleFile = (event) => {
        setFile(event.target.files?.[0]);
        const files = event.target.files;
        if (files && files.length > 0) {
            const file = URL.createObjectURL(files[0]);
            setAudio(file);
        }
    };

    useEffect(() => {
        if (file) {
            postAudio(file)
        }
    });

    const postAudio = async (file) => {
        try {
            const formData = new FormData();
            formData.append("language", language);
            formData.append("media", file, `upload_${file.name}`);

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
                isShownUpload={isShownUpload}
                setFileAudio={setFileAudio}
                audio={audio}
                duration={duration}
                audioRef={audioRef}
                dataFromApi={dataFromApi}
                language={language}
                color="#118AD3"
            /></div>
            : (
                <div className="center-upload">
                    <audio
                        src={file}
                        ref={audioRef}
                        hidden
                    ></audio>
                    <button className="center-upload-icon" onClick={handleClick}>
                        <img
                            className="center-uploadIcon"
                            src={uploadIconWhite}
                            alt="uploadIcon"
                        />
                    </button>
                    <input type="file"
                        ref={hiddenFileInput}
                        onChange={handleFile}
                        style={{ display: 'none' }}
                    />
                    <div className="center-upload-text">
                        برای بارگذاری فایل گفتاری (صوتی/تصویری)، دکمه را فشار دهید <br />
                        متن پیاده شده آن، در اینجا ظاهر شود
                    </div>
                </div>
            )
    );
}

export default InputFileAndUpload;