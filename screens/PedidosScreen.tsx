import React from "react";
import { SafeAreaView, Text, StyleSheet } from "react-native";

const PedidosScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Você está em: Pedidos</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default PedidosScreen;
