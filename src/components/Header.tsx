import Image from 'next/image';

// Static — no client interactivity needed.

const LOGO = `   _____      ________                  
  / ___/     /  _/ / /_  ____ _____ ___ 
  \\__ \\      / // / __ \\/ __ \`/ __ \`__ \\
 ___/ /    _/ // / / / / /_/ / / / / / /
/____(_)  /___/_/_/ /_/\\__,_/_/ /_/ /_/ `;

const PROFILE = [
  { label: 'Name', value: 'Shakil Ilham' },
  { label: 'Location', value: 'Sri Lanka' },
  { label: 'Desig.', value: 'Full Stack Dev' },
  { label: 'Edu', value: 'BSc (Hons) AI' },
] as const;

export function Header() {
  return (
    <header className="flex items-start justify-between px-4 pt-4 pb-3">
      {/* ── Mobile: ASCII art image logo ── */}
      <div className="md:hidden flex items-center">
        <Image
          src="/ascii-art-text.png"
          alt="S Ilham logo"
          width={160}
          height={80}
          className="select-none"
          priority
        />
      </div>

      {/* ── Desktop: ASCII art logo ── */}
      <pre
        aria-label="S Ilham logo"
        className="hidden md:block text-gray-200 text-xs leading-[1.35] select-none shrink-0"
      >
        {LOGO}
      </pre>

      {/* ── Profile info — desktop only ── */}
      <div className="hidden md:flex flex-col gap-0.5 ml-8 mt-1 shrink-0">
        {PROFILE.map(({ label, value }) => (
          <div key={label} className="flex gap-3 text-sm">
            <span className="text-gray-400 w-16 shrink-0">{label}</span>
            <span className="text-gray-200">{value}</span>
          </div>
        ))}
      </div>

      {/* ── Spacer ── */}
      <div className="flex-1" />

      {/* ── GitHub link — desktop only ── */}
      <a
        href="https://github.com/shakilham"
        target="_blank"
        rel="noopener noreferrer"
        className="hidden md:flex items-center gap-1.5 text-sm text-gray-200 border border-gray-600 px-3 py-1 mt-1
                   hover:bg-gray-200 hover:text-black transition-colors duration-100"
      >
        {/* Octocat-outline SVG icon */}
        <svg
          viewBox="0 0 16 16"
          width="14"
          height="14"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38
                   0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13
                   -.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87
                   2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95
                   0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21
                   2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04
                   2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82
                   2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48
                   0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
        </svg>
        Github
      </a>
    </header>
  );
}
