import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

type Pedido = {
  id: string;
  name: string;
  price: number;
  quantidade: number;
};

const CarrinhoScreen = () => {
  const [carrinho, setCarrinho] = useState<Pedido[]>([]);

  const carregarCarrinho = async () => {
  const data = await AsyncStorage.getItem("carrinho");
  const parsed = data ? JSON.parse(data) : [];
  const atualizado = parsed.map((item: any) => ({
    ...item,
    quantidade: item.quantidade ?? 1,
  }));

  setCarrinho(atualizado);
};


  useFocusEffect(
    React.useCallback(() => {
      carregarCarrinho();
    }, [])
  );

  const atualizarCarrinho = async (novoCarrinho: Pedido[]) => {
    setCarrinho(novoCarrinho);
    await AsyncStorage.setItem("carrinho", JSON.stringify(novoCarrinho));
  };

  const removerItem = async (id: string) => {
    const novoCarrinho = carrinho.filter((item) => item.id !== id);
    atualizarCarrinho(novoCarrinho);
  };

  const alterarQuantidade = async (id: string, delta: number) => {
    const novoCarrinho = carrinho
      .map((item) =>
        item.id === id
          ? { ...item, quantidade: Math.max(1, item.quantidade + delta) }
          : item
      );
    atualizarCarrinho(novoCarrinho);
  };

  const total = carrinho.reduce(
    (acc, item) => acc + item.price * item.quantidade,
    0
  );

  const renderItem = ({ item }: { item: Pedido }) => (
    <View style={styles.item}>
      <View style={styles.itemContent}>
        <View>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.price}>R$ {item.price.toFixed(2)}</Text>
          <Text style={styles.qtd}>Quantidade: {item.quantidade}</Text>
          <View style={styles.quantityControls}>
            <TouchableOpacity onPress={() => alterarQuantidade(item.id, -1)} style={styles.qtyButton}>
              <Text style={styles.qtyButtonText}>-</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => alterarQuantidade(item.id, 1)} style={styles.qtyButton}>
              <Text style={styles.qtyButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removerItem(item.id)}
        >
          <Text style={styles.removeText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seu Carrinho</Text>
      {carrinho.length === 0 ? (
        <Text style={styles.empty}>Carrinho vazio.</Text>
      ) : (
        <>
          <FlatList
            data={carrinho}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
          />
          <Text style={styles.total}>Total: R$ {total.toFixed(2)}</Text>
        </>
      )}
    </View>
  );
};

export default CarrinhoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  empty: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginTop: 20,
  },
  item: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  itemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  price: {
    fontSize: 14,
    color: "#27ae60",
  },
  qtd: {
    fontSize: 14,
    marginTop: 4,
  },
  quantityControls: {
    flexDirection: "row",
    marginTop: 6,
  },
  qtyButton: {
    backgroundColor: "#dcdcdc",
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
  },
  qtyButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  removeButton: {
    backgroundColor: "#e74c3c",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  removeText: {
    color: "#fff",
    fontWeight: "600",
  },
  total: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 16,
    color: "#2c3e50",
  },
});
