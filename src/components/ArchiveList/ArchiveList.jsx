import { useState, useEffect } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";

//import { data } from '../../assets/dummydata/data';
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

const token = process.env.REACT_APP_SECRET;

const ArchiveList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showFileAudio, setShowFileAudio] = useState(false);
  const [dataFromApi, setDataFromApi] = useState(null);
  /*const [uploadMethod, setUploadMethod] = useState(null); //sendType
  const [audio, setAudio] = useState(""); //audioUrl
  const [audioFormat, setAudioFormat] = useState(null); //audioType
  const [audioName, setAudioName] = useState(null);
  const [audioLanguage, setAudioLanguage] = useState(null);*/

  function formatDuration(value) {
    const hour = Math.floor(value / 3600);
    const minuteLeft = Math.floor((value % 3600) / 60);
    const secondLeft = value % 60;
    return `${hour > 0 ? `${hour}:` : ``}${minuteLeft > 0 ? `${minuteLeft}:` : ``}${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
  }

  // FOR TOTAL NUMBER OF PAGES
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected + 1);
  };

  const pageCounter = Math.ceil((dataFromApi ? dataFromApi.count : 0) / itemsPerPage);
  const firstIndex = currentPage * itemsPerPage;
  const lastIndex = firstIndex + itemsPerPage;
  const pageData = dataFromApi
    ? dataFromApi?.results?.slice(firstIndex, lastIndex)
    : [];
 

  /*useEffect(() => {
    const url = `https://harf.roshan-ai.ir/api/requests?page=${currentPage}`;
    
const token = process.env.REACT_APP_SECRET;
console.log(token);
    axios.get(url, {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => {
        const updatedResults = res.data.results.map(row => {
          console.log(row)
          return {
            ...row,
						date: row.date,
						file_type: row.request_data.media_urls,
          };
        });
        setDataFromApi({ ...res.data, results: updatedResults });
        console.log(dataFromApi);
      })
    
      .catch(error => {
				console.error(error);
			});
  }, [currentPage, dataFromApi]);*/

  useEffect(() => {
    
    const url = `https://harf.roshan-ai.ir/api/requests?page=${currentPage}`;
    getFromApi( setDataFromApi, url )
  },[currentPage])

  //FOR GETTING LISTS FROM API
  const getFromApi = async ( setDataFromApi, url ) => {
    try {
      const res = await axios.get(url, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      console.log(res.data);
      setDataFromApi(res.data);
    } catch (err) {
      console.log(err);
    }
  };


  return (
    <div className="archive-container">
      <div className="archive-files-container">
        {pageData.map((data) => {
          return (
            <div
              className={`${data.id === showFileAudio ? "archive-file-active" : "archive-file-inactive"}`}
              key={data.id}
              style={
                (data.request_type === "record") && (data.id === showFileAudio)
                  ? { border: "1px solid #00ba9f" }
                  : (data.request_type === "link") && (data.id === showFileAudio)
                    ? { border: "1px solid #ff1654" }
                    : (data.request_type === "upload") && (data.id === showFileAudio)
                      ? { border: "1px solid #118ad3" }
                      : {}
              }
            >
              <div className="archive-file-up">
                <img
                  className="request_type-icon"
                  src={data.request_type === "record"
                    ? RecordIcon
                    : data.request_type === "upload"
                      ? UploadIcon
                      : data.request_type === "link"
                        ? LinkIcon
                        : ""}
                  alt="icons"
                />
                <button
                  className={`archive-file-name ${data.request_type === "link" && "link-name"}`}
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
                  color={data.request_type === "record"
                    ? "rgb(0, 186, 159)"
                    : data.request_type === "upload"
                      ? "rgb(17, 138, 211)"
                      : data.request_type === "link"
                        ? "rgb(255, 22, 84)"
                        : ""} />}
            </div>
          );
        })}
      </div>

      <div className="pagination-container">
        <ReactPaginate
          containerClassName={"pagination"}
          activeClassName={"active"}
          previousLabel={<RightArrowIcon />}
          nextLabel={<LeftArrowIcon />}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={pageCounter}
          marginPagesDisplayed={1}
          pageRangeDisplayed={3}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default ArchiveList;