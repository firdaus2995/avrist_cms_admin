import React, { useState, useEffect } from 'react';

import DeleteComponentIcon from '../../../../assets/efb/preview-delete.svg';

interface ICurrencyField {
  name: string;
  placeholder: string;
  currency?: string;
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
}

const CurrencyField: React.FC<ICurrencyField> = ({
  name,
  placeholder,
  currency,
  isActive,
  onClick,
  onDelete,
}) => {
  const [val, setVal] = useState('');

  useEffect(() => {
    setVal('');
  }, [currency]);

  const handleInputChange = (e: any) => {
    const inputValue = e.target.value;
    // Prevent '0' as the first character
    if (inputValue.startsWith('0') && inputValue.length === 1) {
      setVal('');
      return;
    }
    const formattedValue = formatCurrency(inputValue);
    setVal(formattedValue);
  };

  const formatCurrency = (value: any) => {
    if (currency === 'idr') {
      value = value.replace(/[^\d,]/g, '');
      const parts = value.split('.');

      const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');

      return integerPart;
    } else {
      value = value.replace(/[^\d.]/g, '');
      const parts = value.split(',');

      const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

      return integerPart;
    }
  };

  return (
    <div
      className={`flex flex-col py-4 px-4 bg-light-purple-2 rounded-xl gap-2 border-[1px] ${
        isActive ? 'border-lavender' : 'border-light-purple-2'
      }`}
      onClick={onClick}>
      <p className="font-bold text-sm">{name}</p>
      <div className="flex flex-row gap-2 w-full">
        <div className="flex flex-row gap-2 items-center w-full">
          <span className="w-[35px]">
            <p className="text-sm font-bold">{currency?.toUpperCase()}</p>
          </span>

          <input
            type="text"
            placeholder={placeholder}
            className="h-[40px] w-full text-sm input input-bordered outline-0 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[#D2D4D7]"
            value={val}
            onChange={e => {
              handleInputChange(e);
            }}
          />
        </div>

        <img
          src={DeleteComponentIcon}
          className="cursor-pointer"
          onClick={(event: React.SyntheticEvent) => {
            event.stopPropagation();
            onDelete();
          }}
        />
      </div>
    </div>
  );
};

export default CurrencyField;
