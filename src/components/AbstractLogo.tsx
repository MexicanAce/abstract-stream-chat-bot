import React from 'react';

interface AbstractLogoProps {
  className?: string;
}

export function AbstractLogo({ className = '' }: AbstractLogoProps) {
  return (
    <svg 
      viewBox="0 0 24 22" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M15.821 14.984L20.642 19.759L18.38 21.999L13.56 17.225C13.146 16.815 12.602 16.592 12.015 16.592C11.429 16.592 10.884 16.815 10.471 17.225L5.651 21.999L3.389 19.759L8.209 14.984H15.818H15.821Z" fill="currentColor" />
      <path d="M16.626 13.608L23.209 15.353L24.036 12.29L17.453 10.545C16.889 10.396 16.42 10.038 16.127 9.536C15.834 9.037 15.758 8.453 15.909 7.895L17.671 1.374L14.579 0.556L12.816 7.076L16.623 13.604L16.626 13.608Z" fill="currentColor" />
      <path d="M7.409 13.608L0.827 15.353L0 12.29L6.583 10.545C7.146 10.396 7.616 10.038 7.909 9.536C8.202 9.037 8.277 8.453 8.127 7.895L6.365 1.374L9.457 0.556L11.219 7.076L7.413 13.604L7.409 13.608Z" fill="currentColor" />
    </svg>
  );
}