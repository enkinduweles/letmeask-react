import copyImg from '../../assets/images/copy.svg';
import { useResponsivity } from '../../hooks/useResponsivity';
import classes from '../../styles/roomCode.module.scss';

type RoomCodeProps = {
  code: string;
};

export const RoomCode = (props: RoomCodeProps) => {
  const mediaQuery = useResponsivity(768);

  const copyRoomCodeToClipboard = () => {
    navigator.clipboard.writeText(props.code);
  };

  if (mediaQuery) {
    return (
      <button className={classes.roomCode} onClick={copyRoomCodeToClipboard}>
        <span>Copiar código da sala</span>
      </button>
    );
  }

  return (
    <button className={classes.roomCode} onClick={copyRoomCodeToClipboard}>
      <div>
        <img src={copyImg} alt="Copy room code" />
      </div>
      <span>{props.code}</span>
    </button>
  );
};
