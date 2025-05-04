import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/api";

interface Cliente {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  telefone?: string;
}

const ClientesScreen = ({ onLogout }: any) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);

  const fetchClientes = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await api.get<Cliente[]>("/clientes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setClientes(response.data);
    } catch (error) {
      Alert.alert("Erro ao buscar clientes");
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    onLogout();
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  return (
    <View style={{ padding: 20, flex: 1 }}>
      <Text style={{ fontSize: 24, marginBottom: 10 }}>Clientes</Text>

      <FlatList
        data={clientes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ paddingVertical: 10 }}>
            <Text>Nome: {item.nome}</Text>
            <Text>Email: {item.email}</Text>
          </View>
        )}
      />

      <Button title="Sair" onPress={handleLogout} color="red" />
    </View>
  );
};

export default ClientesScreen;
