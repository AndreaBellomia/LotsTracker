import React, { useEffect, useState } from "react";

import CustomerTable from "../components/Tables/CustomerTable.jsx";
import CustomerList from "../components/Modals/CustomerList.jsx";

export default function Dashboard() {
    const [addModalStatusId, setAddModalStatusId] = useState(undefined);
    const [addModalStatus, setAddModalStatus] = useState(false);
    const handleOpen = () => setAddModalStatus(true);
    const handleClose = () => {
        setAddModalStatus(false), setAddModalStatusId(undefined);
    };

    return (
        <>
            <CustomerTable
                addModalOpen={handleOpen}
                addModalId={setAddModalStatusId}
                key={addModalStatus}
            />
            <CustomerList
                modalStatus={[addModalStatus, setAddModalStatus]}
                fetchId={[addModalStatusId, setAddModalStatusId]}
            />
        </>
    );
}
