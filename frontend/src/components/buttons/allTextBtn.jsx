import React from "react";

function AllTextBtn({ children = "전체 내용 보기", onClick, className = "", ...props }) {
  return (
    <button
      className={`
        w-full
        bg-[#0A27E5]
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

export default AllTextBtn;