import React, { useState } from "react";
import { useNavigate } from "react-router";
import { t } from "i18next";

import CancelIcon from "../../assets/cancel.png";
import ModalConfirmLeave from "@/components/molecules/ModalConfirm";
import { Divider } from "@/components/atoms/Divider";
import { CheckBox } from "@/components/atoms/Input/CheckBox";
import { InputText } from "@/components/atoms/Input/InputText";
import { TitleCard } from "@/components/molecules/Cards/TitleCard";
import { MultipleInput } from "@/components/molecules/MultipleInput";
import { checkIsEmail, copyArray } from "@/utils/logicHelper";
// import { useAppDispatch } from "@/store";

export default function EmailFormBuilderNew () {
  const navigate = useNavigate();
  // const dispatch = useAppDispatch();
  // FORM STATE
  const [formName, setFormName] = useState("");
  const [checkSubmitterEmail, setCheckSubmitterEmail] = useState(false);
  const [multipleInput, setMultipleInput] = useState([]);
  // LEAVE MODAL
  const [showLeaveModal, setShowLeaveModal] = useState<boolean>(false);
  const [titleLeaveModalShow, setLeaveTitleModalShow] = useState<string | null>("");
  const [messageLeaveModalShow, setMessageLeaveModalShow] = useState<string | null>("");

  const onSave = () => {

  }

  const onLeave = () => {
    setShowLeaveModal(false);
    navigate('/email-form-builder');
  };

  const handlerAddMultipleInput = (value: any) => {
    const items: any = copyArray(multipleInput);
    items.push(value);
    setMultipleInput(items);
  };

  const handlerDeleteMultipleInput = (index: any) => {
    const items: any = copyArray(multipleInput);
    items.splice(index, 1);
    setMultipleInput(items);
  };

  return (
    <React.Fragment>
      <TitleCard
        title={t('email-form-builder.add.title')}
        topMargin="mt-2"
      >
        <ModalConfirmLeave
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
          btnType='btn-warning'
        />
        <form className="flex flex-col w-100 mt-[35px] gap-5">
          {/* TOP SECTION */}
          <div className="flex flex-col gap-3">
            <InputText
              labelTitle="Form Name"
              labelStyle="font-bold	"
              labelRequired
              direction="row"
              roundStyle="xl"
              placeholder="Enter new form name"
              inputWidth={400}
              value={formName}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setFormName(event.target.value);
              }}
            />
            <MultipleInput
              labelTitle="PIC"
              labelStyle="font-bold	"
              inputStyle="rounded-xl "
              inputWidth={400}
              items={multipleInput}
              logicValidation={checkIsEmail}
              errorAddValueMessage="The PIC filling format must be email format"
              onAdd={handlerAddMultipleInput}
              onDelete={handlerDeleteMultipleInput}
            />
            <CheckBox
              defaultValue={checkSubmitterEmail}
              updateFormValue={e => {
                setCheckSubmitterEmail(e.value);
              }}
              labelTitle="Also send to submitter email"
              labelContainerStyle="justify-start"
              containerStyle="ml-[225px] "
            />
          </div>

          {/* DIVIDER SECTION */}
          <Divider />

          {/* BOT SECTION */}
          <div className="mt-4 flex flex-row w-100 h-[500px] gap-2">
            <div className="flex flex-1 border-[1px] border-light-grey rounded-2xl p-4">
              <div className="flex flex-col gap-4">
                <h2 className="font-bold ">Component List</h2>
              </div>
            </div>
            <div className="flex flex-1 border-[1px] border-light-grey rounded-2xl p-4">
              <div className="flex flex-col gap-4">
                <h2 className="font-bold ">Form Preview</h2>
              </div>
            </div>
            <div className="flex flex-1 border-[1px] border-light-grey rounded-2xl p-4">
              <div className="flex flex-col gap-4">
                <h2 className="font-bold ">Configuration Bar</h2>
              </div>
            </div>    
          </div>

          {/* BUTTONS SECTION */}
          <div className="mt-[50px] flex justify-end items-end gap-2">
            <button className="btn btn-outline btn-md" onClick={(event: any) => {
              event.preventDefault();
              setLeaveTitleModalShow(t('modal.confirmation'));
              setMessageLeaveModalShow(t('modal.leave-confirmation'));
              setShowLeaveModal(true);          
            }}>
              {t('btn.cancel')}
            </button>
            <button className="btn btn-success btn-md" onClick={(event: any) => {
              event.preventDefault();
              onSave();
            }}>
              {t('btn.save')}
            </button>
          </div>
        </form>
      </TitleCard>
    </React.Fragment>
  )
}
