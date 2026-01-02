import client from "./client";
import { PhotoListResponse, UploadPhotoResponse } from "../types/photoTypes";

/**
 * 사진 리스트 가져오기
 * URL: /photo/photolist
 * Request: userkey(Int), albumkey(TEXT), lastphotokey(TEXT)
 */
export const getPhotoList = async (
  userKey: number,
  albumKey: string,
  lastPhotoKey: string = ""
) => {
  const response = await client.post<PhotoListResponse>("photo/photolist", {
    userKey,
    albumKey,
    lastPhotoKey,
  });
  return response.data;
};

/**
 * 사진 업로드 (Multipart) - 다중 파일 지원
 * URL: /photo/upload
 * Request: userkey, usernick, albumkey, image1, description1, image2, description2 ...
 */
export const uploadPhoto = async (
  userkey: number,
  usernick: string,
  albumkey: string,
  photos: { uri: string; description: string }[]
) => {
  const formData = new FormData();

  // 기본필드
  formData.append("userkey", userkey.toString());
  formData.append("usernick", usernick);
  formData.append("usernick", usernick);

  photos.slice(0, 5).forEach((photo, i) => {
    const index = i + 1; // iOS 로직과 동일하게 1부터 시작

    // (1) 이미지 파트
    // 필드명: image1, image2 ...
    const file = {
      uri: photo.uri,
      type: "image/jpeg",
      name: `image${index}.jpg`, // 파일명 예시
    } as any;

    formData.append(`image${index}`, file);

    // (2) 설명 파트
    // 필드명: description1, description2 ...
    formData.append(`description${index}`, photo.description || "");
  });

  const response = await client.post<UploadPhotoResponse>(
    "/photo/upload",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return response.data;
};
