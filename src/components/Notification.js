import React, { useEffect, useState, createRef } from "react";

import closeIcon from "../images/close.svg";

import {
  NOTIFICATION_DURATION,
  NOTIFICATION_HIDE_DURATION,
  NOTIFICATIONS_ICONS,
  NOTIFICATIONS_COLORS,
  NOTIFICATIONS_TITLES,
} from "../constants";

const notificationDynamicStyles = {
  transition: `all ${NOTIFICATION_HIDE_DURATION / 1000}s`,
};

const Notification = ({
  id,
  notifications = [],
  status,
  remove,
  close,
  increaseTransform,
}) => {
  const reference = createRef();

  const [height, setHeight] = useState(null);

  const handleClose = () => close(id, height);

  useEffect(() => {
    if (reference?.current) {
      const { height } = reference?.current?.getBoundingClientRect();
      setHeight(height);
    }
  }, [reference?.current]);

  useEffect(() => {
    if (height) {
      increaseTransform(id, height);
      const timer = setTimeout(handleClose, NOTIFICATION_DURATION);
      return () => clearTimeout(timer);
    }
  }, [height]);

  return (
    <>
      <div
        key={id}
        ref={reference}
        style={
          remove
            ? {
                ...notificationDynamicStyles,
                transform: "translateX(600px)",
                maxHeight: 0,
                margin: 0,
              }
            : notificationDynamicStyles
        }
        className="notification"
      >
        <div className="notification__header">
          <div>
            <img src={NOTIFICATIONS_ICONS[status]} alt="notification status" />
            <span>{NOTIFICATIONS_TITLES[status]}</span>
          </div>
          <button className="close-btn" type="button" onClick={handleClose}>
            <img src={closeIcon} alt="close notification" />
          </button>
        </div>
        <div className="notification__content">
          {notifications.map((el, index) => (
            <span key={index}>{el}</span>
          ))}
        </div>
        <div
          className="notification__timer"
          style={{
            animation: `${NOTIFICATION_DURATION / 1000}s timer`,
            background: NOTIFICATIONS_COLORS[status],
          }}
        />
      </div>
    </>
  );
};

export default Notification;
