import { useState } from "react";
import ReactPaginate from "react-paginate";

import { data } from '../../assets/dummydata/data';
import AudioUploaded from "../AudioUploaded/AudioUploaded";

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
/*import {
  archiveDummyData,
  prevSvg,
  nextSvg,
} from "@/utilities/archive-dummy-data/archive-dummy-data";*/
//import AiFile from "./ai-file/AiFile";
//import { data } from "@/shared/types";

const ArchiveList = () => {
  const [currentPage, setCurrentPage] = useState(0);
  //const [data, setData] = useState<data[]>(archiveDummyData);
  const [itemsPerPage] = useState(8);
  const [showFileAudio, setShowFileAudio] = useState(false);

  // the number of items to display per page
  /*useEffect(() => {
    // first load
    const pageHeight = document.documentElement.scrollHeight;
    const itemsperpage = 8;
  }, []);*/

  // calculate the total number of pages
  const pageCount = Math.ceil(data.length / itemsPerPage);

  // function to handle page change
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  // calculate the start and end index for the current page
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // get the items for the current page
  const currentPageItems = data.slice(startIndex, endIndex);

  const handleShowFile = event => {
    setShowFileAudio(!showFileAudio);
  }
  // open/close ai file
  /*const onItemClick = (itemId) => {
    setData((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId
          ? { ...item, isActive: true }
          : { ...item, isActive: false }
      )
    );
  };*/

  function formatDuration(value) {
    const hour = Math.floor(value / 3600);
    const minuteLeft = Math.floor((value % 3600) / 60);
    const secondLeft = value % 60;
    return `${hour > 0 ? `${hour}:` : ``}${minuteLeft > 0 ? `${minuteLeft}:` : ``}${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
  }

  return (
    <div className="archive-container">
      {/* Display data */}
      <div className="archive-files-container">
        {currentPageItems.map((data, key) => {
          return (
            <div
              className={`${data.id === showFileAudio ? "archive-file-active" : "archive-file-inactive"}`}
              key={key}
              onClick={e => setShowFileAudio(data.id)}
            >
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
              <button className={`archive-file-name ${data.sendType === "link" && "link-name"}`}>
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
          {data.id === showFileAudio && <AudioUploaded />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Render the pagination component */}
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