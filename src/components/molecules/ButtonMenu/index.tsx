import React from 'react';
import CheckCircle from '@/assets/CheckCircle.svg';
import RejectUser from '@/assets/RejectUser.svg';

interface IButtonMenu {
  title: string;
}
export const ButtonMenu: React.FC<IButtonMenu> = () => {
  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-outline btn-primary m-1 w-44">
        Response
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content border-[1px] menu p-2 shadow bg-base-100 rounded-box w-52">
        <li>
          <label tabIndex={0} className="btn btn-outline btn-primary m-1 w-44">
            <img src={CheckCircle} />
            Approve
          </label>
        </li>
        <li>
          <label tabIndex={0} className="btn btn-outline btn-primary m-1 w-44">
            <img src={RejectUser} />
            Reject
          </label>
        </li>
      </ul>
    </div>
  );
};
