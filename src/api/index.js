import axios from "axios";

class AxiosService {
  constructor() {
    this.instance = axios.create({
      baseURL: "https://api-flk.cloud.astral-dev.ru",
      withCredentials: false,
    });

    this.makeFormData = (files) => {
      const formData = new FormData();

      files.forEach((file) => formData.append(file.meta.oid, file.file));

      const meta = files.reduce(
        (acc, { meta: { oid, soft, protocol, title } }) => {
          return Object.assign(acc, { [oid]: { soft, protocol, title } });
        },
        {}
      );

      formData.append("meta", JSON.stringify(meta));
      return formData;
    };
  }

  checkFiles = async (files) => {
    const data = this.makeFormData(files);
    try {
      const result = await this.instance({
        method: "POST",
        url: "/check_alt",
        data: data,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return result;
    } catch (e) {
      console.log(e.response);
      return e.response;
    }
  };
}

export default AxiosService;
