import { useState, useEffect } from "react";

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
    if (isNotificationActive)
      setTimeout(() => {
        setNotificationActive(false);
        setNotifications([]);
      }, 8000);
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
