import HomeIcon from '../../../assets/sidebar/Home-icon.png';
import MenuIcon from '../../../assets/sidebar/Menu-icon.png';
import PageIcon from '../../../assets/sidebar/Page-icon.png';
import PageTemplateIcon from '../../../assets/sidebar/Page-template-icon.png';
import TemplateIcon from '../../../assets/sidebar/Template-icon.png';
import UserIcon from '../../../assets/sidebar/User-icon.svg';
import EmailIcon from '../../../assets/sidebar/Email-icon.svg';

export const sidebarList = [
  {
    id: 1,
    title: 'Home',
    icon: HomeIcon,
    path: '/',
    role: 'HOME_READ',
  },
  {
    id: 2,
    title: 'Page Management',
    icon: PageIcon,
    path: '/page-management',
    role: 'PAGE_READ',
  },
  {
    id: 3,
    title: 'Menu Management',
    icon: MenuIcon,
    path: '/group-menu',
    role: 'MENU_READ',
  },
  {
    id: 4,
    title: 'Content Management',
    icon: TemplateIcon,
    list: [
      {
        id: 41,
        title: 'Content Type Builder',
        path: '/content-type',
        role: 'CONTENT_TYPE_READ',
      },
      {
        id: 42,
        title: 'Content Manager',
        path: '/content-manager',
        role: 'CONTENT_MANAGER_READ',
      },
      {
        id: 43,
        title: 'Global Config Data',
        path: '/global-config-data',
        role: 'GLOBAL_CONFIG_READ',
      },
    ],
  },
  {
    id: 6,
    title: 'Page Template',
    icon: PageTemplateIcon,
    path: '/page-template',
    role: 'PAGE_TEMPLATE_READ',
  },
  {
    id: 9,
    title: 'Leads Generator',
    icon: UserIcon,
    list: [
      {
        id: 73,
        title: 'Questions',
        path: '/questions',
        role: 'PAGE_TEMPLATE_READ',
      },
      {
        id: 74,
        title: 'Result Template',
        path: '/result-template',
        role: 'PAGE_TEMPLATE_READ',
      },
      {
        id: 75,
        title: 'Conditions',
        path: '/conditions',
        role: 'PAGE_TEMPLATE_READ',
      },
    ],
  },
  {
    id: 7,
    title: 'Email Form Builder',
    icon: EmailIcon,
    path: '/email-form-builder',
    role: 'EMAIL_FORM_READ',
  },
  {
    id: 8,
    title: 'User Management',
    icon: UserIcon,
    list: [
      {
        id: 71,
        title: 'User',
        path: '/user',
        role: 'USER_READ',
      },
      {
        id: 72,
        title: 'Role',
        path: '/roles',
        role: 'ROLE_READ',
      },
    ],
  },
];
