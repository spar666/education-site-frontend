import React, {
  useReducer,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from 'react';

import { WhatsappSVG, CloseSVG, CheckSVG, SendSVG } from './Icons';
import css from './styles.module.css';

// import darkBG from './assets/bg-chat-tile-light.png';
// import lightBG from './assets/bg-chat-tile-dark.png';
import dummyAvatar from './assets/uifaces-popular-image.jpg';
// import SoundBeep from './assets/whatsapp-notification.mp3';
import { reducer } from './reducer';

export interface FloatingWhatsAppProps {
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onSubmit?: (
    event: React.FormEvent<HTMLFormElement>,
    formValue: string
  ) => void;
  onClose?: () => void;
  onNotification?: () => void;
  onLoopDone?: () => void;

  phoneNumber: string;
  accountName: string;
  chatboxHeight?: number;
  chatboxStyle?: React.CSSProperties;
  chatboxClassName?: string;
  avatar?: any;
  statusMessage?: string;
  chatMessage?: string;
  placeholder?: string;

  notification?: boolean;
  notificationDelay?: number;
  notificationLoop?: number;
  notificationSound?: boolean;
  notificationSoundSrc?: string;
  notificationStyle?: React.CSSProperties;
  notificationClassName?: string;

  allowClickAway?: boolean;
  allowEsc?: boolean;
  darkMode?: boolean;
  style?: React.CSSProperties;
  className?: string;

  buttonStyle?: React.CSSProperties;
  buttonClassName?: string;
}

export function FloatingWhatsApp({
  onClick,
  onSubmit,
  onClose,
  onNotification,
  onLoopDone,

  phoneNumber = '9860409629',
  accountName = 'Account Name',
  avatar = dummyAvatar,
  statusMessage = 'Typically replies within 1 hour',
  chatMessage = 'Hello there! 🤝\nHow can we help?',
  placeholder = 'Type a message...',

  allowClickAway = false,
  allowEsc = false,

  notification = true,
  notificationDelay = 60,
  notificationLoop = 0,
  notificationSound = false,
  //   notificationSoundSrc = SoundBeep,
  notificationStyle,
  notificationClassName = 'floating-whatsapp-notification',

  buttonStyle,
  buttonClassName = 'floating-whatsapp-button',

  chatboxHeight = 320,
  chatboxStyle,
  chatboxClassName = 'floating-whatsapp-chatbox',

  darkMode = false,
  style,
  className = 'floating-whatsapp',
}: FloatingWhatsAppProps) {
  const [{ isOpen, isDelay, isNotification }, dispatch] = useReducer(reducer, {
    isOpen: false,
    isDelay: true,
    isNotification: false,
  });

  const timeNow = useMemo(
    () =>
      new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    []
  );

  const inputRef = useRef<HTMLInputElement | null>(null);
  const soundRef = useRef<HTMLAudioElement | null>(null);
  const loops = useRef(0);
  const notificationInterval = useRef<number | null>(null);

  const handleNotification = useCallback(() => {
    if (!notification) return;

    dispatch({ type: 'notification' });
    if (onNotification) onNotification();

    if (notificationLoop > 0) {
      loops.current += 1;

      if (notificationSound && soundRef.current) {
        soundRef.current.currentTime = 0;
        soundRef.current.play();
      }

      if (loops.current === notificationLoop) {
        if (notificationInterval.current) {
          clearInterval(notificationInterval.current);
        }
        if (onLoopDone) onLoopDone();
      }
    }
  }, [
    notification,
    notificationLoop,
    notificationSound,
    onNotification,
    onLoopDone,
  ]);

  useEffect(() => {
    const delayInMillis = notificationDelay * 1000;
    if (delayInMillis < 10000) {
      console.error('notificationDelay must be at least 10 seconds.');
      return;
    }

    notificationInterval.current = window.setInterval(
      handleNotification,
      delayInMillis
    );

    return () => {
      if (notificationInterval.current) {
        clearInterval(notificationInterval.current);
      }
    };
  }, [handleNotification, notificationDelay]);

  const handleOpen = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();

      if (isOpen) return;

      if (notificationInterval.current) {
        clearInterval(notificationInterval.current);
      }

      dispatch({ type: 'open' });
      setTimeout(() => dispatch({ type: 'delay' }), 2000);
      if (onClick) onClick(event);
    },
    [isOpen, onClick]
  );

  const handleClose = useCallback(() => {
    dispatch({ type: 'close' });
    if (onClose) onClose();
  }, [onClose]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Ensure inputRef.current is not null before accessing its value
    if (inputRef.current) {
      const message = inputRef.current.value;

      if (message) {
        window.open(
          `https://api.whatsapp.com/send/?phone=${phoneNumber}&text=${encodeURIComponent(
            message
          )}`
        );

        if (onSubmit) onSubmit(event, message);

        // Clear the input field
        inputRef.current.value = '';
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = () => {
      if (!allowClickAway || !isOpen) return;
      handleClose();
    };

    document.addEventListener('click', handleClickOutside, false);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [allowClickAway, isOpen, handleClose]);

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (allowEsc && isOpen && event.key === 'Escape') handleClose();
    };

    document.addEventListener('keydown', handleEscKey, false);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [allowEsc, isOpen, handleClose]);

  return (
    <div
      className={`${css.floatingWhatsapp} ${
        darkMode ? css.dark : ''
      } ${className}`}
      style={style}
    >
      <div
        className={`${css.whatsappButton} ${buttonClassName}`}
        onClick={handleOpen}
        style={buttonStyle}
        role="button"
        tabIndex={0}
      >
        <WhatsappSVG />
        {isNotification && (
          <span
            className={`${css.notificationIndicator} ${notificationClassName}`}
            style={notificationStyle}
          >
            1
          </span>
        )}
      </div>

      <div
        className={`${css.whatsappChatBox} ${
          isOpen ? css.open : css.close
        } ${chatboxClassName}`}
        style={{ height: isOpen ? chatboxHeight : 0, ...chatboxStyle }}
        role="dialog"
        aria-hidden={!isOpen}
      >
        <header className={css.chatHeader}>
          <div className={css.avatar}>
            <img src={avatar} alt="WhatsApp avatar" width="60" height="60" />
          </div>
          <div className={css.status}>
            <span className={css.statusTitle}>{accountName}</span>
            <span className={css.statusSubtitle}>{statusMessage}</span>
          </div>
          <button
            className={css.close}
            onClick={handleClose}
            aria-label="Close chat"
          >
            <CloseSVG />
          </button>
        </header>

        <div
          className={css.chatBody}
          style={{ backgroundImage: `url(${darkMode})` }}
        >
          {isDelay ? (
            <div className={css.chatBubble}>
              <div className={css.typing}>
                <div className={css.dot} />
                <div className={css.dot} />
                <div className={css.dot} />
              </div>
            </div>
          ) : (
            <div className={css.message}>
              <span className={css.triangle} />
              <span className={css.accountName}>{accountName}</span>
              <p className={css.messageBody}>{chatMessage}</p>
              <span className={css.messageTime}>
                {timeNow}
                <span style={{ marginLeft: 5 }}>
                  <CheckSVG />
                </span>
              </span>
            </div>
          )}
        </div>

        <footer className={css.chatFooter}>
          <form onSubmit={handleSubmit}>
            <input
              className={css.input}
              placeholder={placeholder}
              ref={inputRef}
              dir="auto"
            />
            <button
              type="submit"
              className={css.buttonSend}
              aria-label="Send message"
            >
              <SendSVG />
            </button>
          </form>
        </footer>
      </div>
      {/* 
      {notificationSound && (
        <audio ref={soundRef} hidden src={notificationSoundSrc} />
      )} */}
    </div>
  );
}
