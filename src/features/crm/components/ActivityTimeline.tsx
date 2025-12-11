import React from 'react';

export function ActivityTimeline() {
    return (
        <div className="bg-[#1B1B1B] border border-white/10 rounded-lg p-4 h-full">
            <h3 className="text-sm font-semibold text-white mb-4">Timeline</h3>
            <div className="space-y-4">
                <div className="text-sm text-gray-400">
                    <p>Today, 10:15</p>
                    <p className="text-white">Quote v2 sent by Maria</p>
                </div>
                <div className="text-sm text-gray-400">
                    <p>Dec 8, 14:30</p>
                    <p className="text-white">Stage changed Qual → Quote</p>
                </div>
            </div>
        </div>
    );
}
