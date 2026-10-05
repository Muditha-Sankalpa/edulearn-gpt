const Input = ({ label, error, icon: Icon, rightElement, ...props }) => {
  return (
    <div>
      {label && <label className="block text-sm text-text-muted mb-1">{label}</label>}
      <div className="relative">
        {Icon && <Icon className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />}
        <input
          className={`w-full border border-border rounded-lg py-2.5 text-text transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
            Icon ? "pl-10" : "pl-3"
          } ${rightElement ? "pr-10" : "pr-3"}`}
          {...props}
        />
        {rightElement && <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>}
      </div>
      {error && <p className="text-xs text-accent-red mt-1">{error}</p>}
    </div>
  );
};

export default Input;
