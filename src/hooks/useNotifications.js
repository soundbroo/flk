import { useState, useEffect } from "react";

import { NOTIFICATION_DURATION } from "../constants";

const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isNotificationActive, setNotificationActive] = useState(false);
  const [isNotificationHovered, setNotificationHovered] = useState(false);

  const handleOpenNotification = (newNotification) => {
    setNotifications([...notifications, ...newNotification]);
    setNotificationActive(true);
  };

  const handleCloseNotification = () => {
    setNotificationActive(false);
    setNotifications([]);
  };

  const handleHoverNotification = () => setNotificationHovered(true);
  const handleUnhoverNotification = () => setNotificationHovered(false);

  useEffect(() => {
    let timer;
    if (isNotificationActive) {
      timer = setTimeout(() => {
        setNotificationActive(false);
        setNotifications([]);
      }, NOTIFICATION_DURATION);
    }
    if (!isNotificationActive && timer) {
      clearTimeout(timer);
    }
    return () => clearTimeout(timer);
  }, [isNotificationActive]);

  return [
    notifications,
    isNotificationActive,
    isNotificationHovered,
    handleOpenNotification,
    handleCloseNotification,
    handleHoverNotification,
    handleUnhoverNotification,
  ];
};

export default useNotifications;
