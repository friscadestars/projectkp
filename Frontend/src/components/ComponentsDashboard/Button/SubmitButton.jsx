// src/Components/Button/SubmitButton.jsx
import React from "react";

const SubmitButton = ({ onClick }) => (
    <div className="text-center mt-4">
        <button
            onClick={onClick}
            className="bg-blue-900 text-white px-6 py-2 rounded font-bold text-sm"
        >
            Submit
        </button>
    </div>
);

export default SubmitButton;
