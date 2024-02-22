import React, { useEffect, useState } from "react";
import MainTableList from "./components/MainTableList.jsx";
import CreateArticleModal from "./components/CreateArticleModal.jsx";

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
            <MainTableList
                addModalOpen={handleOpen}
                addModalId={setAddModalStatusId}
                key={addModalStatus}
            />

            <CreateArticleModal
                modalStatus={[addModalStatus, setAddModalStatus]}
                fetchId={[addModalStatusId, setAddModalStatusId]}
            />
        </>
    );
}
