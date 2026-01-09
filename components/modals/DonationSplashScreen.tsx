import React from 'react';

interface DonationSplashScreenProps {
    onClose: () => void;
}

const DonationSplashScreen: React.FC<DonationSplashScreenProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/95 z-[102] flex items-center justify-center p-4 flex-col">
            <div 
                className="bg-orange-50 dark:bg-[#1e0f05] border-2 border-amber-600 rounded-2xl w-full max-w-sm flex flex-col shadow-2xl dark:shadow-amber-900/50 animate-zoom-in"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-4 border-b border-gray-200 dark:border-amber-800 relative">
                    <h2 className="text-xl font-cinzel text-amber-700 dark:text-amber-300 text-center">सेवा समर्पण</h2>
                </div>
                <div className="p-6 text-center">
                    <h3 className="text-gray-800 dark:text-white text-lg font-semibold mb-2">रामोत्सव मिशन का समर्थन करें</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">आपका उदार योगदान हमें रामोत्सव ऐप को बनाए रखने और बेहतर बनाने में मदद करता है, और विभिन्न मंदिर गतिविधियों और सामुदायिक सेवाओं (सेवा) का भी समर्थन करता है। आपकी भक्ति से फर्क पड़ता है। जय श्री राम!</p>
                    <div className="bg-white p-4 rounded-lg inline-block shadow-md">
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=at8322179@oksbi&pn=AmitTripathi" alt="UPI QR" className="w-40 h-40" />
                    </div>
                    <p className="text-amber-600 dark:text-amber-400 font-bold mt-4">at8322179@oksbi</p>
                </div>
            </div>
            <button 
                onClick={onClose} 
                className="mt-8 w-full max-w-sm p-3 bg-amber-500 text-black font-bold rounded-lg"
            >
                Enter the App
            </button>
            <style>{`
                @keyframes zoom-in {
                    from { transform: scale(0.5); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-zoom-in { animation: zoom-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
            `}</style>
        </div>
    );
};

export default DonationSplashScreen;
