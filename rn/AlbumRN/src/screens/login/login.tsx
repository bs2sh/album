import React from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ImageBackground,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard, // 1. 추가된 컴포넌트
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLoginViewModel } from "./useLoginViewModel";

const LoginScreen: React.FC = () => {
  const { email, setEmail, password, setPassword, handleLogin } =
    useLoginViewModel();

  return (
    <ImageBackground
      source={require("../../../assets/images/bg.png")}
      style={styles.background}
      resizeMode="cover"
    >
      {/* 2. 화면 전체를 감싸서 터치 이벤트를 감지 */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardView}
            contentContainerStyle={styles.keyboardContent}
          >
            {/* 상단 로고 영역 */}
            <View style={styles.topArea}>
              <Image
                source={require("../../../assets/images/home.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            {/* 하단 입력창 영역 */}
            <View style={styles.bottomArea}>
              <View style={styles.formRow}>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="이메일"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  <View style={{ height: 10 }} />
                  <TextInput
                    style={styles.input}
                    placeholder="비밀번호"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                  />
                </View>
                {/* 로그인 버튼 */}
                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={handleLogin}
                >
                  <Text style={styles.loginButtonText}>로그인</Text>
                </TouchableOpacity>
              </View>

              {/* 회원가입 */}
              <TouchableOpacity
                style={styles.signUpButton}
                onPress={() => {
                  console.log("회원가입");
                }}
              >
                <Text style={styles.signUpText}>사용자 등록</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  safeArea: { flex: 1 },
  keyboardView: { flex: 1 },
  keyboardContent: { flex: 1 },

  topArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 120,
  },

  bottomArea: {
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  formRow: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  inputWrapper: {
    flex: 1,
    marginRight: 10,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 15,
  },
  loginButton: {
    width: 85,
    backgroundColor: "#3498db",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  signUpButton: {
    alignItems: "center", // 가운데 정렬
    paddingVertical: 10,
  },
  signUpText: {
    color: "#ffffff", // 배경이 어두울 것을 가정하여 흰색 텍스트
    fontSize: 16,
    textDecorationLine: "underline", // 링크 느낌을 주기 위해 밑줄 추가 (선택 사항)
    fontWeight: "500",
  },
});

export default LoginScreen;
