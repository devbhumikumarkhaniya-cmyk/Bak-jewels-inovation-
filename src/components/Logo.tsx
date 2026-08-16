import React from 'react';
import bakLogoImg from '../assets/images/bak_jewels_logo_1786709287105.jpg';

interface LogoProps {
  variant?: 'light' | 'dark' | 'gold';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'light',
  size = 'md',
  showSubtitle = true,
  showText = true,
  className = '',
}) => {
  const iconSizes = {
    sm: { circle: 'w-8 h-8', textTitle: 'text-base sm:text-lg', textSub: 'text-[8px] sm:text-[9px]' },
    md: { circle: 'w-11 h-11 sm:w-12 sm:h-12', textTitle: 'text-xl sm:text-2xl', textSub: 'text-[9px] sm:text-[10px]' },
    lg: { circle: 'w-16 h-16 sm:w-20 sm:h-20', textTitle: 'text-2xl sm:text-3xl', textSub: 'text-xs' },
    xl: { circle: 'w-24 h-24 sm:w-28 sm:h-28', textTitle: 'text-3xl sm:text-4xl', textSub: 'text-xs sm:text-sm' },
  }[size];

  return (
    <div className={`inline-flex items-center gap-3 group select-none cursor-pointer ${className}`}>
      {/* Official 3D Royal Logo Emblem Image */}
      <div className={`relative shrink-0 rounded-full p-[2px] bg-gradient-to-tr from-[#D4AF37] via-[#F3E5AB] to-[#997929] shadow-md group-hover:shadow-[0_0_15px_rgba(212,175,55,0.5)] transition-all duration-500`}>
        <div className={`${iconSizes.circle} rounded-full overflow-hidden bg-black flex items-center justify-center`}>
          <img
            src={bakLogoImg}
            alt="BAK JEWELS Logo"
            className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
          />
        </div>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col text-left">
          <div
            className={`font-cinzel font-bold tracking-[0.2em] uppercase leading-none ${iconSizes.textTitle} text-transparent bg-clip-text bg-gradient-to-r from-[#F9E8B2] via-[#E5C07B] to-[#D4AF37] group-hover:from-white group-hover:to-[#E5C07B] transition-all duration-300`}
          >
            BAK <span className="font-light tracking-[0.25em] text-white">JEWELS</span>
          </div>
          
          {showSubtitle && (
            <div
              className={`font-sans font-medium tracking-[0.35em] uppercase ${iconSizes.textSub} mt-1 text-[#D4AF37]/80 group-hover:text-[#F3E5AB] transition-colors`}
            >
              Haute Joaillerie • Est. 1984
            </div>
          )}
        </div>
      )}
    </div>
  );
};
