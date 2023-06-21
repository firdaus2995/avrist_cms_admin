import { useState } from 'react';
import Collapse from '@mui/material/Collapse';
import { CheckBox } from '../../atoms/Input/CheckBox';
import { IPermissionCollase, ISubCollapse } from './types';
import { store } from '@/store';
export default function PermissionCollapse(props: IPermissionCollase) {
  const { permission, disabled, onChange } = props;

  const [open, setOpen] = useState(false);

  return (
    <>
      {permission?.listContent.length > 1 ? (

        <div className="mb-6">
          <div
            onClick={() => {
              setOpen(!open);
            }}
            className="w-full bg-[#F9F5FD] px-6 py-5 flex justify-between cursor-pointer rounded-lg">
            <h1 className="text-base font-bold">{permission.categoryLabel}</h1>
            {!open ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
              </svg>
            )}
          </div>
          <Collapse in={open}>
            <div className="py-4 pl-4 ">
              {permission.listContent.map((content, i) => (
                <SubCollapse key={i} subcollapse={content} disabled={disabled} onChange={onChange} />
              ))}
            </div>
          </Collapse>
        </div>
      ) : (
        <div className="mb-6">
          <div
            onClick={() => {
              setOpen(!open);
            }}
            className="w-full bg-[#F9F5FD] px-6 py-5 flex justify-between cursor-pointer rounded-lg">
            <h1 className="text-base font-bold">{permission.categoryLabel}</h1>
            {!open ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
              </svg>
            )}
          </div>
          <Collapse in={open}>
            <div className="py-4 px-4 flex gap-20">
              {permission.listContent[0].listDetail.map((d, i) => (
                <CheckBox
                  key={i}
                  updateType={d.permission}
                  labelTitle={d.permissionTitleLabel}
                  defaultValue={store.getState().rolesSlice?.permission?.includes(d.permission)}
                  disabled={disabled}
                  updateFormValue={() => {
                    onChange(d.permission);
                  }}
                />
              ))}
            </div>
          </Collapse>
        </div>
      )}
    </>
  );
}

const SubCollapse = (props: ISubCollapse) => {
  const { subcollapse, disabled, onChange } = props;
  const [open, setOpen] = useState(false);
  
  return (
    <div className="mb-6">
      <div
        onClick={() => {
          setOpen(!open);
        }}
        className="w-full bg-[#F9F5FD] px-6 py-5 flex justify-between cursor-pointer rounded-lg">
        <h1 className="text-base font-bold">{subcollapse.titleLabel}</h1>
        {!open ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
          </svg>
        )}
      </div>
      <Collapse in={open}>
        <div className="py-4 px-4 flex gap-20">
          {subcollapse.listDetail.map((d, i) => (
            <CheckBox
              key={i}
              updateType={d.permission}
              labelTitle={d.permissionTitleLabel}
              defaultValue={store.getState().rolesSlice?.permission?.includes(d.permission)}
              disabled={disabled}
              updateFormValue={() => {
                onChange(d.permission);
              }}
            />
          ))}
        </div>
      </Collapse>
    </div>
  );
};
