import { useTranslation } from 'react-i18next';
// import { useGetRolesQuery } from '../../services/Roles/rolesApi';
import { CheckBox } from '../../components/molecules/Input/CheckBox';
import { Radio } from '../../components/molecules/Input/Radio';
import { useState } from 'react';
export default function Dashboard() {
  // const { data } = useGetRolesQuery({
  //   pageIndex: 0,
  //   limit: 2,
  //   direction: '',
  //   search: '',
  //   sortBy: '',
  // });
  const { t } = useTranslation();

  const [checked, setChecked] = useState('')
  const [checkboxValue, setCheckboxValue] = useState([])

  const radioChangeHandler = (e) => {
    setChecked(e.value)
  };
  
  const checkboxChangeHandler = (e) => {
    if (checkboxValue.includes(e.value)) {
      const filtered = checkboxValue.filter((val) => val !== e.value);
      setCheckboxValue(filtered)
    }else{
      setCheckboxValue((val) => [...val, e.value])
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <br />
      <button className="btn btn-primary btn-sm ">This button made with daisyui</button>
      <br />
      <h1 className="my-10"> {t('dashboard.sample') ?? ''}</h1>
      <CheckBox 
        labelTitle='test checkbox 1'  
        defaultValue='pilihan 1' 
        checked={checkboxValue.includes('pilihan 1')} 
        updateFormValue={checkboxChangeHandler}
      />
      <CheckBox 
        labelTitle='test checkbox 2'  
        defaultValue='pilihan 2' 
        checked={checkboxValue.includes('pilihan 2')} 
        updateFormValue={checkboxChangeHandler}
      />
      <Radio 
        labelTitle='test radio 1' 
        checked={checked === 'pilihan1'} 
        defaultValue='pilihan1' 
        updateFormValue={radioChangeHandler}
      />
      <Radio 
        labelTitle='test radio 2' 
        checked={checked === 'pilihan2'} 
        defaultValue='pilihan2' 
        updateFormValue={radioChangeHandler}
      />
    </div>
  );
}
