import * as React from 'react';
import { styled, alpha, darken } from '@mui/material/styles';

import Paper from '@mui/material/Paper';

const ButtonIcon = styled(Paper)(({ theme }) => ({
  width: '100%',
  aspectRatio : '1 / 1',

  display : 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  cursor : 'pointer',

  color : theme.palette.text.secondary,
  backgroundColor : theme.palette.grey.main,

  transition: ".2s",

  '&:hover' : {
    backgroundColor : alpha(theme.palette.grey.main, 0.9),
    color : theme.palette.primary.main,
  },

  '&:active' : {
    backgroundColor : darken(theme.palette.grey.main, 0.1),
    color : darken(theme.palette.primary.main, 0.1),
  }

}));


export default function (props) {

  const { IconProps, ...buttonProps } = props

  return (
    <ButtonIcon elevation={5} {...buttonProps}>
      <IconProps sx={{ fontSize: "5rem" }} />
    </ButtonIcon>
  )
}