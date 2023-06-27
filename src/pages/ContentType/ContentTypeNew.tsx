import { TitleCard } from '../../components/molecules/Cards/TitleCard';
import { useTranslation } from 'react-i18next';
import { useRoleCreateMutation } from '../../services/Roles/rolesApi';
import { useAppDispatch } from '../../store';
import { useNavigate } from 'react-router-dom';
import ModalConfirmLeave from '../../components/molecules/ModalConfirm';
import CancelIcon from "../../assets/cancel.png";
import { JSXElementConstructor, Key, ReactElement, ReactFragment, ReactPortal, useState } from 'react';
import { InputText } from '@/components/atoms/Input/InputText';
import { CheckBox } from '@/components/atoms/Input/CheckBox';
import TableEdit from "../../assets/table-edit.png";
import TableDelete from "../../assets/table-delete.png";
import Modal from '@/components/atoms/Modal';

export default function ContentTypeNew() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [roleCreate, { isLoading: onSaveLoading }] = useRoleCreateMutation();
  const [showComfirm, setShowComfirm] = useState(false);
  const [titleConfirm, setTitleConfirm] = useState('');
  const [messageConfirm, setmessageConfirm] = useState('');

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [isUseCategory, setIsUseCategory] = useState(false);

  const [isOpenModalAttribute, setIsOpenModalAttribute] = useState(false);

  
  function getFieldId(value: string) {
    const str = value.replace(/\s+/g, '-').toLowerCase();
    
    return str;
  }
  
  function getType(value: string) {
    const str = value.replace(/_/g, ' ').toLowerCase();
    
    return str;
  }
  
  const [listItems, setListItems] = useState([
    {
      fieldType: 'TEXT_FIELD',
      name: 'Title',
      fieldId: '',
      config: [],
      isDeleted: false,
    },
    {
      fieldType: 'TEXT_AREA',
      name: 'Short Description',
      fieldId: '',
      config: [],
      isDeleted: false,
    }
  ]);

  const onLeave = () => {
    setShowComfirm(false);
    navigate('/roles');
  }

  const renderListItems = () => {
    return (
      <div className='my-5'>
        {listItems.map((val: { name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | null | undefined; fieldId: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined; fieldType: string; isDeleted: any; }, idx: Key | null | undefined) => (
          <div key={idx} className='py-2 px-10 flex flex-row justify-between m-4 bg-light-purple-2 rounded-lg hover:border-2 font-medium'>
            <div className='w-1/4 text-left'>{val.name}</div>
            <div className='w-1/4 text-center'>{val.fieldId ? val.fieldId : getFieldId(name)}</div>
            <div className='w-1/4 text-right capitalize'>{getType(val.fieldType)}</div>
            <div className='w-1/4 flex flex-row gap-5 items-center justify-center'>
              <img className={`cursor-pointer select-none flex items-center justify-center`} src={TableEdit} />
              {val.isDeleted && (
                <img className={`cursor-pointer select-none flex items-center justify-center`} src={TableDelete}/>
              )}
            </div>
          </div>
        ))}
        <div className='p-2 flex items-center justify-center'>
          <div 
            role='button'
            onClick={() => { setIsOpenModalAttribute(true); }}
            className='p-2 bg-lavender rounded-full'>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={1.5} 
              stroke="currentColor" 
              className="w-6 h-6 text-white">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
        </div>
      </div>
    )
  }

  const renderForm = () => {
    return (
      <div className='flex flex-col border-b-2 pb-8'>
        <div className='flex flex-row w-1/2 whitespace-nowrap items-center gap-10 text-lg font-bold'>
          <span className={`label-text text-base-content`}>Content Type Name<span className={'text-reddist text-lg'}>*</span></span>
          <InputText 
            labelTitle='' 
            placeholder={'Enter your new content name'}
            value={name}
            inputStyle='rounded-3xl' 
            onChange={(e) => { setName(e.target.value); }} />
        </div>
        <p></p>
        <div className='flex flex-row items-center'>
          <div className='flex flex-row w-1/2 whitespace-nowrap items-center gap-24 text-lg font-bold'>
            <span className={`label-text text-base-content`}>Slug Name<span className={'text-reddist text-lg'}>*</span></span>
            <InputText 
              labelTitle='' 
              placeholder={'Enter slug name'}
              value={slug}
              inputStyle='rounded-3xl' 
              onChange={(e) => { setSlug(e.target.value); }} />
          </div>
          <div className='ml-10'>
            <CheckBox
              defaultValue={isUseCategory}
              updateFormValue={(e) => { setIsUseCategory(e.value); } }
              labelTitle='Use Category' updateType={''} />
          </div>
        </div>
      </div>
    )
  }

  const modalListAttribute = () => {
    return (
      <Modal open={isOpenModalAttribute} toggle={() => null} title="" width={840} height={480}>
        <div className='flex flex-row'>
          <div className='p-2 absolute right-2 top-2'>
              <svg 
                  role='button'
                  onClick={() => { setIsOpenModalAttribute(false); }}
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth={1.5} 
                  stroke="currentColor" 
                  className="w-6 h-6 opacity-50">
                  <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      d="M6 18L18 6M6 6l12 12" />
              </svg>
          </div>
        </div>
      </Modal>
    )
  }

  return (
    <>
      {modalListAttribute()}
      <TitleCard title={'New Content Type'} topMargin="mt-2">
        <ModalConfirmLeave
          open={showComfirm}
          cancelAction={() => {
            setShowComfirm(false);
          }}
          title={titleConfirm}
          cancelTitle="No"
          message={messageConfirm}
          submitAction={onLeave}
          submitTitle="Yes"
          icon={CancelIcon}
          btnType='btn-warning'
        />
        {renderForm()}
        {renderListItems()}
        <div className="flex float-right gap-3">
          <button
            className="btn btn-outline btn-md"
            onClick={() => {
              setTitleConfirm('Are you sure?');
              setmessageConfirm(`Do you want to cancel all the process?`);
              setShowComfirm(true);
            }}>
            {t('btn.cancel')}
          </button>
          <button
            className="btn btn-success btn-md">
            {onSaveLoading ? 'Loading...' : t('btn.save')}
          </button>
        </div>
      </TitleCard>
    </>
  );
}
