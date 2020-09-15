import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { NOTIFICATION_HIDE_DURATION } from "../constants";

const useNotifications = () => {
  const defaultStatus = "success";
  const [notifications, setNotifications] = useState({});
  const [transform, setTransform] = useState(0);
  // const [isNotificationHovered, setNotificationHovered] = useState(false);

  const handleOpenNotification = (newNotifications, status) => {
    setNotifications((prev) => {
      return {
        ...prev,
        [uuidv4()]: {
          notifications: newNotifications,
          status: status || defaultStatus,
        },
      };
    });
  };

  const handleCloseNotification = (id, height) => {
    setTransform((prev) => prev - height);
    setNotifications((prevNotifications) => {
      return {
        ...prevNotifications,
        [id]: { ...prevNotifications[id], removeTransition: true },
      };
    });

    setTimeout(
      () =>
        setNotifications((prev) => {
          const newArray = Object.entries(prev).filter(
            ([uuid, __]) => uuid !== id
          );
          return Object.fromEntries(newArray);
        }),
      NOTIFICATION_HIDE_DURATION
    );
  };

  const increaseNotificationsTransform = (id, height) => {
    setNotifications((prev) => {
      return {
        ...prev,
        [id]: { ...prev[id], transform: height },
      };
    });
    setTransform((prev) => prev + height);
  };
  // const handleHoverNotification = () => setNotificationHovered(true);
  // const handleUnhoverNotification = () => setNotificationHovered(false);

  return [
    notifications,
    transform,
    handleOpenNotification,
    handleCloseNotification,
    increaseNotificationsTransform,
  ];
};

export default useNotifications;
