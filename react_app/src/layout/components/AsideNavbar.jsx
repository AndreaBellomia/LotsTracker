import React, { useState } from "react";
import { Outlet, NavLink, Link } from "react-router-dom";

import { styled } from "@mui/material/styles";
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
  Container
} from "@mui/material";
import Box from "@mui/material/Box";

import { MoveToInbox, Mail, ChevronRight }  from '@mui/icons-material';

const drawerWidth = 240;
const drawerClosedWidth = 60;


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

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const CustomAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  marginLeft: drawerClosedWidth,
  width: `calc(100% - ${drawerClosedWidth}px)`,
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: 'transparent',
  boxShadow: 'none',
  color: 'black',
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const CustomDrawer = styled(Drawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
      boxSizing: 'border-box',
      ...(open && {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
      }),
      ...(!open && {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
      }),
    }),
  );

const CustomChevronIcon = styled(ChevronRight, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    ...(open && {
      transform: 'rotate(180deg)',
    }),

    color: theme.palette.text.secondary.main,

    transition: theme.transitions.create(['transform'], {
      easing: theme.transitions.easing.sharp,
      duration: 300,
    }),
  })
)

const CustomListItem = styled(ListItem, { shouldForwardProp: (prop) => prop!== 'active' })(
  ({ theme, active }) => ({
    display: 'block', 
    borderRadius: ".5rem", 
    marginBottom: 5, 

    ... (active && {
      backgroundColor: "rgba(255, 255, 255, 0.04)"
    })
  })
)

export default function AsideNavbar() {
  const [open, setOpen] = useState(false);

  const handleDrawerToggle = () => {
    setOpen(!open);
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <CustomAppBar position="fixed" open={open}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Mini variant drawer
          </Typography>
        </Toolbar>
      </CustomAppBar>
      <CustomDrawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerToggle}>
            <CustomChevronIcon open={open}/>
          </IconButton>
        </DrawerHeader>
        <List>
          {/* <NavLink to="/contact" activeClassName="active">Contact</NavLink> */}
          
          {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
            <CustomListItem key={text} disablePadding  href="ciao">
              
              <ListItemButton
                sx={{
                  justifyContent: open ? 'initial' : 'center',
                  px: 2,
                  py: 0.5
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 2 : 'auto',
                    justifyContent: 'center',
                    color: "white"
                  }}
                >
                  {index % 2 === 0 ? <MoveToInbox /> : <Mail />}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0}} />
              </ListItemButton>
            </CustomListItem>
          ))}

          <CustomListItem disablePadding to="/magazzino">
              <ListItemButton
                sx={{
                  justifyContent: open ? 'initial' : 'center',
                  px: 2,
                  py: 0.5
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 2 : 'auto',
                    justifyContent: 'center',
                    color: "white"
                  }}
                >
                  <MoveToInbox />
                </ListItemIcon>
                <ListItemText primary={"asd"} sx={{ opacity: open ? 1 : 0}} />
              </ListItemButton>
            </CustomListItem>

            <Link to="/magazzino">Magazzino</Link>
            <Link to="/lotti">Lotti</Link>
        </List>
      </CustomDrawer>
      <Box
        id="main-content"
        component="div"
        sx={{ p: 3, mt:5, width: { sm: `100%` } }}
      >
          <Outlet />
      </Box>
    </Box>
  );
}