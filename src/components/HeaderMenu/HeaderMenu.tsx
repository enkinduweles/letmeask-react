import { ReactNode, useState } from 'react';
import ReactModal from 'react-modal';

import { MenuIcon } from './MenuIcon/MenuIcon';

import logoImg from '../../assets/images/logo.svg';

import classes from '../../styles/headerMenu.module.scss';

type HeaderMenuProps = {
  children: ReactNode;
  isOnMobileDevice: boolean;
};

export const HeaderMenu = (props: HeaderMenuProps) => {
  const { children, isOnMobileDevice } = props;
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <header>
      <div className={classes.content}>
        <img src={logoImg} alt="Let me ask logo" />
        {isOnMobileDevice ? (
          <MenuIcon openModal={openModal} />
        ) : (
          <div>{children}</div>
        )}
      </div>
      <ReactModal
        className={{
          base: 'modal',
          afterOpen: 'opened-modal',
          beforeClose: 'closed-modal',
        }}
        closeTimeoutMS={200}
        overlayClassName="overlay"
        isOpen={showModal && isOnMobileDevice}
        onRequestClose={closeModal}
      >
        {children}
      </ReactModal>
    </header>
  );
};
