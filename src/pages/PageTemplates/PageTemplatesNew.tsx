import { 
  t,
} from "i18next";
import { 
  useNavigate,
} from "react-router-dom";
import { 
  useState,
} from "react";

import UploadIcon from "../../assets/upload-file.svg";
import CancelIcon from "../../assets/cancel.png";
import ModalConfirm from "../../components/molecules/ModalConfirm";
import { 
  TitleCard,
} from "../../components/molecules/Cards/TitleCard";
import { 
  InputText,
} from "../../components/atoms/Input/InputText";
import { 
  useAppDispatch,
} from "../../store";
import { 
  useCreatePageTemplateMutation,
} from "../../services/PageTemplate/pageTemplateApi";
import { 
  openToast,
} from "../../components/atoms/Toast/slice";

export default function PageTemplatesNew () {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // FORM STATE
  const [pageName, setPageName] = useState("");
  const [pageDescription, setPageDescription] = useState("");
  const [pageFileName, setPageFileName] = useState("");
  // LEAVE MODAL
  const [showLeaveModal, setShowLeaveModal] = useState<boolean>(false);
  const [titleLeaveModalShow, setLeaveTitleModalShow] = useState<string | null>("");
  const [messageLeaveModalShow, setMessageLeaveModalShow] = useState<string | null>("");

  // RTK CREATE PAGE TEMPLATE
  const [ createPageTemplate, {
    isLoading
  }] = useCreatePageTemplateMutation();

  const onSave = () => {
    const payload = {
      filenameCode: pageFileName,
      name: pageName,
      shortDesc: pageDescription,
    }
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
  }

  const onLeave = () => {
    setShowLeaveModal(false);
    navigate('/page-template');
  };

  return (
    <TitleCard
      title={t('page-template.add.title')}
      topMargin="mt-2"
    >
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
        btnSubmitStyle='btn-warning'
      />
      <form className="flex flex-col w-100 mt-[35px]">
        <div className="flex flex-col gap-[30px]">
          <InputText
            labelTitle="Page Name"
            labelStyle="font-bold	"
            labelRequired
            value={pageName}
            direction="row"
            roundStyle="xl"
            inputWidth={350}
            placeholder="Content"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setPageName(event.target.value);
            }}
          />
          <InputText
            labelTitle="Page Description"
            labelStyle="font-bold	"
            labelRequired
            value={pageDescription}
            direction="row"
            roundStyle="xl"
            inputWidth={350}
            placeholder="Content"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setPageDescription(event.target.value);
            }}
          />
          <InputText
            labelTitle="Page File name"
            labelStyle="font-bold	"
            labelRequired
            value={pageFileName}
            direction="row"
            roundStyle="xl"
            inputWidth={350}
            placeholder="Content"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setPageFileName(event.target.value);
            }}
          />
          <div className={`form-control w-full flex-row`}>
            <label className={`label w-[225px] font-bold`}>
              <span className={`label-text text-base-content`}>Image Preview<span className={'text-reddist text-lg'}>*</span></span>
            </label>
            <div className="flex flex-col gap-3">
              <div className="w-[550px] h-[275px] border-dashed border-2 rounded-xl gap-[20px] flex flex-col justify-center items-center">
                <img src={UploadIcon} className="w-[48px] h-[48px]" />
                <p className="text-xl">Drag and drop or upload image template preview</p>
              </div>
              <p className="text-[#818494] text-base">Only Support format .jpg .jpeg .png</p>
            </div>
          </div>
          <div className="mt-[200px] flex justify-end items-end gap-2">
            <button className="btn btn-outline btn-md" onClick={(event: any) => {
              event.preventDefault();
              setLeaveTitleModalShow(t('modal.confirmation'));
              setMessageLeaveModalShow(t('modal.leave-confirmation'));
              setShowLeaveModal(true);          
            }}>
              {isLoading ? 'Loading...' : t('btn.cancel')}
            </button>
            <button className="btn btn-success btn-md text-white" onClick={(event: any) => {
              event.preventDefault();
              onSave();
            }}>
              {isLoading ? 'Loading...' : t('btn.save')}
            </button>
          </div>
        </div>
      </form>
    </TitleCard>
  )
}
