export interface Album {
  album_key: string;
  title: string;
  members: string;
  onwer: number;
  enable: boolean;
}

// 앨범 리스트
export interface AlbumListResponse {
  result: number;
  msg: string;
  albums: Album[];
}

// 앨범 만들기
export interface CreateAlbumRequest {
  userKey: number;
  title: string;
}

export interface CreateAlbumResponse {
  result: number;
  msg: string;
  albumKey: string;
}
