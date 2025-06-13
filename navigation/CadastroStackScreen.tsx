import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ItemCadastroScreen from "../screens/screenCadastroItem/ItemCadastroScreen";
import ItemCadastroNovoScreen from "../screens/screenCadastroItem/ItemCadastroNovoScreen";

const Stack = createNativeStackNavigator();

const CadastroStackScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ItemCadastro"
        component={ItemCadastroScreen}
        options={{ title: "Itens Cadastrados" }}
      />
      <Stack.Screen
        name="ItemCadastroNovoScreen"
        component={ItemCadastroNovoScreen}
        options={{ title: "Novo Item" }}
      />
    </Stack.Navigator>
  );
};

export default CadastroStackScreen;
