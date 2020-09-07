export const readFile = (file, openViewer) => {
  const cp1251Reader = new FileReader();
  const utfReader = new FileReader();

  utfReader.onloadend = (e) => openViewer(file.name, e.target.result);

  cp1251Reader.onloadend = (e) => {
    if (e.target.result.toLowerCase().includes(`encoding="windows-1251"`))
      return openViewer(file.name, e.target.result);
    if (e.target.result.toLowerCase().includes(`encoding="utf-8"`))
      return utfReader.readAsText(file, "utf-8");
  };
  cp1251Reader.readAsText(file, "CP1251");
};
