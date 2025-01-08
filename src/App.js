import React, { useState } from "react";
import Modal from "react-modal";
import products from "./data.json";

const App = () => {
  const [selectedRange, setSelectedRange] = useState("");
  const [selectedWatch, setSelectedWatch] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const watches = products;

  const filteredWatches =
    selectedRange === ""
      ? watches
      : watches.filter((watch) => {
          const [min, max] = selectedRange.split("-");
          return watch.price >= parseInt(min) && watch.price <= parseInt(max);
        });

  const openModal = (watch) => {
    setSelectedWatch(watch);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handlePayment = () => {
    if (!window.Razorpay) {
      alert("Razorpay SDK is not loaded.");
      return;
    }
    const options = {
      key: "rzp_test_m4MFJaMZITnPc6",
      amount: selectedWatch.price * 100, // in paise
      currency: "INR",
      name: selectedWatch.name,
      description: "Watch Purchase",
      handler: function (response) {
        alert(`Payment Successful. Payment ID: ${response.razorpay_payment_id}`);
      },
      prefill: {
        name: "Your Name",
        email: "your.email@example.com",
        contact: "9876543210",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Watch Store</h1>
      <div className="mb-4">
        <label className="font-semibold mr-2">Select Cost Range:</label>
        <select
          className="border rounded px-3 py-2"
          onChange={(e) => setSelectedRange(e.target.value)}
        >
          <option value="">All</option>
          <option value="0-3000">₹0 - ₹3000</option>
          <option value="3000-6000">₹3000 - ₹6000</option>
          <option value="6000-10000">₹6000 - ₹10000</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 place-items-center">
        {filteredWatches.map((watch) => (
          <div
            key={watch.id}
            className="border rounded shadow-lg p-4 cursor-pointer w-56"
            onClick={() => openModal(watch)}
          >
            <img src={watch.image} alt={watch.name} className="w-full h-56 rounded object-cover mb-2" />
            <h2 className="text-lg font-bold">{watch.name}</h2>
            <p className="text-gray-900 font-medium">Price: ₹{watch.price}</p>
            <p className="text-gray-600">{watch.description}</p>
          </div>
        ))}
      </div>
      {selectedWatch && (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Watch Details"
          className="bg-white rounded-lg shadow-xl max-w-md mx-auto p-4" 
        >
          <button
            className="text-red-500 font-bold mb-4"
            onClick={closeModal}
          >
            Close
          </button>
          <div className="flex gap-2">
            <img
              src={selectedWatch.image}
              alt={selectedWatch.name}
              className="w-1/2 h-52 object-cover rounded"
            />
            <div className="ml-4">
              <h2 className="text-xl font-bold">{selectedWatch.name}</h2>
              <p className="text-gray-600">Price: ₹{selectedWatch.price}</p>
              <p className="text-gray-700 mt-2">{selectedWatch.description}</p>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                onClick={handlePayment}
              >
                Buy Now
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default App;
