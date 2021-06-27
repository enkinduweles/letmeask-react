import { useHistory, useParams } from 'react-router-dom';

import { Button } from '../components/Button/Button';
import { Question } from '../components/Question/Question';
import { RoomCode } from '../components/RoomCode/RoomCode';

import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import answer from '../assets/images/answer.svg';
import check from '../assets/images/check.svg';
import { database } from '../services/firebase';

import '../styles/room.scss';
import { useRoom } from '../hooks/useRoom';

type RoomParams = {
  id: string;
};

export const AdminRoom = () => {
  const history = useHistory();
  const params = useParams<RoomParams>();
  const roomId = params.id;

  const { questions, roomTitle } = useRoom(roomId);

  const closeRoomHandler = async () => {
    await database.ref(`rooms/${roomId}`).update({
      closedAt: new Date(),
    });

    history.push('/');
  };

  const deleteQuestionHandler = async (questionId: string) => {
    if (window.confirm('Do you really want delete this question?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
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

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Let me ask logo" />
          <div>
            <RoomCode code={params.id} />
            <Button isOutlined onClick={closeRoomHandler}>
              Close room
            </Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>
            Class {roomTitle}
            {questions.length > 0 && <span>{questions.length} questions</span>}
          </h1>
        </div>

        <div className="question-list">
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
    </div>
  );
};
