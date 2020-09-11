import { useState } from "react";

const useViewer = () => {
  const initialViewerState = {
    active: false,
    fileName: null,
    status: null,
    content: null,
    asserts: null,
  };
  const [viewer, setViewer] = useState(initialViewerState);

  const handleOpenViewer = (fileName, status, content, asserts) =>
    setViewer({ ...viewer, active: true, fileName, status, content, asserts });
  const handleCloseViewer = () => setViewer({ ...viewer, active: false });

  return [viewer, handleOpenViewer, handleCloseViewer];
};

export default useViewer;
