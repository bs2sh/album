import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import LoginScreen from "./src/screens/Login/LoginScreen";
import SignUpScreen from "./src/screens/SignUp/SignUpScreen";

import { RootStackParamList } from "./src/navigation/NavigationTypes";

// Stack 네비게이터 생성
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {/* 앱실행시 처음 보여줄 화면 */}
        <Stack.Navigator initialRouteName="Login" id="RootStack">
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
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
