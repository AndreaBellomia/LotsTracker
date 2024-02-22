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


import StorageItemsList from "@/pages/Lotti/TableListPage.jsx";
import ManageLott from "@/pages/Lotti/FormPage.jsx";

import FromSupplierItemsList from "@/pages/FromSupplier/TableListPage.jsx";
import FromSupplierDocumentFrom from "@/pages/FromSupplier/FormPage.jsx";



export default function Router() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<AsideNavbar />}>
                        <Route index element={<Dashboard />} />
                        <Route path="clienti" element={<CustomerList />} />
                        

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

                            <Route index element={<SupplierList />} />
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}
