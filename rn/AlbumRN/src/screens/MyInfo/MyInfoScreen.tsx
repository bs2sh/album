import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/NavigationTypes";

const MyInfoScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // 테스트용으로 일단 여기다 만들어 둠. 정리되면 viewModel 만들어서 옮기자
  const handleLogout = async () => {
    console.log("로그아웃");
    try {
      // 유저키 삭제
      await AsyncStorage.removeItem("userKey");
      // 로그인으로 이동
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleLogout} style={styles.button}>
          <Text style={styles.logoutText}>로그아웃</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: 200,
    height: 120,
  },
  logoutText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default MyInfoScreen;
