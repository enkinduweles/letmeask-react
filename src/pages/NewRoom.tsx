import { FormEvent, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Button } from '../components/Button/Button';
import { database } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';
import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import classes from '../styles/home.module.scss';

export const NewRoom = () => {
  const [newRoom, setNemRoom] = useState('');
  const history = useHistory();
  const { user } = useAuth();

  useEffect(() => {
    localStorage.removeItem('firstLogin');

    document.title = 'Letme ask - New Room';
  }, []);

  const createRoomHanlder = async (event: FormEvent) => {
    event.preventDefault();

    if (newRoom.trim() === '') {
      return;
    }

    const roomRef = database.ref('rooms');

    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id,
    });

    history.push(`/admin/rooms/${firebaseRoom.key}`);
  };

  return (
    <div id={classes.pageAuth}>
      <aside>
        <img src={illustrationImg} alt="Illustration" />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire dúvidas da sua audiência em tempo-real</p>
      </aside>
      <main>
        <div className={classes.mainContent}>
          <img src={logoImg} alt="Logo letme ask" />

          <h2>Criar uma nova sala</h2>
          <form onSubmit={createRoomHanlder}>
            <input
              type="text"
              placeholder="Nome da sala"
              onChange={(event) => setNemRoom(event.target.value)}
            />
            <Button type="submit">Criar sala</Button>
          </form>
          <p>
            Quer entrar em uma sala já existente?
            <Link to="/"> clique aqui</Link>
          </p>
        </div>
      </main>
    </div>
  );
};
