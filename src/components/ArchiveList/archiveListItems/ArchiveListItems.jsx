import { useState, useEffect, useRef } from "react";
import moment from 'moment-jalaali';

import ArchiveFileAudio from "../../ArchiveFileAudio/ArchiveFileAudio";

import "./ArchiveListItems.css";

import { ReactComponent as DownloadIcon } from '../../../assets/images/download-icon.svg';
import { ReactComponent as WordIcon } from '../../../assets/images/Word-icon.svg';
import { ReactComponent as CopyIcon } from '../../../assets/images/copy-icon.svg';
import { ReactComponent as DelIcon } from '../../../assets/images/del-icon.svg';
import { ReactComponent as RecordIcon } from '../../../assets/images/green-record-btn.svg';
import { ReactComponent as UploadIcon } from '../../../assets/images/blue-upload-icon.svg';
import { ReactComponent as LinkIcon } from '../../../assets/images/red-link-icon.svg';

const ArchiveListItems = ({ data, dataFromApi }) => {
    const [showFileAudio, setShowFileAudio] = useState(false);
    const [uploadMethod, setUploadMethod] = useState(null); //sendtype 
    const [audio, setAudio] = useState(""); //audioUrl
    const [audioFormat, setAudioFormat] = useState(null); //audioType
    const [audioName, setAudioName] = useState(null);
    const [audioLanguage, setAudioLanguage] = useState(null);

    // FOR CONVERTING AD DATE TO SOLAR DATE(PERSIAN CALENDAR)
    const convertADDateToSolarDate = (date) => {
        const persianDate = moment(date, 'YYYY-MM-DD HH:mm:ss').format('jYYYY-jMM-jDD');
        return persianDate;
    }

    const formatDuration = (duration) => {
        const [hours, minutes, seconds] = duration.split(':');
        if (hours === '00')
            return `${minutes}:${seconds}`;
        return duration;
    };

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
                    onClick={e => showFileAudio === data.id ? setShowFileAudio() : setShowFileAudio(data.id)}
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
                    <DownloadIcon className="archive-download-icon" />
                    <WordIcon className="archive-word-icon" />
                    <CopyIcon className="archive-copy-icon" />
                    <button className="archive-del-btn">
                        <DelIcon className="archive-del-icon" />
                    </button>
                </div>
            </div>
            {data.id === showFileAudio &&
                <ArchiveFileAudio
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