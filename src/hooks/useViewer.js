import { useState } from "react";

const useViewer = () => {
  const initialViewerState = {
    active: false,
    fileFormat: null,
    fileName: null,
    status: null,
    content: null,
    asserts: null,
  };
  const [viewer, setViewer] = useState(initialViewerState);

  const handleOpenViewer = (fileFormat, fileName, status, content, asserts) =>
    setViewer({
      ...viewer,
      active: true,
      fileFormat,
      fileName,
      status,
      content,
      asserts,
    });
  const handleCloseViewer = () => setViewer({ ...viewer, active: false });

  return [viewer, handleOpenViewer, handleCloseViewer];
};

export default useViewer;
