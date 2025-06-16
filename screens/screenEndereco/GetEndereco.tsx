import React, { useState, useCallback } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
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

  const fetchEnderecos = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get<Endereco[]>(
        "http://192.168.2.114:8080/endereco",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEnderecos(response.data); // ou .reverse() se quiser mostrar o mais novo em cima
    } catch (error) {
      console.log("Erro ao buscar endereços:", error);
    }
  };

  // Atualiza os endereços sempre que a tela for focada
  useFocusEffect(
    useCallback(() => {
      fetchEnderecos();
    }, [])
  );

  return (
    <ImageBackground
      source={require("../../assets/pizzaMenu1.jpeg")}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Meus Endereços</Text>

        <FlatList
          data={enderecos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.enderecoItem}>
              <Text style={styles.enderecoText}>
                {`${item.rua}, ${item.numero} - ${item.bairro}`}
              </Text>
              <Text style={styles.enderecoText}>{`CEP: ${item.cep}`}</Text>
              {item.complemento ? (
                <Text style={styles.enderecoText}>
                  Compl.: {item.complemento}
                </Text>
              ) : null}
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
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 200,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#fff",
  },
  enderecoItem: {
    backgroundColor: "#ffffffcc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  enderecoText: {
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#FFA500",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
    marginHorizontal: 40,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default ListaEnderecosScreen;
