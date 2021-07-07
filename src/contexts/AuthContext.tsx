import { createContext, ReactNode, useEffect, useState } from 'react';
import { useResponsivity } from '../hooks/useResponsivity';

import { auth, firebase } from '../services/firebase';

type User = {
  id: string;
  name: string;
  avatar: string;
};

type AuthContextType = {
  user: User | undefined;
  loginWithGoogle: () => Promise<void>;
  logOut: () => Promise<void>;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

export const authContext = createContext({} as AuthContextType);

const AuthContextProvider = (props: AuthContextProviderProps) => {
  const [user, setUser] = useState<User>();

  const hasMatchMediaQuery = useResponsivity();

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
      } else {
        setUser(undefined);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const loginWithGoogle = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();

    try {
      if (hasMatchMediaQuery) {
        localStorage.setItem('firstLogin', 'true');

        await auth.signInWithRedirect(provider);
      } else {
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
      }
    } catch (error) {
      console.log(error);
      localStorage.remove('firstLogin');
    }
  };

  const logOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <authContext.Provider
      value={{
        user,
        loginWithGoogle,
        logOut,
      }}
    >
      {props.children}
    </authContext.Provider>
  );
};

export default AuthContextProvider;
