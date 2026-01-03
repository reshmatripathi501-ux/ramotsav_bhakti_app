
import React from 'react';

interface DonateModalProps {
    onClose: () => void;
}

const DonateModal: React.FC<DonateModalProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div 
                className="bg-[#1e0f05] border-2 border-amber-600 rounded-2xl w-full max-w-sm flex flex-col shadow-2xl shadow-amber-900/50 animate-zoom-in"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-4 border-b border-amber-800 relative">
                    <h2 className="text-xl font-cinzel text-amber-300 text-center">Sewa Samarpan</h2>
                    <button onClick={onClose} className="absolute right-4 top-1/2 -translate-y-1/2 text-3xl text-gray-400">&times;</button>
                </div>
                <div className="p-6 text-center">
                    <h3 className="text-white text-lg font-semibold mb-2">Temple Construction & App Support</h3>
                    <p className="text-gray-400 text-sm mb-4">Scan QR to donate via UPI</p>
                    <div className="bg-white p-4 rounded-lg inline-block shadow-md">
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=at8322179@oksbi&pn=AmitTripathi" alt="UPI QR" className="w-40 h-40" />
                    </div>
                    <p className="text-amber-400 font-bold mt-4">at8322179@oksbi</p>
                    <p className="text-white text-xs">Amit Tripathi</p>
                    <button className="mt-4 bg-amber-400 text-black font-bold py-2 px-6 rounded-full text-sm flex items-center justify-center gap-2 mx-auto" onClick={() => navigator.clipboard.writeText('at8322179@oksbi').then(() => alert('UPI ID Copied!'))}>
                        <i className="fas fa-copy"></i> Copy UPI ID
                    </button>
                </div>
            </div>
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

export default DonateModal;
