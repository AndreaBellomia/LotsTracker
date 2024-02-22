import React from 'react';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';

import AsideNavbar from '@/layout/components/AsideNavbar.jsx';

import Dashboard from '@/pages/Dashboard/Dashboard.jsx';

import StorageList from '@/pages/Storage/TableListPage.jsx';

import CustomerTableList from '@/pages/Customers/CustomerList.jsx';
import CustomerDocumentTableList from '@/pages/Customers/TableListPage.jsx';
import CustomerDocumentFrom from '@/pages/Customers/FormPage.jsx';

import SupplierTableList from '@/pages/Supplier/SupplierTableList.jsx';

import FromSupplierItemsList from '@/pages/FromSupplier/TableListPage.jsx';
import FromSupplierDocumentFrom from '@/pages/FromSupplier/FormPage.jsx';

import ToSupplierItemsList from '@/pages/ToSupplier/TableListPage.jsx';
import ToSupplierDocumentFrom from '@/pages/ToSupplier/FormPage.jsx';

import StorageItemsList from '@/pages/Lotti/TableListPage.jsx';
import ManageLott from '@/pages/Lotti/FormPage.jsx';

export default function Router() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AsideNavbar />}>
            <Route index element={<Dashboard />} />
            <Route path="clienti" element={<CustomerTableList />} />

            <Route path="magazzino" element={<StorageList />} />

            <Route path="lotti" element={<Outlet />}>
              <Route path="crea" element={<ManageLott />} />
              <Route path="modifica/:id" element={<ManageLott />} />
              <Route index element={<StorageItemsList />} />
            </Route>

            <Route path="documenti" element={<Outlet />}>
              <Route path="crea" element={<CustomerDocumentFrom />} />
              <Route path="modifica/:id" element={<CustomerDocumentFrom />} />
              <Route index element={<CustomerDocumentTableList />} />
            </Route>

            <Route path="fornitori" element={<Outlet />}>
              <Route path="documenti/carico" element={<FromSupplierItemsList />} />
              <Route path="documenti/carico/crea" element={<FromSupplierDocumentFrom />} />
              <Route path="documenti/carico/modifica/:id" element={<FromSupplierDocumentFrom />} />

              <Route path="documenti/scarico" element={<ToSupplierItemsList />} />
              <Route path="documenti/scarico/crea" element={<ToSupplierDocumentFrom />} />
              <Route path="documenti/scarico/modifica/:id" element={<ToSupplierDocumentFrom />} />

              <Route index element={<SupplierTableList />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
