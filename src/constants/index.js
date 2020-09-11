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

export const STATUSES = {
  true: "Проверка пройдена",
  false: "Проверка не пройдена",
  error: "Ошибка",
  null: "Проверка...",
};

export const STATUSES_COLORS = {
  true: "#1CAD1C",
  false: "#e8a100",
  error: "#ff2f00",
  null: "#2a495e",
};

export const STATUSES_ICONS = {
  true: successOutlinedIcon,
  false: warningOutlinedIcon,
  error: errorOutlinedIcon,
  null: processingIcon,
};

export const NOTIFICATION_DURATION = 5000;

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
