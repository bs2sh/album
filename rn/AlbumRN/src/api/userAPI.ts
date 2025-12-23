import client from "./client";
import { ApiResponse } from "./types";
import {
  LoginRequest,
  LoginResponse,
  SignUpRequest,
  SignUpResponse,
} from "../types/userTypes";

// 로그인 API 호출 함수
export const login = async (params: LoginRequest): Promise<LoginResponse> => {
  const response = await client.post<LoginResponse>("/user/login", params);
  return response.data;
};

// 회원가입 API 호출 함수
export const signUp = async (
  params: SignUpRequest
): Promise<SignUpResponse> => {
  const response = await client.post<SignUpResponse>("/user/join", params);
  return response.data;
};

export const fetchData = async <T, R>(url: string, params: T): Promise<R> => {
  const response = await client.post<R>(url, params);
  return response.data;
};
