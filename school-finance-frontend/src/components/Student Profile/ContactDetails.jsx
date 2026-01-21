
import BACKEND_URL from "../../utils/backend";
import { DetailRow } from "./DetailRow";
import { useState ,useEffect  } from "react";


export function ContactDetails({ data }) {

  
  const [studentData, setStudentData] = useState(data);
  
  useEffect(() => {
    setStudentData(data);
  }, [data]);

  async function updateStudent(field, value) {
    try {
      const res = await fetch(
          `${BACKEND_URL}/api/student/update/${data.index_number}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            [field]: value
          })
        }
      );

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || "Update failed");
        return;
      }


      setStudentData(result.student);
      window.location.href=`/students/profile/${studentData.index_number}`
    } catch (err) {
      console.error("Update error", err);
      alert("Server error");
    }
  }

  return (
    <div className="space-y-4">
      <DetailRow
        label="Phone"
        value={studentData.phone}
        onSave={(val) => updateStudent("phone", val)}
      />
    </div>
  );
}
