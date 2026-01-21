import { useState,useEffect } from "react";

export function DetailRow({ label, value, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  function handleSave() {
    setIsEditing(false);
    onSave?.(inputValue);
  }

  function handleCancel() {
    setInputValue(value);
    setIsEditing(false);
  }

  


  return (
    <div className="border-b pb-3 flex justify-between items-start gap-4">
      <div className="flex-1">
        <p className="text-sm text-gray-500">{label}</p>

        {!isEditing ? (
          <p className="font-medium">{value}</p>
        ) : (
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="mt-1 w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        )}
      </div>

      <div className="mt-5">
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="text-green-700 text-sm font-medium"
          >
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="text-green-700 text-sm font-medium"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="text-gray-500 text-sm"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
