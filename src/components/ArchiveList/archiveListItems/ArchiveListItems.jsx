import { useState, useEffect, useRef } from "react";
import axios from "axios";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { Tooltip as ReactTooltip } from "react-tooltip";

import ArchiveFileAudio from "../../archiveFileAudio/ArchiveFileAudio";
import {
    formatDurationNoZero,
    convertTimeToSeconds,
    convertADDateToSolarDate
} from "../../../helpers/TimeFunctions"

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
    const [uploadMethod, setUploadMethod] = useState(null);
    const [audio, setAudio] = useState("");
    const [audioFormat, setAudioFormat] = useState(null);
    const [audioName, setAudioName] = useState(null);
    const [audioLanguage, setAudioLanguage] = useState(null);
    const [textDataFromApi, setTextDataFromApi] = useState([
        { start: "0:00:00", end: "0:00:00", text: "" },
    ]);
    const [sizeInMegabytes, setSizeInMegabytes] = useState(0);

    // SETUP FILES TO DISPLAY
    useEffect(() => {
        // FOR RECORDS AND FILES
        if (data.request_data.media_url) {
            // SET AUDIO FOR PLAYING
            setAudio(data.request_data.media_url);
            const sizeInBytes = data.request_data.media_url?.size;
            const sizeInKilobytes = sizeInBytes / 1024;
            setSizeInMegabytes(sizeInKilobytes / 1024);
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
            const sizeInBytes = data.request_data.media_urls[0].size;
            const sizeInKilobytes = sizeInBytes / 1024;
            setSizeInMegabytes(sizeInKilobytes / 1024);
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
                    {formatDurationNoZero(data.duration)}
                </span>
                <div className="archive-icons">
                    {/* BUTTON FOR DOWNLOADING */}
                    <a
                        href={audio}
                        download={audioRef}
                        data-tooltip-id="download-tooltip"
                    >
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
            <ReactTooltip
                noArrow
                id="download-tooltip"
                place="bottom-end"
                content={`${sizeInMegabytes} مگابایت`}
                style={{
                    backgroundColor: "rgb(255, 255, 255)",
                    color: "#222",
                    boxShadow: "1px 1px 1px 1px rgba(0, 0, 0, 0.15)",
                    width: "94px",
                    height: "30px",
                    fontSize: "10px",
                    font: "SANSSarif"
                }}
            />
        </div>
    );
};

export default ArchiveListItems;