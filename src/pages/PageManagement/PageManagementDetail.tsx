import { useCallback, useEffect, useState } from 'react';
import { TitleCard } from '@/components/molecules/Cards/TitleCard';
import StatusBadge from './components/StatusBadge';
import Typography from '@/components/atoms/Typography';
import { CheckBox } from '@/components/atoms/Input/CheckBox';
import { ButtonMenu } from '@/components/molecules/ButtonMenu';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useGetPageByIdQuery,
  useRestorePageMutation,
  useUpdatePageDataMutation,
  useUpdatePageStatusMutation,
} from '@/services/PageManagement/pageManagementApi';
import { store, useAppDispatch } from '@/store';
import Edit from '@/assets/edit-purple.svg';
import Restore from '@/assets/restore.svg';
import { TextArea } from '@/components/atoms/Input/TextArea';
import ModalForm from '@/components/molecules/ModalForm';
import ModalConfirm from '@/components/molecules/ModalConfirm';
import RestoreOrange from '@/assets/restore-orange.svg';
import CheckOrange from '@/assets/check-orange.svg';
import PaperIcon from '../../assets/paper.png';
import WarningIcon from '@/assets/warning.png';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from '@/components/atoms/Input/InputText';
import CkEditor from '@/components/atoms/Ckeditor';
import { InputSearch } from '@/components/atoms/Input/InputSearch';
import DropDown from '@/components/molecules/DropDown';
import { openToast } from '@/components/atoms/Toast/slice';
import ModalLog from './components/ModalLog';
import TimelineLog from '@/assets/timeline-log.svg';
import dayjs from 'dayjs';

export default function PageManagementDetail() {
  const dispatch = useAppDispatch();
  const params = useParams();
  const [id] = useState<any>(Number(params.id));
  const roles = store.getState().loginSlice.roles;

  const [showApproveModal, setShowApproveModal] = useState(false);
  const [pageDetailList, setPageDetailList] = useState<any>([]);
  const [pageTemplates, setPageTemplates] = useState<any>([]);
  const [selected, setSelected] = useState<any>(null);
  const [contentTypeId, setContentTypeId] = useState<any>(null);
  const [content, setContent] = useState<any>(null);
  const [isDraft, setIsDraft] = useState<any>(false);
  const [idLog, setIdLog] = useState(null);
  const [logTitle, setLogTitle] = useState(null);

  const [setSearch] = useState<any>('');
  const [isEdited, setIsEdited] = useState(false);
  const [isAlreadyReview, setIsAlreadyReview] = useState(false);
  const [showModalReview, setShowModalReview] = useState(false);
  const [showModalWarning, setShowModalWarning] = useState(false);
  const [showModalApprove, setShowModalApprove] = useState(false);
  const [showModalRejected, setShowModalRejected] = useState(false);
  const [rejectComments, setRejectComments] = useState('');
  const [showArchivedModal, setShowArchivedModal] = useState(false);

  // RTK GET DATA
  const fetchDataById = useGetPageByIdQuery({ id });
  const { data: pageDataDetail } = fetchDataById;

  useEffect(() => {
    if (pageDataDetail) {
      setPageDetailList(pageDataDetail?.pageById);
      setSelected(pageDataDetail?.pageById?.pageTemplate?.id);
      setContent(pageDataDetail?.pageById?.content);
    }
  }, [pageDataDetail]);

  const [updatePageData] = useUpdatePageDataMutation();
  const [updatePageStatus] = useUpdatePageStatusMutation();
  const [restorePage] = useRestorePageMutation();

  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  // FORM VALIDATION
  const {
    control,
    handleSubmit,
  } = useForm();

  useEffect(() => {
    setTimeout(() => {
      setPageTemplates([
        {
          id: 1,
          name: 'Image 1',
          image:
            'https://w0.peakpx.com/wallpaper/677/326/HD-wallpaper-blue-landscape-aesthetic-blue-flowers-landscape-nature-trees-thumbnail.jpg',
        },
        {
          id: 2,
          name: 'Image 2',
          image:
            'https://w0.peakpx.com/wallpaper/677/326/HD-wallpaper-blue-landscape-aesthetic-blue-flowers-landscape-nature-trees-thumbnail.jpg',
        },
        {
          id: 3,
          name: 'Image 3',
          image:
            'https://w0.peakpx.com/wallpaper/677/326/HD-wallpaper-blue-landscape-aesthetic-blue-flowers-landscape-nature-trees-thumbnail.jpg',
        },
        {
          id: 4,
          name: 'Image 4',
          image:
            'https://w0.peakpx.com/wallpaper/677/326/HD-wallpaper-blue-landscape-aesthetic-blue-flowers-landscape-nature-trees-thumbnail.jpg',
        },
        {
          id: 5,
          name: 'Image 5',
          image:
            'https://w0.peakpx.com/wallpaper/677/326/HD-wallpaper-blue-landscape-aesthetic-blue-flowers-landscape-nature-trees-thumbnail.jpg',
        },
        {
          id: 6,
          name: 'Image 6',
          image:
            'https://w0.peakpx.com/wallpaper/677/326/HD-wallpaper-blue-landscape-aesthetic-blue-flowers-landscape-nature-trees-thumbnail.jpg',
        },
      ]);
    }, 50);
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
              const payload = {
                id: pageDetailList?.id,
                status: 'WAITING_APPROVE',
                comment: 'Already review',
              };
  
              if (isAlreadyReview) {
                onUpdateStatus(payload);
              } else {
                setShowModalWarning(true);
              }
            }}
            className="btn btn-success text-xs text-white btn-sm w-28 h-10">
            Submit
          </button>
        </div>
      </div>
    );
  };

  const onRestoreData = (payload: {id: any}) => {
    restorePage(payload)
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
  };

  const handlerSubmit = (formData: any) => {
    const payload = {
      id,
      title: formData?.pageName,
      slug: formData?.slug,
      metatitle: formData?.metaTitle,
      metaDescription: formData?.metaDescription,
      shortDesc: formData?.shortDesc,
      content,
      imgFilename: pageTemplates.find((template: { id: any; }) => template.id === selected)?.name,
      isDraft,
      pageTemplateId: selected,
      postTypeId: contentTypeId,
    };

    updatePageData(payload)
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
  };

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
        <StatusBadge status={pageDetailList?.pageStatus || ''} />
      </div>
    );
  };

  const Label = ({ title, value }: any) => {
    return (
      <div className="flex flex-row">
        <Typography type="body" size="m" weight="medium" className="my-2 w-48">
          {title}
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
          <button onClick={() => {goBack()}} className="btn btn-outline text-xs btn-sm w-28 h-10">
            Cancel
          </button>
          <button
            onClick={() => {setIsDraft(true)}}
            className="btn btn-outline border-secondary-warning text-xs text-secondary-warning btn-sm w-28 h-10">
            Save as Draft
          </button>
          <button onClick={() => {setIsDraft(false)}} type="submit" className="btn btn-success text-xs text-white btn-sm w-28 h-10">
            Submit
          </button>
        </div>
      </div>
    );
  }, []);

  const rightTopButton = () => {
    switch (pageDetailList?.pageStatus) {
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

  const viewContent = () => {
    return (
      <div className="ml-2 mt-6">
        <div>
          <Typography type="heading4" weight="bold" className="mb-2">
            General Information
          </Typography>
          <div className="grid grid-cols-1 sm:grid-cols-2">
            <Label title="Page Name" value={pageDetailList?.title} />
            <Label title="Metatitle" value={pageDetailList?.metaTitle} />
            <Label title="Slug" value={pageDetailList?.slug} />
            <Label title="Metadescription" value={pageDetailList?.metaDescription} />
            <Label
              title="Short Description"
              value={pageDetailList?.shortDesc}
            />
          </div>
          <Label title="Content" value={pageDetailList?.content} />
          <Label title="Chosen Template" value={pageDetailList?.imgFilename} />
          <div className="flex justify-center my-5">
            <img src={pageDetailList?.pageTemplate?.imageUrl} />
          </div>
          <Label title="Content Type" value={pageDetailList?.postType?.name} />
        </div>
      </div>
    );
  };

  const editContent = () => {
    return (
      <form className="flex flex-col gap-3" onSubmit={handleSubmit(handlerSubmit)}>
        <div className="flex flex-col gap-3">
          <Typography weight="bold" size="l">
            General Information
          </Typography>
          <div className="flex flex-row justify-between">
            <Controller
              name="pageName"
              control={control}
              defaultValue={pageDetailList?.title}
              render={({ field }) => (
                <InputText
                  labelTitle="Page Name"
                  labelStyle="font-semibold"
                  labelWidth={150}
                  labelRequired
                  direction="row"
                  roundStyle="xl"
                  placeholder="Enter new page name"
                  inputWidth={350}
                  {...field}
                />
              )}
            />
            <Controller
              name="metaTitle"
              control={control}
              defaultValue={pageDetailList?.metaTitle}
              render={({ field }) => (
                <InputText
                  labelTitle="Metatitle"
                  labelStyle="font-semibold"
                  labelWidth={150}
                  labelRequired
                  direction="row"
                  roundStyle="xl"
                  placeholder="Enter metatitle here"
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
              defaultValue={pageDetailList?.slug}
              render={({ field }) => (
                <InputText
                  labelTitle="Slug"
                  labelStyle="font-semibold"
                  labelWidth={150}
                  labelRequired
                  direction="row"
                  roundStyle="xl"
                  placeholder="Enter slug name"
                  inputWidth={350}
                  {...field}
                />
              )}
            />
            <Controller
              name="metaDescription"
              control={control}
              defaultValue={pageDetailList?.metaDescription}
              render={({ field }) => (
                <InputText
                  labelTitle="Metadescription"
                  labelStyle="font-semibold"
                  labelWidth={150}
                  labelRequired
                  direction="row"
                  roundStyle="xl"
                  placeholder="Enter metadescription here"
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
              defaultValue={pageDetailList?.shortDesc}
              render={({ field }) => (
                <TextArea
                  labelTitle="Short Description"
                  labelStyle="font-semibold"
                  labelWidth={150}
                  labelRequired
                  direction="row"
                  placeholder="Enter description"
                  inputWidth={350}
                  {...field}
                />
              )}
            />
          </div>
          <div className="flex flex-col justify-start gap-3">
            <Typography size="m" weight="semi">
              Content
            </Typography>
            <CkEditor />
          </div>
        </div>
        {/* DIVIDER */}
        <div className="w-full my-4 border-[1px] border-lavender" />
        {/* PAGE TEMPLATE SECTION */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-row justify-between">
            <Typography size="m" weight="bold">
              Choose Your Template
            </Typography>
            <InputSearch
              onBlur={(e: any) => {
                setSearch(e.target.value);
              }}
              placeholder="Search"
            />
          </div>
          <div className="flex flex-wrap">
            {pageTemplates.length > 0 &&
              pageTemplates.length < 7 &&
              pageTemplates.map((element: any) => (
                <div key={element.id} className="px-[5%] py-5 flex flex-col basis-2/6 gap-3">
                  <img
                    src={element.image}
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
        </div>
        {/* CONTENT TYPE SECTION */}
        <div className="flex justify-center">
          <div className="w-[35%]">
            <DropDown
              labelTitle="Choose Content Type"
              labelStyle="font-bold	"
              labelRequired
              defaultValue={pageDetailList?.postType?.name}
              labelEmpty=""
              items={[
                {
                  value: 1,
                  label: 'Content Type 1',
                },
                {
                  value: 2,
                  label: 'Content Type 2',
                },
              ]}
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
        title={`Log Approval - ${logTitle}`}
      />
      <ModalConfirm
        open={showApproveModal}
        cancelAction={() => {
          setShowApproveModal(false);
        }}
        title={'Approve'}
        cancelTitle="No"
        message={'Test'}
        submitAction={() => {}}
        submitTitle="Yes"
        // icon={WarningIcon}
        icon={undefined}
      />
      <TitleCard
        title={`${pageDetailList?.title} - Page Template`}
        titleComponent={<Badge />}
        border={true}
        TopSideButtons={rightTopButton()}>
        <ModalConfirm
          open={showModalReview}
          title={'Review Page Content'}
          cancelTitle="No"
          message={'Are you sure you already review this page content?'}
          submitTitle="Yes"
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
            pageDetailList?.pageStatus === 'WAITING_APPROVE'
              ? 'Do you want to approve this page content?'
              : 'Do you want to approve delete this page content?'
          }
          submitTitle="Yes"
          icon={CheckOrange}
          submitAction={() => {
            setShowModalApprove(false);
            const payload = {
              id: pageDetailList?.id,
              status: pageDetailList?.pageStatus === 'DELETE_APPROVE' ? 'ARCHIVED' : 'APPROVED',
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
              id: pageDetailList?.id,
              status:
                pageDetailList?.pageStatus === 'DELETE_APPROVE' ? 'DELETE_REJECTED' : 'REJECTED',
              comment: rejectComments,
            };

            onUpdateStatus(payload);
          }}>
          <div className="flex flex-col justify-center items-center">
            <img src={PaperIcon} className="w-10" />
            {pageDetailList?.pageStatus === 'WAITING_APPROVE' ? (
              <p className="font-semibold my-3 text-xl">Do you want to reject this content data?</p>
            ) : (
              <p className="font-semibold my-3 text-xl">
                Do you want to reject this delete request?
              </p>
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
        {pageDetailList?.lastEdited && (
          <div>Last Edited by <span className='font-bold'>{pageDetailList?.lastEdited?.editedBy}</span> at <span className='font-bold'>{dayjs(pageDetailList?.lastEdited?.editedAt).format('DD/MM/YYYY - HH:mm')}</span></div>
        )}
        {isEdited ? editContent() : viewContent()}
        {roles?.includes('PAGE_REVIEW') ? (
          pageDetailList?.pageStatus === 'WAITING_REVIEW' ||
          pageDetailList?.pageStatus === 'DELETE_REVIEW' ? (
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
                  labelTitle="I Already Review This Page Content"
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
