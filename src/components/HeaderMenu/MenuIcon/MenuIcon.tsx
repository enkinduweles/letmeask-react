import { Fragment } from 'react';
import classes from '../../../styles/menuIcon.module.scss';

type MenuIconProps = {
  openModal: () => void;
};

export const MenuIcon = (props: MenuIconProps) => {
  const { openModal } = props;
  return (
    <Fragment>
      <div id={classes.menuIcon} onClick={openModal}>
        <div />
        <div />
        <div />
      </div>
    </Fragment>
  );
};
