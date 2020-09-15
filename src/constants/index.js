import successOutlinedIcon from "../images/success-outlined.svg";
import warningOutlinedIcon from "../images/warning-outlined.svg";
import errorOutlinedIcon from "../images/error-outlined.svg";
import successFilledIcon from "../images/success-filled.svg";
import warningFilledIcon from "../images/warning-filled.svg";
import errorFilledIcon from "../images/error-filled.svg";
import processingIcon from "../images/status-loading.svg";

export const MAX_FILES_SIZE = 10e6;
export const MAX_FILES_TO_UPLOAD = 10;

export const MAX_READABLE_FILE_SIZE = 10e4;

export const AVAILABLE_FORMATS = ["txt", "xml"];

export const STATUSES = {
  true: "Не содержит ошибок",
  false: "Содержит ошибки",
  error: "Проверка не реализована",
  null: "Проверка...",
};

export const STATUSES_COLORS = {
  true: "#1CAD1C",
  false: "#ff2f00",
  error: "#e8a100",
  null: "#2a495e",
};

export const STATUSES_ICONS = {
  true: successOutlinedIcon,
  false: errorOutlinedIcon,
  error: warningOutlinedIcon,
  null: processingIcon,
};

export const NOTIFICATION_DURATION = 6000;
export const NOTIFICATION_HIDE_DURATION = 300;

export const NOTIFICATIONS_ICONS = {
  success: successFilledIcon,
  warning: warningFilledIcon,
  error: errorFilledIcon,
};

export const NOTIFICATIONS_COLORS = {
  success: "#1CAD1C",
  warning: "#e8a100",
  error: "#ff2f00",
};

export const NOTIFICATIONS_TITLES = {
  success: "Файлы успешно загружены",
  warning: "Внимание!",
  error: "Ошибка!",
};
