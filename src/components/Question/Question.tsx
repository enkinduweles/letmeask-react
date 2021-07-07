import { ReactNode } from 'react';
import classes from '../../styles/question.module.scss';

type QuestionProps = {
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  children?: ReactNode;
  isAnswered: boolean;
  isHighLighted: boolean;
};

export const Question = (props: QuestionProps) => {
  return (
    <div
      className={`${classes.question} ${
        props.isAnswered ? classes.answered : ''
      } ${props.isHighLighted && !props.isAnswered ? classes.highLighted : ''}`}
    >
      <p>{props.content}</p>
      <footer>
        <div className={classes.userInfo}>
          <img src={props.author.avatar} alt={props.author.name} />
          <span>{props.author.name}</span>
        </div>
        <div className={classes.actions}>{props.children}</div>
      </footer>
    </div>
  );
};
