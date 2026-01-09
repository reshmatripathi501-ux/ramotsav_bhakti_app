import React from 'react';
import { jaapCompletionImageUrl } from '../../image';

const Petal: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
  <div className="absolute top-[-10%] w-4 h-4 bg-yellow-300 rounded-full opacity-70" style={style}></div>
);

const JaapCompletionModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const petals = Array.from({ length: 15 }).map((_, i) => {
    const style = {
      left: `${Math.random() * 100}%`,
      animation: `fall ${5 + Math.random() * 5}s linear ${Math.random() * 5}s infinite`,
    };
    return <Petal key={i} style={style} />;
  });

  return (
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        @keyframes zoom-in-celebrate {
          from { transform: scale(0.5) rotate(-15deg); opacity: 0; }
          to { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        .animate-zoom-in-celebrate {
          animation: zoom-in-celebrate 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>
      <div className="absolute inset-0 overflow-hidden">{petals}</div>
      <div
        className="relative bg-gradient-to-br from-orange-100 to-white dark:from-[#2a1000] dark:to-[#1a0a00] border-2 border-amber-400 rounded-2xl w-full max-w-sm text-center p-6 shadow-2xl shadow-amber-500/50 animate-zoom-in-celebrate"
        onClick={e => e.stopPropagation()}
      >
        <img
          src={jaapCompletionImageUrl}
          alt="Shri Ram"
          className="w-40 h-40 object-cover rounded-full mx-auto border-4 border-amber-300 shadow-lg"
        />
        <h2 className="text-2xl font-cinzel text-amber-600 dark:text-amber-300 mt-4" style={{ textShadow: '0 0 10px #ff9933' }}>
          साधुवाद!
        </h2>
        <p className="text-gray-800 dark:text-white mt-2">आपने १०८ जाप पूर्ण किए।</p>
        <p className="text-amber-700 dark:text-amber-400">जय श्री राम!</p>
        <button
          onClick={onClose}
          className="mt-6 bg-amber-500 text-black font-bold px-8 py-2 rounded-full"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default JaapCompletionModal;
