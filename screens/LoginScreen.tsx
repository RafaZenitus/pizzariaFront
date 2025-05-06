import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import { login } from "../services/authService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

type Props = {
  onLogin: () => void;
};

const LoginScreen: React.FC<Props> = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👈 Adicionado
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const response = (await login({ email, password })) as { token: string };
      await AsyncStorage.setItem("token", response.token);

      Alert.alert("Login realizado com sucesso!");
      onLogin();
    } catch (error) {
      Alert.alert("Erro ao fazer login", "Verifique seu email e senha.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.authContainer}>
        <Text style={styles.title}>Login</Text>

        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Senha"
            style={styles.inputWithIcon}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.iconButton}
          >
            <Text style={{ fontSize: 18 }}>{showPassword ? "🙉" : "🙈"}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleLogin} style={styles.button}>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f0f0f0",
  },
  authContainer: {
    width: "80%",
    maxWidth: 400,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
    borderRadius: 4,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 16,
    paddingRight: 8,
  },
  eyeButton: {
    padding: 8,
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
    color: "#3498db",
    textAlign: "center",
    marginBottom: 8,
  },
  errorText: {
    color: "#e74c3c",
    textAlign: "center",
    marginBottom: 12,
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
    paddingRight: 40, // espaço para o ícone
  },
  iconButton: {
    position: "absolute",
    right: 10,
    top: 8,
    padding: 4,
  },
});

export default LoginScreen;
