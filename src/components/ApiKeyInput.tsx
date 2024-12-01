import React, { useState } from "react";
import { FaCog } from "react-icons/fa";

const ApiKeyInput: React.FC = () => {
  const [apiKey, setApiKey] = useState(localStorage.getItem("apiKey") || "");
  const [showInput, setShowInput] = useState(apiKey === "");

  const handleSave = () => {
    localStorage.setItem("apiKey", apiKey);
    setShowInput(false);
  };

  return (
    <>
      {!showInput && (
        <button onClick={() => setShowInput(!showInput)}>
          <FaCog size={24} />
        </button>
      )}
      {showInput && (
        <div className="p-2 bg-white border rounded shadow-lg">
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="border p-1"
            placeholder="Enter API Key"
          />
          <button
            onClick={handleSave}
            className="ml-2 p-1 bg-blue-500 text-white rounded"
          >
            Save
          </button>
        </div>
      )}
    </>
  );
};

export default ApiKeyInput;
