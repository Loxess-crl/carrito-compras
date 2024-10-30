import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { URL_API } from "@/constants/constants";

interface User {
  id: number;
  email: string;
  password: string;
  role: string;
}

const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuthContext();

  const authenticateUser = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${URL_API}/users`);
      const users: User[] = await response.json();

      const user = users.find(
        (user) => user.email === email && user.password === password
      );

      if (!user) {
        throw new Error("Credenciales incorrectas");
      }

      login(user); // Guardar el usuario en el contexto
      return user; // Retorna el usuario para redirigir según el rol
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { authenticateUser, loading, error };
};

export default useAuth;
