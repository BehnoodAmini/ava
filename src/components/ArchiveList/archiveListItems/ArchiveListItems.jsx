import { useState, useEffect, useRef } from "react";
import axios from "axios";
import moment from 'moment-jalaali';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

import ArchiveFileAudio from "../../ArchiveFileAudio/ArchiveFileAudio";

import "./ArchiveListItems.css";

import { ReactComponent as DownloadIcon } from '../../../assets/images/download-icon.svg';
import { ReactComponent as WordIcon } from '../../../assets/images/Word-icon.svg';
import { ReactComponent as CopyIcon } from '../../../assets/images/copy-icon.svg';
import { ReactComponent as DelIcon } from '../../../assets/images/del-icon.svg';
import { ReactComponent as RecordIcon } from '../../../assets/images/green-record-btn.svg';
import { ReactComponent as UploadIcon } from '../../../assets/images/blue-upload-icon.svg';
import { ReactComponent as LinkIcon } from '../../../assets/images/red-link-icon.svg';

const token = process.env.REACT_APP_SECRET;
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const ArchiveListItems = ({ data, dataFromApi, setDataFromApi }) => {
    const audioRef = useRef(null)
    const [showFileAudio, setShowFileAudio] = useState(false);
    const [uploadMethod, setUploadMethod] = useState(null); //sendtype 
    const [audio, setAudio] = useState(""); //audioUrl
    const [audioFormat, setAudioFormat] = useState(null); //audioType
    const [audioName, setAudioName] = useState(null);
    const [audioLanguage, setAudioLanguage] = useState(null);
    const [textDataFromApi, setTextDataFromApi] = useState([
        { start: "0:00:00", end: "0:00:00", text: "" },
    ]);

    // FOR CONVERTING AD DATE TO SOLAR DATE(PERSIAN CALENDAR)
    const convertADDateToSolarDate = (date) => {
        const persianDate = moment(date, 'YYYY-MM-DD HH:mm:ss').format('jYYYY-jMM-jDD');
        return persianDate;
    }

    const formatDuration = (value) => {
        const timeIndex = value.split(":");
        const hours = parseInt(timeIndex[0]);
        const minutes = parseInt(timeIndex[1]);
        const seconds = parseInt(timeIndex[2]);

        if (hours === 0) {
            let time = `${minutes}:${seconds.toString().padStart(2, "0")}`;
            return time;
        } else {
            let time = `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
            return time;
        }
    };

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

    useEffect(() => {
        // FOR RECORDS AND FILES
        if (data.request_data.media_url) {
            // SET AUDIO FOR PLAYING
            setAudio(data.request_data.media_url);
            // FOR GETTING AUDIO FORMAT FOR EXAMPLE: .wav , .mp4 ,...
            setAudioFormat(data.request_data.media_url.split(".").pop());

            // SETTING FILE NAME FOR RECORD AND FILES
            const getFileName = (url, uploadMethod) => {
                let fileName = url.split(uploadMethod).pop().replace("_", " ").replace(".mp3", "");
                fileName = fileName.replace(/_/g, " ");
                return fileName;
            };

            // DIVIDING RECORD AND UPLOAD
            if (data.request_data.media_url.includes("upload_")) {
                setUploadMethod("upload");
                setAudioName(getFileName(data.request_data.media_url, "upload_"));
            }
            if (data.request_data.media_url.includes("record_")) {
                setUploadMethod("record");
                setAudioName(getFileName(data.request_data.media_url, "record_"));
            }
        }

        // FOR LINKS
        if (!data.request_data.media_url) {
            setAudioFormat(data.request_data.media_urls[0].split(".").pop());
            setUploadMethod("link");

            setAudio(data.request_data.media_urls[0]);
            setAudioName(data.request_data.media_urls[0]);
        }

        setAudioLanguage(data.request_data.language);
    }, [data]);

    // FOR GETTING DATA OF EACH FILE FROM API
    useEffect(() => {
        const url = `https://harf.roshan-ai.ir/api/get_request/${data.id}`;

        if (showFileAudio === data.id)
            getFromApi(url);

        // STOP AUDIO AFTER CLOSING
        if (!showFileAudio) {
            audioRef.current?.pause();
        }
    }, [data.id, showFileAudio]);

    const getFromApi = async (url) => {
        try {
            const res = await axios.get(url, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });

            console.log(res.data);
            setTextDataFromApi(res.data.response_data[0].segments);
        } catch (err) {
            console.log(err);
            alert("خطا در سرور دوباره تلاش کنید!");
        }
    };

    const handleDel = async (dataId) => {
        const url = `https://harf.roshan-ai.ir/api/get_request/${dataId}`;
        try {
            await axios.delete(url, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });

            delFromState();
        } catch (err) {
            console.log(err);
            alert("خطا در سرور دوباره تلاش کنید!");
        }
    };

    // FOR DELETING SELECTED FILE LOCALLY FROM STATE
    const delFromState = () => {
        const filesUpdate = {
            ...dataFromApi,
            results: dataFromApi.results.filter((selectedItem) => selectedItem.id !== data.id),
        };
        setDataFromApi(filesUpdate);
        // PAUSE AUDIO AFTER DELETING FILE
        audioRef.current.pause();
    }

    // ONLY WORK FOR ENGLISH!!!!
    const generatePDF = () => {
        if (showFileAudio === data.id) {
            let oneStringTextData = "";
            textDataFromApi.map((text) => {
                return oneStringTextData += `${text.text} `;
            });
            const docDefinition = {
                content: oneStringTextData
            };
            const pdfDocGenerator = pdfMake.createPdf(docDefinition);
            pdfDocGenerator.download(audioName);
        }
        if (showFileAudio !== data.id)
            alert("متن مورد نظر دانلود نشد! لطفا فایل را باز کنید و دوباره تلاش کنید!");
    };

    // FOR COPY BUTTON
    const handleCopy = () => {
        if (showFileAudio === data.id) {
            let oneStringTextData = "";
            textDataFromApi.map((text) => {
                return oneStringTextData += `${text.text}${"\n"}`;
            });
            navigator.clipboard.writeText(oneStringTextData)
                .then(() => {
                    alert("متن مورد نظر کپی شد!");
                })
                .catch((error) => {
                    alert("متن مورد نظر کپی نشد! لطفا دوباره تلاش کنید!");
                    console.error("Failed to copy text:", error);
                });
        }
        if (showFileAudio !== data.id)
            alert("متن مورد نظر کپی نشد! لطفا فایل را باز کنید و دوباره تلاش کنید!");
    };

    return (
        <div
            className={`${data.id === showFileAudio ? "archive-file-active" : "archive-file-inactive"}`}
            key={data.id}
            style={
                (uploadMethod === "record") && (data.id === showFileAudio)
                    ? { border: "1px solid #00ba9f" }
                    : (uploadMethod === "link") && (data.id === showFileAudio)
                        ? { border: "1px solid #ff1654" }
                        : (uploadMethod === "upload") && (data.id === showFileAudio)
                            ? { border: "1px solid #118ad3" }
                            : {}
            }
        >
            <div className="archive-file-up">
                <div className="sendtype-icon">
                    {uploadMethod === "record"
                        ? <RecordIcon />
                        : uploadMethod === "upload"
                            ? <UploadIcon />
                            : uploadMethod === "link"
                                ? <LinkIcon />
                                : "not my app"}
                </div>

                <button
                    className={`archive-file-name ${uploadMethod === "link" && "link-name"}`}
                    onClick={e => showFileAudio === data.id ? setShowFileAudio(null) : setShowFileAudio(data.id)}
                >
                    {audioName}
                </button>
                <span className="archive-file-date">
                    {convertADDateToSolarDate(data.date)}
                </span>
                <span className="archive-file-type">
                    {audioFormat}.
                </span>
                <span className="archive-file-duration">
                    {formatDuration(data.duration)}
                </span>
                <div className="archive-icons">
                    {/* BUTTON FOR DOWNLOADING */}
                    <a href={audio} download={audioRef}>
                        <DownloadIcon className="archive-download-icon" />
                    </a>
                    {/* BUTTON FOR GENERATE AND DOWNLOAD PDF */}
                    <WordIcon
                        className="archive-word-icon"
                        onClick={generatePDF}
                    />
                    {/* BUTYON FOR COPY TEXT OF FILES */}
                    <CopyIcon
                        className="archive-copy-icon"
                        onClick={handleCopy}
                    />
                    {/* BUTYON FOR DELETING FILES */}
                    <button
                        className="archive-del-btn"
                        onClick={() => {
                            return handleDel(data.id);
                        }}
                    >
                        <DelIcon className="archive-del-icon" />
                    </button>
                </div>
            </div>
            {data.id === showFileAudio &&
                <ArchiveFileAudio
                    audio={audio}
                    audioRef={audioRef}
                    textDataFromApi={textDataFromApi}
                    language={audioLanguage}
                    duration={convertTimeToSeconds(data.duration)}
                    color={uploadMethod === "record"
                        ? "rgb(0, 186, 159)"
                        : uploadMethod === "upload"
                            ? "rgb(17, 138, 211)"
                            : uploadMethod === "link"
                                ? "rgb(255, 22, 84)"
                                : ""}
                />
            }
        </div>
    );
};

export default ArchiveListItems;