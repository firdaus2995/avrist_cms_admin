import { TitleCard } from '@/components/molecules/Cards/TitleCard';
import { t } from 'i18next';
import FormList from '@/components/molecules/FormList';
import { styleButton } from '@/utils/styleButton';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ModalConfirm from '@/components/molecules/ModalConfirm';
import CancelIcon from '@/assets/cancel.png';
import {
  useCreateResultTemplateMutation,
  useGetResultTemplateDetailQuery,
  useUpdateResultTemplateMutation,
} from '@/services/LeadsGenerator/leadsGeneratorApi';
import { useAppDispatch } from '@/store';
import { openToast } from '@/components/atoms/Toast/slice';
import Typography from '@/components/atoms/Typography';

const LeadsGeneratorResultDetail = () => {
  const params = useParams();
  const [id] = useState<any>(Number(params?.id));
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname ?? '';
  const dispatch = useAppDispatch();

  const [isTitle, setTitle] = useState<string>('Edit Result Template');
  const [isEditable, setEditable] = useState<boolean>(false);
  const [isDraft, setIsDraft] = useState<boolean>(false); // State to handle draft

  // LEAVE MODAL STATE
  const [showLeaveModal, setShowLeaveModal] = useState<boolean>(false);
  const [titleLeaveModalShow, setLeaveTitleModalShow] = useState<string | null>('');
  const [messageLeaveModalShow, setMessageLeaveModalShow] = useState<string | null>('');

  const [createResultTemplate] = useCreateResultTemplateMutation();
  const [updateResultTemplate] = useUpdateResultTemplateMutation();

  const fetchQuery = useGetResultTemplateDetailQuery({ id });
  const { data } = fetchQuery;

  // Form hook
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm();

  useEffect(() => {
    // Set editable state and title based on the route
    if (pathname.includes('new')) {
      setEditable(true);
      setTitle('Add Result Template');
    }
  }, [pathname]);

  useEffect(() => {
    if (data?.resultTemplateDetail) {
      const { name, narrative, disclaimer, images } = data.resultTemplateDetail;

      reset({
        resultName: name,
        narrative,
        disclaimer,
        images,
      });
    }
  }, [data, reset]);

  // Handle form submission
  const onSubmitData = () => {
    if (pathname.includes('new')) {
      saveData(); // Create new template
    } else {
      editData(); // Update existing template
    }
  };

  // Update existing result template
  const editData = () => {
    const value = getValues();
    const payload = {
      id,
      name: value.resultName,
      narrative: value.narrative,
      disclaimer: value.disclaimer,
      images: value?.images,
      isDraft, // Include isDraft in payload
    };
    updateResultTemplate(payload)
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
      });
  };

  // Create new result template
  const saveData = () => {
    const value = getValues();
    const payload = {
      name: value.resultName,
      narrative: value.narrative,
      isDraft, // Use the isDraft state
      disclaimer: value.disclaimer,
      images: value?.images,
    };
    createResultTemplate(payload)
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
      });
  };

  // Navigate back
  const goBack = () => {
    navigate(-1);
  };

  // Handle modal leave action
  const onLeave = () => {
    setShowLeaveModal(false);
    goBack();
  };

  return (
    <TitleCard
      hasBack
      onBackClick={() => {
        navigate(-1);
      }}
      title={isTitle}
      topMargin="mt-2"
      TopSideButtons={
        !isEditable && (
          <div
            className={styleButton({ variants: 'secondary' })}
            onClick={() => {
              setEditable(true);
            }}>
            Edit Data
          </div>
        )
      }>
      <form onSubmit={handleSubmit(onSubmitData)} className="flex flex-col gap-10">
        <div className="flex flex-col gap-y-4">
          <div className="flex flex-col gap-y-2 w-1/2 ml-[-5px]">
            <Controller
              name="resultName"
              control={control}
              defaultValue=""
              rules={{ required: 'Result Name is required' }}
              render={({ field }) => (
                <FormList.TextField
                  disabled={!isEditable}
                  labelTitle="Result Name"
                  themeColor="primary"
                  placeholder="Result Name"
                  value={field.value}
                  onChange={field.onChange}
                  error={!!errors.resultName}
                  helperText={errors.resultName?.message}
                  border={false}
                />
              )}
            />
            <div className="flex items-center">
              <Typography type="body" size="s" weight="bold" className="w-[225px] ml-1">
                Default Template
              </Typography>
              <Controller
                name="resultName"
                control={control}
                defaultValue=""
                rules={{ required: 'Result Name is required' }}
                render={({ field }) => (
                  <input type="checkbox" id="vehicle1" name="vehicle1" value="Yes" />
                )}
              />
            </div>
            <div className="flex items-center">
              <Typography type="body" size="s" weight="bold" className="w-[225px] ml-1">
                Template Type
              </Typography>
              <Controller
                name="resultName"
                control={control}
                defaultValue=""
                rules={{ required: 'Result Name is required' }}
                render={({ field }) => (
                  <FormList.DropDown
                    disabled={!isEditable}
                    themeColor="primary"
                    error={!!errors.resultName}
                    helperText={errors.resultName?.message}
                    defaultValue={field.value}
                    onChange={field.onChange}
                    items={[]}
                  />
                )}
              />
            </div>
            <div className="flex items-center">
              <Typography type="body" size="s" weight="bold" className="w-[225px] ml-1">
                Content Type
              </Typography>
              <Controller
                name="resultName"
                control={control}
                defaultValue=""
                rules={{ required: 'Result Name is required' }}
                render={({ field }) => (
                  <FormList.DropDown
                    disabled={!isEditable}
                    themeColor="primary"
                    error={!!errors.resultName}
                    helperText={errors.resultName?.message}
                    defaultValue={field.value}
                    onChange={field.onChange}
                    items={[]}
                  />
                )}
              />
            </div>
            <div className="flex items-center">
              <Typography type="body" size="s" weight="bold" className="w-[225px] ml-1">
                Category Content
              </Typography>
              <Controller
                name="resultName"
                control={control}
                defaultValue=""
                rules={{ required: 'Result Name is required' }}
                render={({ field }) => (
                  <FormList.DropDown
                    disabled={!isEditable}
                    themeColor="primary"
                    error={!!errors.resultName}
                    helperText={errors.resultName?.message}
                    defaultValue={field.value}
                    onChange={field.onChange}
                    items={[]}
                  />
                )}
              />
            </div>
          </div>
          <div className="w-2/3">
            <Controller
              name="narrative"
              control={control}
              defaultValue=""
              rules={{
                required: 'Narrative is required',
              }}
              render={({ field }) => (
                <FormList.TextEditor
                  title="Narrative"
                  value={field.value}
                  disabled={!isEditable}
                  error={!!errors.narrative}
                  helperText={errors.narrative?.message}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
          <div className="w-2/3">
            <Controller
              name="disclaimer"
              control={control}
              defaultValue=""
              rules={{
                required: { value: true, message: `Disclaimer is required` },
              }}
              render={({ field }) => (
                <FormList.TextEditor
                  title="Disclaimer"
                  value={field.value}
                  disabled={!isEditable}
                  error={errors.disclaimer}
                  helperText={errors.disclaimer?.message}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
          <div className="w-2/3">
            <Controller
              name="images"
              control={control}
              defaultValue="[]"
              rules={{
                validate: value => {
                  try {
                    const parsedValue = JSON.parse(value);

                    if (Array.isArray(parsedValue) && parsedValue.length > 0) {
                      if (parsedValue.every(item => item.imageUrl && item.altText)) {
                        return true;
                      }
                    }

                    return 'Images are required and must include valid imageUrl and altText.';
                  } catch (error) {
                    return 'Invalid format. Please provide a valid JSON array.';
                  }
                },
              }}
              render={({ field }) => {
                return (
                  <FormList.FileUploaderV2
                    {...field}
                    id="images"
                    fieldTypeLabel="Images"
                    labelTitle="Images"
                    isDocument={false}
                    disabled={!isEditable}
                    editMode={isEditable}
                    multiple={true}
                    error={!!errors?.images}
                    helperText={errors?.images?.message}
                    onChange={field.onChange}
                    border={false}
                  />
                );
              }}
            />
          </div>
        </div>
        <div className="flex gap-2 justify-end items-center mt-10 border-t-2 pt-5">
          <button
            onClick={e => {
              e.preventDefault();
              setLeaveTitleModalShow('Cancel and Back to Previous Page');
              setMessageLeaveModalShow('Do you want to cancel all the process?');
              setShowLeaveModal(true);
            }}
            className="btn btn-outline text-xs btn-sm w-28 h-10">
            {t('user.content-manager-new.cancel')}
          </button>
          <button
            type="submit"
            className={styleButton({ variants: 'secondary', disabled: !isEditable })}
            onClick={() => {
              setIsDraft(true); // Set isDraft before submitting
            }}>
            Save as Draft
          </button>
          <button
            type="submit"
            className={styleButton({ variants: 'success', disabled: !isEditable })}
            onClick={() => {
              setIsDraft(false); // Ensure isDraft is false for final save
            }}>
            Save
          </button>
        </div>
      </form>
      <ModalConfirm
        open={showLeaveModal}
        cancelAction={() => {
          setShowLeaveModal(false);
        }}
        title={titleLeaveModalShow ?? ''}
        cancelTitle={t('no')}
        message={messageLeaveModalShow ?? ''}
        submitAction={onLeave}
        submitTitle={t('yes')}
        icon={CancelIcon}
        btnSubmitStyle="btn-warning"
      />
    </TitleCard>
  );
};

export default LeadsGeneratorResultDetail;
