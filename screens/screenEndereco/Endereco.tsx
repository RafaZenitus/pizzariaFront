import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const AddressRegisterScreen = () => {
  const [cep, setCep] = useState("");
  const [bairro, setBairro] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");

  const navigation = useNavigation();

  const handleRegisterAddress = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const response = await axios.post(
        "http://192.168.18.5:8080/endereco", // ajuste se necessário
        {
          cep,
          bairro,
          rua,
          numero,
          complemento,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );

      console.log("Endereço cadastrado:", response.data);

      Toast.show({
        type: "success",
        text1: "Endereço cadastrado!",
        text2: "Seu endereço foi salvo com sucesso.",
        position: "bottom",
        visibilityTime: 3000,
      });

      navigation.goBack();
    } catch (error) {
      console.log("Erro ao cadastrar endereço:", error);

      Toast.show({
        type: "error",
        text1: "Erro ao cadastrar",
        text2: "Verifique os dados e tente novamente.",
        position: "bottom",
        visibilityTime: 3000,
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.authContainer}>
        <Text style={styles.title}>Cadastrar Endereço</Text>

        <TextInput
          placeholder="CEP"
          style={styles.input}
          value={cep}
          onChangeText={setCep}
        />
        <TextInput
          placeholder="Bairro"
          style={styles.input}
          value={bairro}
          onChangeText={setBairro}
        />
        <TextInput
          placeholder="Rua"
          style={styles.input}
          value={rua}
          onChangeText={setRua}
        />
        <TextInput
          placeholder="Número"
          style={styles.input}
          value={numero}
          onChangeText={setNumero}
        />
        <TextInput
          placeholder="Complemento (opcional)"
          style={styles.input}
          value={complemento}
          onChangeText={setComplemento}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => {
              console.log("handleRegisterAddress chamado");
              handleRegisterAddress();
            }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Salvar Endereço</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.toggleText}>Voltar</Text>
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
});

export default AddressRegisterScreen;
