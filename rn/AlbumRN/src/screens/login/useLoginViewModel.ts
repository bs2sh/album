import { useState } from "react";
import { Alert } from "react-native";
import { login } from "../../api/userAPI";
import { LoginRequest } from "../../types/userTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/NavigationTypes";

interface LoginViewModel {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  handleLogin: () => void;
  handleSignUp: () => void;
}

export const useLoginViewModel = (): LoginViewModel => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async () => {
    // 1. 입력값 유효성 검사
    if (!email || !password) {
      Alert.alert("알림", "이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      // 2. 백엔드 스펙에 맞춰 파라미터 생성
      const params: LoginRequest = {
        email: email,
        pw: password,
      };

      // 3. API 호출
      const response = await login(params);

      // 4. 결과 처리 (백엔드가 내려주는 result 값에 따라 분기)
      if (response.result === 1) {
        console.log("로그인 성공! UserKey:", response.userKey);
        Alert.alert("성공", "로그인되었습니다.");

        // 유저키 저장.
        await AsyncStorage.setItem("userKey", response.userKey);
        Alert.alert("성공", "로그인되었습니다.");
      } else {
        // 실패 시 백엔드에서 보내준 메시지(msg)를 띄워줍니다.
        Alert.alert("로그인 실패", response.msg);
      }
    } catch (error) {
      // 네트워크 에러 등 예기치 못한 에러 처리
      console.error("로그인 에러:", error);
      Alert.alert("오류", "로그인 중 문제가 발생했습니다.");
    }
  };

  const handleSignUp = () => {
    console.log("handle SignUp");
    navigation.navigate("SignUp");
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    handleLogin,
    handleSignUp,
  };
};
