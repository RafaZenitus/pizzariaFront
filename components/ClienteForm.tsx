import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Text, Alert } from "react-native";
// import api from "../api/api.ts";
import api from "../api/api";
import { Cliente } from "../Types/Cliente";
// import { Cliente } from "../Types/Cliente.ts";

export default function ClienteForm() {
  const [form, setForm] = useState<Cliente>({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    endereco: "",
  });

  const handleChange = (field: keyof Cliente, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      await api.post("/clientes", form);
      Alert.alert("Sucesso", "Cliente cadastrado com sucesso!");
      setForm({ nome: "", email: "", telefone: "", cpf: "", endereco: "" });
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível cadastrar o cliente.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={styles.input}
        value={form.nome}
        onChangeText={(text) => handleChange("nome", text)}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={form.email}
        onChangeText={(text) => handleChange("email", text)}
        keyboardType="email-address"
      />

      <Text style={styles.label}>Telefone</Text>
      <TextInput
        style={styles.input}
        value={form.telefone}
        onChangeText={(text) => handleChange("telefone", text)}
        keyboardType="phone-pad"
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
