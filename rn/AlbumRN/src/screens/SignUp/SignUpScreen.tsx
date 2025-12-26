import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useLoginViewModel } from "../Login/useLoginViewModel";
import { useSignUpViewModel } from "./useSignUpViewModel";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const SignUpScreen: React.FC = () => {
  const {
    email,
    setEmail,
    nick,
    setNick,
    password,
    setPassword,
    passwordCheck,
    setPasswordCheck,
    handleClose,
    handleSignUp,
    borderColor,
    errorMsg,
  } = useSignUpViewModel();

  return (
    <ImageBackground
      source={require("../../../assets/images/bg.png")}
      style={styles.background}
      resizeMode="cover"
    >
      {/* 배경 누르면 키보드 내려가도록 하기 위함 */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.safeArea}>
          {/* 키보드 올라왔을때 UI 조정 */}
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
          >
            {/* 상단 닫기버튼 올라가는 뷰 */}
            <View style={styles.header}>
              <TouchableOpacity
                onPress={handleClose}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={30} color="white" />
              </TouchableOpacity>
            </View>
            {/* 타이틀 (Spacer - TEXT - Spacer) */}
            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>사용자 등록</Text>
            </View>
            {/* 입력 폼 영역 */}
            <View style={styles.formContainer}>
              {/* 이메일 */}
              <CustomTextInput
                placeholder="이메일"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />

              {/* 닉네임 */}
              <CustomTextInput
                placeholder="닉네임"
                value={nick}
                onChangeText={setNick}
              />

              {/* 비밀번호 */}
              <CustomTextInput
                placeholder="비밀번호"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                borderColor={borderColor}
              />

              {/* 비밀번호 확인 */}
              <CustomTextInput
                placeholder="비밀번호 확인"
                value={passwordCheck}
                onChangeText={setPasswordCheck}
                secureTextEntry
                borderColor={borderColor}
              />

              {/* 에러 메시지 */}
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errorMsg}</Text>
              </View>

              {/* 가입 버튼 */}
              <TouchableOpacity
                style={styles.joinButton}
                onPress={handleSignUp}
              >
                <Text style={styles.joinButtonText}>등록</Text>
              </TouchableOpacity>
            </View>

            {/* 하단 여백을 위해 뷰하나 붙여 둠 */}
            <View style={{ flex: 1 }} />
          </KeyboardAvoidingView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </ImageBackground>
  );
};

// [Helper Component] SwiftUI의 CustomTextField와 대응
interface CustomTextInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  borderColor?: string;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
}
const CustomTextInput: React.FC<CustomTextInputProps> = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  borderColor = "white", // 기본값 화이트
  keyboardType = "default",
}) => {
  return (
    <View style={[styles.inputContainer, { borderColor: borderColor }]}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#ffffff" // iOS 버전처럼 흰색
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  closeButton: {
    padding: 10,
  },

  // 타이틀
  titleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titleText: {
    fontSize: 40, // Swift: 50 (RN에서는 조금 줄이는게 비율상 맞을 수 있음)
    fontWeight: "400", // Regular
    color: "white",
  },

  // 폼 영역
  formContainer: {
    marginBottom: 50,
  },

  // CustomTextInput 스타일
  inputContainer: {
    borderWidth: 2, // lineWidth: 2
    borderRadius: 8, // cornerRadius: 8
    marginBottom: 15, // padding vertical 대신 margin 사용
    height: 55, // 텍스트 필드 높이 확보
    justifyContent: "center",
    paddingHorizontal: 15,
  },
  input: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  // 에러 메시지
  errorContainer: {
    height: 20, // 메시지가 없어도 공간 차지하지 않거나 고정 높이
    justifyContent: "center",
    marginBottom: 10,
  },
  errorText: {
    color: "#FF3B30", // Red
    fontSize: 12, // Caption
  },

  // 가입 버튼
  joinButton: {
    height: 50,
    borderRadius: 10,
    borderWidth: 3, // lineWidth: 3
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  joinButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default SignUpScreen;
