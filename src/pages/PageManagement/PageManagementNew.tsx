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
import { InputText } from '@/components/atoms/Input/InputText';
import { TextArea } from '@/components/atoms/Input/TextArea';
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

export default function PageManagementNew() {
  const {
    control,
    handleSubmit,
    // eslint-disable-next-line no-empty-pattern
    formState: {},
    getValues,
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // PAGE TEMPLACE SELECTION STATE
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
  const fetchGetEligibleAutoApprove = useGetEligibleAutoApproveQuery({
    actionType: 'create',
    dataType: 'page'
  });
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
          <p className="font-base mt-2 text-xl text-center">
            {t('user.page-management-new.autoApproveSubtitle')}
          </p>
          <CheckBox
            defaultValue={isAutoApprove}
            updateFormValue={e => {
              setIsAutoApprove(e.value);
            }}
            labelTitle={t('user.page-management-new.autoApproveLabel')}
            labelStyle="text-xl mt-2"
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
            <div className="flex flex-row justify-between">
              <Controller
                name="pageName"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <InputText
                    labelTitle={t('user.page-management-new.pageNameLabel')}
                    labelStyle="font-semibold"
                    labelWidth={150}
                    labelRequired
                    direction="row"
                    roundStyle="xl"
                    placeholder={t('user.page-management-new.pageNamePlaceholder')}
                    inputWidth={350}
                    {...field}
                  />
                )}
              />
              <Controller
                name="metaTitle"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <InputText
                    labelTitle={t('user.page-management-new.metaTitleLabel')}
                    labelStyle="font-semibold"
                    labelWidth={150}
                    labelRequired
                    direction="row"
                    roundStyle="xl"
                    placeholder={t('user.page-management-new.metaTitlePlaceholder')}
                    inputWidth={350}
                    {...field}
                  />
                )}
              />
            </div>
            <div className="flex flex-row justify-between">
              <Controller
                name="slug"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <InputText
                    labelTitle={t('user.page-management-new.slugLabel')}
                    labelStyle="font-semibold"
                    labelWidth={150}
                    labelRequired
                    direction="row"
                    roundStyle="xl"
                    placeholder={t('user.page-management-new.slugPlaceholder')}
                    inputWidth={350}
                    {...field}
                  />
                )}
              />
              <Controller
                name="metaDescription"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <InputText
                    labelTitle={t('user.page-management-new.metaDescriptionLabel')}
                    labelStyle="font-semibold"
                    labelWidth={150}
                    labelRequired
                    direction="row"
                    roundStyle="xl"
                    placeholder={t('user.page-management-new.metaDescriptionPlaceholder')}
                    inputWidth={350}
                    {...field}
                  />
                )}
              />
            </div>
            <div className="flex flex-row justify-start">
              <Controller
                name="shortDesc"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextArea
                    labelTitle={t('user.page-management-new.shortDescriptionLabel')}
                    labelStyle="font-semibold"
                    labelWidth={150}
                    labelRequired
                    direction="row"
                    placeholder={t('user.page-management-new.shortDescriptionPlaceholder') ?? ''}
                    inputWidth={350}
                    {...field}
                  />
                )}
              />
            </div>
            <div className="flex flex-col justify-start gap-3">
              <Typography size="m" weight="semi">
                {t('user.page-management-new.contentLabel')}
              </Typography>
              <CkEditor
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
                      src={element.imageUrl}
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
