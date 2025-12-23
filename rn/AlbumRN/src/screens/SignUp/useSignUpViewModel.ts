import { useState, useMemo } from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { signUp } from "../../api/userAPI";
import { SignUpRequest } from "../../types/userTypes";

interface SignUpViewModel {
  email: string;
  setEmail: (text: string) => void;

  nick: string;
  setNick: (text: string) => void;

  password: string;
  setPassword: (password: string) => void;

  passwordCheck: string;
  setPasswordCheck: (passwordCheck: string) => void;

  errorMsg: string;
  borderColor: string;

  handleSignUp: () => void;
  handleClose: () => void;
}

export const useSignUpViewModel = (): SignUpViewModel => {
  const navigation = useNavigation();
  const [email, setEmail] = useState<string>("");
  const [nick, setNick] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordCheck, setPasswordCheck] = useState<string>("");

  //   password or passwordCheck 가 변경됐을때만 비교를 실행함.
  const passwordsMatch = useMemo(() => {
    return password === passwordCheck && password !== "";
  }, [password, passwordCheck]);

  const errorMsg = useMemo(() => {
    if (passwordsMatch) return "";
    if (password !== "") return "비밀번호가 일치하지 않습니다.";
    return "";
  }, [passwordsMatch, password]);

  // password, passwordCheck, passwordsMatch가 변경되면 색상변경
  const borderColor = useMemo(() => {
    if (password === "" && passwordCheck === "") return "white";
    if (passwordsMatch) return "#4CD964"; // iOS Green
    return "#FF3B30"; // iOS Red
  }, [password, passwordCheck, passwordsMatch]);

  const handleClose = () => {
    navigation.goBack();
  };

  const handleSignUp = async () => {
    if (!email || !nick || !password || !passwordCheck) {
      Alert.alert("알림", "입력된 정보를 확인해 주세요.");
      return;
    }

    try {
      const params: SignUpRequest = {
        email,
        pw: password,
        nick,
      };

      const response = await signUp(params);

      if (response.result === 1) {
        Alert.alert("성공", "등록 되었습니다.", [
          { text: "확인", onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert("오류", response.msg);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("오류", "사용자등록 중 문제가 발생했습니다.");
    }
  };

  return {
    email,
    setEmail,
    nick,
    setNick,
    password,
    setPassword,
    passwordCheck,
    setPasswordCheck,
    errorMsg,
    borderColor,
    handleSignUp,
    handleClose,
  };
};
