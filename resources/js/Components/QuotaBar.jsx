import React from 'react';

export default function QuotaBar({ used = 0, limit = 10 }) {
    const percentage = limit > 0 ? Math.min((used / limit) * 100, 100) : 0;
    const isWarning = percentage >= 80;
    const isDanger = percentage >= 95;

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                    Crédits utilisés
                </span>
                <span className={`text-sm font-medium ${
                    isDanger ? 'text-red-600' : isWarning ? 'text-yellow-600' : 'text-gray-700 dark:text-gray-300'
                }`}>
                    {used} / {limit}
                </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                        isDanger
                            ? 'bg-red-500'
                            : isWarning
                            ? 'bg-yellow-500'
                            : 'bg-blue-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}