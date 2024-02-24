import React from 'react';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';

import AsideNavbar from '@/layout/components/AsideNavbar.jsx';

import Dashboard from '@/pages/Dashboard/Dashboard.jsx';

import StorageList from '@/pages/Storage/TableListPage.jsx';

import CustomerTableList from '@/pages/Customers/CustomerList.jsx';
import CustomerDocumentFrom from '@/pages/Customers/FormPage.jsx';

import SupplierTableList from '@/pages/Supplier/SupplierTableList.jsx';

import FromSupplierDocumentFrom from '@/pages/FromSupplier/FormPage.jsx';

import ToSupplierDocumentFrom from '@/pages/ToSupplier/FormPage.jsx';

import StorageItemsList from '@/pages/Lotti/TableListPage.jsx';
import ReturnItemsList from '@/pages/Lotti/TableReturnPage.jsx';
import ManageLott from '@/pages/Lotti/FormPage.jsx';

import DocumentsListRouterPage from '@/pages/Documents/DocumentListPageMain.jsx';

export default function Router() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AsideNavbar />}>
            {/* <Route path="test" element={<Test />} /> */}
            <Route index element={<Dashboard />} />
            <Route path="clienti" element={<CustomerTableList />} />

            <Route path="magazzino" element={<StorageList />} />

            <Route path="lotti" element={<Outlet />}>
              <Route path="crea" element={<ManageLott />} />
              <Route path="riconsegna" element={<ReturnItemsList />} />
              <Route path="modifica/:id" element={<ManageLott />} />
              <Route index element={<StorageItemsList />} />
            </Route>

            <Route path="documenti" element={<Outlet />}>
              <Route path="crea" element={<CustomerDocumentFrom />} />
              <Route path="modifica/:id" element={<CustomerDocumentFrom />} />

              <Route path="carico/crea" element={<FromSupplierDocumentFrom />} />
              <Route path="carico/modifica/:id" element={<FromSupplierDocumentFrom />} />

              <Route path="scarico/crea" element={<ToSupplierDocumentFrom />} />
              <Route path="scarico/modifica/:id" element={<ToSupplierDocumentFrom />} />

              <Route path="lista/consegna" element={<DocumentsListRouterPage type="customer" />} />
              <Route path="lista/carico" element={<DocumentsListRouterPage type="fromSupplier" />} />
              <Route path="lista/scarico" element={<DocumentsListRouterPage type="toSupplier" />} />
            </Route>

            <Route path="fornitori" element={<Outlet />}>
              <Route index element={<SupplierTableList />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
