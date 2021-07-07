import { ButtonHTMLAttributes } from 'react';
import { useResponsivity } from '../../hooks/useResponsivity';
import classes from '../../styles/button.module.scss';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isOutlined?: boolean;
};

export const Button = ({ isOutlined = false, ...props }: ButtonProps) => {
  const mediaQuery = useResponsivity(768);

  if (mediaQuery) {
    return <button className={classes.button} {...props} />;
  }

  return (
    <button
      className={`${classes.button} ${isOutlined ? classes.outlined : ''}`}
      {...props}
    />
  );
};
