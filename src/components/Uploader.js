import React from "react";

import { upload } from "../utils/uploader";

const Uploader = ({ setFiles, openNotification }) => {
  const handleChange = upload(openNotification, setFiles);

  return (
    <div className="uploader">
      <div className="uploader__rules">
        <span>
          <div className="uploader__rules__prefix" />
          Один запрос не облее{" "}
          <span className="font__blue">{`\u00A010 файлов`}</span>
        </span>
        <span>
          <div className="uploader__rules__prefix" />
          Максимальный размер файла{" "}
          <span className="font__blue">{`\u00A010 Мб`}</span>
        </span>
        <span>
          <div className="uploader__rules__prefix" />
          Допустимые форматы{" "}
          <span className="font__blue">{`\u00A0XML и TXT`}</span>
        </span>
      </div>
      <label htmlFor="upload-btn" className="uploader__button">
        Выбрать файлы
      </label>
      <input
        type="file"
        id="upload-btn"
        accept=".xml, .txt"
        multiple
        onChange={handleChange}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default Uploader;
