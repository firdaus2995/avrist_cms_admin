import React, { useState } from "react";
import { useNavigate } from "react-router";
import { t } from "i18next";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import Drag from "./dnd/Drag";
import Drop from "./dnd/Drop";
import CancelIcon from "../../assets/cancel.png";
import ModalConfirm from "@/components/molecules/ModalConfirm";
import EFBComponent from "./component";
import EFBPreview from "./previewComponent";
import EFBConfiguration from "./configuration";
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
  const [formName, setFormName] = useState<any>("");
  const [checkSubmitterEmail, setCheckSubmitterEmail] = useState<any>(false);
  const [multipleInput, setMultipleInput] = useState<any>([]);
  const [components, setComponents] = useState<any>([]);
  const [activeComponent, setActiveComponent] = useState<any>(null);
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

  const functionChangeState = (type: string, value: any) => {
    const currentComponents: any = copyArray(components);
    currentComponents[activeComponent?.index][type] = value;
    setComponents(currentComponents);
    setActiveComponent((prevComponent: any) => (
      {
        ...prevComponent,
        data: currentComponents[activeComponent?.index]
      }
    ));
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
          multiple: false,
          required: false,
        };
      case "TEXTAREA":
        return {
          type: item,
          name: "Text Area Name",
          placeholder: "Enter your field",
          minLength: null,
          maxLength: null,
          multiple: false,
          required: false,
        };
      case "DROPDOWN":
        return {
          type: item,
          name: "Dropdown Name",
          items: ["Ayam", "Babi"],
          multiple: false,
          required: false,
        };
      case "RADIO":
        return {
          type: item,
          name: "Radio Name",
          items: ["Ayam", "Babi"],
          other: true,
          required: false,
        };
      case "CHECKBOX":
        return {
          type: item,
          name: "Checkbox Name",
          items: ["Ayam", "Babi"],
          other: true,
          required: false,
        };
      case "EMAIL":
        return {
          type: item,
          name: "Email Name",
          placeholder: "Enter your email",
          required: false,
        };
      case "LABEL":
        return {
          type: item,
          name: "Label Name",
          position: "TITLE",
        }
      case "NUMBER":
        return {
          type: item,
          name: "Number Name",
          placeholder: "Enter your field",
          required: false,
        };
      case "DOCUMENT":
        return {
          type: item,
          name: "Document Name",
          multiple: false,
          required: false,
        };
      case "IMAGE":
        return {
          type: item,
          name: "Image Name",
          multiple: false,
          required: false,
        };
      default:
        return false;
    };
  };

  const handlerFocusComponent = (element: any, index: any) => {
    if (activeComponent?.index !== index) {
      setActiveComponent({
        index,
        data: element,
      });
    };
  };

  const handlerDeleteComponent = (index: number) => {
    const currentComponents: any = copyArray(components);
    currentComponents.splice(index, 1);
    setComponents(currentComponents);
    setActiveComponent(null);
  };

  const renderDragComponents = () => {
    return (
      <React.Fragment>
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
      </React.Fragment>
    )
  };

  const renderDropComponents = () => {
    return (
      components.map((element: any, index: number) => {
        switch (element.type) {
          case "TEXTFIELD":
            return (
              <EFBPreview.TextField 
                key={index}
                name={element.name}
                placeholder={element.placeholder}
                isActive={activeComponent?.index === index}
                onClick={() => {
                  handlerFocusComponent(element, index)
                }}
                onDelete={() => {
                  handlerDeleteComponent(index);
                }}
              />
            );
          case "TEXTAREA":
            return (
              <EFBPreview.TextArea 
                key={index}
                name={element.name}
                placeholder={element.placeholder}
                isActive={activeComponent?.index === index}
                onClick={() => {
                  handlerFocusComponent(element, index)
                }}
                onDelete={() => {
                  handlerDeleteComponent(index);
                }}
              />
            );
          case "DROPDOWN":
            return (
              <EFBPreview.Dropdown 
                key={index}
                name={element.name}
                items={element.items}
                isActive={activeComponent?.index === index}
                onClick={() => {
                  handlerFocusComponent(element, index)
                }}
                onDelete={() => {
                  handlerDeleteComponent(index);
                }}
              />
            );
          case "RADIO":
            return (
              <EFBPreview.Radio 
                key={index}
                name={element.name}
                items={element.items}
                other={element.other}
                isActive={activeComponent?.index === index}
                onClick={() => {
                  handlerFocusComponent(element, index)
                }}
                onDelete={() => {
                  handlerDeleteComponent(index);
                }}
              />
            );
          case "CHECKBOX":
            return (
              <EFBPreview.Checkbox
                key={index}
                name={element.name}
                items={element.items}
                other={element.other}
                isActive={activeComponent?.index === index}
                onClick={() => {
                  handlerFocusComponent(element, index)
                }}
                onDelete={() => {
                  handlerDeleteComponent(index);
                }}
              />
            );
          case "EMAIL":
            return (
              <EFBPreview.Email
                key={index}
                name={element.name}
                placeholder={element.placeholder}
                isActive={activeComponent?.index === index}
                onClick={() => {
                  handlerFocusComponent(element, index)
                }}
                onDelete={() => {
                  handlerDeleteComponent(index);
                }}
              />
            );
          case "LABEL":
            return (
              <EFBPreview.Label
                key={index}
                name={element.name}
                isActive={activeComponent?.index === index}
                onClick={() => {
                  handlerFocusComponent(element, index)
                }}
                onDelete={() => {
                  handlerDeleteComponent(index);
                }}
              />
            );
          case "NUMBER":
            return (
              <EFBPreview.Number
                key={index}
                name={element.name}
                placeholder={element.placeholder}
                isActive={activeComponent?.index === index}
                onClick={() => {
                  handlerFocusComponent(element, index)
                }}
                onDelete={() => {
                  handlerDeleteComponent(index);
                }}
              />
            );
          case "DOCUMENT":
            return (
              <EFBPreview.Document
                key={index}
                name={element.name}
                isActive={activeComponent?.index === index}
                onClick={() => {
                  handlerFocusComponent(element, index)
                }}
                onDelete={() => {
                  handlerDeleteComponent(index);
                }}
              />
            );
          case "IMAGE":
            return (
              <EFBPreview.Image
                key={index}
                name={element.name}
                isActive={activeComponent?.index === index}
                onClick={() => {
                  handlerFocusComponent(element, index)
                }}
                onDelete={() => {
                  handlerDeleteComponent(index);
                }}
              />
            );
          default:
            return (
              <div>ERROR</div>
            )
        };
      })
    )
  };

  const renderConfiguration = () => {
    switch (activeComponent?.data?.type) {
      case "TEXTFIELD":
        return (
          <EFBConfiguration.TextField 
            name={activeComponent?.data?.name}
            placeholder={activeComponent?.data?.placeholder}
            multiple={activeComponent?.data?.multiple}
            required={activeComponent?.data?.required}
            valueChange={(type: string, value: any) => {
              functionChangeState(type, value)
            }}
          />
        )
      case "TEXTAREA":
        return (
          <EFBConfiguration.TextArea 
            name={activeComponent?.data?.name}
            placeholder={activeComponent?.data?.placeholder}
            minLength={activeComponent?.data?.minLength}
            maxLength={activeComponent?.data?.maxLength}
            multiple={activeComponent?.data?.multiple}
            required={activeComponent?.data?.required}
            valueChange={(type: string, value: any) => {
              functionChangeState(type, value)
            }}
          />
        )
      case "DROPDOWN":
        return (
          <EFBConfiguration.Dropdown 
            name={activeComponent?.data?.name}
            items={activeComponent?.data?.items}
            multiple={activeComponent?.data?.multiple}
            required={activeComponent?.data?.required}
            valueChange={(type: string, value: any) => {
              functionChangeState(type, value)
            }}
          />
        )
      case "RADIO":
        return (
          <EFBConfiguration.Radio 
            name={activeComponent?.data?.name}
            items={activeComponent?.data?.items}
            other={activeComponent?.data?.other}
            required={activeComponent?.data?.required}
            valueChange={(type: string, value: any) => {
              functionChangeState(type, value)
            }}
          />
        )
      case "CHECKBOX":
        return (
          <EFBConfiguration.Checkbox 
            name={activeComponent?.data?.name}
            items={activeComponent?.data?.items}
            other={activeComponent?.data?.other}
            required={activeComponent?.data?.required}
            valueChange={(type: string, value: any) => {
              functionChangeState(type, value)
            }}
          />
        )
      case "EMAIL":
        return (
          <EFBConfiguration.Email 
            name={activeComponent?.data?.name}
            placeholder={activeComponent?.data?.placeholder}
            required={activeComponent?.data?.required}
            valueChange={(type: string, value: any) => {
              functionChangeState(type, value)
            }}
          />
        )
      case "LABEL":
        return (
          <EFBConfiguration.Label 
            name={activeComponent?.data?.name}
            position={activeComponent?.data?.position}
            valueChange={(type: string, value: any) => {
              functionChangeState(type, value)
            }}
          />
        )
      case "NUMBER":
        return (
          <EFBConfiguration.Email 
            name={activeComponent?.data?.name}
            placeholder={activeComponent?.data?.placeholder}
            required={activeComponent?.data?.required}
            valueChange={(type: string, value: any) => {
              functionChangeState(type, value)
            }}
          />
        )
      case "DOCUMENT":
        return (
          <EFBConfiguration.Document 
            name={activeComponent?.data?.name}
            multiple={activeComponent?.data?.multiple}
            required={activeComponent?.data?.required}
            valueChange={(type: string, value: any) => {
              functionChangeState(type, value)
            }}
          />
        )
      case "IMAGE":
        return (
          <EFBConfiguration.Image 
            name={activeComponent?.data?.name}
            multiple={activeComponent?.data?.multiple}
            required={activeComponent?.data?.required} 
            valueChange={(type: string, value: any) => {
              functionChangeState(type, value)
            }}
          />
        )  
      default:
        return (
          <div></div>
        )
    }
  }

  return (
    <React.Fragment>
      <TitleCard
        title={t('email-form-builder.add.title')}
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
              {/* DRAG COMPONENT */}
              <div className="h-full flex flex-1 flex-col border-[1px] border-light-grey rounded-2xl p-2 gap-6">
                <h2 className="font-bold p-3">Component List</h2>
                <div className="flex flex-col gap-3 overflow-auto p-2 border-[1px] border-transparent">
                  {renderDragComponents()}
                </div>
              </div>
              {/* DROP COMPONENT */}
              <div className="flex flex-1 flex-col border-[1px] border-light-grey rounded-2xl p-2 gap-6">
                <h2 className="font-bold p-3">Form Preview</h2>
                <Drop
                  onDropped={(item: any) => {
                    const component: any = handlerAddComponent(item.name);                    
                    if (component) {
                      setComponents((prevItem: any) => [...prevItem, component]);
                    };
                  }}
                >
                  {renderDropComponents()}
                </Drop>
              </div>
              {/* CONFIGURATION */}
              <div className="flex flex-1 flex-col border-[1px] border-light-grey rounded-2xl p-2 gap-6">
                <h2 className="font-bold p-3">Configuration Bar</h2>
                <div className="flex flex-col gap-2 overflow-auto p-2 border-[1px] border-transparent">
                  {renderConfiguration()}
                </div>
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
