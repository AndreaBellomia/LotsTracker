import * as React from 'react';
import { SnackbarProvider } from 'notistack';


export default function _({ children }) {
    const [open, setOpen] = React.useState(true);
  
    return (
        <SnackbarProvider maxSnack={3}>
            {children}
        </SnackbarProvider>
    );
  }
  