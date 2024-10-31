import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { API_URL } from "@/constants/constants";
import { User } from "@/types/user.interface";

const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuthContext();

  const authenticateUser = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/users`);
      const users: User[] = await response.json();

      const user = users.find(
        (user) => user.email === email && user.password === password
      );

      if (!user) {
        throw new Error("Credenciales incorrectas");
      }

      login(user);
      return user;
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { authenticateUser, loading, error };
};

export default useAuth;
