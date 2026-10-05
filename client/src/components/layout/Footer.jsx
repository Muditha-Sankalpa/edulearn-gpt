const Footer = () => (
  <footer className="border-t border-border/60 mt-16">
    <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-text-muted">
      <p>
        Edu<span className="text-primary font-medium">Learn</span> · © {new Date().getFullYear()}
      </p>
      <p>Built with the MERN stack and OpenAI</p>
    </div>
  </footer>
);

export default Footer;
