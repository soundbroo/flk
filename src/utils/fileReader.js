import { MAX_READABLE_FILE_SIZE } from "../constants";

export const checkFileSizeIsAcceptable = (file) =>
  file.size < MAX_READABLE_FILE_SIZE;

export const readFile = (file, assetrs, status, openViewer) => {
  if (!checkFileSizeIsAcceptable(file))
    return openViewer(
      file.name,
      status,
      "Невозможно прочитать содержимое файла",
      assetrs
    );
  const cp1251Reader = new FileReader();
  const utfReader = new FileReader();

  utfReader.onloadend = (e) =>
    openViewer(file.name, status, e.target.result, assetrs);

  cp1251Reader.onloadend = (e) => {
    if (e.target.result.toLowerCase().includes(`encoding="windows-1251"`))
      return openViewer(file.name, status, e.target.result, assetrs);
    return utfReader.readAsText(file, "utf-8");
  };
  cp1251Reader.readAsText(file, "CP1251");
};
