import React from "react";

import closeIcon from "../images/close.svg";

import {
  NOTIFICATION_DURATION,
  NOTIFICATIONS_ICONS,
  NOTIFICATIONS_COLORS,
} from "../constants";

const Notification = ({
  title = "",
  notifications = [],
  status,
  isActive,
  close,
}) => (
  <div className={`notification${isActive ? " notification_active" : ""}`}>
    <div className="notification__header">
      <div>
        <img src={NOTIFICATIONS_ICONS[status]} alt="notification status" />
        <span>{title}</span>
      </div>
      <button className="close-btn" type="button" onClick={close}>
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
        animation: isActive ? `${NOTIFICATION_DURATION / 1000}s timer` : "none",
        background: NOTIFICATIONS_COLORS[status],
      }}
    />
  </div>
);

export default Notification;
