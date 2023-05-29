import HomeIcon from '../../../assets/sidebar/Home-icon.png';
import MenuIcon from '../../../assets/sidebar/Menu-icon.png';
import PageIcon from '../../../assets/sidebar/Page-icon.png';
import PageTemplateIcon from '../../../assets/sidebar/Page-template-icon.png';
import SidebarIcon from '../../../assets/sidebar/Sidebar-icon.png';
import TemplateIcon from '../../../assets/sidebar/Template-icon.png';
import UserIcon from '../../../assets/sidebar/User-icon.png';

export const sidebarList = [
  {
    id: 1,
    title: 'Home',
    icon: HomeIcon,
    path: '/',
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
      },
    ],
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
        path: '/user',
      },
      {
        id: 72,
        title: 'Role',
        path: '/roles',
      },
    ],
  },
];
