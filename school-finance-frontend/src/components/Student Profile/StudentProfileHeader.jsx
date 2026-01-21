
export function StudentProfileHeader({ student }) {

   
  return (
    <div className="mt-8 bg-green-700 text-white p-6 rounded-b-3xl flex items-center justify-between">
      <h1 className="text-xl font-semibold">
        {student.personal.full_name}
      </h1>

      {/* Static icon – teacher is viewing student */}
      <div className="w-12 h-12 bg-white text-green-700 rounded-full flex items-center justify-center text-xl">
        👤
      </div>
    </div>
  );
}
