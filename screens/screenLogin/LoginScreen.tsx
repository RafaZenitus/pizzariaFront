import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
} from "react-native";
import { login } from "../../services/authService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import Ionicons from "react-native-vector-icons/Ionicons";

type Props = {
  onLogin: () => void;
};

const LoginScreen: React.FC<Props> = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const response = (await login({ email, password })) as { token: string };
      await AsyncStorage.setItem("token", response.token);

      Toast.show({
        type: "success",
        text1: "Login realizado com sucesso!",
        text2: "Bem-vindo de volta!",
        position: "bottom",
        visibilityTime: 3000,
        autoHide: true,
      });

      onLogin();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Erro ao fazer login",
        text2: "Verifique seu email e senha.",
        position: "bottom",
        visibilityTime: 3000,
        autoHide: true,
      });
    }
  };

  return (
    
    <ImageBackground
      source={require("../../assets/pizzaMenu2.jpeg")}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.authContainer}>
          <Text style={styles.title}>Login</Text>

          <TextInput
            placeholder="Email"
            placeholderTextColor="#999"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Senha"
              placeholderTextColor="#999"
              style={styles.inputWithIcon}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.iconButton}
            >
              <Ionicons
                name={showPassword ? "eye" : "eye-off"}
                size={24}
                color="#333"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={handleLogin}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate("Register" as never)}
          >
            <Text style={styles.toggleText}>Criar conta</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("ForgotPassword" as never)}
          >
            <Text style={styles.toggleText}>Esqueci minha senha</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  authContainer: {
    width: "80%",
    maxWidth: 400,
    backgroundColor: "rgba(32, 32, 32, 0.80)",
    padding: 16,
    borderRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: "center",
    color: "#fff",
  },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
    borderRadius: 4,
    backgroundColor: "#fff",
    color: "#000",
  },
  inputWrapper: {
    position: "relative",
    marginBottom: 16,
  },
  inputWithIcon: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    padding: 8,
    borderRadius: 4,
    paddingRight: 40,
    backgroundColor: "#fff",
    color: "#000",
  },
  iconButton: {
    position: "absolute",
    right: 10,
    top: 3,
    padding: 4,
  },
  buttonContainer: {
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#ee962c",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  toggleText: {
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
    textDecorationLine: "underline",
  },
});

export default LoginScreen;
