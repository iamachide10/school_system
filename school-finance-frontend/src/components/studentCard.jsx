import { Link } from "react-router-dom";
import { User } from "lucide-react"; // nice avatar icon

export const StudentCard = ({ student }) => {
  return (
    <Link to={`/students/profile/${student.student_code}`}>
      <div className="p-5 bg-white border border-green-200 shadow-lg rounded-2xl hover:shadow-2xl cursor-pointer transition-all flex items-center gap-4">
        
        {/* Avatar Icon */}
        <div className="w-14 h-14 bg-green-100 text-green-700 rounded-full flex items-center justify-center">
          <User size={32} />
        </div>

        {/* Student info */}
        <div>
          <h3 className="text-xl font-bold text-green-700">
            {student.full_name}
          </h3>
          <p className="text-gray-600 text-sm">ID: {student.student_code}</p>
        </div>

      </div>
    </Link>
  );
};
