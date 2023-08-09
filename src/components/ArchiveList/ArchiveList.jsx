import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";

import {data} from '../../assets/dummydata/data';

import './ArchiveList.css';

import RightArrowIcon from '../../assets/images/right-arrow-Icon.svg';
import LeftArrowIcon from '../../assets/images/left-arrow-Icon.svg';
import DownloadIcon from '../../assets/images/download-icon.svg';
import WordIcon from '../../assets/images/Word-icon.svg';
import CopyIcon from '../../assets/images/copy-icon.svg';
import DelIcon from '../../assets/images/del-icon.svg';
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
    const minute = Math.floor(value / 60);
    const secondLeft = value - minute * 60;
    return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
}

  return (
    <div className="archive-container">
      {/* Display data */}
      <div className="archive-files-container">
        {currentPageItems.map((data, key) => {
          return (
            <div className="archive-file" key={key}>
              <div className="sendtype-icon">
                {data.sendType === "record"
                  ? RecordIcon
                  : data.sendType === "upload"
                  ? UploadIcon
                  : data.sendType === "link"
                  ? LinkIcon
                  : ""}
              </div>
              <span className={`archive-file-name ${data.sendType === "link" && "link-name"}`}>
                {data.name}
              </span>
              <span className="archive-file-date">
                {data.createdAt}
              </span>
              <span className="archive-file-type">
                {data.voiceType}
              </span>
              <span className="archive-file-duration">
                {formatDuration(data.duration)}
              </span>
              <div className="archive-icons">
                <div className="archive-download-icone">
                  {DownloadIcon}
                </div>
                <div className="archive-word-icon">
                  {WordIcon}
                </div>
                <div className="archive-copy-icon">
                  {CopyIcon}
                </div>
                <div className="archive-del-icon">
                  {DelIcon}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Render the pagination component */}
      <div className="pagination-container">
        <ReactPaginate
          previousLabel={RightArrowIcon}
          nextLabel={LeftArrowIcon}
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