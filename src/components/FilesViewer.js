import React from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneLight } from "react-syntax-highlighter/dist/esm/styles/hljs";

import closeIcon from "../images/close.svg";

import { STATUSES, STATUSES_COLORS, STATUSES_ICONS } from "../constants";

const FilesViewer = ({
  viewer: { active, fileName, status, content, asserts },
  close,
}) => (
  <div className={`files-viewer${active ? " files-viewer_active" : ""}`}>
    <div className="files-viewer__header">
      <div className="files-viewer__header__title">
        <span className="files-viewer__header__title_name-wrapper">
          <img src={STATUSES_ICONS[status]} alt="processing status" />
          <span className="files-viewer__header__title__name">{fileName}</span>
        </span>
        <span
          className="files-viewer__header__title__status"
          style={{
            color: STATUSES_COLORS[status],
            borderColor: STATUSES_COLORS[status],
          }}
        >
          {STATUSES[status]}
        </span>
      </div>
      <button type="button" className="close-btn" onClick={close}>
        <img src={closeIcon} alt="close viewer" />
      </button>
    </div>
    <div className="files-viewer__content">
      {asserts ? (
        <div className="files-viewer__asserts">
          {asserts.map((assert, index) => (
            <span className="files-viewer__asserts-item">{`${
              index + 1
            }. ${assert}`}</span>
          ))}
        </div>
      ) : null}
      {content ? (
        <SyntaxHighlighter language="xml" style={atomOneLight} showLineNumbers>
          {content}
        </SyntaxHighlighter>
      ) : null}
    </div>
  </div>
);

export default FilesViewer;
