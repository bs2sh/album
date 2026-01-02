import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import LoginScreen from "./src/screens/Login/LoginScreen";
import SignUpScreen from "./src/screens/SignUp/SignUpScreen";
import AlbumListScreen from "./src/screens/AlbumList/AlbumListScreen";
import PhotoListScreen from "./src/screens/PhotoList/PhotoListScreen";

import { RootStackParamList } from "./src/navigation/NavigationTypes";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Stack 네비게이터 생성
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] =
    useState<keyof RootStackParamList>("Login");

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userKey = await AsyncStorage.getItem("userKey");

        if (userKey) {
          // 유저키가 있으면 로그인 되어 있는 상태 -> AlbumList 보여준다.
          console.log(`유저키 있음. ${userKey}`);
          setInitialRoute("AlbumList");
        } else {
          // 유저키 없음. 로그인 안됨. -> Login 보여준다.
          console.log("유저키 없음 . 로그인으로");
          setInitialRoute("Login");
        }
      } catch (e) {
        console.error("로그인 실패 ::", e);
        setInitialRoute("Login");
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {/* 앱실행시 처음 보여줄 화면 */}
        <Stack.Navigator
          initialRouteName={initialRoute}
          id="RootStack"
          screenOptions={{
            headerBackButtonDisplayMode: "minimal",
          }}
        >
          {/* 로그인 화면 */}
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          {/* 회원가입 화면 */}
          <Stack.Screen
            name="SignUp"
            component={SignUpScreen}
            options={{ headerShown: false, presentation: "modal" }}
          />
          {/* 앨범리스트 화면 */}
          <Stack.Screen
            name="AlbumList"
            component={AlbumListScreen}
            options={{ title: "내앨범", headerShown: true }}
          />
          <Stack.Screen
            name="PhotoList"
            component={PhotoListScreen}
            options={{ title: "", headerShown: true }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
