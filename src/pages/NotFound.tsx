import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 text-center">
      <div className="space-y-6">
        <h1 className="text-9xl font-extrabold text-indigo-500 tracking-widest">
          404
        </h1>
        <div className="bg-indigo-600 px-2 text-sm rounded rotate-12 absolute -mt-16 ml-36 inline-block font-semibold">
          Page Not Found
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">
            Looks like you're lost
          </h2>
          <p className="text-slate-400 max-w-sm mx-auto">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>
        <div>
          <Link
            to="/"
            className="inline-block rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition-all duration-200 shadow-lg shadow-indigo-600/20"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
