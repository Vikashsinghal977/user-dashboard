import axiosLib from "axios";

const axios = axiosLib.create({
  baseURL: `https://api.paraheights.com/`,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axios;
