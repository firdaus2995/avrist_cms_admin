import React from "react";

interface ISubmitterEmail {
  name: string;
  placeholder: string;
  isActive: boolean;
  onClick: () => void;
}

const SubmitterEmail: React.FC<ISubmitterEmail> = ({
  name,
  placeholder,
  isActive,
  onClick,
}) => {
  return (
    <div 
      className={`flex flex-col py-4 px-4 bg-lumut rounded-xl gap-2 border-[1px] ${isActive ? 'border-lavender' : 'border-lumut'}`}
      onClick={onClick}
    >
      <p className="font-bold text-sm">{name}</p>
      <div className="flex flex-row gap-2">
        <input
          type="text" 
          placeholder={placeholder} 
          className="h-[40px] w-full text-sm input input-bordered outline-0 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[#D2D4D7]" 
        />
        <div className="min-w-[34px]"/>
      </div>
    </div>
  )
};

export default SubmitterEmail;
