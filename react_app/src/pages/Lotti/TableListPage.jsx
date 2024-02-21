import React, { useState } from 'react';

import TableItemsComponent from './components/TableList.jsx';

export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);

  return (
    <>
      <TableItemsComponent addModalOpen={handleOpen} key={open} />
    </>
  );
}
