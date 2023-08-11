import { useState } from "react";
import ReactPaginate from "react-paginate";

import { data } from '../../assets/dummydata/data';
import ArchiveFileAudio from "../ArchiveFileAudio/ArchiveFileAudio";

import './ArchiveList.css';

import { ReactComponent as RightArrowIcon } from '../../assets/images/right-arrow-Icon.svg';
import { ReactComponent as LeftArrowIcon } from '../../assets/images/left-arrow-Icon.svg';
import { ReactComponent as DownloadIcon } from '../../assets/images/download-icon.svg';
import { ReactComponent as WordIcon } from '../../assets/images/Word-icon.svg';
import { ReactComponent as CopyIcon } from '../../assets/images/copy-icon.svg';
import { ReactComponent as DelIcon } from '../../assets/images/del-icon.svg';
import RecordIcon from '../../assets/images/green-record-btn.svg';
import UploadIcon from '../../assets/images/blue-upload-icon.svg';
import LinkIcon from '../../assets/images/red-link-icon.svg';

const ArchiveList = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(8);
  const [showFileAudio, setShowFileAudio] = useState(false);

  const pageCount = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentPageItems = data.slice(startIndex, endIndex);

  function formatDuration(value) {
    const hour = Math.floor(value / 3600);
    const minuteLeft = Math.floor((value % 3600) / 60);
    const secondLeft = value % 60;
    return `${hour > 0 ? `${hour}:` : ``}${minuteLeft > 0 ? `${minuteLeft}:` : ``}${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
  }

  return (
    <div className="archive-container">
      <div className="archive-files-container">
        {currentPageItems.map((data, key) => {
          return (
            <div
              className={`${data.id === showFileAudio ? "archive-file-active" : "archive-file-inactive"}`}
              key={key}
              style={
                (data.sendType === "record") && (data.id === showFileAudio)
                  ? { border: "1px solid #00ba9f" }
                  : (data.sendType === "link") && (data.id === showFileAudio)
                    ? { border: "1px solid #ff1654" }
                    : (data.sendType === "upload") && (data.id === showFileAudio)
                      ? { border: "1px solid #118ad3" }
                      : {}
              }
            >
              <div className="archive-file-up">
                <img
                  className="sendtype-icon"
                  src={data.sendType === "record"
                    ? RecordIcon
                    : data.sendType === "upload"
                      ? UploadIcon
                      : data.sendType === "link"
                        ? LinkIcon
                        : ""}
                  alt="icons"
                />
                <button
                  className={`archive-file-name ${data.sendType === "link" && "link-name"}`}
                  onClick={e => showFileAudio === data.id ? setShowFileAudio() : setShowFileAudio(data.id)}
                >
                  {data.name}
                </button>
                <span className="archive-file-date">
                  {data.createdAt}
                </span>
                <span className="archive-file-type">
                  {data.voiceType}.
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
                  {/*<img
                  className="archive-download-icon"
                  src={DownloadIcon}
                  alt="download-icon"
                />
                <img
                  className="archive-word-icon"
                  src={WordIcon}
                  alt="word-icon"
                />
                <img
                  className="archive-copy-icon"
                  src={CopyIcon}
                  alt="copy-icon"
                />
                <img
                  className="archive-del-icon"
                  src={DelIcon}
                  alt="delete-icon"
          />*/}
                </div>
              </div>
              {data.id === showFileAudio &&
                <ArchiveFileAudio
                  color={data.sendType === "record"
                    ? "rgb(0, 186, 159)"
                    : data.sendType === "upload"
                      ? "rgb(17, 138, 211)"
                      : data.sendType === "link"
                        ? "rgb(255, 22, 84)"
                        : ""} />}
            </div>
          );
        })}
      </div>
      
      <div className="pagination-container">
        <ReactPaginate
          previousLabel={<RightArrowIcon />}
          nextLabel={<LeftArrowIcon />}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={pageCount}
          marginPagesDisplayed={1}
          pageRangeDisplayed={3}
          onPageChange={handlePageChange}
          containerClassName={"pagination"}
          activeClassName={"active"}
        />
      </div>
    </div>
  );
};

export default ArchiveList;