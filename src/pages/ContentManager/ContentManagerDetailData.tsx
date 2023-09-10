import { Key, useCallback, useEffect, useState } from 'react';
import { TitleCard } from '@/components/molecules/Cards/TitleCard';
import Typography from '@/components/atoms/Typography';
import {
  useGetCategoryListQuery,
  useGetContentDataDetailQuery,
  useRestoreContentDataMutation,
  useUpdateContentDataMutation,
  useUpdateContentDataStatusMutation,
} from '@/services/ContentManager/contentManagerApi';
import { useNavigate, useParams } from 'react-router-dom';
import FormList from '@/components/molecules/FormList';

import { store, useAppDispatch } from '@/store';
import { Controller, useForm } from 'react-hook-form';
import Plus from '@/assets/plus-purple.svg';
import Edit from '@/assets/edit-purple.svg';
import Restore from '@/assets/restore.svg';
import RestoreOrange from '@/assets/restore-orange.svg';
import CheckOrange from '@/assets/check-orange.svg';
import { InputText } from '@/components/atoms/Input/InputText';
import { TextArea } from '@/components/atoms/Input/TextArea';
import StatusBadge from './components/StatusBadge';
import { ButtonMenu } from '@/components/molecules/ButtonMenu';
import { CheckBox } from '@/components/atoms/Input/CheckBox';
import ModalConfirm from '@/components/molecules/ModalConfirm';
import PaperIcon from '../../assets/paper.png';
import WarningIcon from '@/assets/warning.png';
import { openToast } from '@/components/atoms/Toast/slice';
import ModalForm from '@/components/molecules/ModalForm';

export default function ContentManagerDetailData() {
  const dispatch = useAppDispatch();
  const [contentDataDetailList, setContentDataDetailList] = useState<any>({
    id: null,
    title: '',
    shortDesc: '',
    categoryName: '',
    status: '',
    contentData: [],
  });
  const [isEdited, setIsEdited] = useState(false);
  const [isAlreadyReview, setIsAlreadyReview] = useState(false);
  const [showModalReview, setShowModalReview] = useState(false);
  const [showModalWarning, setShowModalWarning] = useState(false);
  const [showModalApprove, setShowModalApprove] = useState(false);
  const [showModalRejected, setShowModalRejected] = useState(false);
  const [rejectComments, setRejectComments] = useState('');
  const [showArchivedModal, setShowArchivedModal] = useState(false);
  const roles = store.getState().loginSlice.roles;

  const handleChange = (id: string | number, value: string) => {
    setContentDataDetailList((prevFormValues: any) => ({
      ...prevFormValues,
      [id]: value,
    }));
  };

  // FORM VALIDATION
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [contentTempData, setContentTempData] = useState<any[]>([]);

  // GO BACK
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  const params = useParams();
  const [id] = useState<any>(Number(params.dataId));

  // TABLE PAGINATION STATE
  const [categoryList, setCategoryList] = useState<any>([]);
  const [postTypeId] = useState(1);
  const [pageIndex] = useState(0);
  const [pageLimit] = useState(10);
  const [direction] = useState('asc');
  const [search] = useState('');
  const [sortBy] = useState('id');

  // RTK GET DATA
  const fetchGetContentDataDetail = useGetContentDataDetailQuery({ id });
  const { data: contentDataDetail } = fetchGetContentDataDetail;

  useEffect(() => {
    if (contentDataDetail) {
      setContentDataDetailList(contentDataDetail?.contentDataDetail);
    }
  }, [contentDataDetail]);

  useEffect(() => {
    void fetchGetContentDataDetail.refetch();
  }, []);

  const [mainForm] = useState<any>({
    title: '',
    shortDesc: '',
    categoryName: '',
  });

  const handleFormChange = (
    id: string | number,
    value: any,
    fieldType?: string,
    isLooping: boolean = false,
    parentId: any = false,
    idxLoop: any = false,
    nestedId: any = false,
  ) => {
    setContentTempData((prevFormValues: any[]) => {
      return prevFormValues.map(item => {
        if (item.id === id || item.id === parentId) {
          if (!isLooping) {
            return { ...item, value, fieldType };
          } else if (item.fieldType === 'LOOPING') {
            const updatedContentData = item.contentData.map((data: any, idx: any) => {
              if (idxLoop === idx) {
                const updatedDetails = data.details.map((detail: any) => {
                  if (detail.id === nestedId) {
                    return { ...detail, value };
                  }
                  return detail;
                });

                return { ...data, details: updatedDetails };
              }
              return data;
            });

            return { ...item, contentData: updatedContentData };
          }
        }
        return item;
      });
    });
  };

  const fetchGetCategoryList = useGetCategoryListQuery({
    postTypeId,
    pageIndex,
    limit: pageLimit,
    direction,
    search,
    sortBy,
  });
  const { data: categoryListData } = fetchGetCategoryList;

  useEffect(() => {
    if (categoryListData) {
      const tempCategoryList = categoryListData?.categoryList?.categoryList.map((element: any) => {
        return {
          value: Number(element.id),
          label: element.name,
        };
      });
      setCategoryList(tempCategoryList);
    }
  }, [categoryListData]);

  // RTK POST DATA
  const [updateContentData] = useUpdateContentDataMutation();
  const [updateContentDataStatus] = useUpdateContentDataStatusMutation();
  const [restoreContentData] = useRestoreContentDataMutation();

  const convertContentData = (inputData: any[]) => {
    const convertedData = [];

    for (const item of inputData) {
      if (item.fieldType === 'LOOPING' && item.contentData) {
        const contentData: any = {};

        for (const detail of item.contentData[0].details) {
          contentData[detail.id] = {
            id: detail.id,
            fieldType: detail.fieldType,
            value: JSON.stringify(
              item.contentData.map(
                (data: { details: any[] }) =>
                  data.details.find((d: { id: any }) => d.id === detail.id)?.value,
              ),
            ),
          };
        }

        const loopItem = {
          id: item.id,
          value: item.value,
          fieldType: item.fieldType,
          contentData: Object.values(contentData),
        };

        convertedData.push(loopItem);
      } else {
        convertedData.push(item);
      }
    }

    return convertedData;
  };

  function onSubmitData() {
    const payload = {
      title: contentDataDetailList?.title,
      shortDesc: contentDataDetailList?.shortDesc,
      isDraft: false,
      postTypeId: id,
      categoryName: contentDataDetailList?.isUseCategory ? mainForm.categoryName : '',
      contentData: convertContentData(contentTempData),
    };

    updateContentData(payload)
      .unwrap()
      .then(() => {
        dispatch(
          openToast({
            type: 'success',
            title: 'Success',
          }),
        );
        goBack();
      })
      .catch(() => {
        dispatch(
          openToast({
            type: 'error',
            title: 'Failed',
          }),
        );
        goBack();
      });
  }

  useEffect(() => {
    const attributeList = contentDataDetailList?.contentData || [];
    if (attributeList.length > 0 && contentTempData.length === 0) {
      const defaultFormData = attributeList.map((attribute: any) => {
        if (attribute.fieldType === 'LOOPING' && attribute.contentData) {
          const loopingContentData = attribute.contentData.map((nestedAttribute: any) => ({
            details: nestedAttribute.details.map((detail: any) => ({
              id: detail.id,
              name: detail.name,
              fieldType: detail.fieldType,
              value: detail.value,
            })),
          }));

          return {
            id: attribute.id,
            value: attribute.value,
            fieldType: attribute.fieldType,
            contentData: loopingContentData,
          };
        } else {
          return {
            id: attribute.id,
            value: attribute.value,
            fieldType: attribute.fieldType,
          };
        }
      });
      setContentTempData(defaultFormData);
    }
  }, [contentDataDetailList?.contentData]);

  const addNewLoopingField = (loopingId: any) => {
    const existingLoopingIndex: number = contentDataDetailList.contentData.findIndex(
      (attribute: { id: string }) => attribute.id === loopingId,
    );

    if (existingLoopingIndex !== -1) {
      const newLoopingField = {
        ...contentDataDetailList.contentData[existingLoopingIndex],
        contentData: [
          ...contentDataDetailList.contentData[existingLoopingIndex].contentData,
          {
            details: contentDataDetailList.contentData[
              existingLoopingIndex
            ].contentData[0].details.map((detail: any) => ({
              ...detail,
              value: '',
            })),
          },
        ],
      };

      const newAttributeList = [...contentDataDetailList.contentData];
      newAttributeList[existingLoopingIndex] = newLoopingField;

      setContentDataDetailList((prevContentDataDetailList: any) => ({
        ...prevContentDataDetailList,
        contentData: newAttributeList,
      }));

      const updatedContentTempData = contentTempData.map((data: any) => {
        if (data.id === loopingId) {
          return {
            ...data,
            contentData: [
              ...data.contentData,
              {
                details: data.contentData[0].details.map((detail: any) => ({
                  ...detail,
                  value: '',
                })),
              },
            ],
          };
        }
        return data;
      });

      setContentTempData(updatedContentTempData);
    }
  };

  const renderFormList = () => {
    // DEFAULT VALUE

    return contentDataDetailList?.contentData.map((props: any, _index: number) => {
      const { id, name, fieldType, contentData, config, value } = props;
      const configs = JSON.parse(config);
      switch (fieldType) {
        case 'TEXT_FIELD':
          return (
            <Controller
              key={id}
              name={id.toString()}
              control={control}
              defaultValue={value}
              rules={{
                required: { value: true, message: `${name} is required` },
                maxLength: {
                  value: configs?.max_length,
                  message: `${configs?.max_length} characters maximum`,
                },
                minLength: {
                  value: configs?.min_length,
                  message: `${configs?.min_length} characters minimum`,
                },
              }}
              render={({ field }) => {
                const onChange = useCallback(
                  (e: any) => {
                    handleFormChange(id, e.target.value, fieldType);
                    field.onChange({ target: { value: e.target.value } });
                  },
                  [id, fieldType, field, handleFormChange],
                );
                return (
                  <FormList.TextField
                    {...field}
                    key={id}
                    fieldTypeLabel="TEXT_FIELD"
                    disabled={!isEdited}
                    labelTitle={name}
                    placeholder=""
                    error={!!errors?.[id]?.message}
                    helperText={errors?.[id]?.message}
                    onChange={onChange}
                  />
                );
              }}
            />
          );
        case 'TEXT_AREA':
          return (
            <Controller
              key={id}
              name={id.toString()}
              control={control}
              defaultValue={value}
              rules={{
                required: { value: true, message: `${name} is required` },
                maxLength: {
                  value: configs?.max_length,
                  message: `${configs?.max_length} characters maximum`,
                },
                minLength: {
                  value: configs?.min_length,
                  message: `${configs?.min_length} characters minimum`,
                },
              }}
              render={({ field }) => {
                const onChange = useCallback(
                  (e: any) => {
                    handleFormChange(id, e.target.value, fieldType);
                    field.onChange({ target: { value: e.target.value } });
                  },
                  [id, fieldType, field, handleFormChange],
                );
                return (
                  <FormList.TextAreaField
                    {...field}
                    key={id}
                    fieldTypeLabel="TEXT_AREA"
                    labelTitle={name}
                    disabled={!isEdited}
                    placeholder=""
                    error={!!errors?.[id]?.message}
                    helperText={errors?.[id]?.message}
                    onChange={onChange}
                  />
                );
              }}
            />
          );
        case 'EMAIL':
          return (
            <Controller
              key={id}
              name={id.toString()}
              control={control}
              defaultValue={value}
              rules={{
                required: { value: true, message: `${name} is required` },
              }}
              render={({ field }) => {
                const onChange = useCallback(
                  (e: any) => {
                    handleFormChange(id, e.target.value, fieldType);
                    field.onChange({ target: { value: e.target.value } });
                  },
                  [id, fieldType, field, handleFormChange],
                );
                return (
                  <FormList.TextField
                    {...field}
                    key={id}
                    type="email"
                    fieldTypeLabel="EMAIL"
                    disabled={!isEdited}
                    labelTitle={name}
                    placeholder=""
                    error={!!errors?.[id]?.message}
                    helperText={errors?.[id]?.message}
                    onChange={onChange}
                  />
                );
              }}
            />
          );
        case 'DOCUMENT':
          return (
            <Controller
              key={id}
              name={id.toString()}
              control={control}
              defaultValue={value}
              rules={{
                required: { value: true, message: `${name} is required` },
              }}
              render={({ field }) => {
                const onChange = useCallback(
                  (e: any) => {
                    handleFormChange(id, e, fieldType);
                    field.onChange({ target: { value: e } });
                  },
                  [id, fieldType, field, handleFormChange],
                );
                return (
                  <FormList.FileUploaderV2
                    {...field}
                    key={id}
                    id={id}
                    fieldTypeLabel="DOCUMENT"
                    labelTitle={name}
                    disabled={!isEdited}
                    isDocument={true}
                    multiple={configs?.media_type === 'multiple_media'}
                    error={!!errors?.[id]?.message}
                    helperText={errors?.[id]?.message}
                    onChange={onChange}
                  />
                );
              }}
            />
          );
        case 'IMAGE':
          return (
            <Controller
              key={id}
              name={id.toString()}
              control={control}
              defaultValue={value}
              rules={{
                required: { value: true, message: `${name} is required` },
              }}
              render={({ field }) => {
                const onChange = useCallback(
                  (e: any) => {
                    handleFormChange(id, e, fieldType);
                    field.onChange({ target: { value: e } });
                  },
                  [id, fieldType, field, handleFormChange],
                );
                return (
                  <FormList.FileUploaderV2
                    {...field}
                    key={id}
                    fieldTypeLabel="IMAGE"
                    disabled={!isEdited}
                    labelTitle={name}
                    isDocument={false}
                    multiple={configs?.media_type === 'multiple_media'}
                    error={!!errors?.[id]?.message}
                    helperText={errors?.[id]?.message}
                    onChange={onChange}
                  />
                );
              }}
            />
          );
        case 'TEXT_EDITOR':
          return <FormList.TextEditor key={id} name={name} />;
        case 'PHONE_NUMBER':
          return (
            <Controller
              key={id}
              name={id.toString()}
              control={control}
              defaultValue={value}
              rules={{
                required: `${name} is required`,
                pattern: {
                  value: /^[0-9\- ]{8,14}$/,
                  message: 'Invalid number',
                },
              }}
              render={({ field }) => {
                const onChange = useCallback(
                  (e: any) => {
                    handleFormChange(id, e.target.value, fieldType);
                    field.onChange({ target: { value: e.target.value } });
                  },
                  [id, fieldType, field, handleFormChange],
                );
                return (
                  <FormList.TextField
                    {...field}
                    key={id}
                    fieldTypeLabel="PHONE_NUMBER"
                    labelTitle={name}
                    disabled={!isEdited}
                    placeholder=""
                    error={!!errors?.[id]?.message}
                    helperText={errors?.[id]?.message}
                    onChange={onChange}
                  />
                );
              }}
            />
          );
        case 'YOUTUBE_URL':
          return (
            <Controller
              key={id}
              name={id.toString()}
              control={control}
              defaultValue={value}
              rules={{
                required: `${name} is required`,
                pattern: {
                  value:
                    /[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)?/gi,
                  message: 'Invalid URL',
                },
              }}
              render={({ field }) => {
                const onChange = useCallback(
                  (e: any) => {
                    handleFormChange(id, e.target.value, fieldType);
                    field.onChange({ target: { value: e.target.value } });
                  },
                  [id, fieldType, field, handleFormChange],
                );
                return (
                  <FormList.TextField
                    {...field}
                    key={id}
                    fieldTypeLabel="YOUTUBE_URL"
                    labelTitle={name}
                    disabled={!isEdited}
                    placeholder=""
                    error={!!errors?.[id]?.message}
                    helperText={errors?.[id]?.message}
                    onChange={onChange}
                  />
                );
              }}
            />
          );
        case 'EMAIL_FORM':
          return (
            <div className="flex flex-row mt-16">
              <div>
                <Typography
                  type="body"
                  size="m"
                  weight="bold"
                  className={`w-48 ml-1 mr-9 -mt-7 mb-2`}>
                  EMAIL_FORM
                </Typography>
                <Typography type="body" size="m" weight="bold" className="w-56 ml-1">
                  {name}
                </Typography>
              </div>
              <Controller
                key={id}
                name={id.toString()}
                control={control}
                defaultValue=""
                rules={{ required: `${name} is required` }}
                render={({ field }) => {
                  const onChange = useCallback(
                    (e: any) => {
                      handleFormChange(id, e.value, fieldType);
                      field.onChange({ target: { value: e.value } });
                    },
                    [id, field, handleFormChange],
                  );
                  return (
                    <FormList.EmailForm
                      {...field}
                      key={id}
                      value={value}
                      disabled={!isEdited}
                      fieldTypeLabel="EMAIL_FORM"
                      placeholder=""
                      error={!!errors?.[id]?.message}
                      helperText={errors?.[id]?.message}
                      items={categoryList}
                      onChange={onChange}
                    />
                  );
                }}
              />
            </div>
          );
        case 'LOOPING':
          return (
            <div key={id}>
              {contentData?.map((value: { details: any[] }, idx: Key | null | undefined) => (
                <>
                  <Typography type="body" size="m" weight="bold" className="w-48 my-5 ml-1 mr-9">
                    {name}
                  </Typography>
                  <div key={idx} className="card w-full shadow-md p-5 mt-5">
                    {value.details.map(
                      (val: { fieldType: any; id: any; value: any; name: any }) => {
                        switch (val.fieldType) {
                          case 'EMAIL':
                          case 'DOCUMENT':
                          case 'IMAGE':
                          case 'TEXT_AREA':
                          case 'TEXT_EDITOR':
                          case 'PHONE_NUMBER':
                          case 'TEXT_FIELD':
                            return (
                              <Controller
                                name={`${idx}_${val.id}`}
                                control={control}
                                defaultValue={val.value}
                                rules={{ required: `${name} is required` }}
                                render={({ field }) => {
                                  const onChange = useCallback(
                                    (e: any) => {
                                      handleFormChange(
                                        val.id,
                                        e.target.value,
                                        val.fieldType,
                                        true,
                                        id,
                                        idx,
                                        val.id,
                                      );
                                      field.onChange({ target: { value: e.target.value } });
                                    },
                                    [val.id, val.fieldType, field, handleFormChange],
                                  );

                                  return (
                                    <FormList.TextField
                                      {...field}
                                      key={val.id}
                                      fieldTypeLabel="TEXT_FIELD"
                                      labelTitle={val.name}
                                      disabled={!isEdited}
                                      placeholder=""
                                      error={!!errors?.[val.id]?.message}
                                      helperText={errors?.[val.id]?.message}
                                      onChange={onChange}
                                    />
                                  );
                                }}
                              />
                            );
                          case 'YOUTUBE_URL':
                            return (
                              <Controller
                                name={`${idx}_${val.id}`}
                                control={control}
                                defaultValue={val.value}
                                rules={{
                                  required: `${val.name} is required`,
                                  pattern: {
                                    value:
                                      /[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)?/gi,
                                    message: 'Invalid URL',
                                  },
                                }}
                                render={({ field }) => {
                                  const onChange = useCallback(
                                    (e: any) => {
                                      handleFormChange(
                                        val.id,
                                        e.target.value,
                                        val.fieldType,
                                        true,
                                        id,
                                        idx,
                                        val.id,
                                      );
                                      field.onChange({ target: { value: e.target.value } });
                                    },
                                    [val.id, val.fieldType, field, handleFormChange],
                                  );
                                  return (
                                    <FormList.TextField
                                      {...field}
                                      key={val.id}
                                      fieldTypeLabel="YOUTUBE_URL"
                                      labelTitle={val.name}
                                      disabled={!isEdited}
                                      placeholder=""
                                      error={!!errors?.[val.id]?.message}
                                      helperText={errors?.[val.id]?.message}
                                      onChange={onChange}
                                    />
                                  );
                                }}
                              />
                            );
                          default:
                            return <p>err</p>;
                        }
                      },
                    )}
                  </div>
                  {idx === contentData?.length - 1 && isEdited && (
                    <div className="flex justify-end mt-8">
                      <button
                        onClick={() => {
                          addNewLoopingField(id);
                        }}
                        className="btn btn-outline border-primary text-primary text-xs btn-sm w-48 h-10">
                        <img src={Plus} className="mr-3" />
                        Add Data
                      </button>
                    </div>
                  )}
                </>
              ))}
            </div>
          );
        default:
          return <p>err</p>;
      }
    });
  };

  const Footer = useCallback(() => {
    return (
      <div className="flex justify-end mt-10">
        <div className="flex flex-row p-2 gap-2">
          <button onClick={() => {}} className="btn btn-outline text-xs btn-sm w-28 h-10">
            Cancel
          </button>
          <button
            onClick={() => {}}
            className="btn btn-outline border-secondary-warning text-xs text-secondary-warning btn-sm w-28 h-10">
            Save as Draft
          </button>
          <button type="submit" className="btn btn-success text-xs text-white btn-sm w-28 h-10">
            Submit
          </button>
        </div>
      </div>
    );
  }, []);

  const submitButton = () => {
    return (
      <div className="flex justify-end mt-10">
        <div className="flex flex-row p-2 gap-2">
          <button
            onClick={() => {
              goBack();
            }}
            className="btn btn-outline text-xs btn-sm w-28 h-10">
            Cancel
          </button>
          <button
            onClick={() => {
              setShowModalReview(true);
            }}
            className="btn btn-success text-xs text-white btn-sm w-28 h-10">
            Submit
          </button>
        </div>
      </div>
    );
  };

  const rigthTopButton = () => {
    switch (contentDataDetailList?.status) {
      case 'WAITING_REVIEW':
        return null;
      case 'WAITING_APPROVE':
      case 'DELETE_APPROVE':
        return (
          <>
            {roles?.includes('CONTENT_MANAGER_APPROVE') ? (
              <ButtonMenu
                title={''}
                onClickApprove={() => {
                  setShowModalApprove(true);
                }}
                onClickReject={() => {
                  setShowModalRejected(true);
                }}
              />
            ) : null}
          </>
        );

      case 'DRAFT':
      case 'APPROVED':
      case 'REJECTED':
      case 'DELETE_REJECTED':
        return (
          <>
            {roles?.includes('CONTENT_MANAGER_EDIT')
              ? !isEdited && (
                  <button
                    onClick={() => {
                      setIsEdited(true);
                    }}
                    className="btn btn-outline border-primary text-primary text-xs btn-sm w-48 h-10">
                    <img src={Edit} className="mr-3" />
                    Edit Content
                  </button>
                )
              : null}
          </>
        );
      case 'ARCHIVED':
        return (
          <button
            onClick={() => {
              setShowArchivedModal(true);
            }}
            className="btn bg-secondary-warning border-none text-xs btn-sm w-48 h-10">
            <img src={Restore} className="mr-3" />
            Restore
          </button>
        );
      default:
        return null;
    }
  };

  const onUpdateStatus = (payload: { id: any; status: string; comment: string }) => {
    updateContentDataStatus(payload)
      .unwrap()
      .then(() => {
        dispatch(
          openToast({
            type: 'success',
            title: 'Success',
            message: getMessageToast(status),
          }),
        );
        goBack();
      })
      .catch(() => {
        dispatch(
          openToast({
            type: 'error',
            title: 'Failed',
          }),
        );
        goBack();
      });
  };

  const onRestoreData = (payload: { id: any }) => {
    restoreContentData(payload)
      .unwrap()
      .then(() => {
        dispatch(
          openToast({
            type: 'success',
            title: 'Success',
            message: getMessageToast(status),
          }),
        );
        goBack();
      })
      .catch(() => {
        dispatch(
          openToast({
            type: 'error',
            title: 'Failed',
          }),
        );
        goBack();
      });
  };

  const getMessageToast = (status: string) => {
    switch (status) {
      case 'WAITING APPROVE':
        return 'You successfully reviewed the content data!';
      case 'APPROVED':
        return 'You successfully approved the content data!';
      case 'REJECTED':
        return 'You successfully rejected the content data!';
    }
  };

  return (
    <TitleCard
      onBackClick={goBack}
      hasBack={true}
      title={`${contentDataDetail?.contentDataDetail?.title ?? ''}`}
      TopSideButtons={rigthTopButton()}>
      <ModalConfirm
        open={showModalReview}
        title={'Review Page Content'}
        cancelTitle="No"
        message={'Are you sure you already review this page content?'}
        submitTitle="Yes"
        icon={PaperIcon}
        submitAction={() => {
          setShowModalReview(false);
          const payload = {
            id: contentDataDetailList?.id,
            status: 'WAITING_APPROVE',
            comment: 'Already review',
          };

          if (isAlreadyReview) {
            onUpdateStatus(payload);
          } else {
            setShowModalWarning(true);
          }
        }}
        btnSubmitStyle="btn bg-secondary-warning border-none"
        cancelAction={() => {
          setShowModalReview(false);
        }}
      />

      <ModalConfirm
        open={showModalWarning}
        title={''}
        message={'Please check the checkbox below the page detail before you submit this form'}
        submitTitle="Yes"
        icon={WarningIcon}
        submitAction={() => {
          setShowModalWarning(false);
        }}
        btnSubmitStyle="btn-error"
        cancelTitle={''}
        cancelAction={function (): void {
          throw new Error('Function not implemented.');
        }}
      />

      <ModalConfirm
        open={showModalApprove}
        title={'Approve'}
        cancelTitle="No"
        message={
          contentDataDetailList?.status === 'WAITING_APPROVE'
            ? 'Do you want to approve this page content?'
            : 'Do you want to approve delete this page content?'
        }
        submitTitle="Yes"
        icon={CheckOrange}
        submitAction={() => {
          setShowModalApprove(false);
          const payload = {
            id: contentDataDetailList?.id,
            status: contentDataDetailList?.status === 'DELETE_APPROVE' ? 'ARCHIVED' : 'APPROVED',
            comment: 'Already approve',
          };

          onUpdateStatus(payload);
        }}
        btnSubmitStyle="btn bg-secondary-warning border-none"
        cancelAction={() => {
          setShowModalApprove(false);
        }}
      />

      <ModalConfirm
        open={showArchivedModal}
        title={'Restore Content Data'}
        cancelTitle="Cancel"
        message={'Are you sure you restore this content data?'}
        submitTitle="Yes"
        icon={RestoreOrange}
        submitAction={() => {
          setShowArchivedModal(false);
          const payload = {
            id: contentDataDetailList?.id,
          };

          onRestoreData(payload);
        }}
        btnSubmitStyle="btn bg-secondary-warning border-none"
        cancelAction={() => {
          setShowArchivedModal(false);
        }}
      />

      <ModalForm
        open={showModalRejected}
        formTitle=""
        height={640}
        submitTitle={'Yes'}
        submitType="bg-secondary-warning border-none"
        submitDisabled={rejectComments === ''}
        cancelTitle={'No'}
        cancelAction={() => {
          setShowModalRejected(false);
        }}
        submitAction={() => {
          setShowModalRejected(false);
          const payload = {
            id: contentDataDetailList?.id,
            status:
              contentDataDetailList?.status === 'DELETE_APPROVE' ? 'DELETE_REJECTED' : 'REJECTED',
            comment: rejectComments,
          };

          onUpdateStatus(payload);
        }}>
        <div className="flex flex-col justify-center items-center">
          <img src={PaperIcon} className="w-10" />
          {contentDataDetailList?.status === 'WAITING_APPROVE' ? (
            <p className="font-semibold my-3 text-xl">Do you want to reject this content data?</p>
          ) : (
            <p className="font-semibold my-3 text-xl">Do you want to reject this delete request?</p>
          )}
          <TextArea
            name="shortDesc"
            labelTitle="Reject Comment"
            labelStyle="font-bold"
            value={rejectComments}
            labelRequired
            placeholder={'Enter reject comments'}
            containerStyle="rounded-3xl"
            onChange={e => {
              setRejectComments(e.target.value);
            }}
          />
        </div>
      </ModalForm>

      {contentDataDetail && (
        <form onSubmit={handleSubmit(onSubmitData)}>
          <div className="ml-2 mt-6">
            <div className="grid grid-cols-1 gap-5">
              <div className="absolute left-64 top-20">
                <StatusBadge status={contentDataDetailList?.status} />
              </div>
              <div className="flex flex-row">
                <Typography type="body" size="m" weight="bold" className="mt-5 ml-1 w-48 mr-16">
                  Title
                </Typography>
                <InputText
                  name="title"
                  value={contentDataDetailList?.title}
                  labelTitle=""
                  disabled={!isEdited}
                  roundStyle="xl"
                  onChange={e => {
                    handleChange(e.target.name, e.target.value);
                  }}
                />
              </div>
              {contentDataDetailList?.isUseCategory && (
                <div className="flex flex-row">
                  <Typography type="body" size="m" weight="bold" className="w-56 ml-1">
                    Category
                  </Typography>
                  <Controller
                    name="category"
                    control={control}
                    defaultValue={contentDataDetailList?.categoryName}
                    rules={{ required: 'Category is required' }}
                    render={({ field }) => {
                      const onChange = useCallback(
                        (e: any) => {
                          handleFormChange('categoryName', e);
                          field.onChange({ target: { value: e } });
                        },
                        [id, field, handleFormChange],
                      );
                      return (
                        <FormList.TextInputDropDown
                          {...field}
                          key="category"
                          labelTitle="Category"
                          placeholder="Title"
                          error={!!errors?.category?.message}
                          helperText={errors?.category?.message}
                          items={categoryList}
                          onChange={onChange}
                        />
                      );
                    }}
                  />
                </div>
              )}
              <div className="flex flex-row">
                <Typography type="body" size="m" weight="bold" className="w-48 mt-5 ml-1 mr-16">
                  Short Description
                </Typography>
                <TextArea
                  name="shortDesc"
                  labelTitle=""
                  value={contentDataDetailList?.shortDesc}
                  disabled={!isEdited}
                  placeholder={'Enter description'}
                  containerStyle="rounded-3xl"
                  onChange={e => {
                    handleChange(e.target.name, e.target.value);
                  }}
                />
              </div>
            </div>
          </div>

          <div className="border border-primary my-10" />

          {renderFormList()}
          {isEdited && <Footer />}
        </form>
      )}
      {roles?.includes('CONTENT_MANAGER_REVIEW') ? (
        contentDataDetailList?.status === 'WAITING_REVIEW' ||
        contentDataDetailList?.status === 'DELETE_REVIEW' ? (
          <div className="flex flex-row justify-between">
            <div className="w-[30vh] mt-5">
              <CheckBox
                defaultValue={isAlreadyReview}
                updateFormValue={e => {
                  setIsAlreadyReview(e.value);
                }}
                labelTitle="I Already Review This Page Content"
                updateType={''}
              />
            </div>
            {submitButton()}
          </div>
        ) : null
      ) : null}
    </TitleCard>
  );
}
