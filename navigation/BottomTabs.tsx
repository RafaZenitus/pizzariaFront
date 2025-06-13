import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ClientesScreen from "../screens/screenUsuarios/UsersScreen";
import PedidosScreen from "../screens/screenPedidos/PedidosScreen";
import CarrinhoScreen from "../screens/screenCarrinho/CarrinhoScreen";
import Ionicons from "react-native-vector-icons/Ionicons";
import AddressRegisterScreen from "../screens/screenEndereco/GetEndereco";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

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
          } else if (route.name === "Pedidos") {
            iconName = "receipt-outline";
            IconComponent = Ionicons;
          } else if (route.name === "Carrinho") {
            iconName = "cart-outline"; // ícone representativo de carrinho
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

      <Tab.Screen name="Pedidos" component={PedidosScreen} />

      <Tab.Screen name="Carrinho" component={CarrinhoScreen} />

      <Tab.Screen
          name="GetEndereço"
          component={AddressRegisterScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home-map-marker" size={size} color={color} />
            ),
          }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;
