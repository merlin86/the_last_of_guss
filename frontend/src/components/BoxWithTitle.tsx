import { type ElementType, type ReactNode } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

export interface BoxWithTitleProps {
  title: string;
  content_component?: ElementType;
  children?: ReactNode;
}

export default function BoxWithTitle(props: BoxWithTitleProps) {
  return (
    <Box>
      <CssBaseline />
      <AppBar position='static'>
        <Typography variant='h6' component="h1" sx={{ padding: 2, textTransform: 'uppercase' }}>
          {props.title}
        </Typography>
      </AppBar>
      <Paper square variant='outlined' component={props.content_component ?? "div"}>
          <Box sx={{ margin: 4 }}>
            {props.children}
          </Box>
      </Paper>
    </Box>
  );
}
