'use client';

import { useShell } from '@/context/ShellContext';

const SOCIALS: { label: string; handle: string; note: string }[] = [
  { label: 'Twitter:', handle: '@xavortm',     note: 'I post rarely' },
  { label: 'Discord:', handle: '@xavortm',     note: 'Best place to be' },
  { label: 'Twitch:',  handle: 'WindFleuret',  note: 'Live right now' },
];

export function AboutView() {
  const { openEmail, openHelp } = useShell();
  const downloadCv = () => {
    const a = document.createElement('a');
    a.href = '/cv.pdf';
    a.download = 'cv.pdf';
    a.click();
  };

  return (
    <div className="flex flex-1 items-center justify-center overflow-y-auto no-scrollbar px-6 py-8">
      <div className="text-sm leading-relaxed text-gray-300 space-y-6 w-full max-w-lg">

        {/* Version heading */}
        <div className="text-center space-y-0.5">
          <p className="text-gray-400">About page v0.0.1</p>
          <p className="text-gray-500">Me on the web</p>
        </div>

        {/* Social links */}
        <div className="space-y-1">
          {SOCIALS.map(({ label, handle, note }) => (
            <div key={label} className="flex gap-3">
              <span className="text-gray-500 w-20 shrink-0">{label}</span>
              <span className="text-gray-200 w-32 shrink-0">{handle}</span>
              <span className="text-gray-600">{note}</span>
            </div>
          ))}
        </div>

        {/* Commands */}
        <div className="space-y-1">
          <p className="text-gray-400 mb-2">Commands about the site</p>

          <div className="flex gap-3 items-baseline">
            <button
              onClick={openEmail}
              className="text-gray-300 hover:text-white focus:outline-none cursor-pointer w-44 shrink-0 text-left"
            >
              type :email&lt;enter&gt;
            </button>
            <span className="text-gray-600">To send an email</span>
          </div>

          <div className="flex gap-3 items-baseline">
            <button
              onClick={openHelp}
              className="text-gray-300 hover:text-white focus:outline-none cursor-pointer w-44 shrink-0 text-left"
            >
              type :help&lt;enter&gt;
            </button>
            <span className="text-gray-600">For the help modal</span>
          </div>

          <div className="flex gap-3 items-baseline">
            <button
              onClick={downloadCv}
              className="text-gray-300 hover:text-white focus:outline-none cursor-pointer w-44 shrink-0 text-left"
            >
              type :cv&lt;enter&gt;
            </button>
            <span className="text-gray-600">To download my CV</span>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-gray-700">Inspired by Neovim</p>
      </div>
    </div>
  );
}
