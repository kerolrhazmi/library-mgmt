import { createContext, useEffect, useState, useContext } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(undefined);

  // ✅ Sign up with display name and insert into profiles
  const signUpNewUser = async (email, password, displayName, role = 'user') => {
    try {
      // 1. Sign up the user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        console.error("There was a problem signing up:", signUpError);
        return { success: false, error: signUpError.message };
      }

      const userId = signUpData.user?.id;
      const userEmail = signUpData.user?.email;

      // 2. Insert user info into profiles table
      if (userId) {
        const { error: insertError } = await supabase.from('profiles').insert([
          {
            id: userId,
            email: userEmail, 
            display_name: displayName,
            role: role,
          },
        ]);

        if (insertError) {
          console.error("Error inserting profile:", insertError);
          return { success: false, error: insertError.message };
        }
      }

      return { success: true };
    } catch (error) {
      console.error("Unexpected error during sign up:", error);
      return { success: false, error: error.message };
    }
  };

  // 🔐 Sign in
  const signInUser = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        console.error("Sign in error occurred:", error);
        window.alert("No account found. Please sign up first.");
        return { success: false, error: error.message };
      }
      console.log("Sign-in success: ", data);
      return { success: true, data };
    } catch (error) {
      console.error("An error occurred:", error);
      return { success: false, error: error.message };
    }
  };

  // 🔓 Sign out
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("There was an error signing out:", error);
    } else {
      setSession(null);
    }
  };

  // ✅ Get session on mount and subscribe to changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ session, signUpNewUser, signOut, signInUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => useContext(AuthContext);
