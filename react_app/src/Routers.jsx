import React from "react";
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";

import AsideNavbar from "@/layout/components/AsideNavbar.jsx";

import {
    Dashboard,
    FromSupplierDocument,
    StorageList,
    StorageItemsList,
    CustomerList,
    ManageLott,
    SupplierList,
} from "@/pages";

import CustomerDocumentTableList from "@/pages/Customers/TableListPage.jsx";
import CustomerDocumentFrom from "@/pages/Customers/FormPage.jsx";


export default function Router() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<AsideNavbar />}>
                        <Route index element={<Dashboard />} />
                        <Route path="" element={<FromSupplierDocument />} />
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
                        {/* <Route path="*" element={<Navigate to="api/" />} /> */}
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}
