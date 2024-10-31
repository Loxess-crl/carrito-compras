import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import InicioScreen from "./inicio";
import CarritoScreen from "./carrito";
import PedidosScreen from "./pedidos";

const Drawer = createDrawerNavigator();

const UserScreen = () => {
  return (
    <NavigationContainer independent>
      <Drawer.Navigator initialRouteName="Inicio">
        <Drawer.Screen name="Inicio" component={InicioScreen} />
        <Drawer.Screen name="Carrito de Compras" component={CarritoScreen} />
        <Drawer.Screen name="Pedidos" component={PedidosScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default UserScreen;
