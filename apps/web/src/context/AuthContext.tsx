
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import type { ReactNode } from "react";

import {
  getCurrentUser,
  login as loginApi,
  logout as logoutApi,
  register as registerApi,
} from "../features/auth/auth.api";

import type {
  LoginInput,
  RegisterInput,
  User,
} from "../features/auth/auth.types";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore authentication from the existing server session.
  useEffect(() => {
    let isMounted = true;

    async function initializeAuth() {
      try {
        const currentUser = await getCurrentUser();

        if (isMounted) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error("Failed to initialize authentication:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void initializeAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (input: LoginInput) => {
    const authenticatedUser = await loginApi(input);
    setUser(authenticatedUser);
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    const registeredUser = await registerApi(input);
    setUser(registeredUser);
  }, []);

  const logout = useCallback(async () => {
    await logoutApi();
    setUser(null);
  }, []);

  const value: AuthContextValue = {
    user,
    isAuthenticated: user !== null,
    isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error(
      "useAuth must be used within an AuthProvider",
    );
  }

  return context;
}
