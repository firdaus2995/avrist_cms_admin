import React from 'react';

interface ITypography {
  styleClass?: string;
  type?: string;
  size?: string;
  weight?: 'bold' | 'medium' | 'regular';
  children: React.ReactNode;
}

interface IFontSizeClasses {
  [key: string]: string | IFontSizeClasses;
}

// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
interface IFontWeightClasses {
  [key: string]: string;
}

export const Typography: React.FC<ITypography> = ({
  styleClass = '',
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
    const sizeClass =
      (fontSizeClasses[type] as IFontSizeClasses)?.[size] || fontSizeClasses.body.xl;
    return sizeClass;
  };

  const getWeightClass = (): string => {
    const weightClass = fontWeightClasses[weight] || fontWeightClasses.regular;
    return weightClass;
  };

  const sizeClass = getSizeClass();
  const weightClass = getWeightClass();

  const classNames = `${sizeClass} ${weightClass} ${styleClass}`;

  return <div className={classNames}>{children}</div>;
};

//   {/* Header Examples */}
//   <Typography type="heading1">Heading 1</Typography> // 32px

//   {/* Body Examples */}
//   <Typography type="body" size="xl" weight="bold">Extra Large Bold Body Text</Typography> // 24
