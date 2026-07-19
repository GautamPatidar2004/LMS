import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Star, MessageSquare } from 'lucide-react';

export default function ReviewsTab() {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const reviews = [
    { name: 'Ankit Kumar', course: 'React Masterclass', rating: 5, comment: 'Amazing course! Very well explained.', date: '2 days ago' },
    { name: 'Priya Sharma', course: 'React Masterclass', rating: 5, comment: 'Great examples and projects.', date: '5 days ago' },
    { name: 'Mohit Jain', course: 'Node.js Bootcamp', rating: 4, comment: 'Good content but audio quality can be improved.', date: '1 week ago' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <span className={`text-[10px] font-bold uppercase tracking-wider block ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
          Feedback
        </span>
        <h1 className={`text-xl md:text-2xl font-black tracking-tight ${isLight ? 'text-slate-800' : 'text-white'}`}>
          Recent Reviews
        </h1>
      </div>

      <div className="space-y-4">
        {reviews.map((r, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-2xl border space-y-3 hover:shadow-sm transition-all ${
              isLight ? 'bg-white border-slate-100' : 'bg-[#0f111a]/40 border-slate-850/80 text-white'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xs font-black text-slate-800 dark:text-slate-200">{r.name}</h3>
                <span className={`text-[9px] font-bold block mt-0.5 ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                  {r.course}
                </span>
              </div>
              <span className="text-[10px] text-slate-405 font-bold">{r.date}</span>
            </div>

            {/* Stars */}
            <div className="flex items-center gap-0.5 text-amber-500">
              {Array.from({ length: r.rating }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-amber-500" />
              ))}
              {Array.from({ length: 5 - r.rating }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 text-slate-250 dark:text-slate-800" />
              ))}
            </div>

            <p className={`text-xs leading-relaxed font-semibold ${isLight ? 'text-slate-650' : 'text-slate-350'}`}>
              "{r.comment}"
            </p>

            <button className="flex items-center gap-1.5 text-[10px] font-black text-violet-500 hover:text-violet-600 pt-1">
              <MessageSquare className="h-3 w-3" />
              Reply to review
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
