import React from 'react';

const DailyQuote: React.FC = () => {
    // In a real app, this could come from an API or a list of quotes.
    const quote = {
        text: "धर्म की जय हो, अधर्म का नाश हो, प्राणियों में सद्भावना हो, विश्व का कल्याण हो।",
        author: "सनातन विचार"
    };

    return (
        <div className="bg-gradient-to-tr from-amber-200/40 to-amber-100/30 dark:from-amber-900/40 dark:to-amber-600/30 border border-amber-500/50 rounded-xl p-4 my-4 text-center shadow-lg">
            <p className="text-gray-800 dark:text-white italic">"{quote.text}"</p>
            <p className="text-right text-amber-700 dark:text-amber-300 text-sm mt-2">- {quote.author}</p>
        </div>
    );
};

export default DailyQuote;
