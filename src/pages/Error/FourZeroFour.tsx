import { useNavigate } from "react-router";

import NotFoundSVG from "@/assets/pages/404.svg";
import HomeIcon from '@/assets/home.svg';

const FourZeroThree = () => {
  const navigate = useNavigate();

  const handlerNavigate = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col justify-center items-center" style={{
      height: 'calc(100vh - 100px)'
    }}>
      <img src={NotFoundSVG} className="mt-[-100px] select-none pointer-events-none"/>
      <button className="btn btn-outline btn-primary flex flex-row justify-between gap-5" onClick={handlerNavigate}>
        <img src={HomeIcon} className="w-[18px] h-[18px]" />
        Back to Home
      </button>
    </div>
  )
};

export default FourZeroThree;
