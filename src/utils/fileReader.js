import { MAX_READABLE_FILE_SIZE } from "../constants";

export const checkIsFileSizeAcceptable = (file) =>
  file.size < MAX_READABLE_FILE_SIZE;

export const checkFormat = (name) => name.toLowerCase().slice(-3, name.length);

export const readFile = (file, assetrs, status, openViewer) => {
  const fileFormat = checkFormat(file.name);
  if (!checkIsFileSizeAcceptable(file))
    return openViewer(
      "txt",
      file.name,
      status,
      "Невозможно прочитать содержимое файла",
      assetrs
    );

  if (fileFormat === "txt") {
    const txtReader = new FileReader();
    txtReader.onloadend = (e) =>
      openViewer(fileFormat, file.name, status, e.target.result, assetrs);
    return txtReader.readAsText(file, "cp866");
  }

  const cp1251Reader = new FileReader();
  const utfReader = new FileReader();

  utfReader.onloadend = (e) =>
    openViewer(fileFormat, file.name, status, e.target.result, assetrs);

  cp1251Reader.onloadend = (e) => {
    if (e.target.result.toLowerCase().includes(`encoding="windows-1251"`))
      return openViewer(
        fileFormat,
        file.name,
        status,
        e.target.result,
        assetrs
      );
    return utfReader.readAsText(file, "utf-8");
  };
  cp1251Reader.readAsText(file, "cp1251");
};
