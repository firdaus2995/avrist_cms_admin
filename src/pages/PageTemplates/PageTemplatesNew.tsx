import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { t } from 'i18next';

import EditPurple from '@/assets/edit-purple.svg';
import CancelIcon from '@/assets/cancel.png';
import ModalConfirm from '@/components/molecules/ModalConfirm';
import ModalForm from '@/components/molecules/ModalForm';
import { TitleCard } from '@/components/molecules/Cards/TitleCard';
import Typography from '@/components/atoms/Typography';
import Table from '@/components/molecules/Table';
import TableEdit from '@/assets/table-edit.png';
import TableDelete from '@/assets/table-delete.svg';
import FormList from '@/components/molecules/FormList';

import { useAppDispatch } from '@/store';
import {
  useCreatePageTemplateMutation,
  useGetPageTemplateByIdQuery,
  useEditPageTemplateMutation,
} from '@/services/PageTemplate/pageTemplateApi';
import { useGetConfigQuery } from '@/services/ContentType/contentTypeApi';
import { openToast } from '@/components/atoms/Toast/slice';

const initialAttributes = {
  fieldType: '',
  fieldId: '',
  description: '',
};

const initialConfig = {
  key: '',
  description: '',
};

export default function PageTemplatesNew() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const params = useParams();
  const location = useLocation();
  // FORM VALIDATION
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  // DEFAULT MODE
  const [mode, setMode] = useState('new');

  // LEAVE MODAL STATE
  const [showLeaveModal, setShowLeaveModal] = useState<boolean>(false);
  const [titleLeaveModalShow, setLeaveTitleModalShow] = useState<string | null>('');
  const [messageLeaveModalShow, setMessageLeaveModalShow] = useState<string | null>('');
  const [openAddAttributesModal, setOpenAddAttributesModal] = useState<any>(false);
  const [openAddConfigModal, setOpenAddConfigModal] = useState<any>(false);
  // ATTRIBUTES LIST STATE
  const [listAttributes, setListAttributes] = useState<any>([]);
  // TABLE DATA - ATTRIBUTES
  const [attributesEditIndex, setAttributesEditIndex] = useState(null);
  const [newAttributes, setNewAttributes] = useState<any>({
    fieldType: '',
    fieldId: '',
    description: '',
  });
  const [attributesData, setAttributesData] = useState<any>([]);
  // TABLE DATA - CONFIG
  const [configEditIndex, setConfigEditIndex] = useState(null);
  const [newConfig, setNewConfig] = useState<any>(initialConfig);
  const [configData, setConfigData] = useState<any>([]);
  // TABLE DATA FORM VALIDATION
  const [attributesErrors, setAttributesErrors] = useState({
    fieldType: '',
    fieldId: '',
    description: '',
  });

  const [configErrors, setConfigErrors] = useState({
    key: '',
    description: '',
  });

  // ATTRIBUTES FUNCTION
  const onAddNewAttributes = () => {
    if (!newAttributes.fieldType) {
      setAttributesErrors(prevErrors => ({
        ...prevErrors,
        fieldType: 'Field Type is required',
      }));
      return;
    }
    if (!newAttributes.fieldId) {
      setAttributesErrors(prevErrors => ({
        ...prevErrors,
        fieldId: 'Field ID is required',
      }));
      return;
    }

    setAttributesErrors({
      fieldType: '',
      fieldId: '',
      description: '',
    });

    if (attributesEditIndex !== null) {
      const updatedAttributes = [...attributesData];
      updatedAttributes[attributesEditIndex] = newAttributes;
      setAttributesData(updatedAttributes);
      setNewAttributes(initialAttributes);
      setAttributesEditIndex(null);
    } else {
      setAttributesData((current: any) => [...current, newAttributes]);
      setNewAttributes(initialAttributes);
    }
    setOpenAddAttributesModal(false);
  };
  const onDeleteAttributes = (indexToDelete: any) => {
    const updatedItems = attributesData.filter((_item: any, index: any) => index !== indexToDelete);
    setAttributesData(updatedItems);
  };

  // CONFIG FUNCTION
  const onAddNewConfig = () => {
    if (!newConfig.key) {
      setConfigErrors(prevErrors => ({
        ...prevErrors,
        key: 'Key is required',
      }));
      return;
    }
    if (configEditIndex !== null) {
      const updatedConfig = [...configData];
      updatedConfig[configEditIndex] = newConfig;
      setConfigData(updatedConfig);
      setNewConfig(initialConfig);
      setConfigEditIndex(null);
    } else {
      setConfigData((current: any) => [...current, newConfig]);
      setNewConfig(initialConfig);
    }
    setOpenAddConfigModal(false);
  };
  const onDeleteConfig = (indexToDelete: any) => {
    const updatedItems = configData.filter((_item: any, index: any) => index !== indexToDelete);
    setConfigData(updatedItems);
  };

  // RTK CREATE PAGE TEMPLATE
  const [createPageTemplate, { isLoading }] = useCreatePageTemplateMutation();
  // RTK EDIT
  const [editedPageTemplate, { isLoading: isLoadingEdit }] = useEditPageTemplateMutation();
  // RTK GET DATA DETAIL
  const fetchPageTemplateQuery = useGetPageTemplateByIdQuery(params);
  const { data: pageTemplate, isLoading: isLoadingPageTemplate } = fetchPageTemplateQuery;
  // RTK ATTRIBUTES LIST
  const fetchConfigQuery = useGetConfigQuery<any>({});
  const { data } = fetchConfigQuery;

  const onSubmit = (e: any) => {
    if (e.pageId) {
      onSubmitEdit(e);
    } else {
      onSubmitNew(e);
    }
  };

  const onSubmitEdit = (e: any) => {
    const updatedAttributesData = attributesData.map((item: any) => ({
      ...item,
      fieldType: item.fieldType.value.toUpperCase(),
    }));
    const payload = {
      id: Number(e.pageId),
      filenameCode: e.pageFileName,
      name: e.pageName,
      shortDesc: e.pageDescription,
      attributes: updatedAttributesData,
      configs: configData,
    };
    editedPageTemplate(payload)
      .unwrap()
      .then((d: any) => {
        dispatch(
          openToast({
            type: 'success',
            title: t('toast-success'),
            message: t('page-template.edit.success-msg', { name: d.pageTemplateUpdate.name }),
          }),
        );
        navigate('/page-template');
      })
      .catch(() => {
        dispatch(
          openToast({
            type: 'error',
            title: t('toast-failed'),
            message: t('page-template.edit.failed-msg', { name: payload.name }),
          }),
        );
      });
  };

  const onSubmitNew = (e: any) => {
    const updatedAttributesData = attributesData.map((item: any) => ({
      ...item,
      fieldType: item.fieldType.value.toUpperCase(),
    }));
    const payload = {
      filenameCode: e.pageFileName,
      name: e.pageName,
      shortDesc: e.pageDescription,
      attributes: updatedAttributesData,
      configs: configData,
    };
    createPageTemplate(payload)
      .unwrap()
      .then((d: any) => {
        dispatch(
          openToast({
            type: 'success',
            title: t('toast-success'),
            message: t('page-template.add.success-msg', { name: d.pageTemplateCreate.name }),
          }),
        );
        navigate('/page-template');
      })
      .catch(() => {
        dispatch(
          openToast({
            type: 'error',
            title: t('toast-failed'),
            message: t('page-template.add.failed-msg', { name: payload.name }),
          }),
        );
      });
  };

  // SET DEFAULT PAGE MODE
  useEffect(() => {
    if (location.pathname.includes('/edit')) {
      setMode('edit');
    } else if (location.pathname.includes('/detail')) {
      setMode('detail');
    } else {
      setMode('new');
    }
  }, [location.pathname]);

  // FETCH DEFAULT FORM DATA FOR DETAIL / EDIT
  useEffect(() => {
    if (mode !== 'new') {
      const refetch = async () => {
        await fetchPageTemplateQuery.refetch();
      };
      void refetch();
    }
  }, [mode]);

  // FILL DATA FOR DETAIL / EDIT
  useEffect(() => {
    const data = pageTemplate?.pageTemplateById;
    if (data && listAttributes) {
      const defaultPageName = data?.name || '';
      const defaultPageDescription = data?.shortDesc || '';
      const defaultPageFileName = data?.filenameCode || '';
      const defaultPageId = data?.id || '';

      setValue('pageName', defaultPageName);
      setValue('pageDescription', defaultPageDescription);
      setValue('pageFileName', defaultPageFileName);
      setValue('pageId', defaultPageId);

      const originalAttributes = data?.attributes;
      const combineAttributes = originalAttributes.map((item: any) => ({
        ...item,
        fieldType: listAttributes?.find(
          (option: any) => option.value.toLowerCase() === item.fieldType.toLowerCase(),
        ),
      }));
      setAttributesData(combineAttributes);
      setConfigData(data?.configs);
    }
  }, [pageTemplate, listAttributes]);

  //  FETCH CONFIG QUERY
  useEffect(() => {
    const refetch = async () => {
      await fetchConfigQuery.refetch();
    };
    void refetch();
  }, []);

  useEffect(() => {
    if (data?.getConfig?.value) {
      const newArray = JSON.parse(data?.getConfig?.value)?.attributes?.map((item: any) => {
        return { value: item.code, label: item.label };
      });
      setListAttributes(newArray);
    }
  }, [data]);

  const onLeave = () => {
    setShowLeaveModal(false);
    navigate(-1);
  };

  const attributesColumns = [
    {
      header: () => <span className="text-[14px]">Attribute Type</span>,
      accessorKey: 'fieldType',
      enableSorting: false,
      cell: (info: any) => {
        const newInfo = info?.row?.original?.fieldType?.value?.toUpperCase();
        return (
          <p className="text-[14px] truncate">
            {newInfo && newInfo !== '' && newInfo !== null ? newInfo : '-'}
          </p>
        );
      },
    },
    {
      header: () => <span className="text-[14px]">Field ID</span>,
      accessorKey: 'fieldId',
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
      accessorKey: 'description',
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
      cell: (info: any) => {
        if (mode === 'detail') {
          return <div />;
        }
        return (
          <div className="flex gap-3">
            <div className="tooltip" data-tip="Edit">
              <button>
                <img
                  className={`cursor-pointer select-none flex items-center justify-center`}
                  src={TableEdit}
                  onClick={e => {
                    e.preventDefault();
                    setAttributesEditIndex(info.row.index);
                    setNewAttributes(info.row.original);
                    setOpenAddAttributesModal(true);
                  }}
                />
              </button>
            </div>
            <div className="tooltip" data-tip="Delete">
              <img
                className={`cursor-pointer select-none flex items-center justify-center`}
                src={TableDelete}
                onClick={e => {
                  e.preventDefault();
                  onDeleteAttributes(info.row.index);
                }}
              />
            </div>
          </div>
        );
      },
    },
  ];

  const configColumns = [
    {
      header: () => <span className="text-[14px]">Key</span>,
      accessorKey: 'key',
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
      accessorKey: 'description',
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
      cell: (info: any) => {
        if (mode === 'detail') {
          return <div />;
        }
        return (
          <div className="flex gap-3">
            <div className="tooltip" data-tip="Edit">
              <button>
                <img
                  className={`cursor-pointer select-none flex items-center justify-center`}
                  src={TableEdit}
                  onClick={e => {
                    e.preventDefault();
                    setConfigEditIndex(info.row.index);
                    setNewConfig(info.row.original);
                    setOpenAddConfigModal(true);
                  }}
                />
              </button>
            </div>
            <div className="tooltip" data-tip="Delete">
              <img
                className={`cursor-pointer select-none flex items-center justify-center`}
                src={TableDelete}
                onClick={e => {
                  e.preventDefault();
                  onDeleteConfig(info.row.index);
                }}
              />
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <TitleCard
      title={`${mode === 'edit' ? 'Edit ' : ''}${t('page-template.add.title')}`}
      TopSideButtons={
        mode === 'detail' ? (
          <Link to={`/page-template/edit/${params?.id}`}>
            <button className="border-primary border-[1px] rounded-xl w-36 py-3 hover:bg-slate-100">
              <div className="flex flex-row gap-2 items-center justify-center text-xs normal-case font-bold text-primary">
                <img src={EditPurple} className="w-6 h-6 mr-1" />
                Edit Content
              </div>
            </button>
          </Link>
        ) : (
          <div />
        )
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
      {/*  THIS IS ATTRIBUTES FORM */}
      <ModalForm
        height={640}
        open={openAddAttributesModal}
        formTitle="Add Attribute"
        submitTitle={t('btn.save')}
        submitType="btn-success"
        cancelTitle={t('btn.cancel')}
        cancelAction={() => {
          setOpenAddAttributesModal(false);
        }}
        submitAction={onAddNewAttributes}>
        <div className="flex flex-col gap-5 w-full">
          <div className="flex flex-row">
            <Typography type="body" size="m" weight="bold" className="w-56 ml-1">
              Attribute Type
              <span className={'text-reddist text-lg'}>{`*`}</span>
            </Typography>
            <FormList.DropDown
              key="category"
              labelTitle="Category"
              defaultValue={newAttributes.fieldType.label}
              resetValue={openAddAttributesModal}
              error={!!attributesErrors.fieldType}
              helperText={attributesErrors.fieldType}
              themeColor="primary"
              items={listAttributes}
              onChange={(e: any) => {
                setNewAttributes({
                  ...newAttributes,
                  fieldType: e,
                });
              }}
            />
          </div>
          <FormList.TextField
            key="fieldId"
            labelTitle="Field ID"
            labelRequired
            themeColor="primary"
            placeholder="Enter field ID"
            value={newAttributes.fieldId}
            error={!!attributesErrors.fieldId}
            helperText={attributesErrors.fieldId}
            onChange={(e: any) => {
              setNewAttributes({ ...newAttributes, fieldId: e.target.value });
            }}
            border={false}
          />
          <FormList.TextAreaField
            key="description"
            labelTitle="Description"
            themeColor="primary"
            placeholder="Enter description"
            value={newAttributes.description}
            onChange={(e: any) => {
              setNewAttributes({ ...newAttributes, description: e.target.value });
            }}
            border={false}
          />
        </div>
      </ModalForm>
      {/*  THIS IS CONFIG FORM */}
      <ModalForm
        open={openAddConfigModal}
        formTitle="Add Config"
        submitType="btn-success"
        submitTitle={t('btn.save')}
        cancelTitle={t('btn.cancel')}
        cancelAction={() => {
          setOpenAddConfigModal(false);
        }}
        submitAction={onAddNewConfig}>
        <div className="flex flex-col gap-5 w-full">
          <FormList.TextField
            key="key"
            labelTitle="Key"
            labelRequired
            placeholder="Enter key"
            value={newConfig.key}
            error={!!configErrors.key}
            helperText={configErrors.key}
            onChange={(e: any) => {
              setNewConfig({ ...newConfig, key: e.target.value });
            }}
            border={false}
          />
          <FormList.TextAreaField
            key="description"
            labelTitle="Description"
            placeholder="Enter description"
            // error={!!errors?.pageName?.message}
            // helperText={errors?.pageName?.message}
            value={newConfig.description}
            onChange={(e: any) => {
              setNewConfig({ ...newConfig, description: e.target.value });
            }}
            border={false}
          />
        </div>
      </ModalForm>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-100 mt-[35px]">
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
                  disabled={mode === 'detail'}
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
                  disabled={mode === 'detail'}
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
              pattern: {
                value: /^[^\s-]+$/,
                message: "Entered value can't contain spaces or dash",
              },
            }}
            render={({ field }) => {
              const onChange = useCallback((e: any) => {
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
                  disabled={mode === 'detail'}
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
                field.onChange({ target: { value: e } });
              }, []);
              return (
                <FormList.FileUploaderV2
                  {...field}
                  key="imagePreview"
                  labelTitle="Image Preview"
                  labelRequired
                  labelText={
                    <>
                      Drag and Drop Image Template Preview or click to{' '}
                      <span className="text-primary font-semibold">Browse</span>
                    </>
                  }
                  isDocument={false}
                  multiple={false}
                  error={!!errors?.imagePreview?.message}
                  helperText={errors?.imagePreview?.message}
                  onChange={onChange}
                  border={false}
                  disabled={mode === 'detail'}
                />
              );
            }}
          />

          <FormList.FieldButton
            name="Attribute"
            buttonTitle="Add Attribute"
            visible={mode !== 'detail'}
            onClick={() => {
              setOpenAddAttributesModal(true);
            }}
          />
          {attributesData.length ? (
            <div className="ml-2 lg:ml-56 ">
              <Table
                rows={attributesData}
                columns={attributesColumns}
                manualPagination={true}
                manualSorting={true}
                loading={isLoadingPageTemplate}
                // error={isError}
              />
            </div>
          ) : (
            <div />
          )}
          <FormList.FieldButton
            name="Config"
            buttonTitle="Add Config"
            visible={mode !== 'detail'}
            onClick={() => {
              setOpenAddConfigModal(true);
            }}
          />
          {configData.length ? (
            <div className="ml-2 lg:ml-56 ">
              <Table
                rows={configData}
                columns={configColumns}
                manualPagination={true}
                manualSorting={true}
                loading={isLoadingPageTemplate}
                // error={isError}
              />
            </div>
          ) : (
            <div />
          )}

          {mode !== 'detail' ? (
            <div className="flex justify-end items-end gap-2">
              <button
                className="btn btn-outline btn-md"
                onClick={e => {
                  e.preventDefault();
                  setLeaveTitleModalShow(t('modal.confirmation'));
                  setMessageLeaveModalShow(t('modal.leave-confirmation'));
                  setShowLeaveModal(true);
                }}>
                {isLoading | isLoadingEdit ? 'Loading...' : t('btn.cancel')}
              </button>
              <button type="submit" className="btn btn-success btn-md text-white">
                {isLoading | isLoadingEdit ? 'Loading...' : t('btn.save')}
              </button>
            </div>
          ) : null}
        </div>
      </form>
    </TitleCard>
  );
}
