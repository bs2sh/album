// 앨범에 사용자 초대 요청
export interface SendInviteRequest {
  albumkey: string;
  sendUserKey: number;
  recvUserKey: number;
  msg: string;
}

// 앨범에 사용자 초대 응답
export interface SendInviteResponse {
  result: number;
  msg: string;
  data: {
    inviteKey: number;
  };
}

// 내가 보낸 초대 목록
export interface SendInvite {
  inviteKey: number;
  albumKey: string;
  albumTitle: string;
  recvUserKey: number;
  recvUserNick: string;
  state: number;
}

// 내가 받은 초대 목록 아이템
export interface ReceiveInvite {
  inviteKey: number;
  albumKey: string;
  albumTitle: string;
  sendUserKey: number;
  sendUserNick: string;
  state?: number; // 0:대기, 1:수락, 2:거절 (수락/거절 처리를 위해 필요)
}

// 공통 리스트 응답 구조
export interface InviteListResponse<T> {
  result: number;
  msg: string;
  data: T[];
}

// 34. 초대 상태 업데이트 응답
export interface UpdateInviteResponse {
  result: number;
  msg: string;
}
