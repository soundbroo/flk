import { useState } from "react";

const useViewer = () => {
  const initialViewerState = {
    active: false,
    fileName: null,
    content: null,
    asserts: null,
  };
  const [viewer, setViewer] = useState(initialViewerState);

  const handleOpenViewer = (fileName, content, asserts) =>
    setViewer({ ...viewer, active: true, fileName, content, asserts });
  const handleCloseViewer = () => setViewer({ ...viewer, active: false });

  return [viewer, handleOpenViewer, handleCloseViewer];
};

export default useViewer;
