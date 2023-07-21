import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { t } from "i18next";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import Drag from "./moduleNewAndUpdate/dragAndDropComponent/Drag";
import Drop from "./moduleNewAndUpdate/dragAndDropComponent/Drop";
import CancelIcon from "../../assets/cancel.png";
import ModalConfirm from "@/components/molecules/ModalConfirm";
import EFBList from "./moduleNewAndUpdate/listComponent";
import EFBPreview from "./moduleNewAndUpdate/previewComponent";
import EFBConfiguration from "./moduleNewAndUpdate/configurationComponent";
import { Divider } from "@/components/atoms/Divider";
import { CheckBox } from "@/components/atoms/Input/CheckBox";
import { InputText } from "@/components/atoms/Input/InputText";
import { TitleCard } from "@/components/molecules/Cards/TitleCard";
import { MultipleInput } from "@/components/molecules/MultipleInput";
import { useAppDispatch } from "@/store";
import { openToast } from "@/components/atoms/Toast/slice";
import { checkIsEmail, copyArray } from "@/utils/logicHelper";
import { useGetEmailFormBuilderDetailQuery, useUpdateEmailFormBuilderMutation } from "@/services/EmailFormBuilder/emailFormBuilderApi";

export default function EmailFormBuilderEdit () {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams();
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

  // RTK GET DETAIL
  const { data: dataDetail } = useGetEmailFormBuilderDetailQuery({ id, pageIndex: 0, limit: 99 }, {
    refetchOnMountOrArgChange: true,
  });

  // RTK UPDATE EMAIL
  const [ updateEmailFormBuilder, {
    isLoading
  }] = useUpdateEmailFormBuilderMutation();

  useEffect(() => {
    if (dataDetail) {
      const emailFormBuilderDetail: any = dataDetail?.postTypeDetail;

      const name: string = emailFormBuilderDetail?.name;
      const pic: any = emailFormBuilderDetail?.pic?.split(";") ?? [];

      const attributeList: any = emailFormBuilderDetail?.attributeList.map((element: any) => {
        const config: any = JSON.parse(element?.config);
        const value: any = element?.value;
        const submmiterEmail: any = config?.send_submitted_form_to_email === "true";

        if (submmiterEmail) {
          setCheckSubmitterEmail(true);
        };

        return {
          type: submmiterEmail ? 'SUBMITTEREMAIL' : element?.fieldType.replaceAll('_', ''),
          name: element?.name,
          ...(!!Object.getOwnPropertyDescriptor(config, 'placeholder') && {
            placeholder: config?.placeholder,
          }),
          ...(!!Object.getOwnPropertyDescriptor(config, 'multiple_input') && {
            multiple: config?.multiple_input === "true" ?? false,
          }),
          ...(!!Object.getOwnPropertyDescriptor(config, 'multiple_select') && {
            multiple: config?.multiple_select === "true" ?? false,
          }),
          ...(!!Object.getOwnPropertyDescriptor(config, 'multiple_upload') && {
            multiple: config?.multiple_upload === "true" ?? false,
          }),
          ...(!!Object.getOwnPropertyDescriptor(config, 'required') && {
            required: config?.required === "true" ?? false,
          }),
          ...(!!Object.getOwnPropertyDescriptor(config, 'min_length') && {
            minLength: config?.min_length,
          }),
          ...(!!Object.getOwnPropertyDescriptor(config, 'max_length') && {
            maxLength: config?.max_length,
          }),
          ...(!!Object.getOwnPropertyDescriptor(config, 'allow_other_value') && {
            other: config?.allow_other_value === "true" ?? false,
          }),
          ...(!!Object.getOwnPropertyDescriptor(config, 'size') && {
            position: config?.size[0].toUpperCase(),
          }),
          ...(!!Object.getOwnPropertyDescriptor(config, 'position') && {
            alignment: config?.position[0].toUpperCase(),
          }),

          ...((element?.fieldType === "CHECKBOX" || element?.fieldType === "RADIO_BUTTON" || element?.fieldType === "DROPDOWN") && {
            items: value ? value.split(";") : [],
          }),

          mandatory: {
            name: false,
            ...((element?.fieldType === "CHECKBOX" || element?.fieldType === "RADIO_BUTTON" || element?.fieldType === "DROPDOWN") && {
              items: false,
            }),
          },
        };
      });      
            
      setFormName(name);
      setMultipleInput(pic);
      setComponents(attributeList);
    }
  }, [dataDetail])
  
  const onSave = () => {
    // ALL COMPONENTS
    let frontendError: boolean = false;

    const currentComponents: any = copyArray(components);
    for (let i = 0; i < currentComponents.length; i++) {
      for (const key in currentComponents[i].mandatory) {
        if (!currentComponents[i][key] || currentComponents[i][key].length === 0) {
          frontendError = true
          currentComponents[i].mandatory[key] = true;
        } else {
          currentComponents[i].mandatory[key] = false;
        }
      };
    };

    // ACTIVE COMPONENT
    const activeCurrentComponent: any = activeComponent?.data;
    if (activeCurrentComponent) {
      for (const key in activeCurrentComponent.mandatory) {
        if (!activeCurrentComponent[key] || activeCurrentComponent[key].length === 0) {
          activeCurrentComponent.mandatory[key] = true;
        } else {
          activeCurrentComponent.mandatory[key] = false;
        }
      };
    };

    setComponents(currentComponents);
    if (activeCurrentComponent) {
      setActiveComponent((prevComponent: any) => (
        {
          ...prevComponent,
          data: activeCurrentComponent,
        }
      ));
    };

    if (frontendError) {
      return;
    };

    const backendComponents: any = currentComponents.map((element: any) => {
      switch (element.type) {
        case "TEXTFIELD":
          return {
            fieldType: "TEXT_FIELD",
            name: element.name,
            fieldId: "TEXT_FIELD",
            config: `{\"placeholder\": \"${element.placeholder}\", \"required\": \"${element.required}\", \"multiple_input\": \"${element.multiple}\"}`, //eslint-disable-line
          };
        case "TEXTAREA":
          return {
            fieldType: "TEXT_AREA",
            name: element.name,
            fieldId: "TEXT_AREA",
            config: `{\"placeholder\": \"${element.placeholder}\", \"required\": \"${element.required}\", \"multiple_input\": \"${element.multiple}\", \"max_length\": \"${element.maxLength ?? 0}\", \"min_length\": \"${element.minLength ?? 0}\"}`, //eslint-disable-line
          };
        case "DROPDOWN":
          return {
            fieldType: "DROPDOWN",
            name: element.name,
            fieldId: "DROPDOWN",
            config: `{\"placeholder\": \"${element.placeholder}\", \"required\": \"${element.required}\", \"multiple_select\": \"${element.multiple}\"}`, //eslint-disable-line
            value: element.items.join(";"),
          };
        case "RADIOBUTTON":
          return {
            fieldType: "RADIO_BUTTON",
            name: element.name,
            fieldId: "RADIO_BUTTON",
            config: `{\"placeholder\": \"${element.placeholder}\", \"required\": \"${element.required}\", \"allow_other_value\": \"${element.other}\"}`, //eslint-disable-line
            value: element.items.join(";"),
          };
        case "CHECKBOX":
          return {
            fieldType: "CHECKBOX",
            name: element.name,
            fieldId: "CHECKBOX",
            config: `{\"placeholder\": \"${element.placeholder}\", \"required\": \"${element.required}\", \"allow_other_value\": \"${element.other}\"}`, //eslint-disable-line
            value: element.items.join(";"),
          };
        case "EMAIL":
          return {
            fieldType: "EMAIL",
            name: element.name,
            fieldId: "EMAIL",
            config: `{\"placeholder\": \"${element.placeholder}\", \"required\": \"${element.required}\", \"send_submitted_form_to_email\": \"false\"}`, //eslint-disable-line
          };
        case "LABEL":
          return {
            fieldType: "LABEL",
            name: element.name,
            fieldId: "LABEL",
            config: `{\"size\": [\"${element.position.toLowerCase()}\"], \"position\": [\"${element.alignment.toLowerCase()}\"]}`, //eslint-disable-line
          };  
        case "NUMBER":
          return {
            fieldType: "NUMBER",
            name: element.name,
            fieldId: "NUMBER",
            config: `{\"placeholder\": \"${element.placeholder}\", \"required\": \"${element.required}\"}`, //eslint-disable-line
          };
        case "DOCUMENT":
          return {
            fieldType: "DOCUMENT",
            name: element.name,
            fieldId: "DOCUMENT",
            config: `{\"required\": \"${element.required}\", \"multiple_upload\": \"${element.multiple}\"}`, //eslint-disable-line
          };
        case "IMAGE":
          return {
            fieldType: "IMAGE",
            name: element.name,
            fieldId: "IMAGE",
            config: `{\"required\": \"${element.required}\", \"multiple_upload\": \"${element.multiple}\"}`, //eslint-disable-line
          };
        case "SUBMITTEREMAIL":
          return {
            fieldType: "EMAIL",
            name: element.name,
            fieldId: "EMAIL",
            config: `{\"placeholder\": \"${element.placeholder}\", \"required\": \"${element.required}\", \"send_submitted_form_to_email\": \"true  \"}`, //eslint-disable-line
          };
        default:
          return false;
      };
    });

    if (multipleInput.length > 0) {
      backendComponents.unshift({
        fieldType: "EMAIL_FORM_PIC",
        name: "EMAIL_FORM_PIC",
        fieldId: "EMAIL_FORM_PIC",
        value: multipleInput.join(";"),
      });
    };

    const payload = {
      id,
      name: formName,
      attributeRequests: backendComponents,
    };

    updateEmailFormBuilder(payload)
      .unwrap()
      .then(() => {
        dispatch(
          openToast({
            type: 'success',
            title: t('toast-success'),
            message: t('email-form-builder.edit.success-msg', { name: payload.name })
          })
        )
        navigate('/email-form-builder');
      })
      .catch(() => {
        dispatch(
          openToast({
            type: 'error',
            title: t('toast-failed'),
            message: t('email-form-builder.edit.failed-msg', { name: payload.name }),
          }),
        );
      })
  };

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

  const handlerSubmitterEmail = (element: any) => {
    if (element) {
      handlerAddComponent("SUBMITTEREMAIL");
      setCheckSubmitterEmail(true);
    } else {
      const indexSubmitterEmail: number = components.findIndex((element: any) => {
        return element.type === "SUBMITTEREMAIL";
      })
      handlerDeleteComponent(indexSubmitterEmail);
      setCheckSubmitterEmail(false);
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

  const handlerAddComponent = (item: any) => {
    let component: any = {};
    switch (item) {
      case "TEXTFIELD":
        component = {
          type: item,
          name: "Text Field Name",
          placeholder: "Enter your field",
          multiple: false,
          required: false,
          mandatory: {
            name: false,
          },
        };
        break;
      case "TEXTAREA":
        component = {
          type: item,
          name: "Text Area Name",
          placeholder: "Enter your field",
          minLength: null,
          maxLength: null,
          multiple: false,
          required: false,
          mandatory: {
            name: false,
          },
        };
        break;
      case "DROPDOWN":
        component = {
          type: item,
          name: "Dropdown Name",
          items: ["Ayam", "Babi"],
          multiple: false,
          required: false,
          mandatory: {
            name: false,
            items: false,
          },
        };
        break;
      case "RADIOBUTTON":
        component = {
          type: item,
          name: "Radio Name",
          items: ["Ayam", "Babi"],
          other: true,
          required: false,
          mandatory: {
            name: false,
            items: false,
          },
        };
        break;
      case "CHECKBOX":
        component = {
          type: item,
          name: "Checkbox Name",
          items: ["Ayam", "Babi"],
          other: true,
          required: false,
          mandatory: {
            name: false,
            items: false,
          },
        };
        break;
      case "EMAIL":
        component = {
          type: item,
          name: "Email Name",
          placeholder: "Enter your email",
          required: false,
          submitter: false,
          mandatory: {
            name: false,
          },
        };
        break;
      case "LABEL":
        component = {
          type: item,
          name: "Label Name",
          position: "TITLE",
          alignment: "LEFT",
          mandatory: {
            name: false,
          },
        };
        break;
      case "NUMBER":
        component = {
          type: item,
          name: "Number Name",
          placeholder: "Enter your field",
          required: false,
          mandatory: {
            name: false,
          },
        };
        break;
      case "DOCUMENT":
        component = {
          type: item,
          name: "Document Name",
          multiple: false,
          required: false,
          mandatory: {
            name: false,
          },
        };
        break;
      case "IMAGE":
        component = {
          type: item,
          name: "Image Name",
          multiple: false,
          required: false,
          mandatory: {
            name: false,
          },
        };
        break;
      case "SUBMITTEREMAIL":
        component = {
          type: item,
          name: "Submitter Email Name",
          placeholder: "Enter your email",
          required: true,
          submitter: true,
          mandatory: {
            name: false,
          },
        };
        break;
      default:
        component = false;
    };
    if (component) {
      setComponents((prevItem: any) => [...prevItem, component]);
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
          <EFBList.TextField />
        </Drag>
        <Drag
          name="TEXTAREA"
        >
          <EFBList.TextArea />
        </Drag>
        <Drag
          name="DROPDOWN"
        >
          <EFBList.Dropdown />
        </Drag>
        <Drag
          name="RADIOBUTTON"
        >
          <EFBList.Radio />
        </Drag>
        <Drag
          name="CHECKBOX"
        >
          <EFBList.Checkbox />
        </Drag>
        <Drag
          name="EMAIL"
        >
          <EFBList.Email />
        </Drag>
        <Drag
          name="LABEL"
        >
          <EFBList.Label />
        </Drag>
        <Drag
          name="NUMBER"
        >
          <EFBList.Number />
        </Drag>
        <Drag
          name="DOCUMENT"
        >
          <EFBList.Document />
        </Drag>
        <Drag
          name="IMAGE"
        >
          <EFBList.Image />
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
          case "RADIOBUTTON":
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
                alignment={element.alignment}
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
          case "SUBMITTEREMAIL":
            return (
              <EFBPreview.SubmitterEmail
                key={index}
                name={element.name}
                placeholder={element.placeholder}
                isActive={activeComponent?.index === index}
                onClick={() => {
                  handlerFocusComponent(element, index)
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
            errors={activeComponent?.data?.mandatory}
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
            errors={activeComponent?.data?.mandatory}
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
            errors={activeComponent?.data?.mandatory}
            valueChange={(type: string, value: any) => {
              functionChangeState(type, value)
            }}
          />
        )
      case "RADIOBUTTON":
        return (
          <EFBConfiguration.Radio 
            name={activeComponent?.data?.name}
            items={activeComponent?.data?.items}
            other={activeComponent?.data?.other}
            required={activeComponent?.data?.required}
            errors={activeComponent?.data?.mandatory}
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
            errors={activeComponent?.data?.mandatory}
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
            errors={activeComponent?.data?.mandatory}
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
            alignment={activeComponent?.data?.alignment}
            errors={activeComponent?.data?.mandatory}
            valueChange={(type: string, value: any) => {
              functionChangeState(type, value)
            }}
          />
        )
      case "NUMBER":
        return (
          <EFBConfiguration.Number 
            name={activeComponent?.data?.name}
            placeholder={activeComponent?.data?.placeholder}
            required={activeComponent?.data?.required}
            errors={activeComponent?.data?.mandatory}
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
            errors={activeComponent?.data?.mandatory}
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
            errors={activeComponent?.data?.mandatory}
            valueChange={(type: string, value: any) => {
              functionChangeState(type, value)
            }}
          />
        )
      case "SUBMITTEREMAIL":
        return (
          <EFBConfiguration.SubmitterEmail 
            name={activeComponent?.data?.name}
            placeholder={activeComponent?.data?.placeholder}
            required={activeComponent?.data?.required}
            errors={activeComponent?.data?.mandatory}
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
        title={t('email-form-builder.edit.title')}
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
              updateFormValue={(event: any) => {
                handlerSubmitterEmail(event.value);
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
                    handlerAddComponent(item.name);                    
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
              {isLoading ? 'Loading...' : t('btn.cancel')}
            </button>
            <button className="btn btn-success btn-md" onClick={(event: any) => {
              event.preventDefault();
              onSave();
            }}>
              {isLoading ? 'Loading...' : t('btn.save')}
            </button>
          </div>
        </form>
      </TitleCard>
    </React.Fragment>
  )
}
