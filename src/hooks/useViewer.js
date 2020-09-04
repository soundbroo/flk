import { useState } from "react";

const useViewer = () => {
  const initialViewerState = {
    active: false,
    fileName: null,
    content: null,
  };
  const [viewer, setViewer] = useState(initialViewerState);

  const handleOpenViewer = (fileName, content) =>
    setViewer({ ...viewer, active: true, fileName, content });
  const handleCloseViewer = () => setViewer({ ...viewer, active: false });

  return [viewer, handleOpenViewer, handleCloseViewer];
};

export default useViewer;
