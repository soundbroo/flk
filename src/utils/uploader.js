import { v4 as uuidv4 } from "uuid";

import AxiosService from "../api";

import { MAX_FILES_SIZE, MAX_FILES_TO_UPLOAD } from "../constants";

const MAX_FILES_SIZE_TEXT = `${MAX_FILES_SIZE / 1e6} мб`;

export const upload = (openNotification, newFiles, setFiles) => {
  // Сложим в массив все уведомления, которые покажем после всех проверок
  const notifications = [];

  const filesArray = Object.values(newFiles);

  // Проверяем файлы, неподходящие по формату
  const nonValidFormatedFiles = filesArray
    .filter(({ name }) => !["txt", "xml"].includes(name.slice(-3, name.length)))
    .map(({ name }) => name);

  const validFormatFiles = filesArray.filter(({ name }) =>
    ["txt", "xml"].includes(name.slice(-3, name.length))
  );
  // console.log("validFormatFiles", validFormatFiles);

  // УВЕДОМЛЕНИЕ: какие файлы не проходят по формату
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

  // УВЕДОМЛЕНИЕ: файлов не должно быть больше 10
  if (validFormatFiles.length > MAX_FILES_TO_UPLOAD)
    notifications.push(
      `Слишком много файлов, будут загружены первые ${MAX_FILES_TO_UPLOAD}`
    );

  // Массив файлов обрезаем, если число файлов больше 10

  const filesToUploadArray =
    validFormatFiles.length > MAX_FILES_TO_UPLOAD
      ? validFormatFiles.splice(0, MAX_FILES_TO_UPLOAD)
      : validFormatFiles;

  // console.log("filesToUploadArray", filesToUploadArray);

  // Проверяем общий размер загружаемых файлов
  const filesToUploadSize = filesToUploadArray.reduce(
    (acc, { size }) => acc + size,
    0
  );
  const oversizeValue = filesToUploadSize - MAX_FILES_SIZE;
  // console.log("filesToUploadSize", filesToUploadSize);
  // console.log("oversizeValue", oversizeValue);

  const filesToSpliceCount = () => {
    let count = 0;
    let oversize = oversizeValue;
    const files = filesToUploadArray.reverse();
    files.forEach(({ size }) => {
      if (oversize > 0) {
        count++;
        oversize -= size;
      }
    });
    return count - 1;
  };

  const spliceCount = oversizeValue > 0 ? filesToSpliceCount() : null;

  // console.log("spliceCount", spliceCount);

  const validSizeFilesToUploadArray =
    oversizeValue > 0
      ? filesToUploadArray.splice(
          filesToUploadArray.length - spliceCount,
          spliceCount
        )
      : filesToUploadArray;

  // console.log("validSizeFilesToUploadArray", validSizeFilesToUploadArray);

  if (oversizeValue > 0) {
    const notification = `Общий размер файлов превышает ${MAX_FILES_SIZE_TEXT}, будут добавлены последние ${validSizeFilesToUploadArray.length}`;
    notifications.push(notification);
  }

  if (validSizeFilesToUploadArray.length)
    notifications.push(
      `Файлов успешно добавлено: ${validSizeFilesToUploadArray.length}`
    );

  const readyFiles = validSizeFilesToUploadArray.map((file) => {
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

  openNotification(notifications);

  return readyFiles;
};

export const sendData = async (files) => {
  const axios = new AxiosService();
  return await axios.checkFiles(files);
};

export const updateFilesState = (files, setFiles, openNotification) => {
  const resultData = upload(openNotification, files, setFiles);
  setFiles((prevFiles) => {
    return [...prevFiles, ...resultData];
  });

  sendData(resultData).then(({ data, status }) =>
    status === 200 && data
      ? setFiles((prevFiles) => {
          return [
            ...prevFiles.map((file) => {
              const { ok: status, direction, asserts } = data[file.meta.oid];
              return {
                ...file,
                check: { ...file.check, status, direction, asserts },
              };
            }),
          ];
        })
      : (() => {
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
          openNotification([data.err_description]);
        })()
  );
};
