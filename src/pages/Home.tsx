import { useHistory } from 'react-router-dom';
import {} from '../';
import { Button } from '../components/Button/Button';
import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';
import '../styles/auth.scss';
import { useAuth } from '../hooks/useAuth';
import { FormEvent, useState } from 'react';
import { database } from '../services/firebase';

export const Home = () => {
  const [roomCode, setRoomCode] = useState('');
  const { user, loginWithGoogle } = useAuth();
  const history = useHistory();

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

  return (
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="Illustration" />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire dúvidas da sua audiência em tempo-real</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="Logo letme ask" />
          <button className="create-room" onClick={createRoomHandler}>
            <img src={googleIconImg} alt="Googgle Icon" />
            Crie sua sala com o Google
          </button>
          <div className="separator">ou entre em uma sala</div>
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
