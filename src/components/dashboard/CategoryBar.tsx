import React from 'react';
import { CategoryBarProps } from '../../types';

const CategoryBar = React.memo(({ icon: Icon, color, name, value, target }: CategoryBarProps) => {
    const isOver = value > target;
    const percentage = Math.min((value/target)*100, 100);
    
    return (
        <div role="group" aria-labelledby={`cat-label-${name}`}>
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <div aria-hidden="true" className={`p-1.5 rounded-lg text-white ${color}`}><Icon className="w-4 h-4" /></div>
                    <span id={`cat-label-${name}`} className="text-sm font-bold text-gray-700">{name}</span>
                </div>
                <div className="text-sm font-bold text-gray-900" aria-label={`${value} of ${target} kilograms`}>
                    {value} <span className="text-gray-500 font-medium">/ {target} kg</span>
                </div>
            </div>
            <div 
                className="w-full bg-gray-100 rounded-full h-3 overflow-hidden"
                role="progressbar"
                aria-valuenow={value}
                aria-valuemin={0}
                aria-valuemax={target}
                aria-label={`${name} carbon emissions progress`}
            >
                <div 
                    className={`h-full rounded-full transition-all duration-1000 ${isOver ? 'bg-red-600' : color}`} 
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
});

CategoryBar.displayName = 'CategoryBar';

export default CategoryBar;
