import React from 'react';

interface OrnamentDividerProps {
  color?: 'gold' | 'maroon' | 'white';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const OrnamentDivider: React.FC<OrnamentDividerProps> = ({
  color = 'gold',
  className = '',
  size = 'md',
}) => {
  const colorClasses = {
    gold: {
      line: 'bg-gradient-to-r from-transparent via-[#C9A356]/60 to-transparent',
      fill: '#C9A356',
      stroke: '#C9A356',
    },
    maroon: {
      line: 'bg-gradient-to-r from-transparent via-[#5C1A34]/40 to-transparent',
      fill: '#5C1A34',
      stroke: '#5C1A34',
    },
    white: {
      line: 'bg-gradient-to-r from-transparent via-[#F8F1E7]/50 to-transparent',
      fill: '#E4C078',
      stroke: '#E4C078',
    },
  }[color];

  const scale = size === 'sm' ? 'w-24' : size === 'lg' ? 'w-48' : 'w-36';

  return (
    <div className={`flex items-center justify-center gap-2 my-2 ${className}`}>
      <div className={`h-[1px] flex-1 max-w-[50px] ${colorClasses.line}`} />
      
      {/* Central Filigree Lotus / Diamond Emblem */}
      <svg
        width="28"
        height="14"
        viewBox="0 0 28 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 hover:scale-110"
      >
        <path
          d="M14 0L17.5 7L14 14L10.5 7L14 0Z"
          fill={colorClasses.fill}
        />
        <path
          d="M14 3L16 7L14 11L12 7L14 3Z"
          fill="#FFF4D2"
          fillOpacity="0.8"
        />
        <path
          d="M7 7C8.5 4.5 11 5 11 5C11 5 9.5 8 7 7Z"
          fill={colorClasses.fill}
        />
        <path
          d="M21 7C19.5 4.5 17 5 17 5C17 5 18.5 8 21 7Z"
          fill={colorClasses.fill}
        />
        <circle cx="2" cy="7" r="1.2" fill={colorClasses.fill} />
        <circle cx="26" cy="7" r="1.2" fill={colorClasses.fill} />
      </svg>

      <div className={`h-[1px] flex-1 max-w-[50px] ${colorClasses.line}`} />
    </div>
  );
};
