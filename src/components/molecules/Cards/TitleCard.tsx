import React from 'react';
import { Subtitle } from '../../atoms/Typography/Subtitle';
import ArrowLeft from '../../../assets/arrow-left.svg';

interface ITitleCard {
  title: string;
  children: React.ReactNode;
  topMargin?: string;
  TopSideButtons?: React.ReactNode;
  SearchBar?: React.ReactNode;
  hasBack?: boolean;
  backTitle?: string;
  onBackClick?: any;
}

export const TitleCard: React.FC<ITitleCard> = ({
  title,
  children,
  topMargin,
  TopSideButtons,
  SearchBar,
  hasBack,
  backTitle,
  onBackClick,
}) => {
  return (
    <div className={`card w-full p-6 bg-base-100 ${topMargin ?? 'mt-6'}`}>
      {hasBack ? (
        <div className="mb-5">
          <button onClick={onBackClick} className="btn btn-ghost btn-sm font-normal text-body-text-3">
            <img src={ArrowLeft} className="w-6 h-6 mr-1 -ml-2" />
            {backTitle ?? 'Back'}
          </button>
        </div>
      ) : (
        <div />
      )}
      <Subtitle styleClass={TopSideButtons !== undefined ? 'inline-block' : ''}>
        {title}
        <div className="flex gap-5">
          {SearchBar !== undefined && SearchBar}
          {TopSideButtons !== undefined && TopSideButtons}
        </div>
      </Subtitle>

      <div className=" mt-6"></div>

      <div className="h-full w-full pb-6 bg-base-100">{children}</div>
    </div>
  );
};
