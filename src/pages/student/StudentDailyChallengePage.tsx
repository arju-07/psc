import React, { useState } from 'react';
import { mockDailyChallenge } from '../../data/mockData';
import { InteractiveMCQPlayer } from '../../components/mcq/InteractiveMCQPlayer';
import { Flame, Calendar, Award, CheckCircle2, Sparkles } from 'lucide-react';

export const StudentDailyChallengePage: React.FC = () => {
  const challenge = mockDailyChallenge;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Streak Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold">
              <Calendar className="w-3.5 h-3.5" />
              <span>{challenge.date}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {challenge.title}
            </h1>
            <p className="text-xs sm:text-sm text-amber-100 max-w-xl">
              {challenge.description}
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 shrink-0">
            <div className="p-3 bg-amber-400 rounded-xl text-amber-950 font-black">
              <Flame className="w-6 h-6 fill-amber-950 text-amber-950" />
            </div>
            <div>
              <div className="text-xl font-black">0 Days</div>
              <div className="text-[11px] text-amber-100 uppercase tracking-wider font-semibold">
                Start Streak
              </div>
            </div>
          </div>
        </div>

        {/* 7-Day Streak Timeline */}
        <div className="pt-2 border-t border-white/20 flex items-center justify-between gap-2 overflow-x-auto text-xs">
          {['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'].map((day, i) => (
            <div key={day} className="flex flex-col items-center gap-1 min-w-[40px]">
              <span className="text-[10px] text-amber-200">{day}</span>
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                  i === 0
                    ? 'bg-white text-amber-600 ring-2 ring-amber-300 animate-pulse'
                    : 'bg-white/20 text-white/70'
                }`}
              >
                {i === 0 ? '★' : i + 1}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive MCQ Daily Player */}
      <InteractiveMCQPlayer
        questions={challenge.questions}
        title="Today's 5-Question Daily Booster"
        mode="learning"
      />
    </div>
  );
};
