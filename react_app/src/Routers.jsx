import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AsideNavbar from "./layout/components/AsideNavbar.jsx";

import { Dashboard, FromSupplierDocument, StorageList, StorageItemsList, DocumentCustomerTable, CustomerList } from "./pages";


export default function Router() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="" element={<AsideNavbar />}>
            <Route index element={<Dashboard />} />
            <Route path="document" element={<FromSupplierDocument />} />
            <Route path="magazzino" element={<StorageList />} />
            <Route path="magazzinoo" element={<StorageItemsList />} />
            <Route path="documenti" element={<DocumentCustomerTable />} />
            <Route path="clienti" element={<CustomerList />} />

          </Route>
        </Routes>
      </BrowserRouter>
    );
  }