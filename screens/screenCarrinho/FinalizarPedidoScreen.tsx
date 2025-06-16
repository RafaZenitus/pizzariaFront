import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import QRCode from "react-native-qrcode-svg";
import * as Clipboard from "expo-clipboard";
import Toast from "react-native-toast-message";
import axios from "axios";
import { gerarPixPayload } from "../../utils/pix";

type Pedido = {
  id: string;
  name: string;
  price: number;
  quantidade: number;
};

type Endereco = {
  id: number;
  cep: string;
  bairro: string;
  rua: string;
  numero: string;
  complemento?: string;
};

const FinalizarPedidoScreen = () => {
  const [carrinho, setCarrinho] = useState<Pedido[]>([]);
  const [enderecos, setEnderecos] = useState<Endereco[]>([]);
  const [enderecoSelecionado, setEnderecoSelecionado] = useState<Endereco | null>(null);
  const [mostrarPix, setMostrarPix] = useState(false);
  const [payloadPix, setPayloadPix] = useState("");

  useEffect(() => {
    carregarCarrinho();
    buscarEnderecos();
  }, []);

  const carregarCarrinho = async () => {
    const data = await AsyncStorage.getItem("carrinho");
    const parsed = data ? JSON.parse(data) : [];
    const carrinhoCorrigido: Pedido[] = parsed.map((item: any) => ({
      id: item.id,
      name: item.name,
      price: Number(item.price) || 0,
      quantidade: Number(item.quantidade) || 1,
    }));
    setCarrinho(carrinhoCorrigido);
  };

  const buscarEnderecos = async () => {
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
      setEnderecos(response.data);
    } catch (error) {
      console.log("Erro ao buscar endereços:", error);
    }
  };

  const total = carrinho.reduce(
    (acc, item) => acc + item.price * item.quantidade,
    0
  );

  const confirmarPedido = async () => {
    if (!enderecoSelecionado) {
      Alert.alert("Erro", "Por favor, selecione um endereço.");
      return;
    }

    const payload = gerarPixPayload({
      chave: "rafazenitus@gmail.com",
      nome: normalizarTexto("PIZZARIA DO FOGO INFERNAL"),
      cidade: normalizarTexto("BARBACENA"),
      valor: total,
      mensagem: `Entrega: ${enderecoSelecionado.rua}, ${enderecoSelecionado.numero}`,
    });

    setPayloadPix(payload);
    setMostrarPix(true);

    await AsyncStorage.removeItem("carrinho");

    Toast.show({
      type: "success",
      text1: "Pedido feito!",
      text2: "Aguardando pagamento via Pix.",
      position: "bottom",
      visibilityTime: 4000,
    });
  };

  function normalizarTexto(text: string): string {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase();
  }

  const renderItem = ({ item }: { item: Pedido }) => (
    <View style={styles.item}>
      <Text style={styles.itemText}>
        {item.name} x{item.quantidade} - R$ {item.price.toFixed(2)}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Finalizar Pedido</Text>

      <Text style={styles.subtitle}>Itens:</Text>
      <FlatList
        data={carrinho}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        style={{ maxHeight: 200 }}
      />

      <Text style={styles.total}>Total: R$ {total.toFixed(2)}</Text>

      <Text style={styles.subtitle}>Selecione o endereço de entrega:</Text>
      <FlatList
        data={enderecos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.enderecoItem,
              enderecoSelecionado?.id === item.id && styles.enderecoSelecionado,
            ]}
            onPress={() => setEnderecoSelecionado(item)}
          >
            <Text>{`${item.rua}, ${item.numero} - ${item.bairro}`}</Text>
            <Text>{`CEP: ${item.cep}`}</Text>
            {item.complemento ? <Text>Compl.: {item.complemento}</Text> : null}
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 16 }}
      />

      <TouchableOpacity style={styles.confirmButton} onPress={confirmarPedido}>
        <Text style={styles.confirmButtonText}>Confirmar Pedido</Text>
      </TouchableOpacity>

      {mostrarPix && (
        <View style={styles.pixContainer}>
          <Text style={styles.pixTitle}>Pagamento via Pix</Text>
          <QRCode value={payloadPix} size={200} />
          <Text selectable style={styles.pixCode}>
            {payloadPix}
          </Text>
          <TouchableOpacity
            style={styles.copyButton}
            onPress={() => {
              Clipboard.setStringAsync(payloadPix);
              Alert.alert("Código copiado!", "Use no app do seu banco.");
            }}
          >
            <Text style={styles.copyButtonText}>Copiar código Pix</Text>
          </TouchableOpacity>
        </View>
      )}
      <Toast />
    </View>
  );
};

export default FinalizarPedidoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  item: {
    backgroundColor: "#f4f4f4",
    padding: 8,
    borderRadius: 6,
    marginBottom: 6,
  },
  itemText: {
    fontSize: 16,
  },
  total: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 12,
    textAlign: "center",
  },
  enderecoItem: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  enderecoSelecionado: {
    borderColor: "#27ae60",
    borderWidth: 2,
    backgroundColor: "#eaffea",
  },
  confirmButton: {
    backgroundColor: "#27ae60",
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 32,
    marginTop: 8,
    marginHorizontal: 40,
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  pixContainer: {
    marginTop: 24,
    alignItems: "center",
  },
  pixTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  pixCode: {
    fontSize: 12,
    textAlign: "center",
    marginVertical: 12,
  },
  copyButton: {
    backgroundColor: "#2980b9",
    padding: 10,
    borderRadius: 8,
  },
  copyButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
