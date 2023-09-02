import { useState, useEffect } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";

import ArchiveListItems from "./archiveListItems/ArchiveListItems";

import './ArchiveList.css';

import { ReactComponent as RightArrowIcon } from '../../assets/images/right-arrow-Icon.svg';
import { ReactComponent as LeftArrowIcon } from '../../assets/images/left-arrow-Icon.svg';

const token = process.env.REACT_APP_SECRET;

const ArchiveList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [dataFromApi, setDataFromApi] = useState(null);

  // FOR SELECTING PAGE IN PAGINATE
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected + 1);
  };

  // FOR TOTAL NUMBER OF PAGES
  const pageCounter = Math.ceil((dataFromApi ? dataFromApi.count : 0) / itemsPerPage);
  const pageData = dataFromApi
    ? dataFromApi?.results : [];


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
    getFromApi(setDataFromApi, url);
  }, [currentPage])

  //FOR GETTING LISTS FROM API
  const getFromApi = async (setDataFromApi, url) => {
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
      alert("خطا در سرور دوباره تلاش کنید!");
    }
  };


  return (
    <div className="archive-container">
      <div className="archive-files-container">
        {pageData?.map((data) => {
          return (
            <ArchiveListItems
              key={data.id}
              data={data}
              dataFromApi={dataFromApi}
            />
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