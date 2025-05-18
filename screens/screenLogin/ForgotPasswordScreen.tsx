import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const navigation = useNavigation();

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert("Por favor, insira o e-mail.");
      return;
    }

    try {
      await axios.post("http://192.168.18.5:8080/forgot-password", { email });

      Alert.alert(
        "E-mail enviado com sucesso",
        "Copie o token recebido no e-mail e cole na próxima tela para redefinir a senha."
      );

      // Redireciona após 1s (garantindo que o alerta foi exibido)
      setTimeout(() => {
        navigation.navigate("ResetPassword" as never);
      }, 1000);
    } catch (error: any) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível enviar o e-mail.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.authContainer}>
        <Text style={styles.title}>Esqueci minha senha</Text>
        <TextInput
          placeholder="Digite seu e-mail"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TouchableOpacity onPress={handleForgotPassword} style={styles.button}>
          <Text style={styles.buttonText}>Enviar link de recuperação</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Login" as never)}
          style={styles.linkContainer}
        >
          <Text style={styles.linkText}>Voltar para o Login</Text>
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
  linkContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  linkText: {
    color: "#3498db",
    fontSize: 16,
    textAlign: "center",
  },
});

export default ForgotPasswordScreen;
