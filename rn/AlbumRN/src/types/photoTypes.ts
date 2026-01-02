// Photo Model
export interface Photo {
  photo_key: string;
  photo_path: string;
  owner: number;
  owner_nick: string;
  album_key: string;
  regdt: number;
  description: string;
}

// 사진 리스트 response
export interface PhotoListResponse {
  result: number;
  msg: string;
  count: number;
  data: {
    count: number;
    list: Photo[];
  };
}

// 사진 업로드 response
export interface UploadPhotoResponse {
  result: number;
  msg: string;
  paths: string[];
}

// 사진 업로드
export interface UploadablePhoto {
  id: string;
  uri: string;
  description: string;
}
