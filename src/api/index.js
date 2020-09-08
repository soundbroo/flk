import axios from "axios";
import uuid from "react-uuid";

class AxiosService {
  constructor() {
    this.instance = axios.create({
      baseURL: "https://api-flk.cloud.astral-dev.ru/check",
      withCredentials: false,
    });

    this.makeFormData = (files) => {
      const formData = new FormData();
      files.forEach((file) =>
        formData.append("file", JSON.stringify({ data: file, name: uuid() }))
      );
      return formData;
    };
  }

  checkFiles = async (files) => {
    const data = this.makeFormData(files);
    await this.instance.post("/", data);
  };
}

export default AxiosService;
