import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { AuthProvider, useAuthContext } from "@/context/AuthContext";
import { Slot } from "expo-router"; // Asegúrate de que este import esté correcto

const Layout = () => {
  return (
    <AuthProvider>
      <Main />
    </AuthProvider>
  );
};

const Main = () => {
  const { user } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      switch (user.role) {
        case "user":
          router.push("/user");
          break;
        case "business":
          router.push("/business");
          break;
        case "delivery":
          router.push("/delivery");
          break;
        default:
          router.push("/login");
      }
    } else {
      router.push("/login");
    }
  }, [user]);

  return <Slot />; // Esto renderiza el contenido de la ruta actual
};

export default Layout;
