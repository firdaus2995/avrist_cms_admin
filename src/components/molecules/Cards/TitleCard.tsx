import React from 'react';
import { Subtitle } from '../../atoms/Typography/Subtitle';
import ArrowLeft from '../../../assets/arrow-left.svg';
import Typography from '@/components/atoms/Typography';

interface ITitleCard {
  title: string;
  children: React.ReactNode;
  topMargin?: string;
  TopSideButtons?: React.ReactNode;
  SearchBar?: React.ReactNode;
  hasBack?: boolean;
  backTitle?: string;
  onBackClick?: any;
  border?: boolean;
  titleComponent?: React.ReactNode;
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
  border,
  titleComponent,
}) => {
  return (
    <div className={`card w-full p-6 bg-base-100 ${topMargin ?? 'mt-6'}`}>
      {hasBack ? (
        <div className="mb-5">
          <button
            onClick={onBackClick}
            className="btn btn-ghost btn-sm font-normal text-body-text-3">
            <img src={ArrowLeft} className="w-6 h-6 mr-1 -ml-2" />
            {backTitle ?? 'Back'}
          </button>
        </div>
      ) : (
        <div />
      )}
      <Subtitle styleClass={TopSideButtons !== undefined ? 'inline-block' : ''}>
        <div className="flex flex-row items-center">
          <Typography size="xl" weight="bold">
            {title}
          </Typography>
          {titleComponent}
        </div>
        <div className="flex gap-3">
          {SearchBar !== undefined && SearchBar}
          {TopSideButtons !== undefined && TopSideButtons}
        </div>
      </Subtitle>

      <div className={`mt-5 ${border && 'border-b-2'}`}></div>

      <div className="h-full w-full pb-6 bg-base-100">{children}</div>
    </div>
  );
};
