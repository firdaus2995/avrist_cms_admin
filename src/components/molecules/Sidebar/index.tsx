import React, { useState } from 'react';
import Icon from 'react-icons-kit';
import {chevronDown, chevronUp} from 'react-icons-kit/fa'
import Menu from '../../../assets/menu.png';
import HomeIcon from '../../../assets/sidebar/Home-icon.png';
import LogoutIcon from '../../../assets/sidebar/Logout-icon.png';
import MenuIcon from '../../../assets/sidebar/Menu-icon.png';
import PageIcon from '../../../assets/sidebar/Page-icon.png';
import PageTemplateIcon from '../../../assets/sidebar/Page-template-icon.png';
import SidebarIcon from '../../../assets/sidebar/Sidebar-icon.png';
import TemplateIcon from '../../../assets/sidebar/Template-icon.png';
import UserIcon from '../../../assets/sidebar/User-icon.png';
import ProfilePhoto from '../../../assets/Profile-photo.png';
interface ISidebar {
  open: boolean;
  setOpen: (t: boolean) => void;
}
export const Sidebar: React.FC<ISidebar> = props => {
  const { open, setOpen } = props;
  return (
    <div className={`${open ? 'w-[268px]' : 'w-16'} h-screen fixed z-30 ease-in-out duration-300`}>
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
      className="flex items-center h-[72px] gap-[14px] pl-[18px]"
      >
      <img 
        role='button' 
        onClick={() => {
          setOpen(!open);
        }} 
        src={Menu} 
        alt="Menu" 
        className="w-6" />
      {/* <img className={`w-[160px] h-[31px] ${open ? 'visible' : 'hidden'}`} src={ReactLogo} /> */}
    </div>
  );
};

interface IMenuSidebar extends ISidebar {}
const MenuSidebar: React.FC<IMenuSidebar> = (props) => {
  const { open } = props;
  const [activeTab, setActiveTab] = useState(1);
  const [openedTab, setOpenedTab] = useState([]);

  const sidebarList = [
    {
      id: 1,
      title: 'Home',
      icon: HomeIcon,
    },
    {
      id: 2,
      title: 'Page Management',
      icon: PageIcon,
    },
    {
      id: 3,
      title: 'Menu Management',
      icon: MenuIcon,
    },
    {
      id: 4,
      title: 'Template Management',
      icon: TemplateIcon,
      list: [
        {
          id: 41,
          title: 'Content Type Builder',
        },
        {
          id: 42,
          title: 'Content Manager',
        }
      ]
    },
    {
      id: 5,
      title: 'Sidebar Template',
      icon: SidebarIcon,
    },
    {
      id: 6,
      title: 'Page Template',
      icon: PageTemplateIcon,
    },
    {
      id: 7,
      title: 'User Management',
      icon: UserIcon,
      list: [
        {
          id: 71,
          title: 'User',
        },
        {
          id: 72,
          title: 'Role',
        }
      ]
    }
  ];

  const footerList = [
    {
      id: 8,
      title: 'Edit Profile',
      bordered: true,
    },
    {
      id: 9,
      title: 'Logout',
      icon: LogoutIcon,
    },
  ];

  const listTabHandler = (e) => {
    if (openedTab.includes(e)) {
      const filtered = openedTab.filter((val) => val !== e);
      setOpenedTab(filtered)
    }else{
      setOpenedTab((val) => [...val, e])
    }
  };

  const renderHeader = () => {
    return (
      <div className='flex flex-col items-center justify-center my-5'>
        <div className='w-12 h-12 rounded-full bg-white flex items-center justify-center'>
          <div className='w-11 h-11 rounded-full bg-black bg-cover' style={{backgroundImage: `url(${ProfilePhoto})`}}></div>
        </div>
        {open && (
          <div className='text-white flex flex-col mt-2 items-center justify-center'>
            <text className='font-bold'>Haykal</text>
            <text>600234563</text>
            <text>Employee - Submitter</text>
          </div>
        )}
      </div>
    )
  }

  const renderListMenu = () => {
    return (
      <div className='border-b pb-5'>
        {sidebarList.map((val) => (
          <div key={val.id}>
            <div 
              role='button' 
              onClick={() => { 
                val.list ? 
                listTabHandler(`Tab_${val.id}`)
                :
                setActiveTab(val.id) 
              }} 
              className={`${activeTab === val.id ? 'bg-[#9B86BA]' : ''} ${open ? 'justify-between m-2' : 'justify-center m-3'} flex flex-row p-2 rounded-xl items-center hover:bg-[#9B86BA]`}>
              <div className='flex flex-row'>
                <img 
                  src={val.icon} 
                  alt={`Menu_${val.id}`} 
                  className="w-4 h-4" />
                {open && (
                  <text className={`${activeTab === val.id ? 'font-bold' : 'font-base'} text-white text-sm ml-4`}>{val.title}</text>
                )}
              </div>
              {val.list && open ? (
                openedTab.includes(`Tab_${val.id}`) ? (
                  <Icon icon={chevronUp} className='text-white' />
                ) : (
                  <Icon icon={chevronDown} className='text-white' />
                )
              ) : null}
            </div>
            {openedTab.includes(`Tab_${val.id}`) && open ? (
              val.list?.map((e) => (
                <div 
                  key={e.id} 
                  className={`${activeTab === e.id ? 'bg-[#9B86BA]' : ''} flex flex-row p-2 m-2 rounded-xl items-center justify-between hover:bg-[#9B86BA]`}
                  role='button'
                  onClick={() => { setActiveTab(e.id); }}>
                  <text className={`${activeTab === e.id ? 'font-bold' : 'font-base'} text-white text-sm ml-8`}>{e.title}</text>
                </div>
              ))
            ) : null}
          </div>
        ))}
      </div>
    )
  }

  const renderFooter = () => {
    return (
     <div className='flex flex-col items-center justify-center my-10'>
      {footerList.map((val) => (
        <div 
          key={val.id} 
          role='button'
          onClick={() => { setActiveTab(val.id); }}
          className={`
            ${activeTab === val.id ? 'bg-[#9B86BA] font-bold' : ''} 
            ${val.bordered && open && ' border border-white'}
            ${open ? 'w-40' : 'p-2'} 
            p-2 text-white rounded-2xl mb-2 text-center flex items-center justify-center`}>
            {val.icon && (
              <img 
                src={val.icon} 
                alt={`Menu_${val.id}`} 
                className={`${open && 'mr-4'} w-4 h-4`} />
            )}
            {open && val.title}
        </div>
      ))}
     </div>
    )
  }

  return (
    <div className={`${open ? 'px-2 pt-3 pb-24' : ''} w-full h-full flex flex-col border bg-[#5E217C] overflow-auto`}>
      {renderHeader()}
      {renderListMenu()}
      {renderFooter()}
    </div>
  );
};
