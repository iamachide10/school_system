export default function ActionCard({
  title,
  icon,
  onClick,
  disabled = false,
  helperText,
}) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`rounded-2xl p-6 text-left border transition
        ${
          disabled
            ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-green-50 border-green-200 hover:bg-green-100"
        }`}
    >
      <div className="text-2xl mb-2">{icon}</div>
      <p className="font-medium">{title}</p>

      {disabled && helperText && (
        <p className="text-xs mt-1 text-gray-500">{helperText}</p>
      )}
    </button>
  );
}
