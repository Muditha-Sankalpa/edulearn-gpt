const PageHeader = ({ icon: Icon, title, subtitle, action }) => (
  <div className="flex items-start justify-between gap-4 mb-8">
    <div className="flex items-center gap-4">
      {Icon && (
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
          style={{ background: "linear-gradient(135deg, #7678ED, #3D348B)" }}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
      )}
      <div>
        <h1 className="text-2xl font-bold text-text tracking-tight">{title}</h1>
        {subtitle && <p className="text-text-muted text-sm mt-0.5">{subtitle}</p>}
      </div>
    </div>
    {action}
  </div>
);

export default PageHeader;
