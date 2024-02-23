import React, { useEffect, useState } from 'react';

import CustomerTable from './components/CustomerTable.jsx';
import CustomerManagementModal from './components/CustomerManagementModal.jsx';

export default function Dashboard() {
  const [addModalStatusId, setAddModalStatusId] = useState(undefined);
  const [addModalStatus, setAddModalStatus] = useState(false);
  const handleOpen = () => setAddModalStatus(true);
  const handleClose = () => {
    setAddModalStatus(false), setAddModalStatusId(undefined);
  };

  return (
    <>
      <CustomerTable addModalOpen={handleOpen} addModalId={setAddModalStatusId} key={addModalStatus} />
      <CustomerManagementModal
        modalStatus={[addModalStatus, setAddModalStatus]}
        fetchId={[addModalStatusId, setAddModalStatusId]}
      />
    </>
  );
}
