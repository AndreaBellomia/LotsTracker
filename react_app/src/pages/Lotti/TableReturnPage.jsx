import React, { useState } from 'react';

import TableItemsComponent from './components/TableReturn.jsx';

export default function () {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);

  return (
    <>
      <TableItemsComponent addModalOpen={handleOpen} key={open} />
    </>
  );
}
