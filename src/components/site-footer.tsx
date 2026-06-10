export function SiteFooter() {
  return (
    <footer className="w-full py-12 md:py-24 border-t border-white/5 bg-surface-container-lowest">
      <div className="max-w-container mx-auto px-6 md:px-16 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col gap-2 text-center md:text-left">
          <img 
            src="/assets/logo.svg" 
            alt="Abdullah Othman"
            className="h-8 w-auto object-contain mb-2 mx-auto md:mx-0"
          />
          <p className="text-xs tracking-[0.1em] font-semibold uppercase text-on-tertiary-fixed-variant max-w-xs font-[var(--font-jetbrains)]">
            © 2026 Abdullah Othman. Built with precision and maintained with intent.
          </p>
        </div>
        <div className="flex gap-8 font-[var(--font-jetbrains)]">
          <a
            href="https://drive.google.com/file/d/1Ry4B7P2Fbh0wayY0T2lw1-3AevRy1H-R/view?usp=drive_link"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs uppercase tracking-[0.1em] font-semibold text-on-tertiary-fixed-variant hover:text-secondary opacity-80 hover:opacity-100 transition-colors"
          >
            CV
          </a>
          <a
            href="https://github.com/Abdullah-Othman0"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs uppercase tracking-[0.1em] font-semibold text-on-tertiary-fixed-variant hover:text-secondary opacity-80 hover:opacity-100 transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/abdullah-i-othman/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs uppercase tracking-[0.1em] font-semibold text-on-tertiary-fixed-variant hover:text-secondary opacity-80 hover:opacity-100 transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/Abdullah-Othman0/portfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs uppercase tracking-[0.1em] font-semibold text-on-tertiary-fixed-variant hover:text-secondary opacity-80 hover:opacity-100 transition-colors"
          >
            Source Code
          </a>
        </div>
      </div>
    </footer>
  );
}
