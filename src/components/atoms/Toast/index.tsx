import React from 'react';
import { Snackbar } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../store';
import { closeToast } from './slice';

import CloseIcon from '../../../assets/icon-close.png';
import ToastInfoIcon from '../../../assets/toast-info.svg';
import WarningIcon from '../../../assets/warning.svg';
import InfoSmIcon from '../../../assets/info-sm.svg';
import SuccessIcon from '../../../assets/success-sm.svg';
const Toast: React.FC = () => {
  const dispatch = useAppDispatch();

  const { dataToast } = useAppSelector((state: any) => state.toastSlice);

  const toastClose = (): void => {
    dispatch(
      closeToast({
        type: dataToast.type,
        title: dataToast.title,
        message: dataToast.message,
      }),
    );
  };

  return (
    <Snackbar
      open={dataToast.open}
      autoHideDuration={null}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      onClose={() => {
        toastClose();
      }}
      className={'z-10'}>
      <div
        className={`
          w-[387px]
          h-[62px]
          ${
            dataToast.type === 'error'
              ? 'bg-white'
              : dataToast.type === 'success'
              ? 'bg-[#B9F7C4]'
              : dataToast.type === 'info'
              ? 'bg-[#B2E6F4]'
              : dataToast.type === 'warning'
              ? 'bg-[#FBE7C6]'
              : 'bg-white'
          }
          shadow-[0_2px_15px_1px_rgba(0,0,0,0.1)]
          rounded-[12px]
          flex
          flex-row
          justify-between
          p-4
          items-center
          z-300
        `}>
        <div className="flex flex-row gap-3 items-center">
          {dataToast.type === 'success' ? (
            <img src={SuccessIcon} />
          ) : dataToast.type === 'warning' ? (
            <img src={WarningIcon} />
          ) : dataToast.type === 'info' ? (
            <img src={InfoSmIcon} />
          ) : (
            <img src={ToastInfoIcon} />
          )}

          <div>
            <p className="text-[16px] text-[#333333] font-semibold">{dataToast.title}</p>
            <p className="text-[12px] text-[#68788D] font-medium">{dataToast.message}</p>
          </div>
        </div>
        <div
          className="cursor-pointer"
          onClick={() => {
            toastClose();
          }}>
          <img src={CloseIcon} width={12} height={12} />
        </div>
      </div>
    </Snackbar>
  );
};

export default Toast;
