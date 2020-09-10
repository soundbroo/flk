import { v4 as uuidv4 } from "uuid";

import AxiosService from "../api";

import { MAX_FILES_SIZE, MAX_FILES_TO_UPLOAD } from "../constants";

const MAX_FILES_SIZE_TEXT = `${MAX_FILES_SIZE / 1e6} мб`;

export const getFilesToSpliceCount = (oversizeValue, filesToSplice) => {
  let count = 0;
  let oversize = oversizeValue;
  const files = filesToSplice.reverse();
  files.forEach(({ size }) => {
    if (oversize > 0) {
      count++;
      oversize -= size;
    }
  });
  return count - 1;
};

export const spliceFilesArrayToValidSize = (files) => {
  // Проверяем общий размер загружаемых файлов
  const filesSize = files.reduce((acc, { size }) => acc + size, 0);
  const oversizeValue = filesSize - MAX_FILES_SIZE;

  if (oversizeValue > 0) {
    const spliceCount = getFilesToSpliceCount(oversizeValue, files);
    const validSizeFiles = files.splice(
      files.length - spliceCount,
      spliceCount
    );
    return { oversizeValue, validFiles: validSizeFiles };
  } else return { oversizeValue, validFiles: files };
};

export const addFilesMeta = (files) =>
  files.map((file) => {
    return {
      file,
      meta: {
        oid: uuidv4().replaceAll("-", ""),
        soft: "web",
        protocol: "json",
        title: file.name,
      },
      check: {
        status: null,
        direction: null,
        asserts: null,
      },
    };
  });

export const upload = (newFiles) => {
  const filesArray = Object.values(newFiles);

  // Проверяем файлы, неподходящие по формату
  const nonValidFormatedFiles = filesArray
    .filter(({ name }) => !["txt", "xml"].includes(name.slice(-3, name.length)))
    .map(({ name }) => name);

  const validFormatFiles = filesArray.filter(({ name }) =>
    ["txt", "xml"].includes(name.slice(-3, name.length))
  );

  // Массив файлов обрезаем, если число файлов больше 10
  const filesToUploadArray =
    validFormatFiles.length > MAX_FILES_TO_UPLOAD
      ? validFormatFiles.splice(0, MAX_FILES_TO_UPLOAD)
      : validFormatFiles;

  // Проверяем общий размер загружаемых файлов и исключаем лишние
  const { oversizeValue, validFiles } = spliceFilesArrayToValidSize(
    filesToUploadArray
  );

  const readyFiles = addFilesMeta(validFiles);
  const notificationData = {
    nonValidFormat: nonValidFormatedFiles,
    notMoreThenTenFiles: validFormatFiles.length,
    tooMuchSize: oversizeValue,
    filesAdded: validFiles.length,
  };

  return { readyFiles, notificationData };
};

export const getUploadNotifications = ({
  nonValidFormat,
  notMoreThenTenFiles,
  tooMuchSize,
  filesAdded,
}) => {
  const notifications = [];

  // УВЕДОМЛЕНИЕ: какие файлы не проходят по формату
  if (nonValidFormat.length) {
    const notificationFiles = nonValidFormat.join(", ");
    const multiple = nonValidFormat.length > 1;
    const notification = `Файл${
      multiple ? "ы" : ""
    } ${notificationFiles} не был${multiple ? "и" : ""} загружен${
      multiple ? "ы" : ""
    }, так как име${multiple ? "ют" : "ет"} неподдерживаемый формат`;
    notifications.push(notification);
  }

  // УВЕДОМЛЕНИЕ: файлов не должно быть больше 10
  if (notMoreThenTenFiles > MAX_FILES_TO_UPLOAD)
    notifications.push(
      `Слишком много файлов, будут загружены первые ${MAX_FILES_TO_UPLOAD}`
    );

  // УВЕДОМЛЕНИЕ: вес файлов не должен превышать 10мб
  if (tooMuchSize > 0) {
    const notification = `Общий размер файлов превышает ${MAX_FILES_SIZE_TEXT}, будут добавлены последние ${filesAdded}`;
    notifications.push(notification);
  }

  // УВЕДОМЛЕНИЕ: файлов успешно добавлено
  if (filesAdded) notifications.push(`Файлов успешно добавлено: ${filesAdded}`);

  return notifications;
};

export const sendData = async (files) => {
  const axios = new AxiosService();
  return await axios.checkFiles(files);
};

export const updateFilesState = (
  files,
  setFiles,
  checkResults,
  setCheckResults,
  openNotification
) => {
  const { readyFiles, notificationData } = upload(files);

  setFiles((prevFiles) => {
    return [...prevFiles, ...readyFiles];
  });

  sendData(readyFiles).then(({ data, status }) => {
    if (status === 200) {
      openNotification(getUploadNotifications(notificationData));
      setCheckResults((prevFiles) => {
        return { ...prevFiles, ...data };
      });
      setFiles((prevFiles) => {
        console.log("checkResults", checkResults);
        const newCheckResults = { ...checkResults, ...data };
        return [
          ...prevFiles.map((file) => {
            const { ok: status, direction, asserts } = {
              ...newCheckResults[file.meta.oid],
            };
            return {
              ...file,
              check: { ...file.check, status, direction, asserts },
            };
          }),
        ];
      });
    } else {
      // Todo: check and fix
      openNotification([data.err_description]);
      setFiles((prevFiles) => {
        return [
          ...prevFiles.map((file) => {
            const { status } = data;
            console.log(status);
            return {
              ...file,
              check: { ...file.check, status },
            };
          }),
        ];
      });
    }
  });
};
