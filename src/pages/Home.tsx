import { FormEvent, useEffect, useState } from 'react';
import { useHistory, Redirect } from 'react-router-dom';

import { Button } from '../components/Button/Button';

import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';

import classes from '../styles/home.module.scss';

export const Home = () => {
  const [roomCode, setRoomCode] = useState('');
  const { user, loginWithGoogle, logOut } = useAuth();
  const history = useHistory();

  useEffect(() => {
    if (!user) {
      localStorage.removeItem('firstLogin');
    }
    document.title = 'Letme ask - Home';
  }, [user]);

  const createRoomHandler = async () => {
    if (!user) {
      await loginWithGoogle();
    }

    history.push('/rooms/new');
  };

  const joinRoomHandler = async (event: FormEvent) => {
    event.preventDefault();

    if (roomCode.trim() === '') {
      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if (!roomRef.exists()) {
      alert('Room does not exist.');
      return;
    }

    if (roomRef.val().closedAt) {
      alert('Room already closed!');
      return;
    }

    history.push(`rooms/${roomCode}`);
  };

  let isFirstLogin = Boolean(window.localStorage.getItem('firstLogin'));

  return (
    <div id={classes.pageAuth}>
      {isFirstLogin && <Redirect to="rooms/new" />}
      <aside>
        <img src={illustrationImg} alt="Illustration" />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire dúvidas da sua audiência em tempo-real</p>
        <p>Usuário: {user?.name}</p>
        <button onClick={logOut}>logout</button>
      </aside>
      <main>
        <div className={classes.mainContent}>
          <img src={logoImg} alt="Logo letme ask" />
          <button className={classes.createRoom} onClick={createRoomHandler}>
            <img src={googleIconImg} alt="Googgle Icon" />
            Crie sua sala com o Google
          </button>
          <div className={classes.separator}>ou entre em uma sala</div>
          <form onSubmit={joinRoomHandler}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              onChange={(event) => setRoomCode(event.target.value)}
              value={roomCode}
            />
            <Button type="submit">Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  );
};
