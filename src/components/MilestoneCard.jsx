import React from 'react';
import { motion } from 'framer-motion';
import { Share2, CheckCircle, Sparkles } from 'lucide-react';

export default function MilestoneCard({ milestone, isUnlocked, onShare }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 15 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className={`p-6 border rounded-2xl relative overflow-hidden flex flex-col justify-between min-h-[180px] text-left transition-all ${
        isUnlocked
          ? 'bg-[#1A1F2E] border-[rgba(0,217,255,0.3)] shadow-[0_0_15px_rgba(0,217,255,0.1)]'
          : 'bg-[#0F1419]/80 border-zinc-800 opacity-40 hover:opacity-60'
      }`}
    >
      {/* Decorative top gradient glow */}
      {isUnlocked && (
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-cyan-500/10 rounded-full blur-xl pointer-events-none" />
      )}

      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <motion.div
            animate={isUnlocked ? { y: [0, -6, 0] } : {}}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="text-3xl filter drop-shadow-md select-none"
          >
            {milestone.icon || '✨'}
          </motion.div>
          
          {isUnlocked ? (
            <span className="text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-800/40 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Unlocked
            </span>
          ) : (
            <span className="text-[10px] bg-zinc-950 text-zinc-600 px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider">
              Locked
            </span>
          )}
        </div>

        <div>
          <h4 className="text-sm font-extrabold text-white">{milestone.title}</h4>
          <p className="text-xs text-stone-400 mt-1 leading-relaxed">{milestone.description}</p>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-zinc-800/50 flex justify-between items-center">
        <span className="text-[9px] text-stone-500 font-medium">
          {isUnlocked ? `Earned: ${new Date(milestone.unlockedAt || Date.now()).toLocaleDateString()}` : 'Requirement in progress'}
        </span>

        {isUnlocked && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onShare(milestone);
            }}
            className="p-1.5 bg-cyan-950 hover:bg-cyan-900 border border-cyan-800/30 text-cyan-400 rounded-lg flex items-center gap-1 text-[10px] font-bold transition-all"
            title="Share achievement card"
          >
            <Share2 className="w-3 h-3" />
            <span>Share</span>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
