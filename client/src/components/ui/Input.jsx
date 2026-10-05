const Input = ({ label, error, ...props }) => {
  return (
    <div>
      {label && <label className="block text-sm text-text-muted mb-1">{label}</label>}
      <input
        className="w-full border border-border rounded-lg px-3 py-2.5 text-text transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        {...props}
      />
      {error && <p className="text-xs text-accent-red mt-1">{error}</p>}
    </div>
  );
};

export default Input;