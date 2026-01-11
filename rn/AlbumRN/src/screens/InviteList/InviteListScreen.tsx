import React, { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useInviteListViewModel } from "./useInviteListViewModel";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { SendInvite, ReceiveInvite } from "../../types/inviteTypes";
import { SafeAreaView } from "react-native-safe-area-context";

type InviteItem = SendInvite | ReceiveInvite;

const InviteListScreen: React.FC = () => {
  const navigation = useNavigation();

  const {
    selectedSegment,
    setSelectedSegment,
    sendInviteList,
    receiveInviteList,
    isLoading,
    handleUpdateInvite,
  } = useInviteListViewModel();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "초대 목록",
      headerTintColor: "black",
      headerTransparent: true,
      headerTitleStyle: { fotWeight: "bold", fontSize: 18 },
    });
  });

  // 보낸 초대 셀 렌더링
  const renderSendItem = ({ item }: { item: SendInvite }) => (
    <View style={styles.itemContainer}>
      <View style={styles.textContainer}>
        <Text style={styles.albumTitle}>{item.albumTitle}</Text>
        <Text style={styles.subText}>받는 사람 : {item.recvUserNick}</Text>
      </View>
      <Text style={[styles.stateText, getStateColor(item.state || 0)]}>
        {getStateText(item.state)}
      </Text>
    </View>
  );
  // 받은 초대 셀 렌더링
  const renderRecvItem = ({ item }: { item: ReceiveInvite }) => (
    <View style={styles.itemContainer}>
      <View style={styles.textContainer}>
        <Text style={styles.albumTitle}>{item.albumTitle}</Text>
        <Text style={styles.subText}>보낸사람 : {item.sendUserNick}</Text>
      </View>
      {/* state 0 대기 상태일때만 수락/거절 버튼 표시 */}
      {item.state === 0 || item.state === undefined ? (
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.acceptButton]}
            onPress={() => handleUpdateInvite(item.inviteKey, true)}
          >
            <Text style={styles.buttonText}>수락</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.rejectButton]}
            onPress={() => handleUpdateInvite(item.inviteKey, false)}
          >
            <Text style={styles.buttonText}>거절</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={[styles.stateText, getStateColor(item.state)]}>
          {getStateText(item.state)}
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        {/* 상단 segmentControl */}
        <View style={styles.segmentContainer}>
          <TouchableOpacity
            style={[
              styles.segmentButton,
              selectedSegment === 100 && styles.segmentActive,
            ]}
            onPress={() => setSelectedSegment(100)}
          >
            <Text
              style={[
                styles.segmentText,
                selectedSegment === 100 && styles.segmentTextActive,
              ]}
            >
              보낸초대
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.segmentButton,
              selectedSegment === 200 && styles.segmentActive,
            ]}
            onPress={() => setSelectedSegment(200)}
          >
            <Text
              style={[
                styles.segmentText,
                selectedSegment === 200 && styles.segmentTextActive,
              ]}
            >
              받은초대
            </Text>
          </TouchableOpacity>
        </View>

        {/* 리스트 영역 */}
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color="#000"
            style={{ marginTop: 20 }}
          />
        ) : (
          <FlatList<InviteItem>
            data={selectedSegment === 100 ? sendInviteList : receiveInviteList}
            keyExtractor={(item) => item.inviteKey.toString()}
            // [수정] renderItem 타입을 조건부로 명확하게 분기
            renderItem={
              selectedSegment === 100 ? renderSendItem : (renderRecvItem as any)
            }
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>초대내역이 없습니다.</Text>
              </View>
            }
          ></FlatList>
        )}
      </View>
    </SafeAreaView>
  );
};

// 상태 코드 -> 텍스트 변환
const getStateText = (state: number) => {
  switch (state) {
    case 0:
      return "대기중";
    case 1:
      return "수락됨";
    case 2:
      return "거절됨";
    default:
      return "완료";
  }
};

// 상태 코드 -> 텍스트 색상 변환
const getStateColor = (state: number) => {
  switch (state) {
    case 0:
      return { color: "#FF9500" }; // Orange
    case 1:
      return { color: "#4CD964" }; // Green
    case 2:
      return { color: "#FF3B30" }; // Red
    default:
      return { color: "#8E8E93" }; // Gray
  }
};
const styles = StyleSheet.create({
  // safeArea에 배경색 적용
  safeArea: {
    flex: 1,
    backgroundColor: "#f2f2f7",
  },
  container: { flex: 1, paddingTop: 60 }, // 헤더 높이만큼 여백

  // 세그먼트 컨트롤 스타일
  segmentContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 15,
    backgroundColor: "rgba(0,0,0,0.1)", // 배경색이 밝아졌으므로 어두운 반투명으로 조정
    borderRadius: 8,
    padding: 4,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 6,
  },
  segmentActive: {
    backgroundColor: "white",
    shadowColor: "#000", // 그림자 추가로 입체감
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentText: {
    color: "#8E8E93",
    fontWeight: "600",
  },
  segmentTextActive: {
    color: "black",
    fontWeight: "bold",
  },

  // 리스트 아이템 스타일
  listContent: { paddingHorizontal: 20, paddingBottom: 20 },
  itemContainer: {
    backgroundColor: "white", // 배경이 회색이므로 아이템은 완전 흰색
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  textContainer: { flex: 1 },
  albumTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  subText: { fontSize: 14, color: "#666" },
  stateText: { fontSize: 14, fontWeight: "bold" },

  // 버튼 스타일
  buttonRow: { flexDirection: "row" },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 8,
  },
  acceptButton: { backgroundColor: "#34C759" }, // iOS Green
  rejectButton: { backgroundColor: "#FF3B30" }, // iOS Red
  buttonText: { color: "white", fontSize: 12, fontWeight: "bold" },

  // 빈 화면 스타일
  emptyContainer: { alignItems: "center", marginTop: 50 },
  emptyText: { color: "#8E8E93", fontSize: 16 }, // 글자색 변경
});

export default InviteListScreen;
