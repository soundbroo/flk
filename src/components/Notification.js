import React from "react";

import successFilledIcon from "../images/success-filled.svg";
import closeIcon from "../images/close.svg";

import { NOTIFICATION_DURATION } from "../constants";

const Notification = ({
  title = "",
  notifications = [],
  isActive,
  close,
  mouseEnter,
  mouseLeave,
}) => (
  <div
    className={`notification${isActive ? " notification_active" : ""}`}
    onMouseEnter={mouseEnter}
    onMouseLeave={mouseLeave}
  >
    <div className="notification__header">
      <div>
        <img src={successFilledIcon} alt="notification status" />
        <span>{title}</span>
      </div>
      <button className="close-btn" type="button" onClick={close}>
        <img src={closeIcon} alt="close notification" />
      </button>
    </div>
    <div className="notification__content">
      {notifications.map((el) => (
        <span>{el}</span>
      ))}
    </div>
    <div
      className="notification__timer"
      style={{
        animation: isActive ? `${NOTIFICATION_DURATION / 1000}s timer` : "none",
      }}
    />
  </div>
);

export default Notification;
