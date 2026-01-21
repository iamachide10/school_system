import { useState } from "react";
import BACKEND_URL from "../../utils/backend";

export function PersonalDetails({ data }) {

  
  const [fullName, setFullName] = useState(data.full_name);
  const [fees, setFees] = useState(data.default_fees);

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingFees, setIsEditingFees] = useState(false);

  async function updateStudent(field, value) {
  
    
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/student/update/${data.index_number}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            [field]: value,
          }),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || "Update failed");
        return false;
      }

  
      setFullName(result.student.full_name);
      setFees(result.student.default_fees);
     window.location.href=`/students/profile/${data.index_number}`

      return true;
    } catch (err) {
      console.error("Update error:", err);
      alert("Server error");
      return false;
    }
  }


  async function saveName() {
    if (fullName === data.full_name) {
      setIsEditingName(false);
      return;
    }

    const success = await updateStudent("full_name", fullName);
    if (success) setIsEditingName(false);
  }

  async function saveFees() {
    if (fees === data.default_fees) {
      setIsEditingFees(false);
      return;
    }

    const success = await updateStudent("default_fees", fees);
    if (success) setIsEditingFees(false);
  }

  return (
    <div className="space-y-6">
      {/* INDEX NUMBER */}
      <div className="border-b pb-2">
        <p className="text-sm text-gray-500">Index Number</p>
        <p className="font-medium">{data.index_number}</p>
      </div>

      <div className="border-b pb-3">
        <p className="text-sm text-gray-500">Full Name</p>

        {!isEditingName ? (
          <div className="flex justify-between items-center">
            <p className="font-medium">{fullName}</p>
            <button
              onClick={() => setIsEditingName(true)}
              className="text-sm text-green-700 font-medium"
            >
              Edit
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            />

            <div className="flex gap-3">
              <button
                onClick={saveName}
                className="px-4 py-2 bg-green-700 text-white rounded-md text-sm"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setFullName(data.full_name);
                  setIsEditingName(false);
                }}
                className="px-4 py-2 text-sm text-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

  
      <div className="border-b pb-4">
        <p className="text-sm text-gray-500 mb-2">Default Fees</p>

        {!isEditingFees ? (
          <div className="flex justify-between items-center">
            <p className="font-medium">{fees}</p>
            <button
              onClick={() => setIsEditingFees(true)}
              className="text-sm text-green-700 font-medium"
            >
              Edit
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex gap-3">
              {[5, 11].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setFees(amount)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium
                    ${
                      fees === amount
                        ? "bg-green-700 text-white border-green-700"
                        : "bg-white text-green-700 border-green-300"
                    }`}
                >
                  {amount}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={saveFees}
                className="px-4 py-2 bg-green-700 text-white rounded-md text-sm"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setFees(data.default_fees);
                  setIsEditingFees(false);
                }}
                className="px-4 py-2 text-sm text-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
