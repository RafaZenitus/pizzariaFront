import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Endereco = {
  id: number;
  cep: string;
  bairro: string;
  rua: string;
  numero: string;
  complemento?: string;
};

const ListaEnderecosScreen = () => {
  const [enderecos, setEnderecos] = useState<Endereco[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchEnderecos = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.get<Endereco[]>(
          "http://192.168.18.5:8080/endereco",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEnderecos(response.data);
      } catch (error) {
        console.log("Erro ao buscar endereços:", error);
      }
    };

    fetchEnderecos();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Meus Endereços</Text>

      <FlatList
        data={enderecos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.enderecoItem}>
            <Text>{`${item.rua}, ${item.numero} - ${item.bairro}`}</Text>
            <Text>{`CEP: ${item.cep}`}</Text>
            {item.complemento ? <Text>Compl.: {item.complemento}</Text> : null}
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("AddressRegister" as never)}
      >
        <Text style={styles.buttonText}>Cadastrar novo endereço</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 24, // desceu mais para não encostar no relógio
    marginBottom: 16,
    textAlign: "center", // centralizado horizontalmente
  },
  enderecoItem: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#ee962c",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 20,
    marginHorizontal: 16, // espaçamento lateral no botão
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});

export default ListaEnderecosScreen;
