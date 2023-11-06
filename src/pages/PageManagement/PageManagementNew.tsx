import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { t } from 'i18next';

import Typography from '@/components/atoms/Typography';
import PreviewEye from '../../assets/preview-eye.svg';
import CkEditor from '@/components/atoms/Ckeditor';
import DropDown from '@/components/molecules/DropDown';
import PaginationComponent from '@/components/molecules/Pagination';
import ModalConfirm from '@/components/molecules/ModalConfirm';
import CancelIcon from '../../assets/cancel.png';
import { TitleCard } from '@/components/molecules/Cards/TitleCard';
import { InputSearch } from '@/components/atoms/Input/InputSearch';
import { useGetPostTypeListQuery } from '@/services/ContentType/contentTypeApi';
import { useGetPageTemplateQuery } from '@/services/PageTemplate/pageTemplateApi';
import { useCreatePageDataMutation } from '@/services/PageManagement/pageManagementApi';
import { useAppDispatch } from '@/store';
import { openToast } from '@/components/atoms/Toast/slice';
import { useGetEligibleAutoApproveQuery } from '@/services/ContentManager/contentManagerApi';
import { CheckBox } from '@/components/atoms/Input/CheckBox';
import ModalForm from '@/components/molecules/ModalForm';
import PaperSubmit from '../../assets/paper-submit.png';
import FormList from '../../components/molecules/FormList';
import { dataTypeList } from './contants';

export default function PageManagementNew() {
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const baseUrl = import.meta.env.VITE_API_URL;

  // PAGE TEMPLATE SELECTION STATE
  const [pageTemplates, setPageTemplates] = useState<any>([]);
  const [selected, setSelected] = useState<any>(null);
  const [search, setSearch] = useState<any>('');
  const [total, setTotal] = useState<number>(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageLimit] = useState(6);
  // FORM DATA
  const [content, setContent] = useState('');
  // CONTENT SELECTION STATE
  const [listContents, setListContents] = useState<any>([]);
  const [contentTypeId, setContentTypeId] = useState<any>(null);
  // LEAVE MODAL
  const [showLeaveModal, setShowLeaveModal] = useState<boolean>(false);
  const [titleLeaveModalShow, setLeaveTitleModalShow] = useState<string | null>('');
  const [messageLeaveModalShow, setMessageLeaveModalShow] = useState<string | null>('');

  // AUTO APPROVE MODAL STATE
  const [showModalAutoApprove, setShowModalAutoApprove] = useState<boolean>(false);
  const [isAutoApprove, setIsAutoApprove] = useState<boolean>(false);

  // RTK GET PAGE TEMPLATE
  const fetchPageTemplatesQuery = useGetPageTemplateQuery(
    {
      pageIndex,
      limit: pageLimit,
      sortBy: 'id',
      direction: 'desc',
      search,
      dataType: '',
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );
  const { data: dataPageTemplates } = fetchPageTemplatesQuery;

  // RTK CREATE PAGE TEMPLATE
  const [createPageData] = useCreatePageDataMutation();

  // RTK GET CONTENT
  const fetchContentsQuery = useGetPostTypeListQuery(
    {
      pageIndex: 0,
      limit: 9999,
      sortBy: 'name',
      direction: 'asc',
      search: '',
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );
  const { data: dataContents } = fetchContentsQuery;

  // RTK GET ELIGIBLE AUTO APPROVE
  const fetchGetEligibleAutoApprove = useGetEligibleAutoApproveQuery(
    {
      actionType: 'create',
      dataType: 'page',
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );
  const { data: eligibleAutoApprove } = fetchGetEligibleAutoApprove;

  useEffect(() => {
    if (dataContents) {
      setListContents(
        dataContents?.postTypeList?.postTypeList.map((element: any) => {
          return {
            value: element.id,
            label: element.name,
          };
        }),
      );
    }

    if (dataPageTemplates) {
      setPageTemplates(dataPageTemplates?.pageTemplateList?.templates);
      setTotal(dataPageTemplates?.pageTemplateList?.total);
    }
  }, [dataContents, dataPageTemplates]);

  const handlerSubmit = (type?: string) => {
    if (eligibleAutoApprove?.isUserEligibleAutoApprove?.result) {
      setShowModalAutoApprove(true);
    } else {
      saveData(type);
    }
  };

  const saveData = (type?: string) => {
    const formData = getValues();

    let isDraft: boolean = false;
    if (type === 'draft') {
      isDraft = true;
    }

    const payload = {
      title: formData?.pageName,
      dataType: formData?.dataType,
      slug: formData?.slug,
      metatitle: formData?.metaTitle,
      metaDescription: formData?.metaDescription,
      shortDesc: formData?.shortDesc,
      content,
      imgFilename: pageTemplates.find((template: { id: any }) => template.id === selected)?.name,
      isDraft,
      isAutoApprove,
      pageTemplateId: selected,
      postTypeId: contentTypeId,
    };

    createPageData(payload)
      .unwrap()
      .then(() => {
        dispatch(
          openToast({
            type: 'success',
            title: 'Success',
          }),
        );
        navigate('/page-management');
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

  const onLeave = () => {
    setShowLeaveModal(false);
    navigate('/page-management');
  };

  function safeParseJSON(jsonString: any) {
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      return [];
    }
  }

  function getImageData(value: any) {
    const parsedValue = safeParseJSON(value);
    try {
      if (parsedValue) {
        return `${baseUrl}/files/get/${parsedValue[0]?.imageUrl}`;
      } else {
        return `${baseUrl}/files/get/${value}`;
      }
    } catch {
      return '';
    }
  }

  return (
    <TitleCard title={t('user.page-management-new.title')} border={true}>
      <ModalConfirm
        open={showLeaveModal}
        cancelAction={() => {
          setShowLeaveModal(false);
        }}
        title={titleLeaveModalShow ?? ''}
        cancelTitle={t('user.page-management-new.cancelButton')}
        message={messageLeaveModalShow ?? ''}
        submitAction={onLeave}
        submitTitle={t('user.page-management-new.saveButton')}
        icon={CancelIcon}
        btnSubmitStyle="btn-warning"
      />
      <ModalForm
        open={showModalAutoApprove}
        formTitle=""
        height={640}
        width={540}
        submitTitle={'Yes'}
        submitType="bg-secondary-warning border-none"
        cancelTitle={'No'}
        cancelAction={() => {
          setShowModalAutoApprove(false);
          setIsAutoApprove(false);
        }}
        submitPosition={'justify-center'}
        submitAction={() => {
          setShowModalAutoApprove(false);
          saveData();
        }}>
        <div className="flex flex-col justify-center items-center">
          <img src={PaperSubmit} className="w-10" />
          <p className="font-bold mt-3 text-xl">{t('user.page-management-new.autoApproveTitle')}</p>
          <p className="font-base my-3 text-l text-center">
            {t('user.page-management-new.autoApproveSubtitle', { title: getValues().pageName })}
          </p>
          <CheckBox
            defaultValue={isAutoApprove}
            updateFormValue={e => {
              setIsAutoApprove(e.value);
            }}
            labelTitle={t('user.page-management-new.autoApproveLabel')}
          />
        </div>
      </ModalForm>
      <div className="flex flex-col mt-5 gap-5">
        <div>
          <button className="w-[160px] !min-h-[45px] h-[45px] btn btn-outline btn-primary flex flex-row justify-center items-center gap-2">
            <img src={PreviewEye} className="h-[30px] w-[30px]" />
            {t('user.page-management-new.previewButton')}
          </button>
        </div>
        <form
          className="flex flex-col gap-5"
          onSubmit={handleSubmit((_data: any) => {
            handlerSubmit();
          })}>
          {/* FORM SECTION */}
          <div className="flex flex-col gap-3">
            <Typography weight="bold" size="l">
              {t('user.page-management-new.generalInformation')}
            </Typography>
            <div className="flex flex-row justify-between mt-2">
              <Controller
                name="pageName"
                control={control}
                defaultValue=""
                rules={{
                  required: {
                    value: true,
                    message: 'Page name is required',
                  },
                }}
                render={({ field }) => (
                  <FormList.TextField
                    {...field}
                    labelTitle={t('user.page-management-new.pageNameLabel')}
                    labelRequired
                    placeholder={t('user.page-management-new.pageNamePlaceholder')}
                    error={!!errors?.pageName?.message}
                    helperText={errors?.pageName?.message}
                    border={false}
                    inputWidth={350}
                  />
                )}
              />
              <Controller
                name="metaTitle"
                control={control}
                defaultValue=""
                rules={{
                  required: {
                    value: true,
                    message: 'Meta title is required',
                  },
                }}
                render={({ field }) => (
                  <FormList.TextField
                    {...field}
                    labelTitle={t('user.page-management-new.metaTitleLabel')}
                    labelRequired
                    placeholder={t('user.page-management-new.metaTitlePlaceholder')}
                    error={!!errors?.metaTitle?.message}
                    helperText={errors?.metaTitle?.message}
                    border={false}
                    inputWidth={350}
                  />
                )}
              />
            </div>
            <div className="flex flex-row justify-between">
              <Controller
                name="slug"
                control={control}
                defaultValue=""
                rules={{
                  required: {
                    value: true,
                    message: 'Slug is required',
                  },
                }}
                render={({ field }) => (
                  <FormList.TextField
                    {...field}
                    labelTitle={t('user.page-management-new.slugLabel')}
                    labelRequired
                    placeholder={t('user.page-management-new.slugPlaceholder')}
                    error={!!errors?.slug?.message}
                    helperText={errors?.slug?.message}
                    border={false}
                    inputWidth={350}
                  />
                )}
              />
              <Controller
                name="metaDescription"
                control={control}
                defaultValue=""
                rules={{
                  required: {
                    value: true,
                    message: 'Meta description is required',
                  },
                }}
                render={({ field }) => (
                  <FormList.TextField
                    {...field}
                    labelTitle={t('user.page-management-new.metaDescriptionLabel')}
                    labelRequired
                    placeholder={t('user.page-management-new.metaDescriptionPlaceholder')}
                    error={!!errors?.metaDescription?.message}
                    helperText={errors?.metaDescription?.message}
                    border={false}
                    inputWidth={350}
                  />
                )}
              />
            </div>
            <div className="flex flex-row justify-start">
              <Controller
                name="shortDesc"
                control={control}
                rules={{
                  required: {
                    value: false,
                    message: 'Short description is required',
                  },
                }}
                render={({ field }) => (
                  <FormList.TextAreaField
                    {...field}
                    labelTitle="Short Description"
                    placeholder="Input Short Description"
                    error={!!errors?.shortDesc?.message}
                    helperText={errors?.shortDesc?.message}
                    border={false}
                    inputWidth={350}
                  />
                )}
              />
            </div>
            <div className="flex flex-row justify-start">
              <Controller
                name='dataType'
                control={control}
                defaultValue='COLLECTION'
                render={({ field }) => (
                  <DropDown
                    {...field}
                    direction='row'
                    inputWidth={350}
                    labelWidth={228}      
                    labelTitle="Page"
                    labelStyle="font-bold"
                    labelEmpty="Choose Page"
                    items={dataTypeList}
                    defaultValue={field.value}
                    onSelect={(event: React.SyntheticEvent, value: string | number | boolean) => {
                      if (event) {
                        setValue('dataType', value);
                        field.onChange(value);
                      };
                    }}
                  />
                )}
              />
            </div>
            <div className="flex flex-col justify-start gap-3">
              <Typography type="body" size="m" weight="bold">
                {t('user.page-management-new.contentLabel')}
              </Typography>
              <CkEditor
                data={content}
                onChange={(data: string) => {
                  setContent(data);
                }}
              />
            </div>
          </div>
          {/* DIVIDER */}
          <div className="w-full my-4 border-[1px] border-lavender" />
          {/* PAGE TEMPLATE SECTION */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-row justify-between">
              <Typography size="m" weight="bold">
                {t('user.page-management-new.templateLabel')}
                <span className="text-reddist">*</span>
              </Typography>
              <InputSearch
                onBlur={(e: any) => {
                  setSearch(e.target.value);
                }}
                placeholder={t('user.page-management-new.searchPlaceholder') ?? ''}
              />
            </div>
            <div className="flex flex-wrap">
              {pageTemplates.length > 0 &&
                pageTemplates.length < 7 &&
                pageTemplates.map((element: any) => (
                  <div key={element.id} className="px-[5%] py-5 flex flex-col basis-2/6 gap-3">
                    <img
                      src={getImageData(element.imageUrl)}
                      className={`h-[450px] object-cover	cursor-pointer rounded-xl ${
                        selected === element.id
                          ? 'border-[#5A4180] border-4'
                          : 'border-[#828282] border-2'
                      }`}
                      onClick={() => {
                        setSelected(element.id);
                      }}
                    />
                    <Typography size="l" weight="medium" alignment="center">
                      {element.name}
                    </Typography>
                  </div>
                ))}
            </div>
            <div className="w-full flex justify-center">
              <div className="mr-5 font-semibold">Total {total} Items</div>
              <PaginationComponent
                total={total}
                page={pageIndex}
                pageSize={pageLimit}
                setPageOnly={true}
                setPage={(page: number) => {
                  setPageIndex(page);
                }}
              />
            </div>
          </div>
          {/* CONTENT TYPE SECTION */}
          <div className="flex justify-center mt-5">
            <div className="w-[50%]">
              <DropDown
                labelTitle={t('user.page-management-new.contentTypeLabel') ?? ''}
                labelStyle="font-bold	"
                labelWidth={175}
                direction="row"
                defaultValue=""
                labelEmpty=""
                items={listContents}
                onSelect={(event: React.SyntheticEvent, value: string | number | boolean) => {
                  if (event) {
                    setContentTypeId(value);
                  }
                }}
              />
            </div>
          </div>
          {/* BUTTONS SECTION */}
          <div className="mt-[25%] flex justify-end items-end gap-2">
            <button
              className="btn btn-outline btn-md"
              onClick={(event: any) => {
                event.preventDefault();
                setLeaveTitleModalShow(t('modal.confirmation'));
                setMessageLeaveModalShow(t('modal.leave-confirmation'));
                setShowLeaveModal(true);
              }}>
              {t('btn.cancel')}
            </button>
            <button
              className="btn btn-outline btn-warning btn-md"
              onClick={handleSubmit((_data: any) => {
                handlerSubmit('draft');
              })}>
              {t('user.page-management-new.saveDraftButton')}
            </button>
            <button type="submit" className="btn btn-success btn-md">
              {t('btn.save')}
            </button>
          </div>
        </form>
      </div>
    </TitleCard>
  );
}
