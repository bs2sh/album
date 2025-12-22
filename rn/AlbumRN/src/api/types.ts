export interface ApiResponse<T> {
  result: number;
  msg: string;
  data: T;
}
