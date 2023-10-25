import React from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

import AsideNavbar from "./layout/components/AsideNavbar.jsx";

import {
    Dashboard,
    FromSupplierDocument,
    StorageList,
    StorageItemsList,
    DocumentCustomerTable,
    CustomerList,
    ManageLott,
    SupplierList
} from "./pages";

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<AsideNavbar />}>
                    <Route index element={<Dashboard />} />
                    <Route path="document" element={<FromSupplierDocument />} />
                    <Route path="clienti" element={<CustomerList />} />
                    <Route path="fornitori" element={<SupplierList />} />

                    <Route path="documenti" element={<DocumentCustomerTable />} />

                    <Route path="magazzino" element={<StorageList />} />
                    <Route path="lotti" element={<Outlet />}>
                        <Route path="crea" element={<ManageLott />} />
                        <Route path="modifica/:id" element={<ManageLott />} />
                        <Route index element={<StorageItemsList />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
