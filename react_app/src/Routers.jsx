import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AsideNavbar from "./layout/components/AsideNavbar.jsx";

import { Dashboard } from "./pages";


export default function Router() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AsideNavbar />}>
            <Route index element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    );
  }