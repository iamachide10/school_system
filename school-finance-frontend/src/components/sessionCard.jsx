import { ArrowRight, Calendar, DollarSign, Users } from "lucide-react";

export default function SessionCard({ session }) {
  return (
    <div
      className="p-4 bg-white rounded-xl shadow-lg border border-green-200 cursor-pointer hover:shadow-2xl transition"
      onClick={() => {
        window.location.href = `/session/${session.session_id}`;
      }}
    >
      <div className="space-y-3">
        <h2 className="font-bold text-xl text-green-700 flex items-center gap-2">
          {session.name}
        </h2>

        <div className="flex items-center gap-2 text-gray-600">
          <Calendar size={18} />
          <span>{new Date(session.time).toLocaleString()}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <DollarSign size={18} />
          <span>Total: GH₵ {session.total_amount}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <Users size={18} />
          <span>Paid: {session.paid_count}</span>
        </div>

        <button className="w-full bg-green-600 text-white font-semibold py-2 rounded-xl mt-3 hover:bg-green-700 transition flex items-center justify-center gap-2">
          Review Session <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
