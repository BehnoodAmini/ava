import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";

import RightArrowIcon from '../../assets/images/right-arrow-Icon.svg'
import LeftArrowIcon from '../../assets/images/left-arrow-Icon.svg'
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
  //const [itemsPerPage, setItemsPerPage] = useState<number>(8);

  // the number of items to display per page
  useEffect(() => {
    // first load
    const pageHeight = document.documentElement.scrollHeight;
    const itemsperpage = 8;
  }, []);

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

  return (
    <div className="archive-ai-content">
      {/* Display data */}
      <div className="ai-files-container">
        {currentPageItems.map((item, index) => {
          return (
            <AiFile
              key={index}
              files={data}
              setFiles={setData}
              item={item}
              onItemClick={onItemClick}
            />
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