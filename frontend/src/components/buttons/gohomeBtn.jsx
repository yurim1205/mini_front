import React from "react";

function GoHomeBtn({ children = "홈으로 가기", onClick, className = "", ...props }) {
  return (
    <button
      className={`
        w-full
        bg-[#0E7EDA]
        hover:bg-blue-700
        text-white
        font-bold
        py-3
        rounded-xl
        shadow-xl
        text-2xl
        transition
        mt-20
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}

export default GoHomeBtn;