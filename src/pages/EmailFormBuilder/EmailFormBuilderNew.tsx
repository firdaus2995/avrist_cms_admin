import update from 'immutability-helper';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { t } from 'i18next';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { v4 as uuidv4 } from 'uuid';
import { useForm, Controller } from 'react-hook-form';

import Drag from "./moduleNewAndUpdate/dragAndDropComponent/Drag";
import Drop from "./moduleNewAndUpdate/dragAndDropComponent/Drop";
import CancelIcon from "../../assets/cancel.png";
import EyeIcon from "@/assets/eye-purple.svg";
import Recaptcha from "../../assets/recaptcha.svg";
import ModalConfirm from "@/components/molecules/ModalConfirm";
import EFBList from "./moduleNewAndUpdate/listComponent";
import EFBPreview from "./moduleNewAndUpdate/previewComponent";
import EFBConfiguration from "./moduleNewAndUpdate/configurationComponent";
import DragDrop from "./moduleNewAndUpdate/dragAndDropComponent/DragDrop";
import DropDown from '@/components/molecules/DropDown';
import ModalDisplay from '@/components/molecules/ModalDisplay';
import { Divider } from "@/components/atoms/Divider";
import { CheckBox } from "@/components/atoms/Input/CheckBox";
import { InputText } from "@/components/atoms/Input/InputText";
import { TitleCard } from "@/components/molecules/Cards/TitleCard";
import { MultipleInput } from "@/components/molecules/MultipleInput";
import { useAppDispatch } from "@/store";
import { openToast } from "@/components/atoms/Toast/slice";
import { checkIsEmail, copyArray, errorMessageTypeConverter } from "@/utils/logicHelper";
import { useCreateEmailFormBuilderMutation, useGetEmailBodyDetailQuery, useGetEmailBodyQuery, useGetFormResultQuery } from "@/services/EmailFormBuilder/emailFormBuilderApi"; 
import { useGetEmailFormAttributeListQuery } from "@/services/Config/configApi";
import { LabelText } from '@/components/atoms/Label/Text';

export default function EmailFormBuilderNew() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    control,
    watch,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({
    reValidateMode: 'onSubmit',
  });

  // BACKEND STATE
  const [formAttribute, setFormAttribute] = useState<any>([]);
  const [objectFormAttribute, setObjectFormAttribute] = useState<any>({});
  // FORM STATE
  const [checkSubmitterEmail, setCheckSubmitterEmail] = useState<any>(false);
  const [checkCaptcha, setCheckCaptcha] = useState<any>(true);
  const [pics, setPics] = useState<any>([]);
  const [components, setComponents] = useState<any>([]);
  const [activeComponent, setActiveComponent] = useState<any>(null);
  // LIST STATE
  const [listFormTemplate, setListFormTemplate] = useState<any>([]);
  const [listEmailBody, setListEmailBody] = useState<any>([]);
  // LEAVE MODAL
  const [showLeaveModal, setShowLeaveModal] = useState<boolean>(false);
  const [titleLeaveModalShow, setLeaveTitleModalShow] = useState<string | null>('');
  const [messageLeaveModalShow, setMessageLeaveModalShow] = useState<string | null>('');
  // PREVIEW EMAIL BODY MODAL
  const [titlePreviewEmailBodyModal, setTitlePreviewEmailBodyModal] = useState<any>("");
  const [shortDescPreviewEmailBodyModal, setShortDescPreviewEmailBodyModal] = useState<any>("");
  const [valuePreviewEmailBodyModal, setValuePreviewEmailBodyModal] = useState<any>("");
  const [showPreviewEmailBodyModal, setShowPreviewEmailBodyModal] = useState<boolean>(false);
  // CAPTCHA MODAL
  const [showCaptchaModal, setShowCaptchaModal] = useState<boolean>(false);
  const [titleCaptchaModalShow, setTitleCaptchaModalShow] = useState<string | null>('');
  const [messageCaptchaModalShow, setMessageCaptchaModalShow] = useState<string | null>('');

  // RTK GET ATTRIBUTE
  const { data: dataAttribute } = useGetEmailFormAttributeListQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
    },
  );
  
  // RTK GET FORM TEMPLATE
  const { data: dataFormTemplate } = useGetFormResultQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
    },
  );

  // RTK GET DATA EB
  const fetchQueryEB = useGetEmailBodyQuery(
    {
      pageIndex: 0,
      limit: 9999,
      sortBy : 'id',
      direction : 'asc',
      search: '',
    },
    {
      refetchOnMountOrArgChange: true
    },
  );
  const { data: dataEB } = fetchQueryEB;

  // RTK GET EMAIL BODY DETAIL
  const fetchEmailBodyDetail = useGetEmailBodyDetailQuery(
    {
      id: getValues('emailBody'),
    }, 
    {
      refetchOnMountOrArgChange: true,
    },
  );
  const { data: dataEBDetail } = fetchEmailBodyDetail;  

  // RTK CREATE EMAIL
  const [ createEmailFormBuilder, {
    isLoading,
  }] = useCreateEmailFormBuilderMutation();

  useEffect(() => {
    watch('emailBody');
  }, [watch]);

  useEffect(() => {
    if (dataAttribute?.getConfig) {
      const arrayFormAttribute: any = JSON.parse(dataAttribute?.getConfig?.value).attributes;
      const objectFormAttribute: any = {};

      for (const element of arrayFormAttribute) {
        objectFormAttribute[element.code.replaceAll('_', '').toUpperCase()] = element.config;
      }
      setFormAttribute(arrayFormAttribute);
      setObjectFormAttribute(objectFormAttribute);
    };
  }, [dataAttribute]);

  useEffect(() => {
    if (dataFormTemplate) {
      setListFormTemplate(dataFormTemplate?.formResultList?.resultList.map((element: any) => {
        return {
          value: element.id,
          label: element.title,
          labelExtension: element.shortDesc,
        };
      }));
    };
  }, [dataFormTemplate]);

  useEffect(() => {
    if (dataEB) {
      setListEmailBody(dataEB?.emailBodyList?.emailBodies.map((element: any) => {
        return {
          value: element.id,
          label: element.title,
        };
      }));
    };
  }, [dataEB]);

  useEffect(() => {
    if (dataEBDetail) {
      setTitlePreviewEmailBodyModal(dataEBDetail?.emailBodyDetail?.title);
      setShortDescPreviewEmailBodyModal(dataEBDetail?.emailBodyDetail?.shortDesc);
      setValuePreviewEmailBodyModal(dataEBDetail?.emailBodyDetail?.value);
    };
  }, [dataEBDetail]);

  const onSave = (data: any) => {
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
        case 'SUBMITTEREMAIL':
          return {
            fieldType: 'EMAIL',
            name: element.name,
            fieldId: 'EMAIL',
            config: `{\"placeholder\": \"${element.placeholder}\", \"required\": \"${element.required}\", \"send_submitted_form_to_email\": \"true\"}`, //eslint-disable-line
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
        case 'IMAGERADIO':
          return {
            fieldType: 'IMAGE_RADIO',
            name: element.name,
            fieldId: 'IMAGE_RADIO',
            config: `{\"required\": \"${element.required}\"}`, //eslint-disable-line
            value: element.items.join(';'),
          };
        case 'TNC':
          return {
            fieldType: 'TNC',
            name: element.name,
            fieldId: 'TNC',
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

    if (data?.emailBody) {
      backendComponents.unshift({
        fieldType: 'EMAIL_BODY',
        name: 'EMAIL_BODY',
        fieldId: 'EMAIL_BODY',
        value: data?.emailBody.toString(),
      });
    };

    if (pics.length > 0) {
      backendComponents.unshift({
        fieldType: 'EMAIL_FORM_PIC',
        name: 'EMAIL_FORM_PIC',
        fieldId: 'EMAIL_FORM_PIC',
        value: pics.join(';'),
      });
    };

    const payload = {
      name: data?.formName,
      attributeRequests: backendComponents,
      formResult: data?.formTemplate,
    };

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
      .catch((error: any) => {
        dispatch(
          openToast({
            type: 'error',
            title: t('toast-failed'),
            message: t(`errors.email-form-builder.${errorMessageTypeConverter(error.message)}`),
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

  const handlerPreviewEmailBody = () => {
    if (getValues('emailBody')) {
      setShowPreviewEmailBodyModal(true);
    };
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
      case 'TNC':
        component = {
          uuid: uuidv4(),
          type: item,
          name: 'TnC Name',
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
    };

    if (component) {
      setComponents((prevItem: any) => {
        const currentComponents: any = copyArray(prevItem);

        const foundTNC: any = currentComponents.find((element: any) => {
          if (element.type === 'TNC') {
            return true;
          };
          return false;
        });

        if (foundTNC && component.type !== "TNC") {
          currentComponents.splice(currentComponents.length - 1, 0, component);
          return currentComponents;
        } else if (foundTNC && component.type === "TNC") {
          return prevItem;
        } else {
          return [...prevItem, component];
        };
      });
    };

    setActiveComponent(null);
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
        case 'TNC':
          return (
            <EFBPreview.TNC
              key={element.uuid}
              isActive={activeComponent?.index === index}
              onClick={() => {
                handlerFocusComponent(element, index);
              }}
              onDelete={() => {
                handlerDeleteComponent(index);
              }}
            />
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
      case 'TNC':
        return (
          <EFBConfiguration.TNC
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
          cancelTitle={t('user.email-form-builder-new.email-form-builder.add.modal-confirm.leave.cancel-title')}
          message={messageLeaveModalShow ?? ''}
          submitAction={onLeave}
          submitTitle={t('user.email-form-builder-new.email-form-builder.add.modal-confirm.leave.submit-title')}
          icon={CancelIcon}
          btnSubmitStyle="btn-warning"
        />
        <ModalDisplay
          open={showPreviewEmailBodyModal}
          cancelAction={() => {
            setShowPreviewEmailBodyModal(false)
          }}
          title={titlePreviewEmailBodyModal}
        >
          <hr className='p-3' />
          <LabelText 
            labelTitle="Title"
            labelWidth={200}
            labelRequired
            value={titlePreviewEmailBodyModal}
          />
          <LabelText 
            labelTitle="Short Description"
            labelWidth={200}
            labelRequired
            value={shortDescPreviewEmailBodyModal}
          />
          <LabelText 
            labelTitle="Value"
            labelWidth={200}
            labelRequired
            value={valuePreviewEmailBodyModal}
          />
        </ModalDisplay>
        <ModalConfirm
          open={showCaptchaModal}
          cancelAction={() => {
            setShowCaptchaModal(false);
            setCheckCaptcha(true);
          }}
          title={titleCaptchaModalShow ?? ''}
          cancelTitle={t('user.email-form-builder-new.email-form-builder.add.cancel-button')}
          message={
            messageCaptchaModalShow ?? ''
          }
          submitAction={onCloseCaptcha}
          submitTitle={t('user.email-form-builder-new.email-form-builder.add.modal-confirm.leave.submit-title')}
          icon={Recaptcha}
          btnSubmitStyle="btn-warning"
        />
        <form className="flex flex-col w-100 mt-[35px] gap-5" onSubmit={handleSubmit(onSave)}>
          {/* TOP SECTION */}
          <div className="flex flex-col gap-3">
            <Controller
              name="formName"
              control={control}
              defaultValue=''
              rules={{ required: t('components.atoms.required') ?? '' }}
              render={({ field }) => (
                <InputText
                  {...field}
                  labelTitle={t('user.email-form-builder-new.email-form-builder.add.form-name-label')}
                  labelStyle="font-bold"
                  labelRequired
                  direction="row"
                  roundStyle="xl"
                  placeholder={t('user.email-form-builder-new.email-form-builder.add.form-name-placeholder')}
                  inputWidth={400}
                  isError={!!errors?.formName}
                />
              )}
            />
            <Controller
              name="formTemplate"
              control={control}
              defaultValue=''
              rules={{ required: t('components.atoms.required') ?? '' }}
              render={({ field }) => (
                <DropDown
                  {...field}
                  direction="row"
                  inputWidth={400}
                  labelTitle={t('user.email-form-builder-new.email-form-builder.add.form-template-label') ?? ''}
                  labelStyle="font-bold"
                  labelRequired
                  labelEmpty={t('user.email-form-builder-new.email-form-builder.add.form-template-empty') ?? ''}
                  items={listFormTemplate}
                  error={!!errors?.formTemplate?.message}
                  helperText={errors?.formTemplate?.message}
                  onSelect={(event: React.SyntheticEvent, value: string | number | boolean) => {
                    if (event) {
                      setValue('formTemplate', value);
                      field.onChange(value);
                    };
                  }}
                />
              )}
            />
            <div className='flex flex-row gap-5'>
              <Controller
                name="emailBody"
                control={control}
                defaultValue=''
                rules={{ required: t('components.atoms.required') ?? '' }}
                render={({ field }) => (
                  <DropDown
                    {...field}
                    direction='row'
                    inputWidth={400}
                    labelTitle="Email Body"
                    labelStyle="font-bold	"
                    labelRequired
                    labelEmpty="Choose Email Body"
                    items={listEmailBody}
                    error={!!errors?.emailBody?.message}
                    helperText={errors?.emailBody?.message}  
                    onSelect={(event: React.SyntheticEvent, value: string | number | boolean) => {
                      if (event) {
                        setValue('emailBody', value);
                        field.onChange(value);  
                      };
                    }}
                  />
                )}
              />
              {
                getValues('emailBody') && (
                  <button 
                    type='button' 
                    className='w-[48px] h-[48px] flex items-center justify-center border-[1px] border-[#9B86BA] rounded-xl'
                    onClick={handlerPreviewEmailBody}
                  >
                    <img src={EyeIcon} />
                  </button>
                )
              }
            </div>
            <MultipleInput
              labelTitle={t('user.email-form-builder-new.email-form-builder.add.pic-label')}
              labelStyle="font-bold"
              inputStyle="rounded-xl "
              inputWidth={400}
              direction="row"
              items={pics}
              logicValidation={checkIsEmail}
              errorAddValueMessage={t('user.email-form-builder-new.email-form-builder.add.pic-error-message') ?? ''}
              onAdd={handlerAddMultipleInput}
              onDelete={handlerDeleteMultipleInput}
            />
            <div className="flex flex-row justify-start gap-5">
              <CheckBox
                defaultValue={checkSubmitterEmail}
                updateFormValue={(event: any) => {
                  handlerSubmitterEmail(event.value);
                }}
                labelTitle={t('user.email-form-builder-new.email-form-builder.add.also-send-label')}
                labelContainerStyle="justify-start"
                containerStyle="ml-[225px] "
              />
              <CheckBox
                defaultValue={checkCaptcha}
                updateFormValue={(event: any) => {
                  handlerCaptcha(event.value);
                }}
                labelTitle={t('user.email-form-builder-new.email-form-builder.add.use-captcha-label')}
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
                <h2 className="font-bold p-3">{t('user.email-form-builder-new.email-form-builder.add.component-list')}</h2>
                <div className="flex flex-col gap-3 overflow-auto p-2 border-[1px] border-transparent">
                  {renderDragComponents()}
                </div>
              </div>
              {/* DROP COMPONENT */}
              <div className="flex flex-1 flex-col border-[1px] border-light-grey rounded-2xl p-2 gap-6">
                <h2 className="font-bold p-3">{t('user.email-form-builder-new.email-form-builder.add.form-preview')}</h2>
                <Drop
                  onDropped={(item: any) => {
                    handlerAddComponent(item.name);
                  }}>
                  {renderDropComponents()}
                </Drop>
              </div>
              {/* CONFIGURATION */}
              <div className="flex flex-1 flex-col border-[1px] border-light-grey rounded-2xl p-2 gap-6">
                <h2 className="font-bold p-3">{t('user.email-form-builder-new.email-form-builder.add.configuration-bar')}</h2>
                <div className="flex flex-col gap-2 overflow-auto p-2 border-[1px] border-transparent">
                  {renderConfiguration()}
                </div>
              </div>
            </div>
          </DndProvider>

          {/* BUTTONS SECTION */}
          <div className="mt-[50px] flex justify-end items-end gap-2">
            <button
              type='button'
              className="btn btn-outline btn-md"
              onClick={(event: any) => {
                event.preventDefault();
                setLeaveTitleModalShow(t('modal.confirmation'));
                setMessageLeaveModalShow(t('modal.leave-confirmation'));
                setShowLeaveModal(true);
              }}
            >
              {isLoading ? 'Loading...' : t('btn.cancel')}
            </button>
            <button
              type='submit'
              className="btn btn-success btn-md"
            >
              {isLoading ? 'Loading...' : t('btn.save')}
            </button>
          </div>
        </form>
      </TitleCard>
    </React.Fragment>
  );
}
