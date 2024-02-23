import React, { useEffect, useState } from 'react';

import SupplierTable from './components/SupplierTable.jsx';
import SupplierList from './components/SupplierList.jsx';

export default function Dashboard() {
  const [addModalStatusId, setAddModalStatusId] = useState(undefined);
  const [addModalStatus, setAddModalStatus] = useState(false);
  const handleOpen = () => setAddModalStatus(true);
  const handleClose = () => {
    setAddModalStatus(false), setAddModalStatusId(undefined);
  };

  return (
    <>
      <SupplierTable addModalOpen={handleOpen} addModalId={setAddModalStatusId} key={addModalStatus} />
      <SupplierList
        modalStatus={[addModalStatus, setAddModalStatus]}
        fetchId={[addModalStatusId, setAddModalStatusId]}
      />
    </>
  );
}
