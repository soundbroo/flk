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

  console.log("checkResultsApp", checkResults);

  const [viewer, handleOpenViewer, handleCloseViewer] = useViewer();

  const [
    notifications,
    status,
    isNotificationActive,
    handleOpenNotification,
    handleCloseNotification,
  ] = useNotifications();

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
      <Notification
        title="Тестовый заголовок"
        notifications={notifications}
        status={status}
        isActive={isNotificationActive}
        close={handleCloseNotification}
      />
      <FilesViewer viewer={viewer} close={handleCloseViewer} />
    </div>
  );
}

export default App;
