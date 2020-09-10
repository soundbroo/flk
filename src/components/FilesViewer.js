import React from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneLight } from "react-syntax-highlighter/dist/esm/styles/hljs";

import closeIcon from "../images/close.svg";

const FilesViewer = ({
  viewer: { active, fileName, content, asserts },
  close,
}) => (
  <div className={`files-viewer${active ? " files-viewer_active" : ""}`}>
    <div className="files-viewer__header">
      <span>{fileName}</span>
      <button type="button" className="close-btn" onClick={close}>
        <img src={closeIcon} alt="close viewer" />
      </button>
    </div>
    <div className="files-viewer__content">
      {content ? (
        <SyntaxHighlighter language="xml" style={atomOneLight} showLineNumbers>
          {content}
        </SyntaxHighlighter>
      ) : null}
      {asserts ? (
        <div className="files-viewer__asserts">
          {asserts.map((assert, index) => (
            <span className="files-viewer__asserts-item">{`${
              index + 1
            }. ${assert}`}</span>
          ))}
        </div>
      ) : null}
    </div>
  </div>
);

export default FilesViewer;
