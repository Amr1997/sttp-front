import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './router/Routes';

const App = () => (
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
);

export default App;
