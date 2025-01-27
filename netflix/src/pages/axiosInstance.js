import axios from "axios";

const axiosInstance = axios.create({
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

export default axiosInstance;