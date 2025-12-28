import React, { useLayoutEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useAlbumListViewModel } from "./useAlbumListViewModel";
import { Album } from "../../types/albumTypes";

const AlbumListScreen: React.FC = () => {
  const navigation = useNavigation();

  const {
    albums,
    isLoading,
    handleCreateAlbum,
    handleMyInfo,
    handleInviteList,
    handlePhotoList,
  } = useAlbumListViewModel();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "내앨범",
      headerTransparent: true,
      headerTintColor: "black",
      headerTitleStyle: { fontSize: 18 },

      //네비게이션 왼쪽 버튼
      headerLeft: () => (
        <TouchableOpacity
          onPress={handleMyInfo}
          style={{ marginHorizontal: 5, alignItems: "center" }}
        >
          <Text style={styles.headerText}>내정보</Text>
        </TouchableOpacity>
      ),
      // 네비게이션 오른쪽 버튼
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: 5,
          }}
        >
          <TouchableOpacity onPress={handleInviteList}>
            <Ionicons name="mail-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, handleMyInfo, handleInviteList]);

  const renderItem = ({ item }: { item: Album }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => handlePhotoList(item)}
    >
      <Text style={styles.listTitle}>{item.title}</Text>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {/* 멤버 수 표시: 콤마로 구분된 문자열 처리 */}
        <Text style={styles.memberCount}>
          {item.members ? item.members.split(",").length : 0}명
        </Text>
        <Ionicons
          name="chevron-forward"
          size={20}
          color="rgba(255,255,255,0.5)"
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require("../../../assets/images/bg.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <View style={styles.container}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#ffffff" />
            </View>
          ) : (
            <FlatList
              data={albums}
              renderItem={renderItem}
              // [중요] 백엔드 스펙에 따라 고유 키를 albumkey로 설정
              keyExtractor={(item) => item.album_key}
              contentContainerStyle={styles.listContent}
              style={styles.list}
            />
          )}

          <View style={styles.bottomArea}>
            <TouchableOpacity
              style={styles.createButton}
              onPress={handleCreateAlbum}
            >
              <Text style={styles.createButtonText}>앨범 만들기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  safeArea: { flex: 1 },
  container: { flex: 1, paddingTop: 60 },
  headerText: { fontSize: 16, color: "black" },
  list: { flex: 1 },
  listContent: { paddingHorizontal: 20, paddingBottom: 20 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  listItem: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  listTitle: { color: "white", fontSize: 20, fontWeight: "400" },
  memberCount: { color: "rgba(255,255,255,0.7)", marginRight: 5, fontSize: 14 },
  bottomArea: { paddingHorizontal: 40, paddingBottom: 20, paddingTop: 10 },
  createButton: {
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "white",
    backgroundColor: "transparent",
  },
  createButtonText: { color: "white", fontSize: 15, fontWeight: "bold" },
});

export default AlbumListScreen;
