import { Link } from "react-router-dom";

export const ClassCard = ({ item }) => {
  return (
    <Link to={`/classes/${item.id}/${item.name}`}>
      <div className="p-5 bg-white border border-green-200 shadow-lg rounded-2xl hover:shadow-2xl cursor-pointer transition-all">
        <h3 className="text-2xl font-bold text-green-700">{item.name}</h3>
        <p className="text-gray-600">Class Teacher: {item.teacher_name ? item.teacher_name :"Unknown"}</p>
      </div>
    </Link>
  );
};
