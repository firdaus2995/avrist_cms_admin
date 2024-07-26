import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import ModalConfirm from '@/components/molecules/ModalConfirm';
import WarningIcon from '@/assets/warning.png';
import { TitleCard } from '@/components/molecules/Cards/TitleCard';
import { InputText } from '@/components/atoms/Input/InputText';
import { TextArea } from '@/components/atoms/Input/TextArea';
import { useAppDispatch } from '@/store';
import { openToast } from '@/components/atoms/Toast/slice';
import {
  useEditCategoryMutation,
  useGetCategoryDetailQuery,
} from '@/services/ContentManager/contentManagerApi';

export default function CategoryEdit() {
  const { t } = useTranslation();
  const { id, categoryid } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // FORM STATE
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  // LEAVE MODAL
  const [showLeaveModal, setShowLeaveModal] = useState<boolean>(false);
  const [titleLeaveModalShow, setLeaveTitleModalShow] = useState<string | null>('');
  const [messageLeaveModalShow, setMessageLeaveModalShow] = useState<string | null>('');

  // RTK GET CONTENT MANAGER CATEGORY
  const fetchCategoryDetailQuery = useGetCategoryDetailQuery(
    { id: categoryid },
    {
      refetchOnMountOrArgChange: true,
    },
  );
  const { data } = fetchCategoryDetailQuery;
  // RTK EDIT CONTENT MANAGER CATEGORY
  const [editContentCategory, { isLoading }] = useEditCategoryMutation();

  useEffect(() => {
    if (data) {
      const categoryDetail = data?.categoryDetail;
      setName(categoryDetail.name);
      setDescription(categoryDetail.shortDesc);
    }
  }, [data]);

  const onSave = () => {
    const payload = {
      id: categoryid,
      name,
      shortDesc: description,
    };
    editContentCategory(payload)
      .unwrap()
      .then(() => {
        dispatch(
          openToast({
            type: 'success',
            title: t('toast-success'),
            message: t('content-manager.category.edit.success-msg', { name: payload.name }),
          }),
        );
        navigate(`/content-manager/${id}`, { state: { activeTabParams: 3 } });
        setTimeout(() => {
          window.location.reload();
        }, 100);
      })
      .catch(() => {
        dispatch(
          openToast({
            type: 'error',
            title: t('toast-failed'),
            message: t('content-manager.category.edit.failed-msg', { name: payload.name }),
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
            labelTitle={t('user.tabs-category-edit.content-manager.category.edit.title')}
            labelStyle="font-bold	"
            value={name}
            direction="row"
            roundStyle="xl"
            inputWidth={300}
            placeholder={t('user.tabs-category-edit.content-manager.category.edit.title')}
            onChange={(event: any) => {
              setName(event.target.value);
            }}
          />
          <TextArea
            labelTitle={t('user.tabs-category-edit.content-manager.category.edit.title')}
            labelStyle="font-bold	"
            value={description}
            direction="row"
            textAreaStyle="rounded-xl"
            inputWidth={300}
            rows={4}
            placeholder={t('user.tabs-category-edit.content-manager.category.edit.title') ?? ''}
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
        cancelTitle={t('user.tabs-category-edit.btn.cancel')}
        message={messageLeaveModalShow ?? ''}
        submitTitle={t('user.tabs-category-edit.btn.save')}
        icon={WarningIcon}
        submitAction={onLeave}
        cancelAction={() => {
          setShowLeaveModal(false);
        }}
      />
      <TitleCard title={t('content-manager.category.edit.title')} topMargin="mt-2">
        {renderForm()}
        <div className="mt-[200px] flex justify-end items-end gap-2">
          <button
            className="btn btn-outline btn-md"
            onClick={(event: any) => {
              event.preventDefault();
              setLeaveTitleModalShow(t('modal.confirmation'));
              setMessageLeaveModalShow(t('modal.leave-confirmation'));
              setShowLeaveModal(true);
            }}>
            {isLoading ? 'Loading...' : t('btn.cancel')}
          </button>
          <button
            className="btn btn-success btn-md text-white"
            onClick={(event: any) => {
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
