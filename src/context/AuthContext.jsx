import { createContext, useEffect, useState, useContext } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(undefined);

  // Sign up with display name
  const signUpNewUser = async (email, password, displayName, role = 'user') => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
          role : role,
        },
      },
    });

    if (error) {
      console.error("There was a problem signing up:", error);
      return { success: false, error };
    }
    return { success: true, data };
  };

  // Sign in
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
    }
  };

  // Sign out
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("There was an error signing out:", error);
    } else {
      setSession(null); // Clear session on sign out
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Cleanup subscription on unmount
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

export const UserAuth = () => {
  return useContext(AuthContext);
};
