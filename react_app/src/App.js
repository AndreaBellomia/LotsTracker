import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Button from '@mui/material/Button';

import { Dashboard, Layout } from "./pages";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )    
};

export default App;
