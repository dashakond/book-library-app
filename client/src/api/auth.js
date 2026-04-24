import API from "./axios";

export const register = (data) => {
    return API.post("/user/registration", data);
};

export const login = (data) => {
    return API.post("/user/login", data);
};