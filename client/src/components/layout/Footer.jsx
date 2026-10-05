const Footer = () => (
  <footer className="mt-16" style={{ backgroundColor: "#3D348B" }}>
    <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-white/70">
      <p>
        Edu<span className="text-accent-yellow font-medium">Learn</span> · © {new Date().getFullYear()}
      </p>
      <p>Built with the MERN stack and OpenAI</p>
    </div>
  </footer>
);

export default Footer;
