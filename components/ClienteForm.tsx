import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Text, Alert } from "react-native";
import api from "../api/api";

export default function ClienteForm() {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    password: "", // ← adicionado conforme exigência do DTO
  });

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    if (!form.nome || !form.email || !form.cpf || !form.password) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      await api.post("/clientes", form);
      Alert.alert("Sucesso", "Cliente cadastrado com sucesso!");
      setForm({ nome: "", email: "", telefone: "", cpf: "", password: "" });
    } catch (error: any) {
      console.error("Erro ao cadastrar cliente:", error?.response?.data || error.message);
      Alert.alert("Erro", "Não foi possível cadastrar o cliente.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome *</Text>
      <TextInput
        style={styles.input}
        value={form.nome}
        onChangeText={(text) => handleChange("nome", text)}
      />

      <Text style={styles.label}>Email *</Text>
      <TextInput
        style={styles.input}
        value={form.email}
        onChangeText={(text) => handleChange("email", text)}
        keyboardType="email-address"
      />

      <Text style={styles.label}>CPF *</Text>
      <TextInput
        style={styles.input}
        value={form.cpf}
        onChangeText={(text) => handleChange("cpf", text)}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Telefone</Text>
      <TextInput
        style={styles.input}
        value={form.telefone}
        onChangeText={(text) => handleChange("telefone", text)}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Senha *</Text>
      <TextInput
        style={styles.input}
        value={form.password}
        onChangeText={(text) => handleChange("password", text)}
        secureTextEntry
      />

      <Button title="Cadastrar" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { marginTop: 10, fontWeight: "bold" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
});
