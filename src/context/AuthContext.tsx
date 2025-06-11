"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { signInAction, signOutAction, signUpAction } from "@/lib/actions/auth";
import { createClient } from "@/db/client";
import { useRouter } from "next/navigation";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    userData?: { fullName?: string }
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type Props = {
  children: React.ReactNode;
  session: Session | null;
};

export const AuthProvider: React.FC<Props> = ({
  children,
  session: initialSession,
}) => {
  const [session, setSession] = useState<Session | null>(initialSession);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const user = session?.user ?? null;

  const router = useRouter();

  useEffect(() => {
    // Set initial session
    setSession(initialSession);

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [initialSession, supabase.auth]);

  const signUp = async (
    email: string,
    password: string,
    userData?: { fullName?: string }
  ) => {
    setLoading(true);
    try {
      const message = await signUpAction(email, password, userData?.fullName);
      toast.success(message);
      router.replace("/marketplace");
    } catch (error) {
      toast.error(`Signup failed: ${(error as Error).message}`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInAction(email, password);
      router.replace("/");
      // Don't show toast here as redirect will happen
    } catch (error) {
      toast.error(`Signin failed: ${(error as Error).message}`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await signOutAction();
      // Don't show toast here as redirect will happen
    } catch (error) {
      toast.error(`Error signing out: ${(error as Error).message}`);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
