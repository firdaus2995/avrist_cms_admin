import { useParams } from 'react-router-dom';
import { TitleCard } from '../../components/molecules/Cards/TitleCard';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { InputText } from '../../components/atoms/Input/InputText';
import DropDown from '../../components/molecules/DropDown';
import { CheckBox } from '../../components/atoms/Input/CheckBox';
import LifeInsurance from '../../assets/lifeInsurance.png';
import SortableTreeComponent from '../../components/atoms/SortableTree';

export default function MenuList() {
  const { t } = useTranslation();
  const params = useParams();
  const [isAddClick, setIsAddClicked] = useState(false);

  const [title, setTitle] = useState('');
  const [page, setPage] = useState('');
  const [type, setType] = useState('');
  const [isOpenTab, setIsOpenTab] = useState(false);
  const [urlLink, setUrlLink] = useState('');

  const [isOpenForm, setIsOpenForm] = useState(false);
  const [dataScructure, setDataStructure] = useState([]);

  function onSave() {
    const dataForm = {
      title,
      page,
      type,
      isOpenTab,
    };
    setDataStructure(data => [...data, dataForm]);

    setIsOpenForm(false);
    setIsAddClicked(false);
  }

  function clearForm() {
    setTitle('');
    setPage('');
    setType('');
    setIsOpenTab(false);
  }

  const renderAddButtons = () => {
    return (
      <div className='flex flex-row items-center justify-center gap-4 mb-10'>
        {!isAddClick ? (
          <div 
            role='button'
            onClick={() => { 
              setIsAddClicked(true); 
              clearForm();
            }}
            className='py-4 transition ease-in-out hover:-translate-y-1 delay-150 px-10 bg-primary rounded-xl flex flex-row gap-2 font-semibold text-white'>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={1.5} 
              stroke="currentColor" 
              className="w-6 h-6">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Pages
          </div>
        ): (
          <>
            <div 
              role='button'
              onClick={() => { 
                // setFormData({...formData, type: 'Page'});
                setType('Page');
                setIsOpenForm(true);
               }}
              className='py-4 transition ease-in-out hover:-translate-y-1 delay-150 px-10 bg-primary rounded-xl flex flex-row gap-2 font-semibold text-white'>
              Pages
            </div>
            <div 
              role='button'
              onClick={() => { 
                // setFormData({...formData, type: 'Link'});
                setType('Link');
                setIsOpenForm(true);
              }}
              className='py-4 transition ease-in-out hover:-translate-y-1 delay-150 px-10 bg-primary rounded-xl flex flex-row gap-2 font-semibold text-white'>
              Links
            </div>
          </>
        )}
      </div>
    )
  }

  const renderForm = () => {
    return (
      <div className='grid grid-cols-2 gap-10 p-4 border-b-2'>
        <div className='flex flex-row whitespace-nowrap items-center gap-10 text-lg font-bold'>
          Page Title
          <InputText 
            labelTitle='' 
            value={title}
            inputStyle='rounded-3xl' 
            onChange={(e) => { setTitle(e.target.value); }} />
        </div>
        <div className='flex flex-row whitespace-nowrap items-center gap-10 text-lg font-bold'>
          Type
          <DropDown
            defaultValue={type}
            items={[
              {
                value: 'Page',
                label: 'Page',
              },
              {
                value: 'Link',
                label: 'Link',
              },
            ]}
            onSelect={(e) => { setType(e.target.innerText); }}
          />
        </div>
        {type === 'Page' ? (
          <div className='flex flex-row whitespace-nowrap items-center gap-20 text-lg font-bold'>
            Page
            <DropDown
              defaultValue={page}
              items={[
                {
                  value: 'Page 1',
                  label: 'Page 1',
                },
                {
                  value: 'Page 2',
                  label: 'Page 2',
                },
              ]}
              onSelect={(e) => { setPage(e.target.innerText); }}
            />
          </div>
        ) : (
          <div className='flex flex-row whitespace-nowrap items-center gap-10 text-lg font-bold'>
            URL Link
            <InputText 
              labelTitle='' 
              value={urlLink}
              inputStyle='rounded-3xl' 
              onChange={(e) => { setUrlLink(e.target.value); }} />
          </div>
        )}
        <p></p>
        <div className='w-40 ml-28'>
          <CheckBox
            defaultValue={isOpenTab}
            updateFormValue={(e) => { setIsOpenTab(e.value); }} 
            labelTitle='Open in New Tab' />
        </div>
        <div 
          role='button'
          aria-disabled
          onClick={() => {
            onSave();
          }}
          className='py-4 w-28 place-self-end transition ease-in-out hover:-translate-y-1 delay-150 px-10 bg-primary rounded-xl flex flex-row gap-2 font-semibold text-white'>
          Save
        </div>
      </div>
    )
  }

  return (
    <>
      {/* <TitleCard title='Avrist Life Insurance' topMargin="mt-2">
      </TitleCard> */}
      <div className='p-5 text-2xl font-bold mb-5 gap-2 text-primary flex flex-row'>
        <img src={LifeInsurance} className='w-8' />
        Avrist Life Insurance
      </div>
      <div className='p-5 text-2xl font-semibold border-b-2 mb-10'>
        Menu Structure
      </div>
      {isOpenForm && renderForm()}
      {!isOpenForm && (
        <>
          {dataScructure?.length > 0 && (
            <SortableTreeComponent data={dataScructure} onChange={(e) => {
              setDataStructure(e)
              console.log(dataScructure)}} />
          )}
          {renderAddButtons()}
        </>
      )}
    </>
  );
}
