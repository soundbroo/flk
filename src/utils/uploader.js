// const MAX_FILE_SIZE = 10e6;
const MAX_FILE_SIZE = 1000;

export const upload = (openNotification, files, setFiles) => {
  console.log("files", files);
  if (files.length > 10) alert("Больше десяти файлов нельзя");
  const filesArray = Object.values(files);

  const oversizedFiles = filesArray
    .filter(({ size }) => size > MAX_FILE_SIZE)
    .map(({ name }) => name);

  const notifications = [];

  if (oversizedFiles.length) {
    const notificationFiles = oversizedFiles.join(", ");
    const notification = `Файлы ${notificationFiles} не были загружены, их размер превышает 10 мб`;
    notifications.push(notification);
  }

  const validFiles = filesArray.filter(
    ({ size, name }) =>
      size <= MAX_FILE_SIZE &&
      ["txt", "xml"].includes(name.slice(-3, name.length))
  );

  if (validFiles.length)
    notifications.push(`Файлов успешно добавлено: ${validFiles.length}`);

  openNotification(notifications);
  setFiles((prevFiles) => {
    return [...prevFiles, ...validFiles];
  });
};
