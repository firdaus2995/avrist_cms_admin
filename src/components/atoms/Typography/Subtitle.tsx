import React from 'react';

interface ISubtitle {
  styleClass?: string;
  children: React.ReactNode;
}

export const Subtitle: React.FC<ISubtitle> = ({ styleClass = '', children }) => {
  return <div className={`flex items-center justify-between text-3xl font-bold ${styleClass}`}>{children}</div>;
};
