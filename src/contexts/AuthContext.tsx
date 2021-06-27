import { createContext, ReactNode, useEffect, useState } from 'react';
import { auth, firebase } from '../services/firebase';

type User = {
  id: string;
  name: string;
  avatar: string;
};

type AuthContextType = {
  user: User | undefined;
  loginWithGoogle: () => Promise<void>;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

export const authContext = createContext({} as AuthContextType);

const AuthContextProvider = (props: AuthContextProviderProps) => {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const { displayName, photoURL, uid } = user;

        if (!displayName || !photoURL) {
          throw new Error('Missing information from Google account');
        }

        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL,
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const loginWithGoogle = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();

    const loginResult = await auth.signInWithPopup(provider);

    if (loginResult.user) {
      const { displayName, photoURL, uid } = loginResult.user;

      if (!displayName || !photoURL) {
        throw new Error('Missing information from Google account');
      }

      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL,
      });
    }
  };

  return (
    <authContext.Provider value={{ user, loginWithGoogle }}>
      {props.children}
    </authContext.Provider>
  );
};

export default AuthContextProvider;
