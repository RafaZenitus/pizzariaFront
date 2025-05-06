import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Alert,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/api";

interface Cliente {
  id: number;
  nome: string;
  email: string;
}

const ClientesScreen = ({ onLogout }: any) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);

  const fetchClientes = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await api.get<Cliente[]>("/clientes", {
        headers: { Authorization: `Bearer ${token}` },
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
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Clientes</Text>

      <FlatList
        data={clientes}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 100 }} // Evita sobreposição com barra inferior
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.nome}</Text>
            <Text style={styles.email}>{item.email}</Text>
          </View>
        )}
      />

      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 10, 
    backgroundColor: "#ffffff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    marginTop: 25,
  },
  card: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
  },
  email: {
    fontSize: 14,
    color: "#555",
  },
  logoutButton: {
    backgroundColor: "red",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
  logoutText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});

export default ClientesScreen;
