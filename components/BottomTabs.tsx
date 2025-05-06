import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ClientesScreen from "../screens/ClientesScreen";
import ItemCadastroScreen from "../screens/ItemCadastroScreen";
import PedidosScreen from "../screens/PedidosScreen";
import Icon from "react-native-vector-icons/Ionicons";

const Tab = createBottomTabNavigator();

const BottomTabs = ({ onLogout }: any) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = "home";

          if (route.name === "Clientes") {
            iconName = "people-outline";
          } else if (route.name === "Cadastro") {
            iconName = "person-add-outline";
          } else if (route.name === "Pedidos") {
            iconName = "receipt-outline";
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        headerShown: false,
        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Clientes">
        {() => <ClientesScreen onLogout={onLogout} />}
      </Tab.Screen>
      <Tab.Screen name="Cadastro" component={ItemCadastroScreen} />
      <Tab.Screen name="Pedidos" component={PedidosScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabs;
