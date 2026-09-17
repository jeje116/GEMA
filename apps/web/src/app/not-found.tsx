import Link from 'next/link';

export default function GlobalNotFound() {
  return (
    <div className="bg-[var(--ivory-50)] min-h-screen flex items-center justify-center pt-20">
      <div className="text-center px-4">
        <h1 className="font-serif text-8xl text-[var(--espresso-900)] mb-4">404</h1>
        <h2 className="font-serif text-2xl text-[var(--espresso-900)] mb-6">Page Not Found</h2>
        <p className="text-[var(--muted)] mb-12 max-w-sm mx-auto">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link 
          href="/en" 
          className="px-8 py-3 bg-[var(--ink)] text-white font-condensed tracking-widest uppercase text-sm hover:bg-[var(--espresso-800)] transition-colors inline-block"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
