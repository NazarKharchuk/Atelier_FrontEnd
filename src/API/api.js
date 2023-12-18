import axios from "axios";

export const instance = axios.create({
    withCredentials: true,
    baseURL: "https://localhost:44385/api/",
});

axios.interceptors.response.use(response => {
    return response;
}, error => {
    alert(error);
    window.location.href = "/login";
    console.error(error);
    return Promise.resolve({});
});