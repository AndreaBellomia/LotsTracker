import React from "react";
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";

import AsideNavbar from "@/layout/components/AsideNavbar.jsx";

import {
    Dashboard,
    StorageList,
    CustomerList,
    SupplierList,
} from "@/pages";

import CustomerDocumentTableList from "@/pages/Customers/TableListPage.jsx";
import CustomerDocumentFrom from "@/pages/Customers/FormPage.jsx";


import ManageLott from "@/pages/Lotti/FormPage.jsx";
import StorageItemsList from "@/pages/Lotti/TableListPage.jsx";


export default function Router() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<AsideNavbar />}>
                        <Route index element={<Dashboard />} />
                        <Route path="clienti" element={<CustomerList />} />
                        <Route path="fornitori" element={<SupplierList />} />

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
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}
