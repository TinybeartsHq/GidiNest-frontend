import { SvgColor } from 'src/components/svg-color';



const icon = (name: string) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} />;

export type NavItem = {
  title: string;
  path: string;
  icon: React.ReactNode;
  info?: React.ReactNode;
};

export const navData = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: icon('ic-analytics'),
  },
    {
    title: 'Savings',
    path: '/savings',
    icon: icon('ic-cart')
  },
  // {
  //   title: 'Savings',
  //   path: '/savings',
  //   icon: icon('ic-cart'),
  //   info: (
  //     <Label color="error" variant="inverted">
  //       +3
  //     </Label>
  //   ),
  // },

  {
    title: 'Transactions',
    path: '/transactions',
    icon: icon('ic-disabled'),
  },
  {
    title: 'Payment Links',
    path: '/payment-links',
    icon: icon('ic-lock'),
  },
  {
    title: 'My Profile',
    path: '/profile',
    icon: icon('ic-user'),
  },

  {
    title: 'Community',
    path: '/community',
    icon: icon('ic-blog'),
    // info: (
    //   <Label color="error" variant="inverted">
    //     +3
    //   </Label>
    // ),
  },
  {
    title: 'Tips and FAQ',
    path: '/tips',
    icon: icon('ic-notification-chat'),
  },
  
];
