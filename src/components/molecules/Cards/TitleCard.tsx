import React from 'react';
import { Subtitle } from '../../atoms/Typography/Subtitle';

interface ITitleCard {
  title: string;
  children: React.ReactNode;
  topMargin?: string;
  TopSideButtons?: React.ReactNode;
  SearchBar?: React.ReactNode;
}

export const TitleCard: React.FC<ITitleCard> = ({ title, children, topMargin, TopSideButtons, SearchBar }) => {
  return (
    <div className={`card w-full p-6 bg-base-100 shadow-xl ${topMargin ?? 'mt-6'}`}>
      <Subtitle styleClass={TopSideButtons !== undefined ? 'inline-block' : ''}>
        {title}
        {/* {SearchBar !== undefined && (
          <div className="inline-block mr-2">{SearchBar}</div>
        )} */}
        <div className="inline-block flex flex-row float-right gap-2 items-center">
          {SearchBar !== undefined && SearchBar}
          {TopSideButtons !== undefined && TopSideButtons}
        </div>
      </Subtitle>

      <div className=" mt-6"></div>

      <div className="h-full w-full pb-6 bg-base-100">{children}</div>
    </div>
  );
};
