import { TitleCard } from '@/components/molecules/Cards/TitleCard';
import { t } from 'i18next';
import FormList from '@/components/molecules/FormList';
import { styleButton } from '@/utils/styleButton';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ModalConfirm from '@/components/molecules/ModalConfirm';
import CancelIcon from '@/assets/cancel.png';
import {
  useCreateResultTemplateMutation,
  useGetResultTemplateDetailQuery,
  useLazyGetResultTemplateTypeQuery,
  useUpdateResultTemplateMutation,
} from '@/services/LeadsGenerator/leadsGeneratorApi';
import { useAppDispatch } from '@/store';
import { openToast } from '@/components/atoms/Toast/slice';
import Typography from '@/components/atoms/Typography';
import { useLazyGetPostTypeListQuery } from '@/services/ContentType/contentTypeApi';
import { useLazyGetCategoryListQuery } from '@/services/ContentManager/contentManagerApi';
import { CheckBox } from '@/components/atoms/Input/CheckBox';

interface IItem {
  value: string | number;
  label: string;
}

const LeadsGeneratorResultDetail = () => {
  const params = useParams();
  const [id] = useState<any>(Number(params?.id));
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname ?? '';
  const dispatch = useAppDispatch();

  const [isTitle, setTitle] = useState<string>('Edit Result Template');
  const [isEditable, setEditable] = useState<boolean>(false);
  const [isDraft, setDraft] = useState<boolean>(false); // State to handle draft
  const [isContent, setContent] = useState<IItem[]>([]);
  const [isCategory, setCategory] = useState<IItem[]>([]);
  const [isTemplateType, setTemplateType] = useState<IItem[]>([]);

  // LEAVE MODAL STATE
  const [showLeaveModal, setShowLeaveModal] = useState<boolean>(false);
  const [titleLeaveModalShow, setLeaveTitleModalShow] = useState<string | null>('');
  const [messageLeaveModalShow, setMessageLeaveModalShow] = useState<string | null>('');

  const [createResultTemplate] = useCreateResultTemplateMutation();
  const [updateResultTemplate] = useUpdateResultTemplateMutation();
  const [getTemplateType] = useLazyGetResultTemplateTypeQuery();
  const [getContentType] = useLazyGetPostTypeListQuery();
  const [getCategory] = useLazyGetCategoryListQuery();
  const { data } = useGetResultTemplateDetailQuery({ id });

  // Form hook
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm();

  const _handleLoop: (list: any[], field: string[]) => IItem[] = (list, field) => {
    const arr: IItem[] = [];
    const withField = field.length > 0;
    for (let i = 0; i < list.length; i++) {
      if (withField) {
        const obj: any = {};
        for (let j = 0; j < field.length; j += 2) {
          obj[field[j]] = list[i][field[j + 1]];
        }
        arr.push(obj);
      } else {
        arr.push({ label: list[i], value: list[i] });
      }
    }
    return arr;
  };

  const _getTemplateType = () => {
    getTemplateType()
      .unwrap()
      .then(e => {
        const val: string = e?.getConfig?.value ? e.getConfig.value : '[]';
        const parse = JSON.parse(val);
        const arr: IItem[] = _handleLoop(parse, []);
        setTemplateType(arr);
      })
      .catch(() => {
        setTemplateType([]);
      });
  };

  const _getContentType = () => {
    getContentType({
      pageIndex: 0,
      limit: 999,
      direction: 'desc',
      search: '',
      sortBy: 'id',
      dataType: '',
    })
      .unwrap()
      .then(e => {
        const list: any[] = e?.postTypeList?.postTypeList ?? [];
        const arr: IItem[] = _handleLoop(list, ['label', 'name', 'value', 'id']);
        setContent(arr);
      })
      .catch(() => {
        setContent([]);
      });
  };

  const _getCategory = (postTypeId: string | number) => {
    getCategory({
      postTypeId,
      pageIndex: 0,
      limit: 999,
      direction: 'desc',
      sortBy: 'id',
    })
      .unwrap()
      .then(e => {
        const list: any[] = e?.categoryList?.categoryList ?? [];
        const arr: IItem[] = _handleLoop(list, ['label', 'name', 'value', 'id']);
        setCategory(arr);
      })
      .catch(() => {
        setCategory([]);
      });
  };

  useEffect(() => {
    _getTemplateType();
    _getContentType();
  }, []);

  useEffect(() => {
    // Set editable state and title based on the route
    if (pathname.includes('new')) {
      setEditable(true);
      setTitle('Add Result Template');
    }
  }, [pathname]);

  useEffect(() => {
    if (data?.resultTemplateDetail) {
      const {
        id,
        name,
        narrative,
        disclaimer,
        images,
        categoryId,
        isDefault,
        isDraft,
        type,
        postTypeId,
        postTypeName,
        postTypeSlug,
      } = data.resultTemplateDetail;

      reset({
        id,
        resultName: name,
        narrative,
        disclaimer,
        images,
        categoryId,
        isDefault,
        isDraft,
        type,
        postTypeId,
        postTypeName,
        postTypeSlug,
      });
    }
  }, [data, reset]);

  console.log(data);

  // Handle form submission
  const onSubmitData = () => {
    if (pathname.includes('new')) {
      saveData(); // Create new template
    } else {
      editData(); // Update existing template
    }
  };

  // Update existing result template
  const editData = () => {
    const value = getValues();
    const payload = {
      id,
      name: value.resultName,
      narrative: value.narrative,
      disclaimer: value.disclaimer,
      images: value?.images,
      isDraft, // Include isDraft in payload
      type: value?.type,
      postTypeId: value?.postTypeId,
      categoryId: value?.categoryId,
      isDefault: value?.isDefault ? value?.isDefault : false,
    };
    updateResultTemplate(payload)
      .unwrap()
      .then(() => {
        dispatch(
          openToast({
            type: 'success',
            title: 'Success',
          }),
        );
        goBack();
        setTimeout(() => {
          window.location.reload();
        }, 100);
      })
      .catch(() => {
        dispatch(
          openToast({
            type: 'error',
            title: 'Failed',
          }),
        );
      });
  };

  // Create new result template
  const saveData = () => {
    const value = getValues();
    const payload = {
      name: value.resultName,
      narrative: value.narrative,
      isDraft, // Use the isDraft state
      disclaimer: value.disclaimer,
      images: value?.images,
      type: value?.type,
      postTypeId: value?.postTypeId,
      categoryId: value?.categoryId,
      isDefault: value?.isDefault ? value?.isDefault : false,
    };
    createResultTemplate(payload)
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
      });
  };

  // Navigate back
  const goBack = () => {
    navigate(-1);
  };

  // Handle modal leave action
  const onLeave = () => {
    setShowLeaveModal(false);
    goBack();
  };

  const _findLabel: (e: number, arr: IItem[]) => string = (id, arr) => {
    let val: string = '';
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].value === id) {
        val = arr[i].label;
      }
    }
    return val;
  };

  return (
    <TitleCard
      hasBack
      onBackClick={() => {
        navigate(-1);
      }}
      title={isTitle}
      topMargin="mt-2"
      TopSideButtons={
        !isEditable && (
          <div
            className={styleButton({ variants: 'secondary' })}
            onClick={() => {
              setEditable(true);
            }}>
            Edit Data
          </div>
        )
      }>
      <form onSubmit={handleSubmit(onSubmitData)} className="flex flex-col gap-10">
        <div className="flex flex-col gap-y-4">
          <div className="flex flex-col gap-y-2 w-1/2 ml-[-5px]">
            <Controller
              name="resultName"
              control={control}
              defaultValue=""
              rules={{ required: 'Result Name is required' }}
              render={({ field }) => (
                <FormList.TextField
                  disabled={!isEditable}
                  labelTitle="Result Name"
                  themeColor="primary"
                  placeholder="Result Name"
                  value={field.value}
                  onChange={field.onChange}
                  error={!!errors.resultName}
                  helperText={errors.resultName?.message}
                  border={false}
                />
              )}
            />
            <div className="flex items-center">
              <Typography type="body" size="s" weight="bold" className="w-[225px] ml-1">
                Default Template
              </Typography>
              <Controller
                name="isDefault"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <CheckBox
                    disabled={!isEditable}
                    defaultValue={field.value}
                    updateFormValue={e => {
                      field.onChange(e.value);
                    }}
                    updateType={''}
                    labelTitle={undefined}
                  />
                )}
              />
            </div>
            <div className="flex items-center">
              <Typography type="body" size="s" weight="bold" className="w-[225px] ml-1">
                Template Type
              </Typography>
              <Controller
                name="type"
                control={control}
                defaultValue=""
                rules={{ required: 'Template Type is required' }}
                render={({ field }) => (
                  <FormList.DropDown
                    disabled={!isEditable}
                    themeColor="primary"
                    error={!!errors.type}
                    helperText={errors.type?.message}
                    defaultValue={_findLabel(field.value, isTemplateType)}
                    onChange={(e: IItem) => {
                      field.onChange(e.value);
                    }}
                    items={isTemplateType}
                  />
                )}
              />
            </div>
            <div className="flex items-center">
              <Typography type="body" size="s" weight="bold" className="w-[225px] ml-1">
                Content Type
              </Typography>
              <Controller
                name="postTypeId"
                control={control}
                defaultValue=""
                rules={{ required: 'Content Type is required' }}
                render={({ field }) => {
                  const postTypeId = data?.resultTemplateDetail?.postTypeId ?? null;
                  useEffect(() => {
                    if (postTypeId) {
                      field.onChange(postTypeId);
                      _getCategory(postTypeId);
                    }
                  }, [postTypeId]);

                  return (
                    <FormList.DropDown
                      disabled={!isEditable}
                      themeColor="primary"
                      error={!!errors.postTypeId}
                      helperText={errors.postTypeId?.message}
                      defaultValue={_findLabel(field.value, isContent)}
                      onChange={(e: IItem) => {
                        field.onChange(e.value);
                        _getCategory(e.value);
                      }}
                      items={isContent}
                    />
                  );
                }}
              />
            </div>
            <div className="flex items-center">
              <Typography type="body" size="s" weight="bold" className="w-[225px] ml-1">
                Category Content
              </Typography>
              <Controller
                name="categoryId"
                control={control}
                defaultValue=""
                // rules={{ required: 'Category Content is required' }}
                render={({ field }) => (
                  <FormList.DropDown
                    disabled={!isEditable || isCategory.length < 1}
                    themeColor="primary"
                    error={!!errors.categoryId}
                    helperText={errors.categoryId?.message}
                    defaultValue={_findLabel(field.value, isCategory)}
                    onChange={(e: IItem) => {
                      field.onChange(e.value);
                    }}
                    items={isCategory}
                  />
                )}
              />
            </div>
          </div>
          <div className="w-2/3">
            <Controller
              name="narrative"
              control={control}
              defaultValue=""
              rules={{
                required: 'Narrative is required',
              }}
              render={({ field }) => (
                <FormList.TextEditor
                  title="Narrative"
                  value={field.value}
                  disabled={!isEditable}
                  error={!!errors.narrative}
                  helperText={errors.narrative?.message}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
          <div className="w-2/3">
            <Controller
              name="disclaimer"
              control={control}
              defaultValue=""
              rules={{
                required: { value: true, message: `Disclaimer is required` },
              }}
              render={({ field }) => (
                <FormList.TextEditor
                  title="Disclaimer"
                  value={field.value}
                  disabled={!isEditable}
                  error={errors.disclaimer}
                  helperText={errors.disclaimer?.message}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
          <div className="w-2/3">
            <Controller
              name="images"
              control={control}
              defaultValue="[]"
              rules={{
                validate: value => {
                  try {
                    const parsedValue = JSON.parse(value);

                    if (Array.isArray(parsedValue) && parsedValue.length > 0) {
                      if (parsedValue.every(item => item.imageUrl && item.altText)) {
                        return true;
                      }
                    }

                    return 'Images are required and must include valid imageUrl and altText.';
                  } catch (error) {
                    return 'Invalid format. Please provide a valid JSON array.';
                  }
                },
              }}
              render={({ field }) => {
                return (
                  <FormList.FileUploaderV2
                    {...field}
                    id="images"
                    fieldTypeLabel="Images"
                    labelTitle="Images"
                    isDocument={false}
                    disabled={!isEditable}
                    editMode={isEditable}
                    multiple={true}
                    error={!!errors?.images}
                    helperText={errors?.images?.message}
                    onChange={field.onChange}
                    border={false}
                  />
                );
              }}
            />
          </div>
        </div>
        <div className="flex gap-2 justify-end items-center mt-10 border-t-2 pt-5">
          <button
            onClick={e => {
              e.preventDefault();
              setLeaveTitleModalShow('Cancel and Back to Previous Page');
              setMessageLeaveModalShow('Do you want to cancel all the process?');
              setShowLeaveModal(true);
            }}
            className="btn btn-outline text-xs btn-sm w-28 h-10">
            {t('user.content-manager-new.cancel')}
          </button>
          <button
            type="submit"
            className={styleButton({ variants: 'secondary', disabled: !isEditable })}
            onClick={() => {
              setDraft(true); // Set isDraft before submitting
            }}>
            Save as Draft
          </button>
          <button
            type="submit"
            className={styleButton({ variants: 'success', disabled: !isEditable })}
            onClick={() => {
              setDraft(false); // Ensure isDraft is false for final save
            }}>
            Save
          </button>
        </div>
      </form>
      <ModalConfirm
        open={showLeaveModal}
        cancelAction={() => {
          setShowLeaveModal(false);
        }}
        title={titleLeaveModalShow ?? ''}
        cancelTitle={t('no')}
        message={messageLeaveModalShow ?? ''}
        submitAction={onLeave}
        submitTitle={t('yes')}
        icon={CancelIcon}
        btnSubmitStyle="btn-warning"
      />
    </TitleCard>
  );
};

export default LeadsGeneratorResultDetail;
