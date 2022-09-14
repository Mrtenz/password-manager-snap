import { CssBaseline } from '@mui/material';
import { FunctionComponent } from 'react';
import { App } from '../features/app';

import './index.css';

const Index: FunctionComponent = () => (
  <>
    <CssBaseline />
    <App />
  </>
);

export const Head: FunctionComponent = () => (
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
  />
);

export default Index;
