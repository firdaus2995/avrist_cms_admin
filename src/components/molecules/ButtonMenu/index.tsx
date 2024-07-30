import React from 'react';
import CheckCircle from '@/assets/CheckCircle.svg';
import RejectUser from '@/assets/RejectUser.svg';
import { t } from 'i18next';

interface IButtonMenu {
  title: string;
  onClickApprove?: any;
  onClickReject?: any;
}
export const ButtonMenu: React.FC<IButtonMenu> = ({ onClickApprove, onClickReject }) => {
  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-outline btn-primary m-1 w-44">
        {t('components.molecules.response')}
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content border-[1px] menu p-2 shadow bg-base-100 rounded-box w-52">
        <li role="button" onClick={onClickApprove}>
          <label tabIndex={0} className="btn btn-outline btn-primary my-1 -ml-6 w-44">
            <img src={CheckCircle} />
            {t('components.molecules.approve')}
          </label>
        </li>
        <li role="button" onClick={onClickReject}>
          <label tabIndex={0} className="btn btn-outline btn-primary my-1 -ml-6 w-44">
            <img src={RejectUser} />
            {t('components.molecules.reject')}
          </label>
        </li>
      </ul>
    </div>
  );
};
