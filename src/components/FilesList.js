import React from "react";

import searchIcon from "../images/search.svg";
import successOutlinedIcon from "../images/success-outlined.svg";
import { ReactComponent as ViewIcon } from "../images/view.svg";
import { ReactComponent as DeleteIcon } from "../images/delete.svg";

const FilesList = ({
  files,
  filteredFiles,
  setFiles,
  filesCount,
  search,
  setSearch,
  openViewer,
}) => {
  const handleSearch = (e) => setSearch(e.target.value);
  const handleDelete = (fileKey) => {
    const newFiles = files.filter(
      ({ name }, index) => `${name}_${index}` !== fileKey
    );
    setFiles(newFiles);
  };
  const handleView = (file) => {
    const reader = new FileReader();
    reader.onloadend = (e) => openViewer(file.name, e.target.result);
    reader.readAsText(file, "CP1251");
  };

  return (
    <div className={`files-list${!files.length ? " files-list_empty" : ""}`}>
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
        <div>
          {filteredFiles.map((file, index) => {
            const fileKey = `${file.name}_${index}`;

            return (
              <div
                key={fileKey}
                className={`files-list__item${
                  file.hidden ? " files-list__item_hidden" : ""
                }`}
              >
                <span className="files-list__item__name">
                  <img src={successOutlinedIcon} alt="processing status" />
                  <span>{file.name}</span>
                </span>
                <span className="files-list__item__status">Проверено</span>
                <div className="files-list__item__control">
                  <button
                    type="button"
                    className="files-list__control files-list__control_view"
                    onClick={() => handleView(file)}
                  >
                    <ViewIcon />
                  </button>
                  <button
                    type="button"
                    className="files-list__control files-list__control_shake files-list__control_delete"
                    onClick={() => handleDelete(fileKey)}
                  >
                    <DeleteIcon />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FilesList;
