import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from "uuid";

import { IItems, IRadio } from './interfaces';
import { t } from 'i18next';
import ErrorSmallIcon from '@/assets/error-small.svg';

const Radio = ({
  labelTitle,
  labelStyle,
  labelRequired,
  items,
  defaultSelected,
  onSelect,
  containerStyle,
  helperText,
  error,
}: IRadio) => {
  const [checked, setChecked] = useState<any>(null);
  const [name] = useState<string>(uuidv4());

  useEffect(() => {
    if (defaultSelected) setChecked(defaultSelected);
  }, [defaultSelected]);

  const handleSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
    value: string | number | boolean,
  ) => {
    setChecked(value);
    if (onSelect) onSelect(event, value);
  };

  if (!items || items.length < 1) {
    return <h2 className="text-red-900">{t('components.molecules.component-radio-error')}</h2>;
  }

  return (
    <div className="w-full flex flex-col">
      <label className="label">
        <span className={`label-text text-base-content ${labelStyle}`}>
          {labelTitle}
          <span className={'text-reddist text-lg'}>{labelRequired ? '*' : ''}</span>
        </span>
      </label>
      <div
        className={containerStyle || `flex flex-row gap-2 h-[48px] items-center`}>
        {items.map((element: IItems, keyIndex: number) => {
          return (
            <div className="form-control" key={keyIndex}>
              <label className="label cursor-pointer flex flex-row gap-2">
                <input
                  type="radio"
                  name={name}
                  className="radio checked:bg-purple"
                  value={element.value}
                  checked={checked === element.value}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    handleSelect(event, element.value);
                  }}
                />
                <span className="label-text">{element.label}</span>
              </label>
            </div>
          );
        })}
      </div>
      {error && (
        <div className="flex flex-row px-1 py-2">
          <img src={ErrorSmallIcon} className="mr-3" />
          <p className="text-reddist text-sm">{helperText}</p>
        </div>
      )}
    </div>
  );
};

export default Radio;
