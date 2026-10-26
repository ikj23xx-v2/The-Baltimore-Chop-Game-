import React from 'react';

export interface HobbyBoxProps {
  series?: string;
  brand?: string;
  edition?: string;
  type?: string;
  imgSrc?: string;
  className?: string;
  onClick?: () => void;
}

export const HobbyBox: React.FC<HobbyBoxProps> = ({ 
  series = "1992 SERIES 1", 
  brand = "CHOP", 
  edition = "STADIUM CLUB", 
  type = "HOBBY BOX",
  imgSrc = "/assets/boxes/chop-stadium-club-box.png",
  className = "",
  onClick
}) => {
  return (
    <div 
      className={`hobby-box-wrapper ${className}`}
      onClick={onClick}
    >
      <img 
        src={imgSrc} 
        alt={`${brand} ${edition} ${type} - ${series}`}
        className="retro-pixel-box"
      />
    </div>
  );
};
