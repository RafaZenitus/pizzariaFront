import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Item {
  id: number;
  nome: string;
  preco: number;
  imagem?: string;
  info?: string;
}

const ItemCadastroScreen = () => {
  const navigation = useNavigation();
  const [itens, setItens] = useState([]);

  const carregarItens = async () => {
    const itensSalvos = await AsyncStorage.getItem("itens");
    const lista = itensSalvos ? JSON.parse(itensSalvos) : [];
    setItens(lista);
  };

  useFocusEffect(
    useCallback(() => {
      carregarItens();
    }, [])
  );

  const renderItem = ({ item }: { item: Item }) => (
    <View style={styles.itemContainer}>
      {item.imagem && (
        <Image source={{ uri: item.imagem }} style={styles.itemImage} />
      )}
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle}>{item.nome}</Text>
        <Text style={styles.itemPrice}>R$ {item.preco}</Text>
        {item.info ? <Text style={styles.itemExtra}>{item.info}</Text> : null}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={itens}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhum item cadastrado.</Text>}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate("ItemCadastroNovoScreen" as never)}
      >
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ItemCadastroScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  itemContainer: {
    flexDirection: "row",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#fff",
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  itemInfo: {
    flex: 1,
    justifyContent: "center",
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemPrice: {
    color: "#28a745",
  },
  itemExtra: {
    fontStyle: "italic",
    color: "#555",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#999",
  },
  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#2196F3",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  floatingButtonText: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
  },
});
