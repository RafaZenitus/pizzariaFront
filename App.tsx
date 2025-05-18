import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ClientesScreen from "./screens/ClientesScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Linking from "expo-linking";
import { View, ActivityIndicator } from "react-native";
import BottomTabs from "./navigation/BottomTabs";
import Toast from "react-native-toast-message";

const Stack = createNativeStackNavigator();
const navigationRef = React.createRef<any>();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [appIsReady, setAppIsReady] = useState(false);

  const checkAuth = async () => {
    const token = await AsyncStorage.getItem("token");
    setIsAuthenticated(!!token);
  };

  const handleDeepLink = async () => {
    const url = await Linking.getInitialURL();
    if (url) {
      const parsed = Linking.parse(url);
      if (parsed.path === "reset-password" && parsed.queryParams?.token) {
        setTimeout(() => {
          navigationRef.current?.navigate("ResetPassword", {
            token: parsed.queryParams?.token,
          });
        }, 500);
      }
    }
  };

  useEffect(() => {
    const prepareApp = async () => {
      await checkAuth();
      await handleDeepLink();
      setAppIsReady(true);
    };
    prepareApp();
  }, []);

  if (!appIsReady || isAuthenticated === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {isAuthenticated ? (
            <Stack.Screen name="Home">
              {(props) => (
                <BottomTabs
                  {...props}
                  onLogout={() => setIsAuthenticated(false)}
                />
              )}
            </Stack.Screen>
          ) : (
            <>
              <Stack.Screen name="Login">
                {(props) => (
                  <LoginScreen
                    {...props}
                    onLogin={() => setIsAuthenticated(true)}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="Register" component={RegisterScreen} />
            </>
          )}
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
          />
          <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        </Stack.Navigator>
      </NavigationContainer>

      <Toast
        position="bottom"
        bottomOffset={100}
        visibilityTime={4000}
        autoHide={true}
      />
    </>
  );
}
