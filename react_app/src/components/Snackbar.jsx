import * as React from 'react';
import { SnackbarProvider } from 'notistack';

export default function _({ children }) {
  return <SnackbarProvider maxSnack={3}>{children}</SnackbarProvider>;
}
