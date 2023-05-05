import React from 'react';
import ReactLogo from '../../../assets/react.svg';
interface ISidebar {
  open: boolean;
  setOpen: (t: boolean) => void;
}
export const Sidebar: React.FC<ISidebar> = props => {
  const { open, setOpen } = props;
  return (
    <div className={`${open ? 'w-[268px]' : 'w-16'}  h-screen  fixed z-30 `}>
      <HeadSidebar open={open} setOpen={setOpen} />
      <MenuSidebar open={open} setOpen={setOpen} />
    </div>
  );
};

interface IHeadSidebar extends ISidebar {}
const HeadSidebar: React.FC<IHeadSidebar> = props => {
  const { open, setOpen } = props;

  return (
    <div
      className="flex items-center h-[72px]  gap-[14px] pl-[18px] "
      style={{
        background: 'linear-gradient(90deg, #FF234B 0%, #F78431 100%)',
      }}>
      <svg
        onClick={() => {
          setOpen(!open);
        }}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6 cursor-pointer text-white">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
        />
      </svg>
      <img className={`w-[160px] h-[31px] ${open ? 'visible' : 'hidden'}`} src={ReactLogo} />
    </div>
  );
};

interface IMenuSidebar extends ISidebar {}
const MenuSidebar: React.FC<IMenuSidebar> = () => {
  // const { open } = props;
  // const location = useLocation();
  // const openClass =
  //   'flex gap-[16px] items-center pl-[13px] pr-[20px] py-[16px] hover:bg-[#F5F7F9] rounded-xl cursor-pointer mb-2';
  // const notOpenClass =
  //   'flex gap-[16px] items-center justify-center  py-[16px] hover:bg-[#F5F7F9] rounded-xl cursor-pointer mb-2';
  // const renderIsActive = (active: boolean): string => {
  //   if (active) {
  //     return 'text-primary';
  //   } else {
  //     return 'text-secondary';
  //   }
  // };

  return <div className="w-full h-full border px-2 pt-3 bg-white"></div>;
};
