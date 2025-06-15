import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ClientesScreen from "../screens/screenUsuarios/UsersScreen";
import PedidosScreen from "../screens/screenPedidos/PedidosScreen";
import CarrinhoScreen from "../screens/screenCarrinho/CarrinhoScreen";
import Ionicons from "react-native-vector-icons/Ionicons";
import AddressRegisterScreen from "../screens/screenEndereco/GetEndereco";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import BebidasScreen from "../screens/screenPedidos/BebidasScreen";

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
          } else if (route.name === "Pizzas") {
            iconName = "pizza-outline";
            IconComponent = Ionicons;
          } else if (route.name === "Bebidas") {
            iconName = "bottle-soda-outline";
            IconComponent = MaterialCommunityIcons;
          } else if (route.name === "Carrinho") {
            iconName = "cart-outline";
            IconComponent = Ionicons;
          } else if (route.name === "Endereços") {
            iconName = "map-marker-radius-outline";
            IconComponent = MaterialCommunityIcons;
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
      

      <Tab.Screen name="Pizzas" component={PedidosScreen} />
      <Tab.Screen name="Bebidas" component={BebidasScreen} />
      <Tab.Screen name="Endereços" component={AddressRegisterScreen}/>
      <Tab.Screen name="Carrinho" component={CarrinhoScreen} />

      

    </Tab.Navigator>
  );
  
};

export default BottomTabs;
