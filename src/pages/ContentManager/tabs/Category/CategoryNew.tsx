import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ModalConfirmLeave from '@/components/molecules/ModalConfirm';
import WarningIcon from '@/assets/warning.png';
import { TitleCard } from '@/components/molecules/Cards/TitleCard';
import { InputText } from '@/components/atoms/Input/InputText';
import { TextArea } from '@/components/atoms/Input/TextArea';

export default function CategoryNew() {
  const { t } = useTranslation();
  const [showConfirm, setShowConfirm] = useState(false);
  const [titleConfirm, setTitleConfirm] = useState('');
  const [messageConfirm, setMessageConfirm] = useState('');

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  // GO BACK
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  const renderForm = () => {
    return (
      <div className="flex flex-col h-[60vh]">
        <div className="flex flex-row w-1/3 whitespace-nowrap items-center gap-11 text-lg font-bold">
          <span className={`label-text text-base-content`}>Category Name<span className={'text-reddist text-lg'}>*</span></span>
          <InputText
            labelTitle=""
            placeholder={'Enter category name'}
            value={name}
            roundStyle="xl"
            onChange={e => {
              setName(e.target.value);
            }}
          />
        </div>
        <p></p>
        <div className="flex flex-row items-center">
          <div className="flex flex-row w-1/3 whitespace-nowrap items-center gap-8 text-lg font-bold">
            <span className={`label-text text-base-content`}>Short Description<span className={'text-reddist text-lg'}>*</span></span>
            <TextArea
              labelTitle=""
              placeholder={'Enter description'}
              value={description}
              containerStyle="rounded-3xl"
              onChange={e => {
                setDescription(e.target.value);
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <ModalConfirmLeave
        open={showConfirm}
        cancelAction={() => {
          setShowConfirm(false);
        }}
        title={titleConfirm}
        cancelTitle="Cancel"
        message={messageConfirm}
        submitAction={() => {
          goBack();
        }}
        submitTitle="Yes"
        // loading={deletePageLoading}
        icon={WarningIcon}
        btnType={''}
      />
      <TitleCard title={'New Category'} topMargin="mt-2">
        {renderForm()}
        <div className="flex float-right gap-3">
          <button
            className="btn btn-outline btn-md"
            onClick={() => {
              setTitleConfirm('Are you sure?');
              setMessageConfirm(`Do you want to cancel all the process?`);
              setShowConfirm(true);
            }}>
            {t('btn.cancel')}
          </button>
          <button className="btn btn-success btn-md">{t('btn.create')}</button>
        </div>
      </TitleCard>
    </>
  );
}
