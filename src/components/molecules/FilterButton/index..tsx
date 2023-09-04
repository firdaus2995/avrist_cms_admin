import React, { useState } from 'react';
import FilterIcon from '@/assets/filter.svg';
import Typography from '@/components/atoms/Typography';
import Radio from '@/components/molecules/Radio';
import { InputDate } from '@/components/atoms/Input/InputDate';

export const FilterButton: React.FC<any> = () => {
  const [open, setOpen] = useState(false);
  const [selection, setSelection] = useState<string | number | boolean>('');

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const onCancelPress = () => {
    setOpen(false);
  };

  const onSubmitPress = () => {
    setOpen(false);
  };
  return (
    <div className={`dropdown-open dropdown dropdown-end mr-3`}>
      <label tabIndex={0} className="">
        <button
          onClick={() => {
            setOpen(!open);
          }}
          className=" border-grey border-[1px] rounded-xl p-3">
          <div className="flex flex-row gap-2 items-center justify-center">
            <img src={FilterIcon} className="w-6 h-6" />
          </div>
        </button>
      </label>

      <ul tabIndex={0} className={open ? 'visible' : 'hidden'}>
        <div className="dropdown-content border-[1px] menu p-5 shadow bg-base-100 rounded-md mt-2 w-96">
          <div className="flex flex-row justify-between items-center">
            <Typography type="body" size="s" weight="semi" className="text-body-text-2">
              Filter
            </Typography>
            <Typography type="body" size="s" weight="regular" className="text-body-text-2">
              Reset Filter
            </Typography>
          </div>
          <Radio
            containerStyle="flex flex-col items-start"
            items={[
              {
                value: 'created',
                label: 'Created Date',
              },
              {
                value: 'updated',
                label: 'Updated Date',
              },
            ]}
            onSelect={(
              event: React.ChangeEvent<HTMLInputElement>,
              value: string | number | boolean,
            ) => {
              if (event) {
                setSelection(value);
              }
            }}
            defaultSelected={selection}
          />
          <div className="flex flex-row gap-2">
            <InputDate
              labelTitle="Start Date:"
              value={startDate}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setStartDate(event.target.value);
              }}
            />
            <InputDate
              labelTitle="End Date:"
              value={endDate}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setEndDate(event.target.value);
              }}
            />
          </div>
          <div className="divider" />
          <div className="flex flex-row gap-2 justify-between">
            <button
              onClick={onCancelPress}
              className="btn flex flex-1 btn-outline btn-primary text-xs btn-sm h-10">
              Cancel
            </button>
            <button
              onClick={onSubmitPress}
              className="btn flex flex-1 btn-primary text-xs btn-sm h-10">
              Submit
            </button>
          </div>
        </div>
      </ul>
    </div>
  );
};
