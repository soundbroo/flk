const MAX_FILE_SIZE = 10e6;
// const MAX_FILE_SIZE = 1000;

export const upload = (openNotification, currentFiles, newFiles, setFiles) => {
  const notifications = [];
  // ToDo: Проверять количество уже загруженных файлов
  if (newFiles.length > 10)
    notifications.push("Слишком много файлов, будут загружены первые 10");

  const filesArray = Object.values(newFiles);

  const filesToUploadArray =
    filesArray.length > 10 ? filesArray.splice(0, 10) : filesArray;

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
    }, ${multiple ? "их" : "его"} размер превышает 10 мб`;
    notifications.push(notification);
  }

  const validSizeFiles = filesToUploadArray.filter(
    ({ size }) => size <= MAX_FILE_SIZE
  );

  const nonValidFormatedFiles = validSizeFiles
    .filter(({ name }) => !["txt", "xml"].includes(name.slice(-3, name.length)))
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
};
