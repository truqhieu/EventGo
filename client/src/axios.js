import axios from "axios";
import { apiRefreshToken } from "./apis/authen/authentication";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL_SERVER,
  withCredentials: true, // Bật chế độ gửi cookie cùng với yêu cầu
});

// Add a request interceptor 
// Đây là nơi bạn có thể thực hiện các hành động trước khi yêu cầu được gửi đi. ?
instance.interceptors.request.use(
  function (config) {
    const authData = JSON.parse(localStorage.getItem("authData")) || {};
    const accessToken = authData?.accessToken || "";

    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config; // Phải return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
// Đây là nơi bạn xử lý lỗi xảy ra khi gửi yêu cầu.
instance.interceptors.response.use(
  async (response) => {
    return response.data; // Return data from the response
  },
  async (error) => {
    const { response, config } = error;
    console.log(error);
    if (response?.status === 401) {   
      if (response.data && response.data.mess === "Invalid AccessToken") {
        // If the error message is "Invalid AccessToken", meaning the token has expired
        if (!config._retry) {
          config._retry = true; // Mark the request as already retried
          try {
            // Call the refresh token API
            const refreshTokenResponse = await apiRefreshToken();
            if (refreshTokenResponse?.success) {
              const newAccessToken = refreshTokenResponse.accessToken;
              config.headers["Authorization"] = `Bearer ${newAccessToken}`;

              // Create the new authData object
              const authData = {
                isLogin: true,
                accessToken: newAccessToken
              };

              // Store `authData` into localStorage
              localStorage.setItem("authData", JSON.stringify(authData));

              console.log(newAccessToken);
              
              // Retry the original request with the new token
              return axios(config); // Retry the original request with the new token
            } else {
              return Promise.reject(error);
            }
          } catch (error) {
            return Promise.reject(error);
          }
        }
      } else {
        // Handle other 401 errors, like invalid username/password
        return Promise.reject(error); // Do nothing else if it's an authentication error
      }
    }

    return Promise.reject(error);
  }
);


export default instance;
