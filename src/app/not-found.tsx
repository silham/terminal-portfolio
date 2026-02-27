import Link from 'next/link';
import Image from 'next/image';
import { PortfolioShell } from '@/components/PortfolioShell';

export default function NotFound() {
  return (
    <PortfolioShell>
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center select-none">

        {/* 404 art image */}
        <div className="mb-10 w-full max-w-2xl px-4">
          <Image
            src="/404-art.png"
            alt="404"
            width={900}
            height={200}
            className="w-full h-auto"
            priority
          />
        </div>

        {/* Subtitle */}
        <p className="text-gray-400 text-sm mb-1">Nothing happens here</p>
        <p className="text-gray-400 text-sm mb-6">
          But there is something neat over there:
        </p>

        {/* Navigation links */}
        <p className="text-sm space-x-1">
          <Link
            href="/"
            className="text-gray-200 border border-gray-700 px-1.5 py-0 hover:bg-gray-200 hover:text-black transition-colors"
          >
            [my posts]
          </Link>
          <Link
            href="/projects"
            className="text-gray-200 border border-gray-700 px-1.5 py-0 hover:bg-gray-200 hover:text-black transition-colors"
          >
            [projects]
          </Link>
          <Link
            href="/about"
            className="text-gray-200 border border-gray-700 px-1.5 py-0 hover:bg-gray-200 hover:text-black transition-colors"
          >
            [about]
          </Link>
        </p>
      </div>
    </PortfolioShell>
  );
}
