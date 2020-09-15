import React from "react";

import Tooltip from "./Tooltip";

import searchIcon from "../images/search.svg";
import { ReactComponent as ViewIcon } from "../images/view.svg";
import { ReactComponent as DeleteIcon } from "../images/delete.svg";

import { readFile } from "../utils/fileReader";

import { STATUSES, STATUSES_COLORS, STATUSES_ICONS } from "../constants";

import useTooltip from "../hooks/useTooltip";

const FilesList = ({
  files,
  filteredFiles,
  setFiles,
  filesCount,
  search,
  setSearch,
  openViewer,
}) => {
  const [tooltip, showTooltip, closeTooltip] = useTooltip(files);

  const handleSearch = (e) => setSearch(e.target.value);
  const handleView = (file, assetrs, status) =>
    readFile(file, assetrs, status, openViewer);
  const handleDelete = (fileKey) => {
    const newFiles = files.filter(({ meta: { oid } }) => oid !== fileKey);
    setFiles(newFiles);
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
          {filteredFiles.map(
            (
              {
                file,
                meta: { oid },
                hidden,
                check: { status: responseStatus, direction, asserts },
              },
              index
            ) => {
              const status = String(responseStatus);
              const statusText = STATUSES[status];
              return (
                <div
                  key={oid}
                  className={`files-list__item${
                    hidden ? " files-list__item_hidden" : ""
                  }`}
                  onMouseLeave={() => closeTooltip(oid)}
                >
                  <span className="files-list__item__name">
                    <img
                      src={STATUSES_ICONS[status]}
                      alt="processing status"
                      className={`files-list__item__name__img${
                        status === "null" ? " circle-animation" : ""
                      }`}
                    />
                    <span onMouseEnter={() => showTooltip(oid)}>
                      {file.name}
                    </span>
                  </span>
                  <span className="files-list__item__direction">
                    {direction || null}
                  </span>
                  <span
                    className="files-list__item__status"
                    style={{ color: STATUSES_COLORS[status] }}
                  >
                    {statusText}
                  </span>
                  <div className="files-list__item__control">
                    <button
                      type="button"
                      className="files-list__control files-list__control_view"
                      onClick={() => handleView(file, asserts, status)}
                    >
                      <ViewIcon />
                    </button>
                    <button
                      type="button"
                      className="files-list__control files-list__control_shake files-list__control_delete"
                      onClick={() => handleDelete(oid)}
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                  {tooltip[oid] ? (
                    <Tooltip
                      title={tooltip[oid]}
                      lastElem={files.length > 1 && files.length === index + 1}
                    />
                  ) : null}
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
};

export default FilesList;
