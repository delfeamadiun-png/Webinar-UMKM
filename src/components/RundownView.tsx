import React from 'react';
import { RundownItem } from '../types';
import { Play, Coffee, Flag, Calendar } from 'lucide-react';

interface RundownViewProps {
  rundown?: RundownItem[];
}

export default function RundownView({ rundown }: RundownViewProps) {
  if (!rundown || rundown.length === 0) {
    return (
      <div className="glass border border-white/5 rounded-2xl p-6 text-center shadow-lg font-sans">
        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-500 mb-3">
          <Calendar className="w-6 h-6" />
        </div>
        <h4 className="text-xs font-bold text-slate-350">Rundown Acara Belum Tersedia</h4>
        <p className="text-[10px] text-slate-450 mt-1">Jadwal susunan acara untuk kelas webinar ini sedang dipersiapkan oleh pihak panitia.</p>
      </div>
    );
  }

  // To count only 'session' types for the 01, 02 labels
  let sessionCounter = 0;

  return (
    <div className="space-y-4 font-sans">
      <div className="flex items-center space-x-2">
        <h3 className="text-sm font-bold text-slate-200">Rundown Acara</h3>
      </div>
      
      <div className="relative pl-4 border-l border-white/5 space-y-5 ml-2">
        {rundown.map((item) => {
          let isBreak = item.type === 'break';
          let isStart = item.type === 'start';
          let isEnd = item.type === 'end';
          
          let iconBlock;
          if (isStart) {
            iconBlock = (
              <div className="w-9 h-9 rounded-full bg-orange-600/90 flex items-center justify-center shrink-0 shadow-lg shadow-orange-600/20 text-white">
                <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
              </div>
            );
          } else if (isBreak) {
            iconBlock = (
              <div className="w-9 h-9 rounded-full bg-slate-850 border border-white/10 flex items-center justify-center shrink-0 text-slate-500">
                <Coffee className="w-3.5 h-3.5" />
              </div>
            );
          } else if (isEnd) {
            iconBlock = (
              <div className="w-9 h-9 rounded-full bg-amber-500/15 border border-amber-500/40 flex items-center justify-center shrink-0 text-amber-500">
                <Flag className="w-3.5 h-3.5" />
              </div>
            );
          } else {
            sessionCounter++;
            const numStr = String(sessionCounter).padStart(2, '0');
            iconBlock = (
              <div className="w-9 h-9 rounded-full bg-orange-500/5 border border-orange-500/35 flex items-center justify-center shrink-0 text-orange-500 text-[11px] font-bold font-mono">
                {numStr}
              </div>
            );
          }

          return (
            <div key={item.id} className="relative flex items-start space-x-4">
              {/* Connector line dot */}
              <div className="absolute -left-[21px] top-4 w-2 h-2 rounded-full bg-indigo-500/30 border border-slate-950"></div>
              
              {/* Custom circle icon block */}
              <div className="shrink-0">
                {iconBlock}
              </div>

              {/* Text Agenda Card */}
              <div className={`flex-1 p-3.5 rounded-xl border transition-all ${
                isBreak 
                  ? 'bg-slate-950/20 border-white/5 border-dashed text-slate-500' 
                  : 'bg-slate-900/60 border-white/5 hover:border-white/10 text-slate-100'
              }`}>
                <div className="space-y-0.5">
                  <span className={`block text-[11px] font-bold font-sans ${
                    isBreak ? 'text-slate-500' : 'text-orange-500'
                  }`}>
                    {item.time} {isBreak && <span className="text-[10px] text-slate-600 font-normal italic font-mono">(Istirahat)</span>}
                  </span>
                  <h4 className={`text-xs font-bold leading-normal font-sans ${
                    isBreak ? 'text-slate-450 line-through decoration-slate-700' : 'text-slate-200'
                  }`}>
                    {item.title}
                  </h4>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
