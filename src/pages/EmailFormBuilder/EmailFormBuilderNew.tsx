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
import EFBComponent from "./component";
import EFBPreview from "./previewComponent";
import Drag from "./dnd/drag";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Drop from "./dnd/Drop";
// import { useAppDispatch } from "@/store";

export default function EmailFormBuilderNew () {
  const navigate = useNavigate();
  // const dispatch = useAppDispatch();
  // FORM STATE
  const [formName, setFormName] = useState<any>("");
  const [checkSubmitterEmail, setCheckSubmitterEmail] = useState<any>(false);
  const [multipleInput, setMultipleInput] = useState<any>([]);
  const [components, setComponents] = useState<any>([]);
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

  const handlerAddComponent = (item: any) => {
    switch (item) {
      case "TEXTFIELD":
        return {
          type: item,
          name: "Text Field Name",
          placeholder: "Enter your field",    
        };
      case "TEXTAREA":
        return {
          type: item,
          name: "Text Area Name",
          placeholder: "Enter your field",    
        };
      case "DROPDOWN":
        return {
          type: item,
          name: "Dropdown Name",
          items: ["Ayam", "Babi"]
        };
      case "RADIO":
        return {
          type: item,
          name: "Radio Name",
          items: ["Ayam", "Babi"],
          other: true,
        };
      case "CHECKBOX":
        return {
          type: item,
          name: "Checkbox Name",
          items: ["Ayam", "Babi"],
          other: true,
        };
      case "EMAIL":
        return {
          type: item,
          name: "Email Name",
          placeholder: "Enter your email",
        };
      case "LABEL":
        return {
          type: item,
          name: "Label Name",
        }
      case "NUMBER":
        return {
          type: item,
          name: "Number Name",
          placeholder: "Enter your field"
        };
      case "DOCUMENT":
        return {
          type: item,
          name: "Document Name",
        };
      case "IMAGE":
        return {
          type: item,
          name: "Image Name",
        };
      default:
        return false;
    };
  };

  const handlerDeleteComponent = (index: number) => {
    const currentComponents: any = copyArray(components);
    currentComponents.splice(index, 1);
    setComponents(currentComponents);
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
          <DndProvider backend={HTML5Backend}>
            <div className="mt-4 flex flex-row w-100 h-[600px] gap-2">
              <div className="h-full flex flex-1 flex-col border-[1px] border-light-grey rounded-2xl p-2 gap-6">
                <h2 className="font-bold p-3">Component List</h2>
                <div className="flex flex-col gap-3 overflow-auto p-2 border-[1px] border-transparent">
                  <Drag
                    name="TEXTFIELD"
                  >
                    <EFBComponent.TextField />
                  </Drag>
                  <Drag
                    name="TEXTAREA"
                  >
                    <EFBComponent.TextArea />
                  </Drag>
                  <Drag
                    name="DROPDOWN"
                  >
                    <EFBComponent.Dropdown />
                  </Drag>
                  <Drag
                    name="RADIO"
                  >
                    <EFBComponent.Radio />
                  </Drag>
                  <Drag
                    name="CHECKBOX"
                  >
                    <EFBComponent.Checkbox />
                  </Drag>
                  <Drag
                    name="EMAIL"
                  >
                    <EFBComponent.Email />
                  </Drag>
                  <Drag
                    name="LABEL"
                  >
                    <EFBComponent.Label />
                  </Drag>
                  <Drag
                    name="NUMBER"
                  >
                    <EFBComponent.Number />
                  </Drag>
                  <Drag
                    name="DOCUMENT"
                  >
                    <EFBComponent.Document />
                  </Drag>
                  <Drag
                    name="IMAGE"
                  >
                    <EFBComponent.Image />
                  </Drag>
                </div>
              </div>
              <div className="flex flex-1 flex-col border-[1px] border-light-grey rounded-2xl p-2 gap-6">
                <h2 className="font-bold p-3">Form Preview</h2>
                <Drop
                  onDropped={(item: any) => {
                    let component: any = handlerAddComponent(item.name);                    
                    if (component) {
                      setComponents((prevItem: any) => [...prevItem, component]);
                    };
                  }}
                >
                  {
                    components.map((element: any, index: number) => {
                      switch (element.type) {
                        case "TEXTFIELD":
                          return (
                            <EFBPreview.Textfield 
                              key={index}
                              name={element.name}
                              placeholder={element.placeholder}
                              onDelete={() => handlerDeleteComponent(index)}
                            />
                          );
                        case "TEXTAREA":
                          return (
                            <EFBPreview.TextArea 
                              key={index}
                              name={element.name}
                              placeholder={element.placeholder}
                              onDelete={() => handlerDeleteComponent(index)}
                            />
                          );
                        case "DROPDOWN":
                          return (
                            <EFBPreview.Dropdown 
                              key={index}
                              name={element.name}
                              items={element.items}
                              onDelete={() => handlerDeleteComponent(index)}
                            />
                          );
                        case "RADIO":
                          return (
                            <EFBPreview.Radio 
                              key={index}
                              name={element.name}
                              items={element.items}
                              other={element.other}
                              onDelete={() => handlerDeleteComponent(index)}
                            />
                          );
                        case "CHECKBOX":
                          return (
                            <EFBPreview.Checkbox
                              key={index}
                              name={element.name}
                              items={element.items}
                              other={element.other}
                              onDelete={() => handlerDeleteComponent(index)}
                            />
                          );
                        case "EMAIL":
                          return (
                            <EFBPreview.Email
                              key={index}
                              name={element.name}
                              placeholder={element.placeholder}
                              onDelete={() => handlerDeleteComponent(index)}
                            />
                          );
                        case "LABEL":
                          return (
                            <EFBPreview.Label
                              key={index}
                              name={element.name}
                              onDelete={() => handlerDeleteComponent(index)}
                            />
                          );
                        case "NUMBER":
                          return (
                            <EFBPreview.Number
                              key={index}
                              name={element.name}
                              placeholder={element.placeholder}
                              onDelete={() => handlerDeleteComponent(index)}
                            />
                          );
                        case "DOCUMENT":
                          return (
                            <EFBPreview.Document
                              key={index}
                              name={element.name}
                              onDelete={() => handlerDeleteComponent(index)}
                            />
                          );
                        case "IMAGE":
                          return (
                            <EFBPreview.Image
                              key={index}
                              name={element.name}
                              onDelete={() => handlerDeleteComponent(index)}
                            />
                          );
                        default:
                          return (
                            <div>ERROR</div>
                          )
                      };
                    })
                  }
                </Drop>
              </div>
              <div className="flex flex-1 flex-col border-[1px] border-light-grey rounded-2xl p-2 gap-6">
                <h2 className="font-bold p-3">Configuration Bar</h2>
              </div>    
            </div>
          </DndProvider>

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
