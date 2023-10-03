import React, { useState, useEffect } from 'react';
import FilterIcon from '@/assets/filter.svg';
import Typography from '@/components/atoms/Typography';
import Radio from '@/components/molecules/Radio';
import { InputDate } from '@/components/atoms/Input/InputDate';
import dayjs from 'dayjs';
import { t } from 'i18next';

export const FilterButton: React.FC<any> = ({
  open,
  setOpen,
  onSubmit,
  startDate: propStartDate,
  endDate: propEndDate,
  defaultSelected,
  onResetFilter: propsOnResetFilter,
  onCancelPress,
}) => {
  const now = dayjs().format('YYYY-MM-DD');
  const [selection, setSelection] = useState<string | number | boolean>(defaultSelected);
  const [startDate, setStartDate] = useState(propStartDate);
  const [endDate, setEndDate] = useState(propEndDate);

  useEffect(() => {
    // Ensure start date is not greater than end date
    if (dayjs(startDate).isAfter(endDate)) {
      setStartDate(endDate);
    }
  }, [startDate, endDate]);

  const onSubmitPress = () => {
    const payload = {
      selection,
      startDate,
      endDate,
    };
    onSubmit(payload);
  };

  const onResetPress = () => {
    propsOnResetFilter();
    setSelection('CREATED_AT');
    setStartDate(propStartDate);
    setEndDate(propEndDate);
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
            <img src={FilterIcon} className="w-6 h-6" alt="Filter" />
          </div>
        </button>
      </label>

      <ul tabIndex={0} className={open ? 'visible' : 'hidden'}>
        <div className="dropdown-content border-[1px] menu p-5 shadow bg-base-100 rounded-md mt-2 w-96">
          <div className="flex flex-row justify-between items-center">
            <Typography type="body" size="s" weight="semi" className="text-body-text-2">
              {t('components.molecules.filter-button.filterButton.filter')}
            </Typography>
            <div className="cursor-pointer w-20 h-7" onClick={onResetPress}>
              <Typography type="body" size="s" weight="regular" className="text-body-text-2">
                {t('components.molecules.filter-button.filterButton.resetFilter')}
              </Typography>
            </div>
          </div>
          <Radio
            containerStyle="flex flex-col items-start"
            items={[
              {
                value: 'CREATED_AT',
                label: t('components.molecules.filter-button.radioItems.createdAt'),
              },
              {
                value: 'UPDATED_AT',
                label: t('components.molecules.filter-button.radioItems.updatedAt'),
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
              max={endDate}
              labelTitle={t('components.molecules.filter-button.dateLabels.startDate')}
              value={startDate}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setStartDate(dayjs(event.target.value).format('YYYY-MM-DD'));
              }}
            />
            <InputDate
              max={now}
              labelTitle={t('components.molecules.filter-button.dateLabels.endDate')}
              value={endDate}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setEndDate(dayjs(event.target.value).format('YYYY-MM-DD'));
              }}
            />
          </div>
          <div className="divider" />
          <div className="flex flex-row gap-2 justify-between">
            <button
              onClick={() => {
                onCancelPress();
                onResetPress();
              }}
              className="btn flex flex-1 btn-outline btn-primary text-xs btn-sm h-10">
              {t('components.molecules.filter-button.buttons.cancel')}
            </button>
            <button
              onClick={onSubmitPress}
              className="btn flex flex-1 btn-primary text-xs btn-sm h-10">
              {t('components.molecules.filter-button.buttons.submit')}
            </button>
          </div>
        </div>
      </ul>
    </div>
  );
};
