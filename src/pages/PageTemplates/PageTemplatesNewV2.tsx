import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';
import { useState, useCallback } from 'react';

import EditPurple from '@/assets/edit-purple.svg';
import CancelIcon from '@/assets/cancel.png';
import ModalConfirm from '@/components/molecules/ModalConfirm';
import ModalForm from '@/components/molecules/ModalForm';
import { TitleCard } from '@/components/molecules/Cards/TitleCard';

import Table from '@/components/molecules/Table';
import TableEdit from '@/assets/table-edit.png';
import TableDelete from '@/assets/table-delete.svg';

// import { useAppDispatch } from '../../store';
// import { useCreatePageTemplateMutation } from '../../services/PageTemplate/pageTemplateApi';
// import { openToast } from '../../components/atoms/Toast/slice';

import { useForm, Controller } from 'react-hook-form';
import FormList from '@/components/molecules/FormList';
// import { useRestoreDataMutation } from '../../services/ContentManager/contentManagerApi';

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
  const [openAddAttributesModal, setOpenAddAttributesModal] = useState<any>(false);

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

  // TABLE COLUMN
  const sampleData = [
    { attributes: 'AATR1', id: '1', desc: 'Desc 1' },
    { attributes: 'AATR2', id: '2', desc: 'Desc 2' },
  ];
  const attributesColumns = [
    {
      header: () => <span className="text-[14px]">Attribute Type</span>,
      accessorKey: 'attributes',
      enableSorting: false,
      cell: (info: any) => (
        <p className="text-[14px] truncate">
          {info.getValue() && info.getValue() !== '' && info.getValue() !== null
            ? info.getValue()
            : '-'}
        </p>
      ),
    },
    {
      header: () => <span className="text-[14px]">Field ID</span>,
      accessorKey: 'id',
      enableSorting: false,
      cell: (info: any) => (
        <p className="text-[14px] truncate">
          {info.getValue() && info.getValue() !== '' && info.getValue() !== null
            ? info.getValue()
            : '-'}
        </p>
      ),
    },
    {
      header: () => <span className="text-[14px]">Description</span>,
      accessorKey: 'desc',
      enableSorting: false,
      cell: (info: any) => (
        <p className="text-[14px] truncate">
          {info.getValue() && info.getValue() !== '' && info.getValue() !== null
            ? info.getValue()
            : '-'}
        </p>
      ),
    },
    {
      header: () => <span className="text-[14px]">Action</span>,
      accessorKey: 'id',
      enableSorting: false,
      cell: (_info: any) => (
        <div className="flex gap-3">
          <div className="tooltip" data-tip="Edit">
            <button>
              <img
                className={`cursor-pointer select-none flex items-center justify-center`}
                src={TableEdit}
                onClick={() => {
                  // onClickEmailFormBuilderEdit(info.getValue());
                }}
              />
            </button>
          </div>
          <div className="tooltip" data-tip="Delete">
            <img
              className={`cursor-pointer select-none flex items-center justify-center`}
              src={TableDelete}
              onClick={() => {
                // onClickEmailFormBuilderDelete(info.getValue());
              }}
            />
          </div>
        </div>
      ),
    },
  ];

  const configColumns = [
    {
      header: () => <span className="text-[14px]">Key</span>,
      accessorKey: 'id',
      enableSorting: false,
      cell: (info: any) => (
        <p className="text-[14px] truncate">
          {info.getValue() && info.getValue() !== '' && info.getValue() !== null
            ? info.getValue()
            : '-'}
        </p>
      ),
    },
    {
      header: () => <span className="text-[14px]">Description</span>,
      accessorKey: 'createdBy.name',
      enableSorting: false,
      cell: (info: any) => (
        <p className="text-[14px] truncate">
          {info.getValue() && info.getValue() !== '' && info.getValue() !== null
            ? info.getValue()
            : '-'}
        </p>
      ),
    },
    {
      header: () => <span className="text-[14px]">Action</span>,
      accessorKey: 'id',
      enableSorting: false,
      cell: (_info: any) => (
        <div className="flex gap-3">
          <div className="tooltip" data-tip="Edit">
            <button>
              <img
                className={`cursor-pointer select-none flex items-center justify-center`}
                src={TableEdit}
                onClick={() => {
                  // onClickEmailFormBuilderEdit(info.getValue());
                }}
              />
            </button>
          </div>
          <div className="tooltip" data-tip="Delete">
            <img
              className={`cursor-pointer select-none flex items-center justify-center`}
              src={TableDelete}
              onClick={() => {
                // onClickEmailFormBuilderDelete(info.getValue());
              }}
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <TitleCard
      title={t('page-template.add.title')}
      TopSideButtons={
        <button className="border-primary border-[1px] rounded-xl w-36 py-3 hover:bg-slate-100">
          <div className="flex flex-row gap-2 items-center justify-center text-xs normal-case font-bold text-primary">
            <img src={EditPurple} className="w-6 h-6 mr-1" />
            Edit Content
          </div>
        </button>
      }
      topMargin="mt-2">
      {/* ON CANCEL */}
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
      <ModalForm
        open={openAddAttributesModal}
        formTitle="Page Template"
        submitTitle={t('btn.save-alternate')}
        cancelTitle={t('btn.cancel')}
        cancelAction={() => {
          setOpenAddAttributesModal(false);
        }}
        submitAction={() => {}}>
        <p>Tezs</p>
      </ModalForm>
      <form
        onSubmit={handleSubmit(e => {
          e.preventDefault();
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
              required: { value: false, message: `Image preview is required` },
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
                  border={false}
                />
              );
            }}
          />

          <FormList.FieldButton
            name="Attribute"
            buttonTitle="Add Attribute"
            onClick={() => {
              setOpenAddAttributesModal(true);
            }}
          />
          <div className="ml-2 lg:ml-56 ">
            <Table
              rows={sampleData}
              columns={attributesColumns}
              manualPagination={true}
              manualSorting={true}
              // loading={isFetching}
              // error={isError}
            />
          </div>
          <FormList.FieldButton
            name="Config"
            buttonTitle="Add Config"
            onClick={() => {
              console.log('halo');
            }}
          />
          <div className="ml-2 lg:ml-56 ">
            <Table
              rows={[{}]}
              columns={configColumns}
              manualPagination={true}
              manualSorting={true}
              // loading={isFetching}
              // error={isError}
            />
          </div>

          <div className="flex justify-end items-end gap-2">
            <button
              className="btn btn-outline btn-md"
              onClick={e => {
                e.preventDefault();
                setLeaveTitleModalShow(t('modal.confirmation'));
                setMessageLeaveModalShow(t('modal.leave-confirmation'));
                setShowLeaveModal(true);
              }}>
              {/* {isLoading ? 'Loading...' : t('btn.cancel')} */}
              {t('btn.cancel')}
            </button>
            <button type="submit" className="btn btn-success btn-md text-white">
              {t('btn.save')}
            </button>
          </div>
        </div>
      </form>
    </TitleCard>
  );
}
