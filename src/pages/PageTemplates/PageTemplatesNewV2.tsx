import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';
import { useState, useCallback } from 'react';

import CancelIcon from '../../assets/cancel.png';
import ModalConfirm from '../../components/molecules/ModalConfirm';
import { TitleCard } from '../../components/molecules/Cards/TitleCard';
// import { useAppDispatch } from '../../store';
// import { useCreatePageTemplateMutation } from '../../services/PageTemplate/pageTemplateApi';
// import { openToast } from '../../components/atoms/Toast/slice';

import { useForm, Controller } from 'react-hook-form';
import FormList from '@/components/molecules/FormList';

export default function PageTemplatesNewV2() {
  const navigate = useNavigate();
  // const dispatch = useAppDispatch();
  // FORM STATE
  // const [pageName, setPageName] = useState('');
  // const [pageDescription, setPageDescription] = useState('');
  // const [pageFileName, setPageFileName] = useState('');
  // LEAVE MODAL
  const [showLeaveModal, setShowLeaveModal] = useState<boolean>(false);
  const [titleLeaveModalShow, setLeaveTitleModalShow] = useState<string | null>('');
  const [messageLeaveModalShow, setMessageLeaveModalShow] = useState<string | null>('');

  // FORM VALIDATION
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // RTK CREATE PAGE TEMPLATE
  // const [createPageTemplate, { isLoading }] = useCreatePageTemplateMutation();

  // const onSave = () => {
  //   const payload = {
  //     filenameCode: pageFileName,
  //     name: pageName,
  //     shortDesc: pageDescription,
  //   };
  //   createPageTemplate(payload)
  //     .unwrap()
  //     .then((d: any) => {
  //       dispatch(
  //         openToast({
  //           type: 'success',
  //           title: t('toast-success'),
  //           message: t('page-template.add.success-msg', { name: d.pageTemplateCreate.name }),
  //         }),
  //       );
  //       navigate('/page-template');
  //     })
  //     .catch(() => {
  //       dispatch(
  //         openToast({
  //           type: 'error',
  //           title: t('toast-failed'),
  //           message: t('page-template.add.failed-msg', { name: payload.name }),
  //         }),
  //       );
  //     });
  // };

  const onLeave = () => {
    setShowLeaveModal(false);
    navigate('/page-template');
  };

  return (
    <TitleCard title={t('page-template.add.title')} topMargin="mt-2">
      <ModalConfirm
        open={showLeaveModal}
        cancelAction={() => {
          setShowLeaveModal(false);
        }}
        title={titleLeaveModalShow ?? ''}
        cancelTitle="No"
        message={messageLeaveModalShow ?? ''}
        submitAction={onLeave}
        submitTitle="Yes"
        icon={CancelIcon}
        btnSubmitStyle="btn-warning"
      />
      <form
        onSubmit={handleSubmit(e => {
          console.log(e);
        })}
        className="flex flex-col w-100 mt-[35px]">
        <div className="flex flex-col gap-[30px]">
          <Controller
            key="pageName"
            name="pageName"
            control={control}
            defaultValue=""
            rules={{
              required: { value: true, message: `Page name is required` },
            }}
            render={({ field }) => {
              const onChange = useCallback((e: any) => {
                // handleFormChange(id, e.target.value, fieldType);
                field.onChange({ target: { value: e.target.value } });
              }, []);
              return (
                <FormList.TextField
                  {...field}
                  key="pageName"
                  labelTitle="Page Name"
                  labelRequired
                  placeholder="Enter page name"
                  error={!!errors?.pageName?.message}
                  helperText={errors?.pageName?.message}
                  onChange={onChange}
                  border={false}
                />
              );
            }}
          />
          <Controller
            key="pageDescription"
            name="pageDescription"
            control={control}
            defaultValue=""
            rules={{
              required: { value: true, message: `Page description is required` },
            }}
            render={({ field }) => {
              const onChange = useCallback((e: any) => {
                // handleFormChange(id, e.target.value, fieldType);
                field.onChange({ target: { value: e.target.value } });
              }, []);
              return (
                <FormList.TextField
                  {...field}
                  key="pageDescription"
                  labelTitle="Page Description"
                  labelRequired
                  placeholder="Enter page description"
                  error={!!errors?.pageDescription?.message}
                  helperText={errors?.pageDescription?.message}
                  onChange={onChange}
                  border={false}
                />
              );
            }}
          />
          <Controller
            key="pageFileName"
            name="pageFileName"
            control={control}
            defaultValue=""
            rules={{
              required: { value: true, message: `Page file name is required` },
            }}
            render={({ field }) => {
              const onChange = useCallback((e: any) => {
                // handleFormChange(id, e.target.value, fieldType);
                field.onChange({ target: { value: e.target.value } });
              }, []);
              return (
                <FormList.TextField
                  {...field}
                  key="pageFileName"
                  labelTitle="Page File Name"
                  labelRequired
                  placeholder="Enter page file name"
                  error={!!errors?.pageFileName?.message}
                  helperText={errors?.pageFileName?.message}
                  onChange={onChange}
                  border={false}
                />
              );
            }}
          />
          <Controller
            key="imagePreview"
            name="imagePreview"
            control={control}
            defaultValue=""
            rules={{
              required: { value: true, message: `Image Preview is required` },
            }}
            render={({ field }) => {
              const onChange = useCallback((e: any) => {
                // handleFormChange(id, e, fieldType);
                field.onChange({ target: { value: e } });
              }, []);
              return (
                <FormList.FileUploaderV2
                  {...field}
                  key="imagePreview"
                  labelTitle="Image Preview"
                  labelRequired
                  isDocument={false}
                  multiple={false}
                  error={!!errors?.imagePreview?.message}
                  helperText={errors?.imagePreview?.message}
                  onChange={onChange}
                />
              );
            }}
          />
          <div className="flex justify-end items-end gap-2">
            <button
              className="btn btn-outline btn-md"
              onClick={(event: any) => {
                event.preventDefault();
                setLeaveTitleModalShow(t('modal.confirmation'));
                setMessageLeaveModalShow(t('modal.leave-confirmation'));
                setShowLeaveModal(true);
              }}>
              {/* {isLoading ? 'Loading...' : t('btn.cancel')} */}
            </button>
            <button className="btn btn-success btn-md" type="submit">
              {/* {isLoading ? 'Loading...' : t('btn.save')} */}
            </button>
          </div>
        </div>
      </form>
    </TitleCard>
  );
}
