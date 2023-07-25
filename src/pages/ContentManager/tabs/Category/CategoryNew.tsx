import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import ModalConfirm from '@/components/molecules/ModalConfirm';
import WarningIcon from '@/assets/warning.png';
import { TitleCard } from '@/components/molecules/Cards/TitleCard';
import { InputText } from '@/components/atoms/Input/InputText';
import { TextArea } from '@/components/atoms/Input/TextArea';
import { useCreateCategoryMutation } from '@/services/ContentManager/contentManagerApi';
import { useAppDispatch } from '@/store';
import { openToast } from '@/components/atoms/Toast/slice';

export default function CategoryNew() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // FORM STATE
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  // LEAVE MODAL
  const [showLeaveModal, setShowLeaveModal] = useState<boolean>(false);
  const [titleLeaveModalShow, setLeaveTitleModalShow] = useState<string | null>("");
  const [messageLeaveModalShow, setMessageLeaveModalShow] = useState<string | null>("");

  // RTK CREATE CONTENT MANAGER CATEGORY
  const [ createContentCategory, {
    isLoading,
  }] = useCreateCategoryMutation();

  const onSave = () => {
    const payload = {
      postTypeId: id,
      name,
      shortDesc: description,
    };
    createContentCategory(payload)
      .unwrap()
      .then(() => {
        dispatch(
          openToast({
            type: 'success',
            title: t('toast-success'),
            message: t('content-manager.category.add.success-msg', { name: payload.name }),
          }),
        );
        navigate(`/content-manager/${id}`);
      })
      .catch(() => {
        dispatch(
          openToast({
            type: 'error',
            title: t('toast-failed'),
            message: t('content-manager.category.add.failed-msg', { name: payload.name }),
          }),
        );
      });
  };

  const onLeave = () => {
    setShowLeaveModal(false);
    navigate(-1);
  };

  const renderForm = () => {
    return (
      <form className="flex flex-col w-100 mt-[35px]">
        <div className="flex flex-col gap-[30px]">
          <InputText
            labelTitle="Category Name"
            labelStyle="font-bold	"
            value={name}
            direction="row"
            roundStyle="xl"
            inputWidth={300}
            placeholder="Enter category name"
            onChange={(event: any) => {
              setName(event.target.value);
            }}
          />
          <TextArea
            labelTitle="Category Name"
            labelStyle="font-bold	"
            value={description}
            direction="row"
            textAreaStyle='rounded-xl'
            inputWidth={300}
            rows={4}
            placeholder="Enter description"
            onChange={(event: any) => {
              setDescription(event.target.value);
            }}
          />
        </div>
      </form>
    );
  };

  return (
    <>
      <ModalConfirm
        open={showLeaveModal}
        title={titleLeaveModalShow ?? ''}
        cancelTitle="Cancel"
        message={messageLeaveModalShow ?? ''}
        submitTitle="Yes"
        icon={WarningIcon}
        submitAction={onLeave}
        cancelAction={() => {
          setShowLeaveModal(false);
        }}
      />
      <TitleCard title={t('content-manager.category.add.title')} topMargin="mt-2">
        {renderForm()}
        <div className="mt-[200px] flex justify-end items-end gap-2">
          <button className="btn btn-outline btn-md" onClick={(event: any) => {
            event.preventDefault();
            setLeaveTitleModalShow(t('modal.confirmation'));
            setMessageLeaveModalShow(t('modal.leave-confirmation'));
            setShowLeaveModal(true);          
          }}>
            {isLoading ? 'Loading...' : t('btn.cancel')}
          </button>
          <button className="btn btn-success btn-md" onClick={(event: any) => {
            event.preventDefault();
            onSave();
          }}>
            {isLoading ? 'Loading...' : t('btn.save')}
          </button>
        </div>
      </TitleCard>
    </>
  );
}
