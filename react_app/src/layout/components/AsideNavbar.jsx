import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';

import { styled } from '@mui/material/styles';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Container,
  Link
} from '@mui/material';


import Box from '@mui/material/Box';

import {
  ChevronRight,
  Person,
  Settings,
  FolderRounded,
  WidgetsRounded,
  QrCodeScannerRounded,
  FactoryRounded,
  JoinFullRounded,
  LocalShippingRounded,
  FileUploadRounded
} from '@mui/icons-material';


const drawerWidth = 240;
const drawerClosedWidth = 70;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  width: drawerClosedWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  // [theme.breakpoints.up('sm')]: {
  //   width: `54 + 1px)`,
  // },
});

const DrawerHeader = styled('div')(({ theme, open }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  ...(open && {
    justifyContent: 'end'
  }),
  // necessary for content to be below app bar
  // ...theme.mixins.toolbar,
}));

const CustomDrawer = styled(Drawer, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  border: 0,
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),


}));

const CustomChevronIcon = styled(ChevronRight, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  ...(open && {
    transform: 'rotate(180deg)',
  }),

  color: theme.palette.text.secondary.main,

  transition: theme.transitions.create(['transform'], {
    easing: theme.transitions.easing.sharp,
    duration: 300,
  }),
}));

const CustomListItem = styled(ListItem, { shouldForwardProp: (prop) => prop !== 'active' })(({ theme, active }) => ({
  display: 'block',
  borderRadius: '.5rem',
  marginBottom: 5,
  color: theme.palette.text.secondary,
  textDecoration: "none",

  ...(active && {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  }),
}));

export default function AsideNavbar() {
  const [open, setOpen] = useState(false);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const listItems = [
    {
      url: '/lotti',
      name: 'Lotti',
      icon: <QrCodeScannerRounded />,
    },
    {
      url: '/lotti/riconsegna',
      name: 'Rientro lotti',
      icon: <JoinFullRounded />,
    },
    {
      url: '/magazzino',
      name: 'Magazzino',
      icon: <WidgetsRounded />,
    },
    {
      url: '/documenti/0',
      name: 'Documenti',
      icon: <FolderRounded />,
    },
    {
      url: '/clienti',
      name: 'Clienti',
      icon: <Person />,
    },
    {
      url: '/fornitori',
      name: 'Fornitori',
      icon: <FactoryRounded />,
    },

  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <CustomDrawer variant="permanent" open={open} PaperProps={{ sx : { borderRadius: 0, backgroundColor: " white", border: 0 } }}>
        <DrawerHeader open={open} >
          <IconButton onClick={handleDrawerToggle}>
            <CustomChevronIcon open={open} />
          </IconButton>
        </DrawerHeader>
        <List>
          {listItems.map((element, index) => (
            <Link href={element.url} key={index} sx={{ textDecoration: "none", marginBottom: 5}}>
              <CustomListItem disablePadding>
                <ListItemButton
                  sx={{
                    justifyContent: open ? 'initial' : 'center',
                    px: 2,
                    py: 1,
                    borderRadius: '5px'
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 2 : 'auto',
                      justifyContent: 'center'
                    }}
                  >
                    <>{element.icon}</>
                  </ListItemIcon>
                  <ListItemText primary={element.name} sx={{ opacity: open ? 1 : 0 }} primaryTypographyProps={{ variant: "button" }} />
                </ListItemButton>
              </CustomListItem>
            </Link>
          ))}
        </List>

        <List sx={{ bottom: 0, marginTop: "auto" }}>
          <Link href="/admin" sx={{ textDecoration: "none", marginBottom: 5}}>
              <CustomListItem disablePadding>
                <ListItemButton
                  sx={{
                    justifyContent: open ? 'initial' : 'center',
                    px: 2,
                    py: 1,
                    borderRadius: '5px'
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 2 : 'auto',
                      justifyContent: 'center'
                    }}
                  >
                    <Settings />
                  </ListItemIcon>
                  <ListItemText primary="Admin" sx={{ opacity: open ? 1 : 0 }} primaryTypographyProps={{ variant: "button" }} />
                </ListItemButton>
              </CustomListItem>
            </Link>
        </List>
      </CustomDrawer>
      <Box id="main-content" component="div" sx={{ p: 3, mt: 5, width: { sm: `100%` } }}>
        <Outlet />
      </Box>
    </Box>
  );
}
