import React from "react";

const Tooltip = ({ title, lastElem }) => (
  <div className={`tooltip${lastElem ? " tooltip_last" : ""}`}>
    <span>{title}</span>
  </div>
);

export default Tooltip;
