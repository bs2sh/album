import client from "./client";
import {
  InviteListResponse,
  SendInvite,
  ReceiveInvite,
  UpdateInviteResponse,
  SendInviteRequest,
  SendInviteResponse,
} from "../types/inviteTypes";

/**
 * 앨범에 사용자 초대
 * URL: /invite/sendInvite
 */

export const sendInvite = async (
  params: SendInviteRequest
): Promise<SendInviteResponse> => {
  const response = await client.post<SendInviteResponse>(
    "/invite/sendInvite",
    params
  );
  return response.data;
};

/**
 * 내가 보낸 초대 목록
 * URL: invite/sendList
 */
export const getSendInviteList = async (
  sendUserKey: number
): Promise<InviteListResponse<SendInvite>> => {
  const response = client.post<InviteListResponse<SendInvite>>(
    "/invite/sendList",
    { sendUserKey }
  );
  return (await response).data;
};

/**
 * 내가 받은 초대 목록
 * /invite/recvList
 */
export const getReceiveInviteList = async (
  recvUserKey: number
): Promise<InviteListResponse<ReceiveInvite>> => {
  const response = await client.post<InviteListResponse<ReceiveInvite>>(
    "/invite/receiveList",
    { recvUserKey }
  );
  return response.data;
};

/**
 * 초대 상태 업데이트
 * /invite/updateState
 * Request: inviteKey, state 1:수락, 2: 거절
 */
export const updateInviteState = async (
  inviteKey: number,
  state: number
): Promise<UpdateInviteResponse> => {
  const response = await client.post<UpdateInviteResponse>("invite/update", {
    inviteKey,
    state,
  });
  return response.data;
};
