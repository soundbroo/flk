import { useState, useEffect } from "react";

import { NOTIFICATION_DURATION } from "../constants";

const useNotifications = () => {
  const defaultStatus = "success";
  const [notifications, setNotifications] = useState([]);
  const [status, setStatus] = useState(defaultStatus);
  const [isNotificationActive, setNotificationActive] = useState(false);
  // const [isNotificationHovered, setNotificationHovered] = useState(false);

  const handleOpenNotification = (newNotifications, status) => {
    setNotifications([...notifications, ...newNotifications]);
    status && setStatus(status);
    setNotificationActive(true);
  };

  const handleCloseNotification = () => {
    setNotificationActive(false);
    setTimeout(() => {
      setNotifications([]);
      setStatus(defaultStatus);
    }, 500);
  };

  // const handleHoverNotification = () => setNotificationHovered(true);
  // const handleUnhoverNotification = () => setNotificationHovered(false);

  useEffect(() => {
    let timer;
    if (isNotificationActive) {
      timer = setTimeout(
        () => handleCloseNotification(),
        NOTIFICATION_DURATION
      );
    }
    if (!isNotificationActive && timer) {
      clearTimeout(timer);
    }
    return () => clearTimeout(timer);
  }, [isNotificationActive]);

  return [
    notifications,
    status,
    isNotificationActive,
    // isNotificationHovered,
    handleOpenNotification,
    handleCloseNotification,
    // handleHoverNotification,
    // handleUnhoverNotification,
  ];
};

export default useNotifications;
