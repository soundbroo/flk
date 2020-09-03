import React, { createRef, useEffect } from "react";

import closeIcon from "../images/close.svg";

const FilesViewer = ({ viewer: { active, fileName, content }, close }) => {
  const contentRef = createRef();

  useEffect(() => {
    if (contentRef && content) console.log(contentRef?.current);
  }, [contentRef, content]);

  return (
    <div className={`files-viewer${active ? " files-viewer_active" : ""}`}>
      <div className="files-viewer__header">
        <span>{fileName}</span>
        <button type="button" className="close-btn" onClick={close}>
          <img src={closeIcon} alt="close viewer" />
        </button>
      </div>
      <div className="files-viewer__content">{content}</div>
    </div>
  );
};

export default FilesViewer;
