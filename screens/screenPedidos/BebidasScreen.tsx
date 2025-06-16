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

type Bebida = {
  id: string;
  name: string;
  description: string;
  price: number;
  volume: number;
  tipo: string;
  image: string;
};

const BebidasScreen = () => {
  const [bebidas, setBebidas] = useState<Bebida[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBebidas = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Toast.show({ type: "error", text1: "Token não encontrado." });
        return;
      }

      const response = await axios.get("http://192.168.2.114:8080/bebidas", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBebidas(response.data as Bebida[]);
    } catch (error: any) {
      const message = error.response?.data || "Erro ao buscar bebidas.";
      Toast.show({ type: "error", text1: "Erro", text2: String(message) });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBebidas();
  }, []);

  const addToCart = async (bebida: Bebida) => {
    try {
      const cartData = await AsyncStorage.getItem("carrinho");
      let cart: Bebida[] = cartData ? JSON.parse(cartData) : [];

      const exists = cart.find(item => item.id === bebida.id);
      if (!exists) {
        cart.push(bebida);
        await AsyncStorage.setItem("carrinho", JSON.stringify(cart));
        Toast.show({
          type: "success",
          text1: `${bebida.name} adicionada ao carrinho!`,
        });
      } else {
        Toast.show({
          type: "info",
          text1: `${bebida.name} já está no carrinho.`,
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

  const renderItem = ({ item }: { item: Bebida }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.image }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.details}>Volume: {item.volume}ml</Text>
        <Text style={styles.details}>Tipo: {item.tipo}</Text>
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
            data={bebidas}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
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
    backgroundColor: "rgba(32, 32, 32, 0.95)",
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
    fontSize: 22,
    fontWeight: "bold",
    color: "#eee",
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

export default BebidasScreen;
