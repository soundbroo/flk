import React from "react";

import successFilledIcon from "../images/success-filled.svg";
import closeIcon from "../images/close.svg";

const Notification = ({ title = "", notifications = [], isActive, close }) => (
  <div className={`notification${isActive ? " notification_active" : ""}`}>
    <div className="notification__header">
      <div>
        <img src={successFilledIcon} alt="notification status" />
        <span>{title}</span>
      </div>
      <button className="notification__close" type="button" onClick={close}>
        <img src={closeIcon} alt="close notification" />
      </button>
    </div>
    <div className="notification__content">
      {notifications.map((el) => (
        <span>{el}</span>
      ))}
    </div>
  </div>
);

export default Notification;
