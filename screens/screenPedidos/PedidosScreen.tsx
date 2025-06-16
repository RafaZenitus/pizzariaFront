import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  FlatList,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

type Pedido = {
  id: string;
  name: string;
  description: string;
  price: number;
  tamanho: string;
  ingredientes: string;
  image: string;
};

const PedidosScreen = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPedidos = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Toast.show({ type: "error", text1: "Token não encontrado." });
        return;
      }

      const response = await axios.get("http://192.168.2.114:8080/pizzas", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPedidos(response.data as Pedido[]);
    } catch (error: any) {
      const message = error.response?.data || "Erro ao buscar pedidos.";
      Toast.show({ type: "error", text1: "Erro", text2: String(message) });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  const addToCart = async (pedido: Pedido) => {
    try {
      const cartData = await AsyncStorage.getItem("carrinho");
      let cart: Pedido[] = cartData ? JSON.parse(cartData) : [];

      const exists = cart.find((item) => item.id === pedido.id);
      if (!exists) {
        cart.push(pedido);
        await AsyncStorage.setItem("carrinho", JSON.stringify(cart));
        Toast.show({
          type: "success",
          text1: `${pedido.name} adicionado ao carrinho!`,
        });
      } else {
        Toast.show({
          type: "info",
          text1: `${pedido.name} já está no carrinho.`,
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Erro ao adicionar ao carrinho",
        text2: String(error),
      });
    }
  };

  const renderItem = ({ item }: { item: Pedido }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.image }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.details}>Tamanho: {item.tamanho}</Text>
        <Text style={styles.details}>Ingredientes: {item.ingredientes}</Text>
        <Text style={styles.price}>R$ {item.price.toFixed(2)}</Text>
        <TouchableOpacity style={styles.button} onPress={() => addToCart(item)}>
          <Text style={styles.buttonText}>Adicionar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ImageBackground
      source={require("../../assets/pizzaMenu3.jpeg")}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <FlatList
            contentContainerStyle={styles.listContent}
            data={pedidos}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
          />
        )}
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
    paddingHorizontal: 16,
    paddingTop: 236, 
  },
  listContent: {
    paddingBottom: 100,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "rgba(32, 32, 32, 0.90)",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 3,
  },
  image: {
    width: 100,
    height: 100,
    backgroundColor: "#eee",
  },
  cardContent: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  title: {
    color: "#eee",
    fontSize: 22,
    fontWeight: "bold",
  },
  description: {
    fontSize: 16,
    color: "#eee",
  },
  details: {
    fontSize: 16,
    color: "#eee",
  },
  price: {
    fontSize: 30,
    color: "#27ae60",
    fontWeight: "600",
  },
  button: {
    marginTop: 8,
    backgroundColor: "#27ae60",
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: "center",
    
  },
  buttonText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default PedidosScreen;
