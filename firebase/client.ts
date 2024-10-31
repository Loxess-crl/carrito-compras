import { initializeApp } from "firebase/app";
import "firebase/database";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCoe17WzFE6UlpelA1BFDh4f6I7rTlAag4",
  authDomain: "carrito-compras-8249f.firebaseapp.com",
  databaseURL: "https://carrito-compras-8249f-default-rtdb.firebaseio.com",
  projectId: "carrito-compras-8249f",
  storageBucket: "carrito-compras-8249f.appspot.com",
  messagingSenderId: "501831644993",
  appId: "1:501831644993:web:7a41e477cb15fc3c7593c0",
};

export const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
