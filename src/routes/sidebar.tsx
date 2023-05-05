export const routes = [
  {
    path: '',
    icon: 'A',
    name: 'Dashboard',
  },
  {
    path: 'roles',
    icon: 'B',
    name: 'Roles',
  },

  {
    path: '',
    icon: '',
    name: 'Sub Menu',
    submenu: [
      {
        path: 'sub1',
        icon: 'C',
        name: 'Sub 1',
      },
      {
        path: 'sub2',
        icon: 'D',
        name: 'Sub 2',
      },
    ],
  },
];
