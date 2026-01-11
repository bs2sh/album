import { useCallback, useState } from "react";
import { SendInvite, ReceiveInvite } from "../../types/inviteTypes";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getReceiveInviteList,
  getSendInviteList,
  updateInviteState,
} from "../../api/inviteAPI";
import { Alert } from "react-native";

interface InviteListViewModel {
  selectedSegment: number; // 100: 보낸초대, 200: 받은 초대
  setSelectedSegment: (val: number) => void;
  sendInviteList: SendInvite[];
  receiveInviteList: ReceiveInvite[];
  isLoading: boolean;
  handleUpdateInvite: (inviteKey: number, accept: boolean) => void;
}

export const useInviteListViewModel = (): InviteListViewModel => {
  const [selectedSegment, setSelectedSegment] = useState(100);
  const [sendInviteList, setSendInviteList] = useState<SendInvite[]>([]);
  // prettier-ignore
  const [receiveInviteList, setReceiveInviteList] = useState<ReceiveInvite[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchInvites();
    }, [])
  );

  const fetchInvites = async () => {
    setIsLoading(true);
    try {
      const userKeyStr = await AsyncStorage.getItem("userKey");
      const userKey = userKeyStr ? parseInt(userKeyStr, 10) : -1;

      if (userKey === -1) return;

      // 내가 보낸 초대 / 내가 받은 초대 API 병렬 호출
      const [sendRes, recvRes] = await Promise.all([
        getSendInviteList(userKey),
        getReceiveInviteList(userKey),
      ]);

      // 내가 보낸 초대
      if (sendRes.result === 1) {
        setSendInviteList(sendRes.data);
      } else {
        console.log("Send List Error: ", sendRes.msg);
      }

      // 내가 받은 초대
      if (recvRes.result === 1) {
        setReceiveInviteList(recvRes.data);
      } else {
        console.log("Receive List Error: ", recvRes.msg);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("오류", "초대 목록을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateInvite = async (inviteKey: number, accept: boolean) => {
    try {
      const state = accept ? 1 : 2;
      const response = await updateInviteState(inviteKey, state);

      if (response.result === 1) {
        Alert.alert(
          "알림",
          accept ? "초대를 수락했습니다." : "초대를 거절했습니다."
        );
        // 리스트 갱신
        fetchInvites();
      }
    } catch (error) {
      console.error(error);
      Alert.alert("오류", "상태 변경 중 문제가 발생했습니다.");
    }
  };

  return {
    selectedSegment,
    setSelectedSegment,
    sendInviteList,
    receiveInviteList,
    isLoading,
    handleUpdateInvite,
  };
};
