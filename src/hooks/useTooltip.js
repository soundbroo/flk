import { useState } from "react";

const useTooltip = (files) => {
  const tooltipInitialState = files.map(({ meta: { oid } }) => {
    return { [oid]: null };
  });
  const [tooltip, setTooltip] = useState(tooltipInitialState);

  const showTooltip = (oid) =>
    setTooltip((prevState) => {
      return {
        ...prevState,
        [oid]: files.find(({ meta: { oid: id } }) => oid === id).file.name,
      };
    });
  const closeTooltip = (oid) =>
    setTooltip((prevState) => {
      return { ...prevState, [oid]: null };
    });

  return [tooltip, showTooltip, closeTooltip];
};

export default useTooltip;
