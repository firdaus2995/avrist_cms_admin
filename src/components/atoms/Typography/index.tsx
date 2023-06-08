import React from 'react';

interface ITypographyProps {
  className?: string;
  type?: 'heading' | 'heading1' | 'heading2' | 'heading3' | 'heading4' | 'heading5' | 'body';
  size?: 'xl' | 'l' | 'm' | 'normal' | 's' | 'xs';
  weight?: 'bold' | 'medium' | 'regular';
  children: React.ReactNode;
}

const fontSizeClasses = {
  heading: 'text-6xl',
  heading1: 'text-4xl',
  heading2: 'text-3xl',
  heading3: 'text-2xl',
  heading4: 'text-xl',
  heading5: 'text-lg',
  body: {
    xl: 'text-xl',
    l: 'text-lg',
    m: 'text-base',
    normal: 'text-base',
    s: 'text-sm',
    xs: 'text-xs',
  },
};

const fontWeightClasses = {
  bold: 'font-bold',
  medium: 'font-medium',
  regular: 'font-normal',
};

const Typography: React.FC<ITypographyProps> = ({
  className = '',
  type = 'body',
  size = 'xl',
  weight = 'regular',
  children,
}) => {
  const fontSizeClasses: any = {
    heading: 'text-6xl',
    heading1: 'text-4xl', // 32px
    heading2: 'text-3xl', // 28px
    heading3: 'text-2xl', // 24px
    heading4: 'text-xl', // 20px
    heading5: 'text-lg', // 16px
    body: {
      xl: 'text-xl', // 24px
      l: 'text-lg', // 20px
      m: 'text-base', // 18px
      normal: 'text-base', // 16px
      s: 'text-sm', // 14px
      xs: 'text-xs', // 12px
      //   xxs: 'text-xs', // 10px
    },
  };

  const fontWeightClasses: IFontWeightClasses = {
    bold: 'font-bold',
    medium: 'font-medium',
    regular: 'font-normal',
  };

  const getSizeClass = (): string => {
    const fontSizeClass = fontSizeClasses[type];
    if (typeof fontSizeClass === 'string') {
      return fontSizeClass;
    }
    return fontSizeClass[size] || fontSizeClass.xl;
  };

  const getWeightClass = (): string => {
    return fontWeightClasses[weight] || fontWeightClasses.regular;
  };

  const sizeClass = getSizeClass();
  const weightClass = getWeightClass();

  const classNames = `${sizeClass} ${weightClass} ${className}`;

  return <div className={classNames}>{children}</div>;
};

export default Typography;
