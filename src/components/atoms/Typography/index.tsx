import React from 'react';

interface ITypographyProps {
  className?: string;
  type?: 'heading' | 'heading1' | 'heading2' | 'heading3' | 'heading4' | 'heading5' | 'body';
  size?: 'xl' | 'l' | 'm' | 'normal' | 's' | 'xs';
  weight?: 'bold' | 'medium' | 'regular' | 'light' | 'semi';
  alignment?: 'left' | 'center' | 'right';
  children: React.ReactNode;
}

type IFontSizeClasses = Record<string, string | Record<string, string>>;

type IFontWeightClasses = Record<string, string>;

type IFontAlignmentClasses = Record<string, string>;

const fontSizeClasses: IFontSizeClasses = {
  heading: 'text-6xl',
  heading1: 'text-4xl',
  heading2: 'text-3xl',
  heading3: 'text-2xl',
  heading4: 'text-xl',
  heading5: 'text-lg',
  body: {
    xl: 'text-xl',
    l: 'text-lg',
    m: 'text-sm',
    normal: 'text-sm',
    s: 'text-sm',
    xs: 'text-xs',
  },
};

const fontWeightClasses: IFontWeightClasses = {
  bold: 'font-bold',
  semi: 'font-semibold',
  medium: 'font-medium',
  regular: 'font-normal',
  light: 'font-light',
};

const fontAlignmentClasses: IFontAlignmentClasses = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

const Typography: React.FC<ITypographyProps> = ({
  className = '',
  type = 'body',
  size = 'xl',
  weight = 'regular',
  alignment = 'left',
  children,
}) => {
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

  const getAlignmentClass = (): string => {
    return fontAlignmentClasses[alignment] || fontWeightClasses.left;
  };

  const sizeClass = getSizeClass();
  const weightClass = getWeightClass();
  const alignmentClass = getAlignmentClass();

  const classNames = `${sizeClass} ${weightClass} ${alignmentClass} ${className}`;

  return <div className={classNames}>{children}</div>;
};

export default Typography;

// <Typography type="heading3" size="l" weight="medium">Heading 3 Text</Typography>
// <Typography type="body" size="m" weight="bold">Medium Bold Text</Typography>
