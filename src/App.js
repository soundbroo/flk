import React, { useState, useEffect } from "react";

import Header from "./components/Header";
import Uploader from "./components/Uploader";
import FilesList from "./components/FilesList";
import Notification from "./components/Notification";
import FilesViewer from "./components/FilesViewer";

import "./App.css";

import placeholder from "./images/placeholder.svg";

function App() {
  const [files, setFiles] = useState([]);
  const [search, setSearch] = useState("");
  const [isNotificationActive, setNotificationActive] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const initialViewerState = {
    active: false,
    fileName: null,
    content: null,
  };
  const [viewer, setViewer] = useState(initialViewerState);

  const filteredFiles = files.filter(({ name }) =>
    name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCloseNotification = () => {
    setNotificationActive(false);
    setNotifications([]);
  };
  const handleOpenNotification = (newNotification) => {
    setNotifications([...notifications, ...newNotification]);
    setNotificationActive(true);
  };
  const handleCloseViewer = () => setViewer({ ...viewer, active: false });
  const handleOpenViewer = (fileName, content) =>
    setViewer({ ...viewer, active: true, fileName, content });

  useEffect(() => {
    if (isNotificationActive)
      setTimeout(() => {
        setNotificationActive(false);
        setNotifications([]);
      }, 8000);
  }, [isNotificationActive]);

  console.log(files);

  return (
    <div className="app">
      <Header />
      <div className="content">
        <div className="title">
          Проверка файлов отчетности ФНС, ПФР, ФСС, РАР
        </div>
        <Uploader
          files={files}
          setFiles={setFiles}
          openNotification={handleOpenNotification}
        />
        {!files.length ? (
          <img
            src={placeholder}
            alt="Files not uploaded"
            className="placeholder"
          />
        ) : (
          <FilesList
            files={files}
            filteredFiles={filteredFiles}
            setFiles={setFiles}
            filesCount={files.length}
            search={search}
            setSearch={setSearch}
            openViewer={handleOpenViewer}
          />
        )}
      </div>
      <Notification
        title="Тестовый заголовок"
        notifications={notifications}
        isActive={isNotificationActive}
        close={handleCloseNotification}
      />
      <FilesViewer viewer={viewer} close={handleCloseViewer} />
    </div>
  );
}

export default App;
