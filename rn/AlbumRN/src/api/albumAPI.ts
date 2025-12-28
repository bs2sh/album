import client from "./client";
import {
  AlbumListResponse,
  CreateAlbumRequest,
  CreateAlbumResponse,
} from "../types/albumTypes";

/**
 * 11. 가입한 앨범 리스트 가져오기
 * URL: /user/joinalbums
 * Method: POST
 * Request: { userKey: number }
 */
export const joinalbums = async (
  userKey: number
): Promise<AlbumListResponse> => {
  const response = await client.post<AlbumListResponse>("user/joinalbums", {
    userkey: userKey,
  });
  return response.data;
};

/**
 * 앨범 생성
 * URL: /album/create
 * Request: userkey(Int), title(String)
 */
export const createAlbum = async (
  params: CreateAlbumRequest
): Promise<CreateAlbumResponse> => {
  const response = await client.post<CreateAlbumResponse>(
    "/album/create",
    params
  );
  return response.data;
};
