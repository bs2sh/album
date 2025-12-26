import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../../navigation/NavigationTypes";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Alert } from "react-native";

const AlbumListScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleLogout = async () => {
    try {
      // 저장되어 있는 userKey 삭제.
      await AsyncStorage.removeItem("userKey");

      // 로그인 화면으로 이동.
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (e) {
      Alert.alert("오류", "로그아웃 실패");
    }
  };

  // 여기부터 화면 그리기
  return (
    <View style={styles.container}>
      <Text style={styles.title}>앨범리스트</Text>
      <Text style={styles.subtitle}>로그인 성공</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>로그아웃</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 50,
  },
  logoutButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#ff4757",
    borderRadius: 8,
  },
  logoutText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default AlbumListScreen;
