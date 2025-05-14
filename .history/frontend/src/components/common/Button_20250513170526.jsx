import React from 'react';

function Button({ children, onClick, className = '' }) {
  return (
    <button
      className={
        "w-64 py-3 border border-white text-white rounded-sm text-lg font-semibold bg-transparent hover:bg-white/10 transition " +
        className
      }
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button; 