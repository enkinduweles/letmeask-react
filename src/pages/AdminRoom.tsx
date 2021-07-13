import { useEffect, useState, memo, useCallback } from 'react';

import { useHistory, useParams } from 'react-router-dom';
import ReactModal from 'react-modal';

import { useAuth } from '../hooks/useAuth';

import { Button } from '../components/Button/Button';
import { Question } from '../components/Question/Question';
import { RoomCode } from '../components/RoomCode/RoomCode';
import { HeaderMenu } from '../components/HeaderMenu/HeaderMenu';

import deleteImg from '../assets/images/delete.svg';
import answer from '../assets/images/answer.svg';
import check from '../assets/images/check.svg';
import { database } from '../services/firebase';

import { useRoom } from '../hooks/useRoom';
import { useResponsivity } from '../hooks/useResponsivity';

import classes from '../styles/room.module.scss';

type RoomParams = {
  id: string;
};

export const AdminRoom = () => {
  const [openModal, setOpenModal] = useState(false);
  const [questionId, setQuestionId] = useState('');
  const { logOut } = useAuth();
  const history = useHistory();
  const isOnMobileDevice = useResponsivity(768);
  const params = useParams<RoomParams>();
  const roomId = params.id;

  const { questions, roomTitle } = useRoom(roomId);

  useEffect(() => {
    document.title = 'Letme ask - Room';
  }, []);

  const closeRoomHandler = useCallback(async () => {
    await database.ref(`rooms/${roomId}`).update({
      closedAt: new Date(),
    });

    history.push('/');
  }, [history, roomId]);

  const deleteQuestionHandler = (questionId: string) => {
    // if (window.confirm('Do you really want delete this question?')) {
    //   await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    // }

    setOpenModal(true);
    setQuestionId(questionId);
  };

  const cancelDeleteAction = () => {
    setOpenModal(false);
  };

  const confirmDeleteAction = async () => {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
  };

  const checkQuestionAsAnswered = async (questionId: string) => {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    });
  };
  const highLightQuestion = async (questionId: string) => {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighLighted: true,
    });
  };

  const signOut = useCallback(async () => {
    await logOut();

    history.push('/');
  }, [history, logOut]);

  const closeModal = () => {
    setOpenModal(false);
  };

  return (
    <div id={classes.pageRoom}>
      <HeaderMenu isOnMobileDevice={isOnMobileDevice}>
        <RoomCode code={roomId} />
        <Button isOutlined onClick={closeRoomHandler}>
          Encerrar sala
        </Button>
        <Button onClick={signOut}>Sair</Button>
      </HeaderMenu>

      {questions.length > 0 ? (
        <main>
          <div className={classes.roomTitle}>
            <h1>
              Class {roomTitle}
              {questions.length > 0 && (
                <span>{questions.length} questions</span>
              )}
            </h1>
          </div>

          <div className={classes.questionList}>
            {questions.map((question) => {
              return (
                <Question
                  key={question.id}
                  content={question.content}
                  author={question.author}
                  isAnswered={question.isAnswered}
                  isHighLighted={question.isHighLighted}
                >
                  {!question.isAnswered && (
                    <>
                      <button
                        type="button"
                        onClick={() => checkQuestionAsAnswered(question.id)}
                      >
                        <img src={check} alt="Mark as answered" />
                      </button>
                      <button
                        type="button"
                        onClick={() => highLightQuestion(question.id)}
                      >
                        <img src={answer} alt="Highlight question" />
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => deleteQuestionHandler(question.id)}
                  >
                    <img src={deleteImg} alt="Delete question" />
                  </button>
                </Question>
              );
            })}
          </div>
        </main>
      ) : (
        <p>Loading...</p>
      )}

      <ReactModal
        isOpen={openModal}
        onRequestClose={closeModal}
        className={{
          base: `${classes.modal}`,
          afterOpen: `${classes.openedModal}`,
          beforeClose: `${classes.closedModal}`,
        }}
        closeTimeoutMS={200}
        overlayClassName={`${classes.overlay}`}
      >
        <div className={classes.modalContent}>
          <h2>You want to delete this question?</h2>
          <p>This action can't be undone after confirmation.</p>
          <div>
            <Button onClick={cancelDeleteAction}>CANCEL</Button>
            <Button onClick={confirmDeleteAction}>OK</Button>
          </div>
        </div>
      </ReactModal>
    </div>
  );
};
