import React from "react";

import searchIcon from "../images/search.svg";
import successOutlinedIcon from "../images/success-outlined.svg";
import viewIcon from "../images/view.svg";
import deleteIcon from "../images/delete.svg";

const FilesList = ({
  files,
  filteredFiles,
  setFiles,
  filesCount,
  search,
  setSearch,
}) => {
  const handleSearch = (e) => setSearch(e.target.value);
  const handleDelete = (index, name) => {
    const newFiles = files.filter((el, i) => i !== index && name !== el.name);
    setFiles(newFiles);
  };

  return (
    <div className="files-list">
      <div className="files-list__header">
        <span>
          Загруженные файлы <span className="font__gray">{filesCount}</span>
        </span>
        <div className="files-list__search">
          <img src={searchIcon} alt="search icon" />
          <input type="text" value={search} onChange={handleSearch} />
        </div>
      </div>
      <div className="files-list__items">
        {filteredFiles.map(({ name }, index) => (
          <div key={`${name}_${index}`} className="files-list__item">
            <span className="files-list__item__name">
              <img src={successOutlinedIcon} alt="processing status" />
              <span>{name}</span>
            </span>
            <span className="files-list__item__status">Проверено</span>
            <div className="files-list__item__control">
              <button type="button">
                <img src={viewIcon} alt="view document" />
              </button>
              <button
                type="button"
                onClick={(index) => handleDelete(index, name)}
              >
                <img src={deleteIcon} alt="delete document" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilesList;
