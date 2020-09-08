import axios from "axios";
import uuid from "react-uuid";

class AxiosService {
  constructor() {
    this.instance = axios.create({
      baseURL: "https://api-flk.cloud.astral-dev.ru/",
      withCredentials: false,
      headers: {
        // "Content-Type": "application/json",
      },
    });

    this.makeFormData = (files) => {
      const formData = new FormData();
      const filesWithUuid = files.map((file) => {
        return { name: uuid(), data: file };
      });
      console.log(filesWithUuid);
      filesWithUuid.forEach((file) => {
        formData.append("file", file);
      });
      return formData;
    };
  }

  checkFiles = async (files) => {
    const data = this.makeFormData(files);
    await this.instance.post("check", data);
  };
}

export default AxiosService;
