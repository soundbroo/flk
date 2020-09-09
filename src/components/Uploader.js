import React, { useState } from "react";

import { updateFilesState } from "../utils/uploader";

const Uploader = ({ setFiles, openNotification }) => {
  const [dragging, setDragging] = useState(false);

  const handleChange = (newfiles) =>
    updateFilesState(newfiles, setFiles, openNotification);
  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    updateFilesState(e.dataTransfer.files, setFiles, openNotification);
  };
  const handleDragEnter = () => setDragging(true);
  const handleDragLeave = (e) => {
    e.stopPropagation();
    setDragging(false);
  };

  return (
    <div className="uploader">
      <div className="uploader__rules">
        <span>
          <div className="uploader__rules__prefix" />
          Один запрос не более
          <span className="font__blue">{`\u00A010 файлов`}</span>
        </span>
        <span>
          <div className="uploader__rules__prefix" />
          Максимальный размер файла
          <span className="font__blue">{`\u00A010 Мб`}</span>
        </span>
        <span>
          <div className="uploader__rules__prefix" />
          Допустимые форматы
          <span className="font__blue">{`\u00A0XML и TXT`}</span>
        </span>
      </div>
      <label
        htmlFor="upload-btn"
        className={`uploader__button ${
          dragging ? " uploader__button_dragging" : ""
        }`}
      >
        Выбрать файлы
      </label>
      <input
        type="file"
        id="upload-btn"
        accept=".xml, .txt"
        multiple
        onChange={(e) => handleChange(e.target.files)}
        style={{ display: "none" }}
      />
      <div
        className={`uploader__dnd ${dragging ? " uploader__dnd_dragging" : ""}`}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      />
    </div>
  );
};

export default Uploader;
