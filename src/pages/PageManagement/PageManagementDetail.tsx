import dayjs from 'dayjs';
import { t } from 'i18next';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import CkEditor from '@/components/atoms/Ckeditor';
import ModalForm from '@/components/molecules/ModalForm';
import ModalConfirm from '@/components/molecules/ModalConfirm';
import RestoreOrange from '@/assets/restore-orange.svg';
import CheckOrange from '@/assets/check-orange.svg';
import PaperIcon from '../../assets/paper.png';
import WarningIcon from '@/assets/warning.png';
import Edit from '@/assets/edit-purple.svg';
import Restore from '@/assets/restore.svg';
import StatusBadge from '@/components/atoms/StatusBadge';
import Typography from '@/components/atoms/Typography';
import DropDown from '@/components/molecules/DropDown';
import CancelIcon from '@/assets/cancel.png';
import ModalLog from './components/ModalLog';
import TimelineLog from '@/assets/timeline-log.svg';
import PaperSubmit from '../../assets/paper-submit.png';
import PaginationComponent from '@/components/molecules/Pagination';
import { TextArea } from '@/components/atoms/Input/TextArea';
import { TitleCard } from '@/components/molecules/Cards/TitleCard';
import { CheckBox } from '@/components/atoms/Input/CheckBox';
import { ButtonMenu } from '@/components/molecules/ButtonMenu';
import { store, useAppDispatch } from '@/store';
import { useForm, Controller } from 'react-hook-form';
import { InputSearch } from '@/components/atoms/Input/InputSearch';
import { openToast } from '@/components/atoms/Toast/slice';
import { useGetEligibleAutoApproveQuery } from '@/services/ContentManager/contentManagerApi';
import { useGetPageTemplateQuery } from '@/services/PageTemplate/pageTemplateApi';
import { useGetPostTypeListQuery } from '@/services/ContentType/contentTypeApi';
import { dataTypeList } from './constants';
import { errorMessageTypeConverter, getImageData } from '@/utils/logicHelper';
import {
  useGetPageByIdQuery,
  useRestorePageMutation,
  useUpdatePageDataMutation,
  useUpdatePageStatusMutation,
} from '@/services/PageManagement/pageManagementApi';
import { InputText } from '@/components/atoms/Input/InputText';

export default function PageManagementDetail() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    watch,
  } = useForm({
    reValidateMode: 'onSubmit',
  });
  const dispatch = useAppDispatch();
  const params = useParams();
  const roles = store.getState().loginSlice.roles;

  const [id] = useState<any>(Number(params.id));

  const [showApproveModal, setShowApproveModal] = useState(false);
  const [pageDetailList, setPageDetailList] = useState<any>([]);
  const [pageTemplates, setPageTemplates] = useState<any>([]);
  const [selected, setSelected] = useState<any>(null);
  const [contentTypeId, setContentTypeId] = useState<any>(null);
  const [content, setContent] = useState<any>(null);
  const [isDraft, setIsDraft] = useState<any>(false);
  const [idLog, setIdLog] = useState(null);
  const [logTitle, setLogTitle] = useState(null);

  const [search, setSearch] = useState<any>('');
  const [isEdited, setIsEdited] = useState(false);
  const [isAlreadyReview, setIsAlreadyReview] = useState(false);
  const [showModalReview, setShowModalReview] = useState(false);
  const [showModalWarning, setShowModalWarning] = useState(false);
  const [showModalApprove, setShowModalApprove] = useState(false);
  const [showModalRejected, setShowModalRejected] = useState(false);
  const [rejectComments, setRejectComments] = useState('');
  const [showArchivedModal, setShowArchivedModal] = useState(false);

  // PAGE TEMPLACE SELECTION STATE
  const [total, setTotal] = useState<number>(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageLimit] = useState(6);

  // CONTENT SELECTION STATE
  const [listContents, setListContents] = useState<any>([]);

  // AUTO APPROVE MODAL STATE
  const [showModalAutoApprove, setShowModalAutoApprove] = useState<boolean>(false);
  const [isAutoApprove, setIsAutoApprove] = useState<boolean>(false);

  // LEAVE MODAL STATE
  const [showLeaveModal, setShowLeaveModal] = useState<boolean>(false);
  const [titleLeaveModalShow, setLeaveTitleModalShow] = useState<string | null>('');
  const [messageLeaveModalShow, setMessageLeaveModalShow] = useState<string | null>('');

  // RTK GET DATA
  const fetchDataById = useGetPageByIdQuery(
    { id },
    {
      refetchOnMountOrArgChange: true,
    },
  );
  const { data: pageDataDetail } = fetchDataById;

  // RTK GET PAGE TEMPLATE
  const fetchPageTemplatesQuery = useGetPageTemplateQuery(
    {
      pageIndex,
      limit: pageLimit,
      sortBy: 'id',
      direction: 'desc',
      search,
      dataType: getValues('dataType') ?? pageDetailList?.dataType,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );
  const { data: dataPageTemplates } = fetchPageTemplatesQuery;

  // RTK GET CONTENT
  const fetchContentsQuery = useGetPostTypeListQuery(
    {
      pageIndex: 0,
      limit: 9999,
      sortBy: 'name',
      direction: 'asc',
      search: '',
      dataType: getValues('dataType') ?? pageDetailList?.dataType,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );
  const { data: dataContents } = fetchContentsQuery;

  const fetchGetEligibleAutoApprove = useGetEligibleAutoApproveQuery(
    {
      actionType: 'edit',
      dataType: 'page',
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );
  const { data: eligibleAutoApprove } = fetchGetEligibleAutoApprove;

  useEffect(() => {
    watch('dataType');
  }, [watch]);

  useEffect(() => {
    if (pageDataDetail) {
      setPageDetailList(pageDataDetail?.pageById);
      setSelected(pageDataDetail?.pageById?.pageTemplate?.id);
      setContent(pageDataDetail?.pageById?.content);
      setContentTypeId(pageDataDetail?.pageById?.postType?.id);
    }
  }, [pageDataDetail]);

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

  const [updatePageData] = useUpdatePageDataMutation();
  const [updatePageStatus] = useUpdatePageStatusMutation();
  const [restorePage] = useRestorePageMutation();

  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  // MAIN FUNCTION
  const submitButton = () => {
    return (
      <div className="flex justify-end mt-10">
        <div className="flex flex-row p-2 gap-2">
          <button
            onClick={() => {
              goBack();
            }}
            className="btn btn-outline text-xs btn-sm w-28 h-10">
            {t('user.page-management.detail.labels.cancel')}
          </button>
          <button
            onClick={() => {
              const payload = {
                id: pageDetailList?.id,
                status: pageDetailList?.status === 'DELETE_REVIEW' ? 'DELETE_APPROVE' : 'WAITING_APPROVE',
                comment: 'Already review',
              };              

              if (isAlreadyReview) {
                onUpdateStatus(payload);
              } else {
                setShowModalWarning(true);
              }
            }}
            className="btn btn-success text-xs text-white btn-sm w-28 h-10">
            {t('user.page-management.detail.labels.submit')}
          </button>
        </div>
      </div>
    );
  };

  const onRestoreData = (payload: { id: any }) => {
    restorePage(payload)
      .unwrap()
      .then(() => {
        dispatch(
          openToast({
            type: 'success',
            title: t('user.page-management.detail.messages.success'),
          }),
        );
        goBack();
      })
      .catch(() => {
        dispatch(
          openToast({
            type: 'error',
            title: t('user.page-management.detail.messages.failed'),
          }),
        );
        setShowArchivedModal(false);
      });
  };

  const onUpdateStatus = (payload: { id: any; status: string; comment: string }) => {
    updatePageStatus(payload)
      .unwrap()
      .then(() => {
        dispatch(
          openToast({
            type: 'success',
            title: t('user.page-management.detail.messages.success'),
          }),
        );
        goBack();
      })
      .catch(() => {
        dispatch(
          openToast({
            type: 'error',
            title: t('user.page-management.detail.messages.failed'),
          }),
        );
        goBack();
      });
  };

  const handlerSubmit = () => {
    if (eligibleAutoApprove?.isUserEligibleAutoApprove?.result) {
      setShowModalAutoApprove(true);
    } else {
      saveData();
    }
  };

  const saveData = () => {
    const pageData = getValues();
    const payload = {
      id,
      title: pageData?.pageName,
      dataType: pageData?.dataType,
      slug: pageData?.slug,
      metatitle: pageData?.metaTitle,
      metaDescription: pageData?.metaDescription,
      shortDesc: pageData?.shortDesc,
      content,
      isDraft,
      isAutoApprove,
      pageTemplateId: selected,
      postTypeId: contentTypeId,
    };

    updatePageData(payload)
      .unwrap()
      .then(() => {
        dispatch(
          openToast({
            type: 'success',
            title: t('user.page-management.detail.messages.success'),
          }),
        );
        goBack();
      })
      .catch((error: any) => {
        dispatch(
          openToast({
            type: 'error',
            message: t(`errors.page-management.${errorMessageTypeConverter(error.message)}`),
          }),
        );
        goBack();
      });
  };

  // COMPONENTS
  const Badge = () => {
    return (
      <div className="ml-5 flex flex-row gap-5">
        <div
          className="ml-3 cursor-pointer tooltip"
          data-tip="Log"
          onClick={() => {
            setIdLog(id);
            setLogTitle(pageDetailList?.title);
          }}>
          <img src={TimelineLog} className="w-6 h-6" />
        </div>
        <StatusBadge status={pageDetailList?.status || ''} />
      </div>
    );
  };

  const Label = ({ title, value, required }: any) => {
    return (
      <div className="flex flex-row">
        <Typography type="body" size="m" weight="medium" className="my-2 w-48">
          {title}
          {
            required && (
              <span className='text-reddist font-bold'>*</span>
            )
          }
        </Typography>
        <Typography type="body" size="s" weight="regular" className="text-body-text-2 my-2 mr-5">
          {value}
        </Typography>
      </div>
    );
  };

  const Footer = useCallback(() => {
    return (
      <div className="flex justify-end mt-10">
        <div className="flex flex-row p-2 gap-2">
          <button
            onClick={e => {
              e.preventDefault();
              setLeaveTitleModalShow(t('modal.confirmation'));
              setMessageLeaveModalShow(t('modal.leave-confirmation'));
              setShowLeaveModal(true);
            }}
            className="btn btn-outline text-xs btn-sm w-28 h-10">
            {t('user.page-management.detail.labels.cancel')}
          </button>
          <button
            onClick={() => {
              setIsDraft(true);
            }}
            className="btn btn-outline border-secondary-warning text-xs text-secondary-warning btn-sm w-28 h-10">
            {t('user.page-management.detail.labels.saveAsDraft')}
          </button>
          <button
            onClick={() => {
              setIsDraft(false);
            }}
            type="submit"
            className="btn btn-success text-xs text-white btn-sm w-28 h-10">
            {t('user.page-management.detail.labels.submit')}
          </button>
        </div>
      </div>
    );
  }, []);

  const rightTopButton = () => {
    switch (pageDetailList?.status) {
      case 'WAITING_REVIEW':
        return null;
      case 'WAITING_APPROVE':
      case 'DELETE_APPROVE':
        return (
          <>
            {roles?.includes('PAGE_APPROVE') ? (
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
            {roles?.includes('PAGE_EDIT')
              ? !isEdited && (
                <button
                  onClick={() => {
                    setIsEdited(true);
                  }}
                  className="btn btn-outline border-primary text-primary text-xs btn-sm w-48 h-10">
                  <img src={Edit} className="mr-3" />
                  {t('user.page-management.detail.labels.editContent')}
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
            {t('user.page-management.detail.labels.restore')}
          </button>
        );
      default:
        return null;
    }
  };

  const viewContent = () => {
    return (
      <div className="ml-2 mt-6">
        <div>
          <Typography type="heading4" weight="bold" className="mb-2">
            {t('user.page-management.detail.labels.generalInformation')}
          </Typography>
          <div className="grid grid-cols-1 sm:grid-cols-2">
            <Label
              title={t('user.page-management.detail.labels.pageName')}
              value={pageDetailList?.title}
              required
            />
            <Label
              title={t('user.page-management.detail.labels.metaTitle')}
              value={pageDetailList?.metaTitle}
              required
            />
            <Label
              title={t('user.page-management.detail.labels.slug')}
              value={pageDetailList?.slug}
              required
            />
            <Label
              title={t('user.page-management.detail.labels.metaDescription')}
              value={pageDetailList?.metaDescription}
              required
            />
            <Label
              title={t('user.page-management.detail.labels.shortDesc')}
              value={pageDetailList?.shortDesc}
            />
            <div></div>
            <Label
              title={t('user.page-management.detail.labels.data-type')}
              value={pageDetailList?.dataType}
              required
            />
          </div>
          <Label
            title={t('user.page-management.detail.labels.content')}
            value={pageDetailList?.content}
          />
          <Label
            title={t('user.page-management.detail.labels.chosenTemplate')}
            value={pageDetailList?.pageTemplate?.name}
          />
          <div className="flex justify-center my-5">
            <img src={getImageData(pageDetailList?.pageTemplate?.imageUrl)} />
          </div>
          <Label
            title={t('user.page-management.detail.labels.contentType')}
            value={pageDetailList?.postType?.name}
          />
        </div>
      </div>
    );
  };

  const editContent = () => {
    return (
      <form className="flex flex-col gap-5" onSubmit={handleSubmit(handlerSubmit)}>
        <div className="flex flex-col gap-3">
          <Typography weight="bold" size="l">
            {t('user.page-management.detail.labels.generalInformation')}
          </Typography>
          <div className="flex flex-row justify-between mt-2">
            <Controller
              name="pageName"
              control={control}
              defaultValue={pageDetailList?.title}
              rules={{
                required: {
                  value: true,
                  message: 'Page name is required',
                },
              }}
              render={({ field }) => (
                <InputText
                  {...field}
                  direction='row'
                  inputWidth={350}
                  labelTitle={t('user.page-management-new.pageNameLabel')}
                  labelRequired
                  labelStyle="font-bold"
                  placeholder={t('user.add.placeholder-user-fullname')}
                  roundStyle="xl"
                  isError={!!errors?.pageName}
                  helperText={errors?.pageName?.message}
                />
              )}
            />
            <Controller
              name="metaTitle"
              control={control}
              defaultValue={pageDetailList?.metaTitle}
              rules={{
                required: {
                  value: true,
                  message: 'Meta title is required',
                },
              }}
              render={({ field }) => (
                <InputText
                  {...field}
                  direction='row'
                  inputWidth={350}
                  labelTitle={t('user.page-management-new.metaTitleLabel')}
                  labelRequired
                  labelStyle="font-bold"
                  placeholder={t('user.page-management-new.metaTitlePlaceholder')}
                  roundStyle="xl"
                  isError={!!errors?.metaTitle}
                  helperText={errors?.metaTitle?.message}
                />
              )}
            />
          </div>
          <div className="flex flex-row justify-between">
            <Controller
              name="slug"
              control={control}
              defaultValue={pageDetailList?.slug}
              rules={{
                required: {
                  value: true,
                  message: 'Slug is required',
                },
              }}
              render={({ field }) => (
                <InputText
                  {...field}
                  direction='row'
                  inputWidth={350}
                  labelTitle={t('user.page-management-new.slugLabel')}
                  labelRequired
                  labelStyle="font-bold"
                  placeholder={t('user.page-management-new.slugPlaceholder')}
                  roundStyle="xl"
                  isError={!!errors?.slug}
                  helperText={errors?.slug?.message}
                />
              )}
            />
            <Controller
              name="metaDescription"
              control={control}
              defaultValue={pageDetailList?.metaDescription}
              rules={{
                required: {
                  value: true,
                  message: 'Meta description is required',
                },
              }}
              render={({ field }) => (
                <InputText
                  {...field}
                  direction='row'
                  inputWidth={350}
                  labelTitle={t('user.page-management-new.metaDescriptionLabel')}
                  labelRequired
                  labelStyle="font-bold"
                  placeholder={t('user.page-management-new.metaDescriptionPlaceholder')}
                  roundStyle="xl"
                  isError={!!errors?.metaDescription}
                  helperText={errors?.metaDescription?.message}
                />
              )}
            />
          </div>
          <div className="flex flex-row justify-start">
            <Controller
              name="shortDesc"
              control={control}
              defaultValue={pageDetailList?.shortDesc}
              render={({ field }) => (
                <TextArea
                  {...field}
                  direction='row'
                  inputWidth={350}
                  labelTitle={t('user.page-management-new.shortDescriptionLabel')}
                  labelStyle="font-bold"
                  placeholder={t('user.page-management-new.shortDescriptionPlaceholder')}
                  roundStyle="xl"
                />
              )}
            />
          </div>
          <div className="flex flex-row justify-start">
            <Controller
              name='dataType'
              control={control}
              defaultValue={pageDetailList?.dataType}
              render={({ field }) => (
                <DropDown
                  {...field}
                  direction='row'
                  inputWidth={350}
                  labelTitle={t('user.page-management-new.dataTypeLabel')}
                  labelStyle="font-bold"
                  labelRequired
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
              {t('user.page-management.detail.labels.chooseTemplate')}
              <span className="text-reddist">*</span>
            </Typography>
            <InputSearch
              onBlur={(e: any) => {
                setSearch(e.target.value);
              }}
              placeholder={t('user.page-management.detail.labels.search') ?? ''}
            />
          </div>
          <div className="flex flex-wrap">
            {pageTemplates.length > 0 &&
              pageTemplates.length < 7 &&
              pageTemplates.map((element: any) => (
                <div key={element.id} className="px-[5%] py-5 flex flex-col basis-2/6 gap-3">
                  <img
                    src={getImageData(element.imageUrl)}
                    className={`h-[450px] object-cover	cursor-pointer rounded-xl ${selected === element.id
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
          <div className="w-full flex justify-center items-center">
            <div className='mr-5 font-semibold'>Total {total} Items</div>
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
        <div className="flex justify-center">
          <div className="w-[35%]">
            <DropDown
              labelTitle={t('user.page-management.detail.labels.chooseContentType') ?? ''}
              labelStyle="font-bold	"
              defaultValue={pageDetailList?.postType?.id}
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
        {isEdited && <Footer />}
      </form>
    );
  };

  return (
    <>
      <ModalLog
        id={idLog}
        open={!!idLog}
        toggle={() => {
          setIdLog(null);
        }}
        title={`${t('user.page-management.detail.labels.log-approval') ?? ''} - ${logTitle}`}
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
          <p className="font-bold mt-3 text-xl">{t('user.page-management.detail.labels.autoApproveTitle')}</p>
          <p className="font-base mt-2 text-xl text-center">
            {t('user.page-management.detail.labels.autoApproveSubtitle', { title: getValues().pageName })}
          </p>
          <CheckBox
            defaultValue={isAutoApprove}
            updateFormValue={e => {
              setIsAutoApprove(e.value);
            }}
            labelTitle={t('user.page-management.detail.labels.autoApproveLabel')}
            labelStyle='text-xl'
          />
        </div>
      </ModalForm>
      <ModalConfirm
        open={showApproveModal}
        cancelAction={() => {
          setShowApproveModal(false);
        }}
        title={t('user.page-management.detail.labels.approve')}
        cancelTitle={t('user.page-management.detail.labels.restoreNo')}
        message={'Test'}
        submitAction={() => { }}
        submitTitle={t('user.page-management.detail.labels.restoreYes')}
        icon={undefined}
      />
      <ModalConfirm
        open={showModalReview}
        title={t('user.page-management.detail.labels.reviewPageContent')}
        cancelTitle={t('user.page-management.detail.labels.restoreNo')}
        message={t('user.page-management.detail.labels.reviewPageConfirmation') ?? ''}
        submitTitle={t('user.page-management.detail.labels.restoreYes')}
        icon={PaperIcon}
        submitAction={() => {
          setShowModalReview(false);
        }}
        btnSubmitStyle="btn bg-secondary-warning border-none"
        cancelAction={() => {
          setShowModalReview(false);
          setIsAlreadyReview(false);
        }}
      />
      <ModalConfirm
        open={showModalWarning}
        title={''}
        message={t('user.page-management.detail.messages.alreadyReviewWarning') ?? ''}
        submitTitle={t('user.page-management.detail.labels.restoreYes')}
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
        title={t('user.page-management.detail.labels.approve')}
        cancelTitle={t('user.page-management.detail.labels.restoreNo')}
        message={
          pageDetailList?.status === 'WAITING_APPROVE'
            ? t('user.page-management.detail.labels.approveConfirmation') ?? ''
            : t('user.page-management.detail.labels.approveDeleteConfirmation') ?? ''
        }
        submitTitle={t('user.page-management.detail.labels.restoreYes')}
        icon={CheckOrange}
        submitAction={() => {
          setShowModalApprove(false);
          const payload = {
            id: pageDetailList?.id,
            status: pageDetailList?.status === 'DELETE_APPROVE' ? 'ARCHIVED' : 'APPROVED',
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
        title={t('user.page-management.detail.labels.restoreContentData')}
        cancelTitle={t('user.page-management.detail.labels.cancel')}
        message={t('user.page-management.detail.labels.restoreConfirmation') ?? ''}
        submitTitle={t('user.page-management.detail.labels.restoreYes')}
        icon={RestoreOrange}
        submitAction={() => {
          setShowArchivedModal(false);
          const payload = {
            id: pageDetailList?.id,
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
        submitPosition="justify-center"
        formTitle=""
        height={640}
        submitTitle={t('user.page-management.detail.labels.restoreYes')}
        submitType="bg-secondary-warning border-none"
        submitDisabled={rejectComments === ''}
        cancelTitle={t('user.page-management.detail.labels.restoreNo')}
        cancelAction={() => {
          setShowModalRejected(false);
        }}
        submitAction={() => {
          setShowModalRejected(false);
          const payload = {
            id: pageDetailList?.id,
            status: pageDetailList?.status === 'DELETE_APPROVE' ? 'DELETE_REJECTED' : 'REJECTED',
            comment: rejectComments,
          };

          onUpdateStatus(payload);
        }}>
        <div className="flex flex-col justify-center items-center w-full">
          <img src={PaperIcon} className="w-10" />
          {pageDetailList?.status === 'WAITING_APPROVE' ? (
            <p className="font-semibold my-3 text-xl">
              {t('user.page-management.detail.labels.rejectConfirmation')}
            </p>
          ) : (
            <p className="font-semibold my-3 text-xl">
              {t('user.page-management.detail.labels.deleteRejectConfirmation')}
            </p>
          )}
          <TextArea
            name="shortDesc"
            labelTitle={t('user.page-management.detail.labels.rejectComments')}
            labelStyle="font-bold"
            value={rejectComments}
            labelRequired
            placeholder={t('user.page-management.detail.labels.enterRejectComments') ?? ''}
            containerStyle="px-8" 
            onChange={e => {
              setRejectComments(e.target.value);
            }}
          />
        </div>
      </ModalForm>
      <ModalConfirm
        open={showLeaveModal}
        cancelAction={() => {
          setShowLeaveModal(false);
        }}
        title={titleLeaveModalShow ?? ''}
        cancelTitle={t('no')}
        message={messageLeaveModalShow ?? ''}
        submitAction={() => {
          goBack();
        }}
        submitTitle={t('yes')}
        icon={CancelIcon}
        btnSubmitStyle="btn-warning"
      />
      
      <TitleCard
        title={`${pageDetailList?.title} - ${t('user.page-management.detail.labels.title') ?? ''}`}
        titleComponent={<Badge />}
        border={true}
        TopSideButtons={rightTopButton()}
      >
        {(pageDetailList?.lastComment && (pageDetailList?.status === 'DELETE_REJECTED' || pageDetailList?.status === 'REJECTED')) && (
          <div className='flex flex-row gap-3 bg-[#FBF8FF] p-4 rounded-lg my-6 max-w-[700px]'>
            <Typography size='s' weight='bold' className='min-w-[140px]'>Rejected Comment:</Typography>
            <Typography size='s' className='text-reddist'>{pageDetailList.lastComment}</Typography>
          </div>          
        )}
        {pageDetailList?.lastEdited && (
          <div>
            {t('user.page-management.detail.labels.lastEditedBy')}{' '}
            <span className="font-bold">{pageDetailList?.lastEdited?.editedBy}</span>{' '}
            {t('user.page-management.detail.labels.at')}{' '}
            <span className="font-bold">
              {dayjs(pageDetailList?.lastEdited?.editedAt).format('DD/MM/YYYY - HH:mm')}
            </span>
          </div>
        )}
        {isEdited ? editContent() : viewContent()}
        {roles?.includes('PAGE_REVIEW') ? (
          pageDetailList?.status === 'WAITING_REVIEW' ||
            pageDetailList?.status === 'DELETE_REVIEW' ? (
            <div className="flex flex-row justify-between">
              <div className="w-[30vh] mt-5">
                <CheckBox
                  defaultValue={isAlreadyReview}
                  updateFormValue={e => {
                    setIsAlreadyReview(e.value);
                    if (e.value) {
                      setShowModalReview(true);
                    }
                  }}
                  labelTitle={t('user.page-management.detail.labels.alreadyReview')}
                  updateType={''}
                />
              </div>
              {submitButton()}
            </div>
          ) : null
        ) : null}
      </TitleCard>
    </>
  );
}
