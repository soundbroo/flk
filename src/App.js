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
  const [isNotificationHovered, setNotificationHovered] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const initialViewerState = {
    active: false,
    fileName: null,
    content: null,
  };
  const [viewer, setViewer] = useState(initialViewerState);

  const filteredFiles = files.map((el) => {
    return Object.assign(el, {
      hidden: !el.name.toLowerCase().includes(search.toLowerCase()),
    });
  });

  const handleCloseNotification = () => {
    setNotificationActive(false);
    setNotifications([]);
  };
  const handleOpenNotification = (newNotification) => {
    setNotifications([...notifications, ...newNotification]);
    setNotificationActive(true);
  };

  const handleHoverNotification = () => setNotificationHovered(true);
  const handleUnhoverNotification = () => setNotificationHovered(false);

  const handleCloseViewer = () => setViewer({ ...viewer, active: false });
  const handleOpenViewer = (fileName, content) =>
    setViewer({ ...viewer, active: true, fileName, content });

  // console.log(isNotificationHovered);

  useEffect(() => {
    if (isNotificationActive)
      setTimeout(() => {
        setNotificationActive(false);
        setNotifications([]);
      }, 8000);

    // if (isNotificationActive) {
    //   const timerId = setInterval(function update() {
    //     const timeoutId = setTimeout(() => {
    //       setNotificationActive(false);
    //       setNotificationHovered(false);
    //       setNotifications([]);
    //     }, 6000);
    //     if (isNotificationHovered) {
    //       clearTimeout(timeoutId);
    //     }
    //   }, 2000);
    // }
  }, [isNotificationActive]);

  return (
    <div className="app">
      <Header />
      <div className="content">
        <div className="title">
          Проверка файлов отчетности ФНС, ПФР, ФСС, РАР
        </div>
        <Uploader
          setFiles={setFiles}
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
        isActive={isNotificationActive}
        close={handleCloseNotification}
        mouseEnter={handleHoverNotification}
        mouseLeave={handleUnhoverNotification}
      />
      <FilesViewer viewer={viewer} close={handleCloseViewer} />
    </div>
  );
}

export default App;
