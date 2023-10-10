import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AsideNavbar from "./layout/components/AsideNavbar.jsx";

import { Dashboard, FromSupplierDocument, StorageList } from "./pages";


export default function Router() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="" element={<AsideNavbar />}>
            <Route index element={<Dashboard />} />
            <Route path="document" element={<FromSupplierDocument />} />
            <Route path="magazzino" element={<StorageList />} />
          </Route>
        </Routes>
      </BrowserRouter>
    );
  }