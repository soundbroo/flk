import React, { useState } from "react";

import Header from "./components/Header";
import Uploader from "./components/Uploader";
import FilesList from "./components/FilesList";
import Notification from "./components/Notification";
import FilesViewer from "./components/FilesViewer";

import useNotifications from "./hooks/useNotifications";
import useViewer from "./hooks/useViewer";

import "./App.css";

import placeholder from "./images/placeholder.svg";

function App() {
  const [files, setFiles] = useState([]);
  const [checkResults, setCheckResults] = useState({});
  const [search, setSearch] = useState("");

  const [viewer, handleOpenViewer, handleCloseViewer] = useViewer();

  const [
    notifications,
    transform,
    handleOpenNotification,
    handleCloseNotification,
    increaseNotificationsTransform,
  ] = useNotifications();

  // console.log(notifications);

  const filteredFiles = files.map((file) => {
    return Object.assign(file, {
      ...file,
      hidden: !file.file.name.toLowerCase().includes(search.toLowerCase()),
    });
  });

  return (
    <div className="app">
      <Header />
      <div className="content">
        <div className="title">
          Проверка файлов отчетности ФНС, ПФР, ФСС, РАР
        </div>
        <Uploader
          currentFiles={files}
          setFiles={setFiles}
          checkResults={checkResults}
          setCheckResults={setCheckResults}
          openNotification={handleOpenNotification}
        />
        <img
          src={placeholder}
          alt="Files not uploaded"
          className={`placeholder${files.length ? " placeholder_hidden" : ""}`}
        />
        <FilesList
          files={files}
          filteredFiles={filteredFiles}
          setFiles={setFiles}
          filesCount={files.length}
          search={search}
          setSearch={setSearch}
          openViewer={handleOpenViewer}
        />
      </div>
      <div className="notifications" style={{ height: `${transform}px` }}>
        {Object.entries(notifications).map(
          ([id, { notifications, status, removeTransition }]) => (
            <Notification
              key={id}
              id={id}
              notifications={notifications}
              status={status}
              remove={removeTransition}
              close={handleCloseNotification}
              increaseTransform={increaseNotificationsTransform}
            />
          )
        )}
      </div>
      <FilesViewer viewer={viewer} close={handleCloseViewer} />
    </div>
  );
}

export default App;
