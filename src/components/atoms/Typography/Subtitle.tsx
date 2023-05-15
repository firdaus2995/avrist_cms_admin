import React from 'react';

interface ISubtitle {
  styleClass?: string;
  children: React.ReactNode;
}

export const Subtitle: React.FC<ISubtitle> = ({ styleClass = '', children }) => {
  return <div className={`text-2xl font-semibold ${styleClass}`}>{children}</div>;
};
