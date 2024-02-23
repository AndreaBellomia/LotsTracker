import * as React from 'react';
import { SnackbarProvider } from 'notistack';
import { useSnackbar } from 'notistack';

export const SNACK_EVENT_NAME = 'dispatchSnack';

export default function _({ children }) {
  return <SnackbarProvider maxSnack={3}>{children}</SnackbarProvider>;
}

export function SnackProvider() {
  const { enqueueSnackbar } = useSnackbar();
  React.useEffect(() => {
    const handlerEvent = (event) => {
      enqueueSnackbar(event.detail.message, {
        variant: event.detail.type,
        ...event.detail.options,
      });
    };

    document.addEventListener(SNACK_EVENT_NAME, handlerEvent);

    return () => {
      document.removeEventListener(SNACK_EVENT_NAME, handlerEvent);
    };
  }, []);
  return null;
}

export class Snack {
  constructor(options = {}) {
    this.options = {
      autoHideDuration: 3000,
      ...options
    };
  }

  triggerEvent(detail) {
    const event = new CustomEvent(SNACK_EVENT_NAME, { detail });

    if (!event.detail) {
      console.error('Event detail not specified');
      return;
    }

    document.dispatchEvent(event);
  }

  error(message) {
    const detail = {
      message: message,
      type: 'error',
      options: this.options,
    };

    this.triggerEvent(detail);
  }

  success(message) {
    const detail = {
      message: message,
      type: 'success',
      options: this.options,
    };

    this.triggerEvent(detail);
  }

  warning(message) {
    const detail = {
      message: message,
      type: 'warning',
      options: this.options,
    };

    this.triggerEvent(detail);
  }

  info(message) {
    const detail = {
      message: message,
      type: 'info',
      options: this.options,
    };

    this.triggerEvent(detail);
  }

  regular(message) {
    const detail = {
      message: message,
      type: '',
      options: this.options,
    };

    this.triggerEvent(detail);
  }
}

export const snack = new Snack();
