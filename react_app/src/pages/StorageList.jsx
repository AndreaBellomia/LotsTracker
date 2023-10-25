import React, { useEffect, useState } from "react";
import TableComponent from "../components/Tables/TableComponent.jsx";
import StorageArticleModal from "../components/Modals/StorageArticleModal.jsx";

export default function Dashboard() {
    // Modal state
    const [addModalStatusId, setAddModalStatusId] = useState(undefined);
    const [addModalStatus, setAddModalStatus] = useState(false);
    const handleOpen = () => setAddModalStatus(true);
    const handleClose = () => {
        setAddModalStatus(false), setAddModalStatusId(undefined);
    };

    return (
        <>
            <TableComponent
                addModalOpen={handleOpen}
                addModalId={setAddModalStatusId}
                key={addModalStatus}
            />

            <StorageArticleModal
                modalStatus={[addModalStatus, setAddModalStatus]}
                fetchId={[addModalStatusId, setAddModalStatusId]}
            />
        </>
    );
}
