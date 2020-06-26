import axios from "axios";
export const serverIp = "http://127.0.0.1:8000/";
// export const serverIp = "http://rippedcoders.com:8002/";

export const ServerAddr = axios.create({
  baseURL: serverIp,
  timeout: 30000,
  headers: {},
  withCredentials: true,
  transformRequest: [
    function (data, headers) {
      return JSON.stringify(data);
    },
  ],
});
