import React from 'react';

const StatsCard = ({ title, value, icon, color = 'blue', trend, subtitle, percentage }) => {
  const colorClasses = {
    blue: {
      bg: 'from-white to-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-600',
      iconBg: 'bg-blue-100'
    },
    yellow: {
      bg: 'from-white to-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-600',
      iconBg: 'bg-yellow-100'
    },
    green: {
      bg: 'from-white to-green-50',
      border: 'border-green-200',
      text: 'text-green-600',
      iconBg: 'bg-green-100'
    },
    purple: {
      bg: 'from-white to-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-600',
      iconBg: 'bg-purple-100'
    },
    red: {
      bg: 'from-white to-red-50',
      border: 'border-red-200',
      text: 'text-red-600',
      iconBg: 'bg-red-100'
    }
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <div className={`card bg-gradient-to-br ${colors.bg} border-2 ${colors.border} hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold text-text-secondary mb-2">{title}</p>
          <p className={`text-4xl font-black ${colors.text} mb-1`}>{value}</p>
          {subtitle && (
            <p className="text-xs text-text-secondary mt-1">{subtitle}</p>
          )}
          {trend && (
            <p className="text-xs text-green-600 font-semibold mt-2 flex items-center">
              <span className="mr-1">↗</span> {trend}
            </p>
          )}
          {percentage && (
            <p className="text-sm text-text-secondary mt-1">
              {percentage}% of total
            </p>
          )}
        </div>
        <div className={`${colors.iconBg} w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-md`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
