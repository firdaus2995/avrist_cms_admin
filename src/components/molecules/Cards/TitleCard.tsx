import React from 'react';
import { Subtitle } from '../../atoms/Typography/Subtitle';

interface ITitleCard {
  title: string;
  children: React.ReactNode;
  topMargin?: string;
  TopSideButtons?: React.ReactNode;
}

export const TitleCard: React.FC<ITitleCard> = ({ title, children, topMargin, TopSideButtons }) => {
  return (
    <div className={`card w-full p-6 bg-base-100 ${topMargin ?? 'mt-6'}`}>
      <Subtitle styleClass={TopSideButtons !== undefined ? 'inline-block' : ''}>
        {title}
        {TopSideButtons !== undefined && (
          <div className="inline-block float-right">{TopSideButtons}</div>
        )}
      </Subtitle>

      <div className=" mt-6"></div>

      <div className="h-full w-full pb-6 bg-base-100">{children}</div>
    </div>
  );
};
