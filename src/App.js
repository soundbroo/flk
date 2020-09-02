import React, { useState, useEffect } from "react";

import Header from "./components/Header";
import Uploader from "./components/Uploader";
import FilesList from "./components/FilesList";
import Notification from "./components/Notification";

import "./App.css";

import placeholder from "./images/placeholder.svg";

function App() {
  const [files, setFiles] = useState([]);
  const [search, setSearch] = useState("");
  const [isNotificationActive, setNotificationActive] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const filteredFiles = files.filter(({ name }) =>
    name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCloseNotification = () => setNotificationActive(false);
  const handleOpenNotification = (newNotification) => {
    setNotifications([...notifications, ...newNotification]);
    setNotificationActive(true);
  };

  useEffect(() => {
    isNotificationActive &&
      setTimeout(() => setNotificationActive(false), 8000);
  }, [isNotificationActive]);

  console.log(notifications);

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
          />
        )}
      </div>
      <Notification
        title="Тестовый заголовок"
        notifications={notifications}
        isActive={isNotificationActive}
        close={handleCloseNotification}
      />
    </div>
  );
}

export default App;
