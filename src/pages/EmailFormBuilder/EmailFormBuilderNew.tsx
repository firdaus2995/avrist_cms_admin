import update from 'immutability-helper';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { t } from 'i18next';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { v4 as uuidv4 } from 'uuid';

import Drag from "./moduleNewAndUpdate/dragAndDropComponent/Drag";
import Drop from "./moduleNewAndUpdate/dragAndDropComponent/Drop";
import CancelIcon from "../../assets/cancel.png";
import Recaptcha from "../../assets/recaptcha.svg";
import ModalConfirm from "@/components/molecules/ModalConfirm";
import EFBList from "./moduleNewAndUpdate/listComponent";
import EFBPreview from "./moduleNewAndUpdate/previewComponent";
import EFBConfiguration from "./moduleNewAndUpdate/configurationComponent";
import DragDrop from "./moduleNewAndUpdate/dragAndDropComponent/DragDrop";
import DropDown from '@/components/molecules/DropDown';
import { Divider } from "@/components/atoms/Divider";
import { CheckBox } from "@/components/atoms/Input/CheckBox";
import { InputText } from "@/components/atoms/Input/InputText";
import { TitleCard } from "@/components/molecules/Cards/TitleCard";
import { MultipleInput } from "@/components/molecules/MultipleInput";
import { useAppDispatch } from "@/store";
import { openToast } from "@/components/atoms/Toast/slice";
import { checkIsEmail, copyArray } from "@/utils/logicHelper";
import { useCreateEmailFormBuilderMutation, useGetFormResultQuery } from "@/services/EmailFormBuilder/emailFormBuilderApi"; 
import { useGetEmailFormAttributeListQuery } from "@/services/Config/configApi";

export default function EmailFormBuilderNew() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // BACKEND STATE
  const [formAttribute, setFormAttribute] = useState<any>([]);
  const [objectFormAttribute, setObjectFormAttribute] = useState<any>({});
  // FORM STATE
  const [formName, setFormName] = useState<any>("");
  const [formTemplate, setFormTemplate] = useState<any>(null);
  const [checkSubmitterEmail, setCheckSubmitterEmail] = useState<any>(false);
  const [checkCaptcha, setCheckCaptcha] = useState<any>(true);
  const [pics, setPics] = useState<any>([]);
  const [components, setComponents] = useState<any>([]);
  const [activeComponent, setActiveComponent] = useState<any>(null);
  // LIST STATE
  const [listFormTemplate, setListFormTemplate] = useState<any>([]);
  // LEAVE MODAL
  const [showLeaveModal, setShowLeaveModal] = useState<boolean>(false);
  const [titleLeaveModalShow, setLeaveTitleModalShow] = useState<string | null>('');
  const [messageLeaveModalShow, setMessageLeaveModalShow] = useState<string | null>('');
  // CAPTCHA MODAL
  const [showCaptchaModal, setShowCaptchaModal] = useState<boolean>(false);
  const [titleCaptchaModalShow, setTitleCaptchaModalShow] = useState<string | null>('');
  const [messageCaptchaModalShow, setMessageCaptchaModalShow] = useState<string | null>('');

  // RTK GET ATTRIBUTE
  const { data: dataAttribute } = useGetEmailFormAttributeListQuery({}, {
    refetchOnMountOrArgChange: true,
  });

  // RTK CREATE EMAIL
  const [ createEmailFormBuilder, {
    isLoading,
  }] = useCreateEmailFormBuilderMutation();

  // RTK GET FORM TEMPLATE
  const { data: dataFormTemplate } = useGetFormResultQuery({}, {
    refetchOnMountOrArgChange: true,
  });  

  useEffect(() => {
    if (dataAttribute?.getConfig) {
      const arrayFormAttribute: any = JSON.parse(dataAttribute?.getConfig?.value).attributes;
      const objectFormAttribute: any = {};

      // DUMMY DELETE SOON
      // arrayFormAttribute.push({
      //   code: 'image_radio',
      //   label: 'Image Radio',
      //   description: 'Image Radio',
      //   icon: 'PHN2ZyB3aWR0aD0iMjIiIGhlaWdodD0iMjIiIHZpZXdCb3g9IjAgMCAyMiAyMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTExIDE2LjVDMTIuNTIxNyAxNi41IDEzLjgxODkgMTUuOTYzNiAxNC44OTE4IDE0Ljg5MDdDMTUuOTY0NyAxMy44MTc4IDE2LjUwMDcgMTIuNTIwOSAxNi41IDExQzE2LjUgOS40NzgzMyAxNS45NjM2IDguMTgxMDcgMTQuODkwNyA3LjEwODJDMTMuODE3OCA2LjAzNTMzIDEyLjUyMDkgNS40OTkyNyAxMSA1LjVDOS40NzgzMyA1LjUgOC4xODEwNyA2LjAzNjQzIDcuMTA4MiA3LjEwOTNDNi4wMzUzMyA4LjE4MjE3IDUuNDk5MjcgOS40NzkwNyA1LjUgMTFDNS41IDEyLjUyMTcgNi4wMzY0MyAxMy44MTg5IDcuMTA5MyAxNC44OTE4QzguMTgyMTcgMTUuOTY0NyA5LjQ3OTA3IDE2LjUwMDcgMTEgMTYuNVpNMTEgMjJDOS40NzgzMyAyMiA4LjA0ODMzIDIxLjcxMTEgNi43MSAyMS4xMzMyQzUuMzcxNjcgMjAuNTU1MyA0LjIwNzUgMTkuNzcxOCAzLjIxNzUgMTguNzgyNUMyLjIyNzUgMTcuNzkyNSAxLjQ0MzkzIDE2LjYyODMgMC44NjY4IDE1LjI5QzAuMjg5NjY3IDEzLjk1MTcgMC4wMDA3MzMzMzMgMTIuNTIxNyAwIDExQzAgOS40NzgzMyAwLjI4ODkzMyA4LjA0ODMzIDAuODY2OCA2LjcxQzEuNDQ0NjcgNS4zNzE2NyAyLjIyODIzIDQuMjA3NSAzLjIxNzUgMy4yMTc1QzQuMjA3NSAyLjIyNzUgNS4zNzE2NyAxLjQ0MzkzIDYuNzEgMC44NjY4QzguMDQ4MzMgMC4yODk2NjcgOS40NzgzMyAwLjAwMDczMzMzMyAxMSAwQzEyLjUyMTcgMCAxMy45NTE3IDAuMjg4OTMzIDE1LjI5IDAuODY2OEMxNi42MjgzIDEuNDQ0NjcgMTcuNzkyNSAyLjIyODIzIDE4Ljc4MjUgMy4yMTc1QzE5Ljc3MjUgNC4yMDc1IDIwLjU1NjQgNS4zNzE2NyAyMS4xMzQzIDYuNzFDMjEuNzEyMiA4LjA0ODMzIDIyLjAwMDcgOS40NzgzMyAyMiAxMUMyMiAxMi41MjE3IDIxLjcxMTEgMTMuOTUxNyAyMS4xMzMyIDE1LjI5QzIwLjU1NTMgMTYuNjI4MyAxOS43NzE4IDE3Ljc5MjUgMTguNzgyNSAxOC43ODI1QzE3Ljc5MjUgMTkuNzcyNSAxNi42MjgzIDIwLjU1NjQgMTUuMjkgMjEuMTM0M0MxMy45NTE3IDIxLjcxMjIgMTIuNTIxNyAyMi4wMDA3IDExIDIyWk0xMSAxOS44QzEzLjQ1NjcgMTkuOCAxNS41Mzc1IDE4Ljk0NzUgMTcuMjQyNSAxNy4yNDI1QzE4Ljk0NzUgMTUuNTM3NSAxOS44IDEzLjQ1NjcgMTkuOCAxMUMxOS44IDguNTQzMzMgMTguOTQ3NSA2LjQ2MjUgMTcuMjQyNSA0Ljc1NzVDMTUuNTM3NSAzLjA1MjUgMTMuNDU2NyAyLjIgMTEgMi4yQzguNTQzMzMgMi4yIDYuNDYyNSAzLjA1MjUgNC43NTc1IDQuNzU3NUMzLjA1MjUgNi40NjI1IDIuMiA4LjU0MzMzIDIuMiAxMUMyLjIgMTMuNDU2NyAzLjA1MjUgMTUuNTM3NSA0Ljc1NzUgMTcuMjQyNUM2LjQ2MjUgMTguOTQ3NSA4LjU0MzMzIDE5LjggMTEgMTkuOFoiIGZpbGw9IiM4MTg0OTQiLz4KPC9zdmc+Cg==',
      //   config: [
      //     {
      //       code: 'required',
      //       label: 'Required Field',
      //       isMandatory: true,
      //       type: 'checkbox',
      //       value: [],
      //     },
      //   ],
      // });

      for (const element of arrayFormAttribute) {
        objectFormAttribute[element.code.replaceAll('_', '').toUpperCase()] = element.config;
      }

      setFormAttribute(arrayFormAttribute);
      // console.log(objectFormAttribute);
      setObjectFormAttribute(objectFormAttribute);
    }
  }, [dataAttribute]);

  useEffect(() => {
    if (dataFormTemplate) {
      setListFormTemplate(dataFormTemplate?.formResultList?.templates.map((element: any) => {
        return {
          value: element.id,
          label: element.title,
          labelExtension: element.shortDesc,
        };
      }));
    };
  }, [dataFormTemplate]);

  const onSave = () => {
    // ALL COMPONENTS
    let frontendError: boolean = false;

    const currentComponents: any = copyArray(components);
    for (let i = 0; i < currentComponents.length; i++) {
      for (const key in currentComponents[i].mandatory) {
        if (!currentComponents[i][key] || currentComponents[i][key].length === 0) {
          frontendError = true;
          currentComponents[i].mandatory[key] = true;
        } else {
          currentComponents[i].mandatory[key] = false;
        };
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
      }
    }

    setComponents(currentComponents);
    if (activeCurrentComponent) {
      setActiveComponent((prevComponent: any) => ({
        ...prevComponent,
        data: activeCurrentComponent,
      }));
    }

    if (frontendError) {
      return;
    }

    const backendComponents: any = currentComponents.map((element: any) => {
      switch (element.type) {
        case 'TEXTFIELD':
          return {
            fieldType: 'TEXT_FIELD',
            name: element.name,
            fieldId: 'TEXT_FIELD',
            config: `{\"placeholder\": \"${element.placeholder}\", \"required\": \"${element.required}\", \"multiple_input\": \"${element.multipleInput}\"}`, //eslint-disable-line
          };
        case 'TEXTAREA':
          return {
            fieldType: 'TEXT_AREA',
            name: element.name,
            fieldId: 'TEXT_AREA',
            config: `{\"placeholder\": \"${element.placeholder}\", \"required\": \"${element.required}\", \"multiple_input\": \"${element.multipleInput}\", \"max_length\": \"${element.maxLength ?? 0}\", \"min_length\": \"${element.minLength ?? 0}\"}`, //eslint-disable-line
          };
        case 'DROPDOWN':
          return {
            fieldType: 'DROPDOWN',
            name: element.name,
            fieldId: 'DROPDOWN',
            config: `{\"placeholder\": \"${element.placeholder}\", \"required\": \"${element.required}\", \"multiple_select\": \"${element.multipleSelect}\"}`, //eslint-disable-line
            value: element.items.join(';'),
          };
        case 'RADIOBUTTON':
          return {
            fieldType: 'RADIO_BUTTON',
            name: element.name,
            fieldId: 'RADIO_BUTTON',
            config: `{\"placeholder\": \"${element.placeholder}\", \"required\": \"${element.required}\", \"allow_other_value\": \"${element.allowOtherValue}\"}`, //eslint-disable-line
            value: element.items.join(';'),
          };
        case 'CHECKBOX':
          return {
            fieldType: 'CHECKBOX',
            name: element.name,
            fieldId: 'CHECKBOX',
            config: `{\"placeholder\": \"${element.placeholder}\", \"required\": \"${element.required}\", \"allow_other_value\": \"${element.allowOtherValue}\"}`, //eslint-disable-line
            value: element.items.join(';'),
          };
        case 'EMAIL':
          return {
            fieldType: 'EMAIL',
            name: element.name,
            fieldId: 'EMAIL',
            config: `{\"placeholder\": \"${element.placeholder}\", \"required\": \"${element.required}\", \"send_submitted_form_to_email\": \"false\"}`, //eslint-disable-line
          };
        case 'LABEL':
          return {
            fieldType: 'LABEL',
            name: element.name,
            fieldId: 'LABEL',
            config: `{\"size\": [\"${element.size.toLowerCase()}\"], \"position\": [\"${element.position.toLowerCase()}\"]}`, //eslint-disable-line
          };
        case 'NUMBER':
          return {
            fieldType: 'NUMBER',
            name: element.name,
            fieldId: "NUMBER",
            config: `{\"placeholder\": \"${element.placeholder}\", \"required\": \"${element.required}\", \"use_decimal\": \"${element.useDecimal}\"}`, //eslint-disable-line
          };
        case 'DOCUMENT':
          return {
            fieldType: 'DOCUMENT',
            name: element.name,
            fieldId: 'DOCUMENT',
            config: `{\"required\": \"${element.required}\", \"multiple_upload\": \"${element.multipleUpload}\"}`, //eslint-disable-line
          };
        case 'IMAGE':
          return {
            fieldType: 'IMAGE',
            name: element.name,
            fieldId: 'IMAGE',
            config: `{\"required\": \"${element.required}\", \"multiple_upload\": \"${element.multipleUpload}\"}`, //eslint-disable-line
          };
        case 'LINEBREAK':
          return {
            fieldType: 'LINE_BREAK',
            name: 'LINE_BREAK',
            fieldId: 'LINE_BREAK',
            config: ``, //eslint-disable-line
          };
        case 'RATING':
          return {
            fieldType: 'RATING',
            name: element.name,
            fieldId: 'RATING',
            config: `{\"required\": \"${element.required}\"}`, //eslint-disable-line
            value: element.items.join(';'),
          };
        case 'SUBMITTEREMAIL':
          return {
            fieldType: 'EMAIL',
            name: element.name,
            fieldId: 'EMAIL',
            config: `{\"placeholder\": \"${element.placeholder}\", \"required\": \"${element.required}\", \"send_submitted_form_to_email\": \"true\"}`, //eslint-disable-line
          };
        case 'IMAGERADIO':
          return {
            fieldType: 'IMAGE_RADIO',
            name: element.name,
            fieldId: 'IMAGE_RADIO',
            config: `{\"required\": \"${element.required}\"}`, //eslint-disable-line
            value: element.items.join(';'),
          };
        default:
          return false;
      }
    });

    backendComponents.unshift({
      fieldType: 'ENABLE_CAPTCHA',
      name: 'ENABLE_CAPTCHA',
      fieldId: 'ENABLE_CAPTCHA',
      value: checkCaptcha ? 'true' : 'false',
    });

    if (pics.length > 0) {
      backendComponents.unshift({
        fieldType: 'EMAIL_FORM_PIC',
        name: 'EMAIL_FORM_PIC',
        fieldId: 'EMAIL_FORM_PIC',
        value: pics.join(';'),
      });
    }

    const payload = {
      name: formName,
      attributeRequests: backendComponents,
      formResult: formTemplate,
    };

    // console.log('ini payload ', payload);

    createEmailFormBuilder(payload)
      .unwrap()
      .then(() => {
        dispatch(
          openToast({
            type: 'success',
            title: t('toast-success'),
            message: t('email-form-builder.add.success-msg', { name: payload.name }),
          }),
        );
        navigate('/email-form-builder');
      })
      .catch(() => {
        dispatch(
          openToast({
            type: 'error',
            title: t('toast-failed'),
            message: t('email-form-builder.add.failed-msg', { name: payload.name }),
          }),
        );
      });
  };

  const onLeave = () => {
    setShowLeaveModal(false);
    navigate('/email-form-builder');
  };

  const onCloseCaptcha = () => {
    setShowCaptchaModal(false);
  };

  const functionChangeState = (type: string, value: any) => {
    const currentComponents: any = copyArray(components);
    currentComponents[activeComponent?.index][type] = value;
    setComponents(currentComponents);
    setActiveComponent((prevComponent: any) => ({
      ...prevComponent,
      data: currentComponents[activeComponent?.index],
    }));
  };

  const handlerAddMultipleInput = (value: any) => {
    const items: any = copyArray(pics);
    items.push(value);
    setPics(items);
  };

  const handlerDeleteMultipleInput = (index: any) => {
    const items: any = copyArray(pics);
    items.splice(index, 1);
    setPics(items);
  };

  const handlerSubmitterEmail = (value: any) => {
    if (value) {
      handlerAddComponent('SUBMITTEREMAIL');
      setCheckSubmitterEmail(true);
    } else {
      const indexSubmitterEmail: number = components.findIndex((element: any) => {
        return element.type === 'SUBMITTEREMAIL';
      });
      handlerDeleteComponent(indexSubmitterEmail);
      setCheckSubmitterEmail(false);
    }
  };

  const handlerCaptcha = (value: any) => {
    if (value === false) {
      setCheckCaptcha(false);
      setShowCaptchaModal(true);
      setTitleCaptchaModalShow('Are you sure?');
      setMessageCaptchaModalShow('Do you want to Disable Captcha in this form?');
    } else {
      setCheckCaptcha(value);
    }
  };

  const handlerFocusComponent = (element: any, index: any) => {
    if (activeComponent?.index !== index) {
      setActiveComponent({
        index,
        data: element,
      });
    }
  };

  const handlerAddComponent = (item: any) => {
    let component: any = {};
    switch (item) {
      case 'TEXTFIELD':
        component = {
          uuid: uuidv4(),
          type: item,
          name: 'Text Field Name',
          placeholder: 'Enter your field',
          multipleInput: false,
          required: false,
          mandatory: {
            name: false,
          },
        };
        break;
      case 'TEXTAREA':
        component = {
          uuid: uuidv4(),
          type: item,
          name: 'Text Area Name',
          placeholder: 'Enter your field',
          minLength: null,
          maxLength: null,
          multipleInput: false,
          required: false,
          mandatory: {
            name: false,
          },
        };
        break;
      case 'DROPDOWN':
        component = {
          uuid: uuidv4(),
          type: item,
          name: 'Dropdown Name',
          items: ['Content 1', 'Content 2'],
          multipleSelect: false,
          required: false,
          mandatory: {
            name: false,
            items: false,
          },
        };
        break;
      case 'RADIOBUTTON':
        component = {
          uuid: uuidv4(),
          type: item,
          name: 'Radio Name',
          items: ['Content 1', 'Content 2'],
          allowOtherValue: true,
          required: false,
          mandatory: {
            name: false,
            items: false,
          },
        };
        break;
      case 'CHECKBOX':
        component = {
          uuid: uuidv4(),
          type: item,
          name: 'Checkbox Name',
          items: ['Content 1', 'Content 2'],
          allowOtherValue: true,
          required: false,
          mandatory: {
            name: false,
            items: false,
          },
        };
        break;
      case 'EMAIL':
        component = {
          uuid: uuidv4(),
          type: item,
          name: 'Email Name',
          placeholder: 'Enter your email',
          required: false,
          submitter: false,
          mandatory: {
            name: false,
          },
        };
        break;
      case 'LABEL':
        component = {
          uuid: uuidv4(),
          type: item,
          name: 'Label Name',
          size: 'TITLE',
          position: 'LEFT',
          mandatory: {
            name: false,
          },
        };
        break;
      case 'NUMBER':
        component = {
          uuid: uuidv4(),
          type: item,
          name: 'Number Name',
          placeholder: 'Enter your field',
          useDecimal: false,
          required: false,
          mandatory: {
            name: false,
          },
        };
        break;
      case 'DOCUMENT':
        component = {
          uuid: uuidv4(),
          type: item,
          name: 'Document Name',
          multipleUpload: false,
          required: false,
          mandatory: {
            name: false,
          },
        };
        break;
      case 'IMAGE':
        component = {
          uuid: uuidv4(),
          type: item,
          name: 'Image Name',
          multipleUpload: false,
          required: false,
          mandatory: {
            name: false,
          },
        };
        break;
      case 'LINEBREAK':
        component = {
          uuid: uuidv4(),
          type: item,
        };
        break;
      case 'RATING':
        component = {
          uuid: uuidv4(),
          type: item,
          name: 'Rating Name',
          items: [],
          required: false,
          mandatory: {
            name: false,
            items: false,
          },
        };
        break;
      case 'SUBMITTEREMAIL':
        component = {
          uuid: uuidv4(),
          type: item,
          name: 'Submitter Email Name',
          placeholder: 'Enter your email',
          required: true,
          submitter: true,
          mandatory: {
            name: false,
          },
        };
        break;
      case 'IMAGERADIO':
        component = {
          uuid: uuidv4(),
          type: item,
          name: 'Image Radio Name',
          items: [],
          required: false,
          mandatory: {
            name: false,
            items: false,
          },
        };
        break;
      default:
        component = false;
    }
    if (component) {
      setComponents((prevItem: any) => [...prevItem, component]);
    }
  };

  const handlerDeleteComponent = (index: number) => {
    const currentComponents: any = copyArray(components);
    currentComponents.splice(index, 1);
    setComponents(currentComponents);
    setActiveComponent(null);
  };

  const handlerReorderComponent = (dragIndex: number, hoverIndex: number) => {
    setActiveComponent(null);
    setComponents((prevComponent: any) =>
      update(prevComponent, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevComponent[dragIndex]],
        ],
      }),
    );
  };

  const renderDragComponents = () => {
    return (
      <React.Fragment>
        {formAttribute.map((element: any, index: number) => (
          <Drag name={element?.code?.replaceAll('_', '').toUpperCase()} key={index}>
            <EFBList label={element?.label} icon={element?.icon} />
          </Drag>
        ))}
      </React.Fragment>
    );
  };

  const renderDropComponents = () => {
    return components.map((element: any, index: number) => {
      switch (element.type) {
        case 'TEXTFIELD':
          return (
            <DragDrop key={element.uuid} index={index} moveComponent={handlerReorderComponent}>
              <EFBPreview.TextField
                name={element.name}
                placeholder={element.placeholder}
                isActive={activeComponent?.index === index}
                onClick={() => {
                  handlerFocusComponent(element, index);
                }}
                onDelete={() => {
                  handlerDeleteComponent(index);
                }}
              />
            </DragDrop>
          );
        case 'TEXTAREA':
          return (
            <DragDrop key={element.uuid} index={index} moveComponent={handlerReorderComponent}>
              <EFBPreview.TextArea
                name={element.name}
                placeholder={element.placeholder}
                isActive={activeComponent?.index === index}
                onClick={() => {
                  handlerFocusComponent(element, index);
                }}
                onDelete={() => {
                  handlerDeleteComponent(index);
                }}
              />
            </DragDrop>
          );
        case 'DROPDOWN':
          return (
            <DragDrop key={element.uuid} index={index} moveComponent={handlerReorderComponent}>
              <EFBPreview.Dropdown
                name={element.name}
                items={element.items}
                isActive={activeComponent?.index === index}
                onClick={() => {
                  handlerFocusComponent(element, index);
                }}
                onDelete={() => {
                  handlerDeleteComponent(index);
                }}
              />
            </DragDrop>
          );
        case 'RADIOBUTTON':
          return (
            <DragDrop key={element.uuid} index={index} moveComponent={handlerReorderComponent}>
              <EFBPreview.Radio
                name={element.name}
                items={element.items}
                other={element.allowOtherValue}
                isActive={activeComponent?.index === index}
                onClick={() => {
                  handlerFocusComponent(element, index);
                }}
                onDelete={() => {
                  handlerDeleteComponent(index);
                }}
              />
            </DragDrop>
          );
        case 'CHECKBOX':
          return (
            <DragDrop key={element.uuid} index={index} moveComponent={handlerReorderComponent}>
              <EFBPreview.Checkbox
                name={element.name}
                items={element.items}
                other={element.allowOtherValue}
                isActive={activeComponent?.index === index}
                onClick={() => {
                  handlerFocusComponent(element, index);
                }}
                onDelete={() => {
                  handlerDeleteComponent(index);
                }}
              />
            </DragDrop>
          );
        case 'EMAIL':
          return (
            <DragDrop key={element.uuid} index={index} moveComponent={handlerReorderComponent}>
              <EFBPreview.Email
                name={element.name}
                placeholder={element.placeholder}
                isActive={activeComponent?.index === index}
                onClick={() => {
                  handlerFocusComponent(element, index);
                }}
                onDelete={() => {
                  handlerDeleteComponent(index);
                }}
              />
            </DragDrop>
          );
        case 'LABEL':
          return (
            <DragDrop key={element.uuid} index={index} moveComponent={handlerReorderComponent}>
              <EFBPreview.Label
                name={element.name}
                isActive={activeComponent?.index === index}
                alignment={element.position}
                onClick={() => {
                  handlerFocusComponent(element, index);
                }}
                onDelete={() => {
                  handlerDeleteComponent(index);
                }}
              />
            </DragDrop>
          );
        case 'NUMBER':
          return (
            <DragDrop key={element.uuid} index={index} moveComponent={handlerReorderComponent}>
              <EFBPreview.Number
                name={element.name}
                placeholder={element.placeholder}
                isActive={activeComponent?.index === index}
                onClick={() => {
                  handlerFocusComponent(element, index);
                }}
                onDelete={() => {
                  handlerDeleteComponent(index);
                }}
              />
            </DragDrop>
          );
        case 'DOCUMENT':
          return (
            <DragDrop key={element.uuid} index={index} moveComponent={handlerReorderComponent}>
              <EFBPreview.Document
                name={element.name}
                isActive={activeComponent?.index === index}
                onClick={() => {
                  handlerFocusComponent(element, index);
                }}
                onDelete={() => {
                  handlerDeleteComponent(index);
                }}
              />
            </DragDrop>
          );
        case 'IMAGE':
          return (
            <DragDrop key={element.uuid} index={index} moveComponent={handlerReorderComponent}>
              <EFBPreview.Image
                name={element.name}
                isActive={activeComponent?.index === index}
                onClick={() => {
                  handlerFocusComponent(element, index);
                }}
                onDelete={() => {
                  handlerDeleteComponent(index);
                }}
              />
            </DragDrop>
          );
        case 'LINEBREAK':
          return (
            <DragDrop key={element.uuid} index={index} moveComponent={handlerReorderComponent}>
              <EFBPreview.LineBreak
                isActive={activeComponent?.index === index}
                onClick={() => {
                  handlerFocusComponent(element, index);
                }}
                onDelete={() => {
                  handlerDeleteComponent(index);
                }}
              />
            </DragDrop>
          );
        case 'RATING':
          return (
            <DragDrop key={element.uuid} index={index} moveComponent={handlerReorderComponent}>
              <EFBPreview.Rating
                id={element.id}
                name={element.name}
                items={element.items}
                isActive={activeComponent?.index === index}
                onClick={() => {
                  handlerFocusComponent(element, index);
                }}
                onDelete={() => {
                  handlerDeleteComponent(index);
                }}
              />
            </DragDrop>
          );
        case 'SUBMITTEREMAIL':
          return (
            <DragDrop key={element.uuid} index={index} moveComponent={handlerReorderComponent}>
              <EFBPreview.SubmitterEmail
                name={element.name}
                placeholder={element.placeholder}
                isActive={activeComponent?.index === index}
                onClick={() => {
                  handlerFocusComponent(element, index);
                }}
              />
            </DragDrop>
          );
        case 'IMAGERADIO':
          return (
            <DragDrop key={element.uuid} index={index} moveComponent={handlerReorderComponent}>
              <EFBPreview.ImageRadio
                name={element.name}
                items={element.items}
                isActive={activeComponent?.index === index}
                onClick={() => {
                  handlerFocusComponent(element, index);
                }}
                onDelete={() => {
                  handlerDeleteComponent(index);
                }}
              />
            </DragDrop>
          );
        default:
          return <div>ERROR</div>;
      }
    });
  };

  const renderConfiguration = () => {
    switch (activeComponent?.data?.type) {
      case 'TEXTFIELD':
        return (
          <EFBConfiguration.TextField
            data={activeComponent?.data}
            configList={objectFormAttribute[activeComponent?.data?.type]}
            valueChange={(type: string, value: any) => {
              functionChangeState(type, value);
            }}
          />
        );
      case 'TEXTAREA':
        return (
          <EFBConfiguration.TextArea
            data={activeComponent?.data}
            configList={objectFormAttribute[activeComponent?.data?.type]}
            valueChange={(type: string, value: any) => {
              functionChangeState(type, value);
            }}
          />
        );
      case 'DROPDOWN':
        return (
          <EFBConfiguration.Dropdown
            data={activeComponent?.data}
            configList={objectFormAttribute[activeComponent?.data?.type]}
            valueChange={(type: string, value: any) => {
              functionChangeState(type, value);
            }}
          />
        );
      case 'RADIOBUTTON':
        return (
          <EFBConfiguration.Radio
            data={activeComponent?.data}
            configList={objectFormAttribute[activeComponent?.data?.type]}
            valueChange={(type: string, value: any) => {
              functionChangeState(type, value);
            }}
          />
        );
      case 'CHECKBOX':
        return (
          <EFBConfiguration.Checkbox
            data={activeComponent?.data}
            configList={objectFormAttribute[activeComponent?.data?.type]}
            valueChange={(type: string, value: any) => {
              functionChangeState(type, value);
            }}
          />
        );
      case 'EMAIL':
        return (
          <EFBConfiguration.Email
            data={activeComponent?.data}
            configList={objectFormAttribute[activeComponent?.data?.type]}
            valueChange={(type: string, value: any) => {
              functionChangeState(type, value);
            }}
          />
        );
      case 'LABEL':
        return (
          <EFBConfiguration.Label
            data={activeComponent?.data}
            configList={objectFormAttribute[activeComponent?.data?.type]}
            valueChange={(type: string, value: any) => {
              functionChangeState(type, value);
            }}
          />
        );
      case 'NUMBER':
        return (
          <EFBConfiguration.Number
            data={activeComponent?.data}
            configList={objectFormAttribute[activeComponent?.data?.type]}
            valueChange={(type: string, value: any) => {
              functionChangeState(type, value);
            }}
          />
        );
      case 'DOCUMENT':
        return (
          <EFBConfiguration.Document
            data={activeComponent?.data}
            configList={objectFormAttribute[activeComponent?.data?.type]}
            valueChange={(type: string, value: any) => {
              functionChangeState(type, value);
            }}
          />
        );
      case 'IMAGE':
        return (
          <EFBConfiguration.Image
            data={activeComponent?.data}
            configList={objectFormAttribute[activeComponent?.data?.type]}
            valueChange={(type: string, value: any) => {
              functionChangeState(type, value);
            }}
          />
        );
      case 'RATING':
        return (
          <EFBConfiguration.Rating
            data={activeComponent?.data}
            configList={objectFormAttribute[activeComponent?.data?.type]}
            valueChange={(type: string, value: any) => {
              functionChangeState(type, value);
            }}
          />
        );
      case 'SUBMITTEREMAIL':
        return (
          <EFBConfiguration.SubmitterEmail
            data={activeComponent?.data}
            configList={objectFormAttribute.EMAIL}
            valueChange={(type: string, value: any) => {
              functionChangeState(type, value);
            }}
          />
        );
      case 'IMAGERADIO':
        return (
          <EFBConfiguration.ImageRadio
            data={activeComponent?.data}
            configList={objectFormAttribute[activeComponent?.data?.type]}
            valueChange={(type: string, value: any) => {
              functionChangeState(type, value);
            }}
          />
        );
      default:
        return <div></div>;
    }
  };

  return (
    <React.Fragment>
      <TitleCard title={t('email-form-builder.add.title')} topMargin="mt-2">
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
          btnSubmitStyle="btn-warning"
        />
        <ModalConfirm
          open={showCaptchaModal}
          cancelAction={() => {
            setShowCaptchaModal(false);
            setCheckCaptcha(true);
          }}
          title={titleCaptchaModalShow ?? ''}
          cancelTitle="Cancel"
          message={messageCaptchaModalShow ?? ''}
          submitAction={onCloseCaptcha}
          submitTitle="Yes"
          icon={Recaptcha}
          btnSubmitStyle="btn-warning"
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
            <DropDown
              labelTitle="Form Template"
              labelStyle="font-bold	"
              direction='row'
              inputWidth={400}
              labelEmpty="Choose Form Template"
              labelRequired={true}
              items={listFormTemplate}
              onSelect={(event: React.SyntheticEvent, value: string | number | boolean) => {
                if (event) {
                  setFormTemplate(value);
                }
              }}
            />
            <MultipleInput
              labelTitle="PIC"
              labelStyle="font-bold	"
              inputStyle="rounded-xl "
              inputWidth={400}
              direction="row"
              items={pics}
              logicValidation={checkIsEmail}
              errorAddValueMessage="The PIC filling format must be email format"
              onAdd={handlerAddMultipleInput}
              onDelete={handlerDeleteMultipleInput}
            />
            <div className="flex flex-row justify-start gap-5">
              <CheckBox
                defaultValue={checkSubmitterEmail}
                updateFormValue={(event: any) => {
                  handlerSubmitterEmail(event.value);
                }}
                labelTitle="Also send to submitter email"
                labelContainerStyle="justify-start"
                containerStyle="ml-[225px] "
              />
              <CheckBox
                defaultValue={checkCaptcha}
                updateFormValue={(event: any) => {
                  handlerCaptcha(event.value);
                }}
                labelTitle="Use Captcha"
                labelContainerStyle="justify-start"
              />
            </div>
          </div>

          {/* DIVIDER SECTION */}
          <Divider />

          {/* BOT SECTION */}
          <DndProvider backend={HTML5Backend}>
            <div className="mt-4 flex flex-row w-100 h-[700px] gap-2">
              {/* DRAG COMPONENT */}
              <div className="flex flex-1 flex-col border-[1px] border-light-grey rounded-2xl p-2 gap-6">
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
                  }}>
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
            <button
              className="btn btn-outline btn-md"
              onClick={(event: any) => {
                event.preventDefault();
                setLeaveTitleModalShow(t('modal.confirmation'));
                setMessageLeaveModalShow(t('modal.leave-confirmation'));
                setShowLeaveModal(true);
              }}>
              {isLoading ? 'Loading...' : t('btn.cancel')}
            </button>
            <button
              className="btn btn-success btn-md"
              onClick={(event: any) => {
                event.preventDefault();
                onSave();
              }}>
              {isLoading ? 'Loading...' : t('btn.save')}
            </button>
          </div>
        </form>
      </TitleCard>
    </React.Fragment>
  );
}
