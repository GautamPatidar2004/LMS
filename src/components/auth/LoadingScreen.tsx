import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({ message = 'Verifying session...' }: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 bg-slate-50 z-50 flex items-center justify-center">
      <div className="text-center space-y-3">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mx-auto" />
        <p className="text-sm text-slate-500 font-semibold">{message}</p>
      </div>
    </div>
  );
}
