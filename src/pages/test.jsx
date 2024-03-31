import React, { useState } from 'react';

const ExampleModal = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  return (
    <div>
      aaa
    </div>
  );
};

export default ExampleModal;
