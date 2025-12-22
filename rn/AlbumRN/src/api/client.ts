import axios from "axios";

const BASE_URL = "http://127.0.0.1:3100";
const client = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/*
// [Request Interceptor] 요청 전 실행
client.interceptors.request.use(
  async (config) => {
    // 예: AsyncStorage에서 토큰을 가져와 헤더에 삽입
    // const token = await AsyncStorage.getItem('accessToken');
    const token = "MOCK_TOKEN"; // 임시 토큰

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// [Response Interceptor] 응답 후 실행
client.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.status} ${response.config.url}`);
    return response;
  },
  async (error) => {
    if (error.response) {
      // 서버가 응답을 줬으나 상태 코드가 2xx가 아닌 경우
      console.error("[API Error]", error.response.data);

      // 예: 401 Unauthorized 처리 (로그아웃 로직 등)
      if (error.response.status === 401) {
        console.log("토큰 만료! 로그아웃 처리 필요");
      }
    } else {
      // 네트워크 에러 등
      console.error("[Network Error]", error.message);
    }
    return Promise.reject(error);
  }
);
*/
export default client;
