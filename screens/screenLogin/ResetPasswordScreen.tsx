import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import axios from "axios";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";

const ResetPasswordScreen = () => {
  const [token, setToken] = useState(""); // Campo para colar token
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigation = useNavigation();
  const route = useRoute<RouteProp<{ params: { token?: string } }, 'params'>>();
  const routeToken = route.params?.token; // Token vindo por deep link, se tiver

  // const navigation = useNavigation();
  // const route = useRoute();
  // const routeToken = route.params?.token;

  const effectiveToken = (token || routeToken || "").trim(); // Garantir que está limpo

  const handleResetPassword = async () => {
    if (!effectiveToken) {
      Alert.alert("Erro", "Token não fornecido.");
      return;
    }

    if (!newPassword || !confirmPassword) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    try {
      await axios.put(
        `http://192.168.2.114:8080/reset-password?token=${encodeURIComponent(effectiveToken.trim())}`,
        {
          password: newPassword, // Aqui está a chave correta
        }
      );
     

      Alert.alert("Sucesso", "Senha redefinida com sucesso!");
      navigation.navigate("Login" as never);
      //navigation.navigate("Login");
    } catch (error: any) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível redefinir a senha.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Redefinir Senha</Text>

      {!routeToken && (
        <TextInput
          placeholder="Cole aqui o token"
          value={token}
          onChangeText={setToken}
          style={styles.input}
          autoCapitalize="none"
        />
      )}

      <TextInput
        placeholder="Nova senha"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
        style={styles.input}
      />
      <TextInput
        placeholder="Confirmar nova senha"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        style={styles.input}
      />
      <Button title="Redefinir senha" onPress={handleResetPassword} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  input: { borderBottomWidth: 1, marginBottom: 20, fontSize: 16, paddingVertical: 8 },
});

export default ResetPasswordScreen;
