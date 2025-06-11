import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import QRCode from "react-native-qrcode-svg";
import * as Clipboard from "expo-clipboard";
import Toast from "react-native-toast-message";
import { gerarPixPayload } from "../../utils/pix"; // ajuste o caminho conforme seu projeto

type Pedido = {
  id: string;
  name: string;
  price: number;
  quantidade: number;
};

const FinalizarPedidoScreen = () => {
  const [carrinho, setCarrinho] = useState<Pedido[]>([]);
  const [endereco, setEndereco] = useState("");
  const [mostrarPix, setMostrarPix] = useState(false);
  const [payloadPix, setPayloadPix] = useState("");

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

  useEffect(() => {
    carregarCarrinho();
  }, []);

  const total = carrinho.reduce(
    (acc, item) => acc + item.price * item.quantidade,
    0
  );

  const confirmarPedido = async () => {
    if (!endereco.trim()) {
      Alert.alert("Erro", "Por favor, preencha o endereço.");
      return;
    }

    const payload = gerarPixPayload({
      chave: "rafazenitus@gmail.com",
      //tipoChave: "02",
      nome: normalizarTexto("PIZZARIA DO FOGO INFERNAL"),
      cidade: normalizarTexto("BARBACENA"),
      valor: total,
      mensagem: "Pedido feito com o app Pizzaria do Fogo Infernal",
    });

    function normalizarTexto(text: string): string {
      return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase();
    }

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

      <TextInput
        style={styles.input}
        placeholder="Digite seu endereço de entrega"
        value={endereco}
        onChangeText={setEndereco}
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
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  confirmButton: {
    backgroundColor: "#27ae60",
    paddingVertical: 14,
    borderRadius: 8,
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
