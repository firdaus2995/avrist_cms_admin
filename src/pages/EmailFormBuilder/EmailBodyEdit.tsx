import { t } from "i18next";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import CancelIcon from "../../assets/cancel.png";
import ModalConfirm from "@/components/molecules/ModalConfirm";
import Typography from "@/components/atoms/Typography";
import CkEditor from "@/components/atoms/Ckeditor";
import { InputText } from "@/components/atoms/Input/InputText";
import { TextArea } from "@/components/atoms/Input/TextArea";
import { useAppDispatch } from "@/store";
import { TitleCard } from "@/components/molecules/Cards/TitleCard";
import { openToast } from "@/components/atoms/Toast/slice";
import { useUpdateEmailBodyMutation, useGetEmailBodyDetailQuery } from "@/services/EmailFormBuilder/emailFormBuilderApi";
import { errorMessageTypeConverter } from "@/utils/logicHelper";

export default function EmailBodyEdit() {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    reValidateMode: 'onSubmit',
  });
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const params = useParams();

  // FORM STATE
  const [id] = useState<number>(Number(params.id));
  // LEAVE MODAL
  const [showLeaveModal, setShowLeaveModal] = useState<boolean>(false);
  const [titleLeaveModalShow, setLeaveTitleModalShow] = useState<string | null>("");
  const [messageLeaveModalShow, setMessageLeaveModalShow] = useState<string | null>("");

  // RTK GET DETAIL
  const fetchEmailBodyDetail = useGetEmailBodyDetailQuery({id}, {
    refetchOnMountOrArgChange: true,
  });
  const { data } = fetchEmailBodyDetail;

  // RTK GET DETAIL
  const [updateEmailBody] = useUpdateEmailBodyMutation();

  useEffect(() => {
    watch('value');
  }, [watch]);

  useEffect(() => {
    if (data) {
      const defaultValues: any = {};
      
      defaultValues.title = data?.emailBodyDetail?.title;
      defaultValues.shortDesc = data?.emailBodyDetail?.shortDesc;

      reset({ ...defaultValues });

      setValue('value', data?.emailBodyDetail?.value);
    };
  }, [data]);  
  
  const handlerSubmit = (formData: any) => {
    const payload = {
      id,
      title: formData.title,
      shortDesc: formData.shortDesc,
      value: formData.value,
    };

    updateEmailBody(payload)
      .unwrap()
      .then(() => {
        dispatch(
          openToast({
            type: 'success',
            title: 'Success',
          }),
        );
        navigate('/email-form-builder', {
          state: {
            from: "EMAIL_BODY"
          },
        });
      })
      .catch((error: any) => {
        dispatch(
          openToast({
            type: 'error',
            title: 'Failed',
            message: t(`errors.email-form-builder.${errorMessageTypeConverter(error.message)}`),
          }),
        );
      });
  };

  const onLeave = () => {
    setShowLeaveModal(false);
    navigate('/email-form-builder');
  };

  return (
    <TitleCard
      title="Edit Email Body"
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
      <form className="flex flex-col gap-5" onSubmit={handleSubmit((data: any) => {
        handlerSubmit(data)
      })}>
        {/* FORM SECTION */}
        <Controller
          name="title"
          control={control}
          defaultValue=""
          rules={{ required: t('components.atoms.required') ?? ''}}
          render={({ field }) => (
            <InputText
              {...field}
              labelTitle="Title"
              labelStyle="font-semibold"
              labelWidth={200}
              labelRequired
              direction="row"
              roundStyle="xl"
              placeholder="Enter your title"
              inputWidth={400}
              maxLength={30}
              isError={!!errors?.title}
            />
          )}
        />
        <Controller
          name="shortDesc"
          control={control}
          defaultValue=""
          rules={{ required: t('components.atoms.required') ?? ''}}
          render={({ field }) => (
            <TextArea
              {...field}
              labelTitle="Short Description"
              labelStyle="font-semibold"
              labelWidth={200}
              labelRequired
              direction="row"
              placeholder="Enter description"
              inputWidth={400}
              isError={!!errors?.shortDesc}
            />
          )}
        />
        <div className="flex flex-col justify-start gap-3">
          <Typography size="m" weight="semi">
            Value<span className="text-reddist">*</span>
          </Typography>
          <Controller
            name="value"
            control={control}
            rules={{ required: t('components.atoms.required') ?? ''}}
            render={({ field }) => (
              <CkEditor 
                {...field}
                data={getValues('value') ?? ''}
                onChange={(data: string) => {
                  setValue('value', data);
                }}
                isError={!!errors?.value}
              />
            )}
          />
        </div>
        {/* BUTTONS SECTION */}
        <div className="mt-[10%] flex justify-end items-end gap-2">
          <button className="btn btn-outline btn-md" onClick={(event: any) => {
            event.preventDefault();
            setLeaveTitleModalShow(t('modal.confirmation'));
            setMessageLeaveModalShow(t('modal.leave-confirmation'));
            setShowLeaveModal(true);          
          }}>
            {t('btn.cancel')}
          </button>
          <button 
            type='submit' 
            className="btn btn-success btn-md"
          >
            {t('btn.save')}
          </button>
        </div>
      </form>
    </TitleCard>
  )
};
