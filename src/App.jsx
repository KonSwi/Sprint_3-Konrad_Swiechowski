import { useState } from "react";
import Form from "./components/Form";
import Modal from "./components/Modal";

const App = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const handleFormSubmit = (data) => {
    setSubmittedData(data);
    setModalOpen(true);
  };

  return (
    <div>
      {modalOpen ? (
        <Modal onClose={() => setModalOpen(false)} data={submittedData} />
      ) : (
        <Form onSubmit={handleFormSubmit} />
      )}
    </div>
  );
};

export default App;
