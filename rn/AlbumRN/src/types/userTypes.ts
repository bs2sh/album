// 로그인 API를 위한 인터페이스
export interface LoginRequest {
  email: string;
  pw: string;
}

export interface LoginResponse {
  result: number;
  msg: string;
  userKey: string;
}

// 회원가입 API를 위한 인터페이스
export interface SignUpRequest {
  email: string;
  pw: string;
  nick: string;
}

export interface SignUpResponse {
  result: number;
  msg: string;
  email: string;
}
