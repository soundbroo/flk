import { v4 as uuidv4 } from "uuid";

import AxiosService from "../api";

import {
  MAX_FILES_SIZE,
  MAX_FILES_TO_UPLOAD,
  AVAILABLE_FORMATS,
} from "../constants";

const MAX_FILES_SIZE_TEXT = `${MAX_FILES_SIZE / 1e6} мб`;

export const sortFilesBySizeDesc = (files) =>
  files.sort(({ size: sizeA }, { size: sizeB }) => sizeB - sizeA);

export const getFilesToSpliceCount = (oversizeValue, files) => {
  let count = 0;
  let oversize = oversizeValue;
  console.log(
    "oversize",
    oversize,
    "files",
    files.map(({ size }) => size)
  );
  files.forEach(({ size }) => {
    if (oversize > 0) {
      count++;
      oversize -= size;
    }
  });
  console.log("count", count);
  return count;
};

export const spliceFilesArrayToValidSize = (files) => {
  // Проверяем общий размер загружаемых файлов
  const sortedFiles = sortFilesBySizeDesc(files);
  const filesSize = sortedFiles.reduce((acc, { size }) => acc + size, 0);
  const oversizeValue = filesSize - MAX_FILES_SIZE;

  if (oversizeValue > 0) {
    const spliceCount = getFilesToSpliceCount(oversizeValue, sortedFiles);
    sortedFiles.splice(0, spliceCount);
    return { oversizeValue, validFiles: sortedFiles };
  } else return { oversizeValue, validFiles: sortedFiles };
};

export const addFilesMeta = (files) =>
  files.map((file) => {
    return {
      file,
      meta: {
        oid: uuidv4().replace(/-/g, ""),
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

export const checkAlreadyUploadedFiles = (prevFiles, newFiles) => {
  let alreadyUploadedFiles = [];
  newFiles.forEach(({ name, size, lastModified }) => {
    prevFiles.forEach(
      ({
        file: {
          name: currentName,
          size: currentSize,
          lastModified: currentLastModified,
        },
      }) => {
        if (
          name === currentName &&
          size === currentSize &&
          lastModified === currentLastModified
        )
          alreadyUploadedFiles = [...alreadyUploadedFiles, { name, size }];
      }
    );
  });
  return alreadyUploadedFiles;
};

export const deleteAlreadyUploadedFiles = (uploadedFiles, newFiles) =>
  newFiles.filter(
    ({
      name: currentName,
      size: currentSize,
      lastModified: currentLastModified,
    }) =>
      uploadedFiles.every(
        ({ name, size, lastModified }) =>
          name !== currentName &&
          size !== currentSize &&
          lastModified !== currentLastModified
      )
  );

export const checkFormat = (name) =>
  AVAILABLE_FORMATS.includes(name.toLowerCase().slice(-3, name.length));

export const prepareFilesToUpload = (newFiles, currentFiles) => {
  const filesArray = Object.values(newFiles);

  // Проверяем файлы, неподходящие по формату
  const nonValidFormatedFiles = filesArray
    .filter(({ name }) => !checkFormat(name))
    .map(({ name }) => name);

  const validFormatFiles = filesArray.filter(({ name }) => checkFormat(name));

  // Проверяем и удаляем повторно загружаемые файлы
  const alreadyUploadedFiles = checkAlreadyUploadedFiles(
    currentFiles,
    filesArray
  );

  const notUploadedValidFormatFiles = alreadyUploadedFiles.length
    ? deleteAlreadyUploadedFiles(alreadyUploadedFiles, validFormatFiles)
    : validFormatFiles;

  // Массив файлов обрезаем, если число файлов больше 10
  const filesToUploadArray =
    notUploadedValidFormatFiles.length > MAX_FILES_TO_UPLOAD
      ? notUploadedValidFormatFiles.splice(0, MAX_FILES_TO_UPLOAD)
      : notUploadedValidFormatFiles;

  // Проверяем общий размер загружаемых файлов и исключаем лишние
  const { oversizeValue, validFiles } = spliceFilesArrayToValidSize(
    filesToUploadArray
  );

  const readyFiles = addFilesMeta(validFiles);
  const notificationData = {
    nonValidFormat: nonValidFormatedFiles,
    notMoreThenTenFiles: notUploadedValidFormatFiles.length,
    tooMuchSize: oversizeValue,
    filesAdded: validFiles.length,
    alreadyUploadedFiles: alreadyUploadedFiles.map(({ name }) => name),
  };

  return { readyFiles, notificationData };
};

export const getUploadNotifications = ({
  nonValidFormat,
  notMoreThenTenFiles,
  tooMuchSize,
  filesAdded,
  alreadyUploadedFiles,
}) => {
  const notifications = [];
  let warning = 0;

  const pushWarningNotification = (notification) => {
    notifications.push(notification);
    warning++;
  };

  // УВЕДОМЛЕНИЕ: какие файлы не проходят по формату
  if (nonValidFormat.length) {
    const notificationFiles = nonValidFormat.join(", ");
    const multiple = nonValidFormat.length > 1;
    const notification = `Файл${
      multiple ? "ы" : ""
    } ${notificationFiles} не был${multiple ? "и" : ""} загружен${
      multiple ? "ы" : ""
    }, так как име${multiple ? "ют" : "ет"} неподдерживаемый формат`;
    pushWarningNotification(notification);
  }

  // УВЕДОМЛЕНИЕ: файлы уже были загружены
  if (alreadyUploadedFiles.length) {
    const multiple = alreadyUploadedFiles.length > 1;
    const notification = `Файл${
      multiple ? "ы" : ""
    } ${alreadyUploadedFiles.join(", ")} уже был${
      multiple ? "и" : ""
    } загружен${multiple ? "ы" : ""}`;
    pushWarningNotification(notification);
  }

  // УВЕДОМЛЕНИЕ: файлов не должно быть больше 10
  if (notMoreThenTenFiles > MAX_FILES_TO_UPLOAD)
    pushWarningNotification(
      `Слишком много файлов, будут загружены первые ${MAX_FILES_TO_UPLOAD}`
    );

  // УВЕДОМЛЕНИЕ: вес файлов не должен превышать 10мб
  if (tooMuchSize > 0) {
    const getNotification = () => {
      switch (filesAdded) {
        case 0:
          return `Общий размер файлов превышает ${MAX_FILES_SIZE_TEXT}`;
        case 1:
          return `Общий размер файлов превышает ${MAX_FILES_SIZE_TEXT}, будет добавлен 1 файл`;
        default:
          return `Общий размер файлов превышает ${MAX_FILES_SIZE_TEXT}, добавлено файлов: ${filesAdded}`;
      }
    };
    pushWarningNotification(getNotification());
  }

  // УВЕДОМЛЕНИЕ: файлов успешно добавлено
  if (filesAdded) notifications.push(`Файлов успешно добавлено: ${filesAdded}`);

  return warning ? { notifications, status: "warning" } : { notifications };
};

export const sendData = async (files) => {
  const axios = new AxiosService();
  return await axios.checkFiles(files);
};

export const successUpdate = (
  data,
  prevCheckResults,
  setCheckResults,
  setFiles
) => {
  setCheckResults((prevFiles) => {
    return { ...prevFiles, ...data };
  });
  setFiles((prevFiles) => {
    const newCheckResults = { ...prevCheckResults, ...data };
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
};

export const failUpdate = (
  data,
  prevCheckResults,
  files,
  openNotification,
  setCheckResults,
  setFiles
) => {
  openNotification([data.err_description], "error");
  const currentResults = Object.fromEntries(
    files.map(({ meta: { oid } }) => [oid, { ok: "error" }])
  );
  setCheckResults((prevFiles) => {
    return {
      ...prevFiles,
      ...currentResults,
    };
  });
  setFiles((prevFiles) => {
    const newCheckResults = { ...prevCheckResults, ...currentResults };
    return [
      ...prevFiles.map((file) => {
        const { ok: status } = {
          ...newCheckResults[file.meta.oid],
        };
        return {
          ...file,
          check: { ...file.check, status },
        };
      }),
    ];
  });
};

export const updateFilesState = (
  files,
  currentFiles,
  setFiles,
  checkResults,
  setCheckResults,
  openNotification
) => {
  if (!files.length) return;
  const { readyFiles, notificationData } = prepareFilesToUpload(
    files,
    currentFiles
  );

  const { notifications, status } = getUploadNotifications(notificationData);

  status
    ? openNotification(notifications, status)
    : openNotification(notifications);

  setFiles((prevFiles) => {
    return [...prevFiles, ...readyFiles];
  });

  sendData(readyFiles).then(({ data, status }) => {
    if (status === 200)
      return successUpdate(data, checkResults, setCheckResults, setFiles);
    return failUpdate(
      data,
      checkResults,
      readyFiles,
      openNotification,
      setCheckResults,
      setFiles
    );
  });
};
