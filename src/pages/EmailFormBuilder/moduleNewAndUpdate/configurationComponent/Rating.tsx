import React, { useEffect, useState } from 'react';

import Config from './Config';
import { InputText } from '@/components/atoms/Input/InputText';
import { MultipleInput } from '@/components/molecules/MultipleInput';
import { openToast } from '@/components/atoms/Toast/slice';
import { useAppDispatch } from '@/store';
import { checkIsNotEmpty, copyArray } from '@/utils/logicHelper';

interface IRating {
  data: any;
  configList: any;
  valueChange: (type: string, value: any) => void;
}

const Rating: React.FC<IRating> = ({ data, configList, valueChange }) => {
  const dispatch = useAppDispatch();
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    if (data?.items?.length > 0) {
      setRatings(data?.items);
    }
  }, []);

  useEffect(() => {
    valueChange(
      'componentId',
      data?.name
        .toLowerCase()
        .replace(/[^a-z]/g, '-')
        .replace(/-+/g, '-'),
    );
  }, [data?.name]);

  const handlerAddRatingValue = (value: any) => {
    const items: any = copyArray(ratings);
    if (items.length > 9) {
      dispatch(
        openToast({
          type: 'error',
          title: 'Failed',
          message: 'Cannot add values more than 10',
        }),
      );
    } else {
      items.push(value);
      setRatings(items);
      valueChange('items', items);
    }
  };

  const handlerDeleteRatingValue = (index: any) => {
    const items: any = copyArray(ratings);
    items.splice(index, 1);
    setRatings(items);
    valueChange('items', items);
  };

  return (
    <React.Fragment>
      <InputText
        labelTitle="Rating Name"
        labelStyle="font-bold	"
        inputHeight={40}
        inputStyle="text-sm"
        placeholder="Enter your rating name"
        roundStyle="lg"
        value={data?.name}
        isError={data?.mandatory?.name}
        onChange={(event: any) => {
          valueChange('name', event.target.value);
        }}
      />
      <MultipleInput
        labelTitle="Slider Value"
        labelStyle="font-bold	"
        inputStyle="rounded-xl "
        items={ratings}
        isError={data?.mandatory?.items}
        onAdd={handlerAddRatingValue}
        onDelete={handlerDeleteRatingValue}
        logicValidation={checkIsNotEmpty}
        errorAddValueMessage="Field cannot be empty"
      />
      <Config data={data} configList={configList} valueChange={valueChange} />
    </React.Fragment>
  );
};

export default Rating;
