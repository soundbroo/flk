import { MAX_FILE_SIZE, MAX_FILES_TO_UPLOAD } from "../constants";

export const upload = (openNotification, currentFiles, newFiles, setFiles) => {
  // ToDo: Проверять количество уже загруженных файлов
  // ToDo: Сначала проверять формат, потом размер

  const maxFileSizeText = `${MAX_FILE_SIZE / 1e6} мб`;

  if (currentFiles.length < MAX_FILES_TO_UPLOAD) {
    const notifications = [];

    if (currentFiles.length + newFiles.length > MAX_FILES_TO_UPLOAD)
      notifications.push(
        `Слишком много файлов, будут загружены первые ${
          MAX_FILES_TO_UPLOAD - currentFiles.length
        }`
      );

    const filesArray = Object.values(newFiles);

    const filesToUploadArray =
      currentFiles.length + filesArray.length > MAX_FILES_TO_UPLOAD
        ? filesArray.splice(0, MAX_FILES_TO_UPLOAD - currentFiles.length)
        : filesArray;

    const oversizedFiles = filesToUploadArray
      .filter(({ size }) => size > MAX_FILE_SIZE)
      .map(({ name }) => name);

    if (oversizedFiles.length) {
      const notificationFiles = oversizedFiles.join(", ");
      const multiple = oversizedFiles.length > 1;
      const notification = `Файл${
        multiple ? "ы" : ""
      } ${notificationFiles} не был${multiple ? "и" : ""} загружен${
        multiple ? "ы" : ""
      }, ${multiple ? "их" : "его"} размер превышает ${maxFileSizeText}`;
      notifications.push(notification);
    }

    const validSizeFiles = filesToUploadArray.filter(
      ({ size }) => size <= MAX_FILE_SIZE
    );

    const nonValidFormatedFiles = validSizeFiles
      .filter(
        ({ name }) => !["txt", "xml"].includes(name.slice(-3, name.length))
      )
      .map(({ name }) => name);

    if (nonValidFormatedFiles.length) {
      const notificationFiles = nonValidFormatedFiles.join(", ");
      const multiple = nonValidFormatedFiles.length > 1;
      const notification = `Файл${
        multiple ? "ы" : ""
      } ${notificationFiles} не был${multiple ? "и" : ""} загружен${
        multiple ? "ы" : ""
      }, так как име${multiple ? "ют" : "ет"} неподдерживаемый формат`;
      notifications.push(notification);
    }

    const validFiles = validSizeFiles.filter(({ name }) =>
      ["txt", "xml"].includes(name.slice(-3, name.length))
    );

    if (validFiles.length)
      notifications.push(`Файлов успешно добавлено: ${validFiles.length}`);

    openNotification(notifications);
    setFiles((prevFiles) => {
      return [...prevFiles, ...validFiles];
    });
  } else
    openNotification([
      `Невозможно добавить более ${MAX_FILES_TO_UPLOAD} файлов`,
    ]);
};
