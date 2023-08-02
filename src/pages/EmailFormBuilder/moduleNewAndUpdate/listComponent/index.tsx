import React from "react";

interface IEFBList {
  label: string;
  icon: string;
};

const EFBList: React.FC<IEFBList> = ({
  label,
  icon,
}) => {
  return (
    <div className="min-h-[65px] flex flex-row justify-between items-center py-2 px-4 bg-light-purple-2 rounded-xl">
      <p className="font-bold text-sm">{label}</p>
      <div className="w-[28px] h-[28px] flex justify-center items-center">
        <img src={`data:image/svg+xml;base64,${icon}`} />
      </div>
    </div>
  )
};

export default EFBList;
