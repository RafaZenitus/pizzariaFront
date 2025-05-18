import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ClientesScreen from "../screens/ClientesScreen";
import PedidosScreen from "../screens/PedidosScreen";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import CadastroStackScreen from "../components/CadastroStackScreen"; // novo import

const Tab = createBottomTabNavigator();

const BottomTabs = ({ onLogout }: any) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = "home";
          let IconComponent = Ionicons;

          if (route.name === "Usuários") {
            iconName = "people-outline";
            IconComponent = Ionicons;
          } else if (route.name === "Cadastro") {
            iconName = "book-plus-outline";
            IconComponent = MaterialCommunityIcons;
          } else if (route.name === "Pedidos") {
            iconName = "receipt-outline";
            IconComponent = Ionicons;
          }

          return <IconComponent name={iconName} size={size} color={color} />;
        },
        headerShown: false,
        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Usuários">
        {() => <ClientesScreen onLogout={onLogout} />}
      </Tab.Screen>

      <Tab.Screen name="Cadastro" component={CadastroStackScreen} />

      <Tab.Screen name="Pedidos" component={PedidosScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabs;
