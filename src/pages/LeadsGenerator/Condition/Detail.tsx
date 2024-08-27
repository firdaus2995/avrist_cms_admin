import { CheckBox } from '@/components/atoms/Input/CheckBox';
import { t } from 'i18next';
import { openToast } from '@/components/atoms/Toast/slice';
import Typography from '@/components/atoms/Typography';
import { TitleCard } from '@/components/molecules/Cards/TitleCard';
import FormList from '@/components/molecules/FormList';
import ModalConfirm from '@/components/molecules/ModalConfirm';
import CancelIcon from '@/assets/cancel.png';
import {
  useCreateConditionMutation,
  useGetConditionDetailQuery,
  useGetQuestionListQuery,
  useGetResultTemplateListQuery,
  useUpdateConditionMutation,
} from '@/services/LeadsGenerator/leadsGeneratorApi';
import { useAppDispatch } from '@/store';
import { styleButton } from '@/utils/styleButton';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const LeadsGeneratorConditionDetail = () => {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const [id] = useState<any>(Number(params?.id));
  const pathname = location.pathname ?? '';
  const dispatch = useAppDispatch();

  const [isTitle, setTitle] = useState<string>('Edit Condition');
  const [isEditable, setEditable] = useState<boolean>(false);
  const [expandedConditions, setExpandedConditions] = useState<number[]>([]);
  const [conditionsData, setConditionsData] = useState([]);
  const [listResultName, setListResultName] = useState([]);
  const [selectedResultName, setSelectedResultName] = useState<any>({});
  const [formTitle, setFormTitle] = useState('');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number[]>>({});
  const [isDraft, setIsDraft] = useState<boolean>(false);

  // LEAVE MODAL STATE
  const [showLeaveModal, setShowLeaveModal] = useState<boolean>(false);
  const [titleLeaveModalShow, setLeaveTitleModalShow] = useState<string | null>('');
  const [messageLeaveModalShow, setMessageLeaveModalShow] = useState<string | null>('');

  const [createCondition] = useCreateConditionMutation();
  const [updateCondition] = useUpdateConditionMutation();

  const fetchDetailQuery = useGetConditionDetailQuery({ id });
  const { data: dataDetail } = fetchDetailQuery;

  const fetchQuery = useGetQuestionListQuery({});
  const { data } = fetchQuery;

  const fetchQueryResultTemplate = useGetResultTemplateListQuery({
    pageIndex: 0,
    limit: 50,
    direction: 'desc',
    sortBy: 'id',
  });
  const { data: dataResult } = fetchQueryResultTemplate;

  useEffect(() => {
    if (dataDetail) {
      const { title, resultTemplateId, questions } = dataDetail.conditionDetail;
      setFormTitle(title);
      const matchedResultName = listResultName?.find(
        (item: any) => item.value === resultTemplateId,
      );
      setSelectedResultName(matchedResultName || {});

      const answersMap: Record<number, number[]> = {};
      questions.forEach((q: any) => {
        answersMap[q.questionId] = q.answerIds;
      });
      setSelectedAnswers(answersMap);

      const expandedQuestion: any[] = [];
      questions?.map((item: { questionId: any }) => {
        expandedQuestion?.push(item?.questionId);
      });
      setExpandedConditions(expandedQuestion);
    }
  }, [dataDetail, listResultName]);

  useEffect(() => {
    if (dataResult) {
      const transformedData = dataResult?.resultTemplateList?.templates?.map(
        (item: { id: any; name: any }) => ({
          value: item.id,
          label: item.name,
        }),
      );
      setListResultName(transformedData);
    }
  }, [dataResult]);

  useEffect(() => {
    if (data) {
      const transformedData = data.getQuestion.questions.map(
        (question: { id: any; question: any; answers: any[] }) => ({
          id: question.id,
          text: question.question,
          subConditions: question.answers.map(
            (answer: { id: any; answerDesc: any; weight: any }) => ({
              id: answer.id,
              value: answer.answerDesc,
              score: answer.weight,
            }),
          ),
        }),
      );
      setConditionsData(transformedData);
    }
  }, [data]);

  const toggleCondition = (id: number) => {
    setExpandedConditions(prev => {
      if (prev.includes(id)) {
        setSelectedAnswers(prevAnswers => {
          const { [id]: _, ...rest } = prevAnswers;
          return rest;
        });
        return prev.filter(condId => condId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleAnswerToggle = (questionId: number, answerId: number) => {
    setSelectedAnswers(prev => {
      const answers = prev[questionId] || [];
      if (answers.includes(answerId)) {
        return {
          ...prev,
          [questionId]: answers.filter(id => id !== answerId),
        };
      } else {
        return {
          ...prev,
          [questionId]: [...answers, answerId],
        };
      }
    });
  };

  const goBack = () => {
    navigate(-1);
  };

  const onLeave = () => {
    setShowLeaveModal(false);
    goBack();
  };

  useEffect(() => {
    if (isDraft) {
      if (pathname.includes('new')) {
        handleSubmit();
      } else {
        handleEdit();
      }
    }
  }, [isDraft]);

  const handleSubmit = () => {
    const payload = {
      title: formTitle,
      resultTemplateId: selectedResultName.value,
      isDraft,
      isDefault: false,
      questions: Object.keys(selectedAnswers).map(questionId => ({
        questionId: Number(questionId),
        answerIds: selectedAnswers[Number(questionId)],
        action: 'create',
      })),
    };

    createCondition(payload)
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

  const handleEdit = () => {
    const payload = {
      id,
      title: formTitle,
      resultTemplateId: selectedResultName.value,
      isDraft,
      isDefault: false,
      questions: Object.keys(selectedAnswers).map(questionId => ({
        questionId: Number(questionId),
        answerIds: selectedAnswers[Number(questionId)],
        action: 'edit',
      })),
    };

    updateCondition(payload)
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

  useEffect(() => {
    if (pathname.includes('new')) {
      setEditable(true);
      setTitle('Add Condition');
    }
  }, [pathname]);

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
      <div className="flex flex-col gap-y-4 pb-10 border-b-2">
        <div className="flex flex-col gap-y-2 w-2/3">
          <FormList.TextField
            disabled={!isEditable}
            labelTitle="Condition Title"
            themeColor="primary"
            placeholder="Condition Title"
            value={formTitle}
            onChange={(e: any) => {
              setFormTitle(e.target.value);
            }}
            border={false}
          />
          <div className="flex items-center">
            <Typography type="body" size="s" weight="bold" className="w-[222px] ml-1">
              Result Name
            </Typography>
            <FormList.DropDown
              disabled={!isEditable}
              defaultValue={selectedResultName?.label}
              items={listResultName}
              onChange={(e: any) => {
                setSelectedResultName(e);
              }}
            />
          </div>
        </div>

        <div className="p-4 rounded-lg shadow-md w-2/3 bg-light-purple-2">
          <h3 className="text-lg font-bold mb-4">Conditions</h3>
          <div className="space-y-2">
            {conditionsData.map((condition: any) => (
              <div key={condition.id} className="bg-bright-purple-2 rounded-[12px]">
                <div
                  className={`${
                    expandedConditions.includes(condition.id)
                      ? 'border-b-2 border-border-purple'
                      : ''
                  } flex items-center gap-[12px] px-[12px] py-[8px]`}>
                  <CheckBox
                    defaultValue={expandedConditions.includes(condition.id)}
                    updateFormValue={_e => {
                      toggleCondition(condition.id);
                    }}
                    labelTitle={condition.text}
                    updateType={''}
                  />
                </div>
                {expandedConditions.includes(condition.id) && (
                  <div className="pl-6 mt-2 bg-bright-purple-2 rounded-md p-2">
                    {condition.subConditions.map((subCond: any) => (
                      <div
                        key={subCond.id}
                        className="flex items-center gap-[12px] px-[12px] py-[8px]">
                        <CheckBox
                          defaultValue={
                            selectedAnswers[condition.id]?.includes(subCond.id) || false
                          }
                          updateFormValue={_e => {
                            handleAnswerToggle(condition.id, subCond.id);
                          }}
                          labelTitle={subCond.value}
                          updateType={''}
                        />
                        <div className="py-[2px] px-3 w-[42px] flex items-center justify-center rounded-xl bg-bright-purple-3 text-primary font-bold">
                          {subCond.score}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex gap-2 justify-end items-center pt-5">
        <div
          className={styleButton({ variants: 'third' })}
          onClick={e => {
            e.preventDefault();
            setLeaveTitleModalShow('Cancel and Back to Previous Page');
            setMessageLeaveModalShow('Do you want to cancel all the process?');
            setShowLeaveModal(true);
          }}>
          Cancel
        </div>
        <div
          className={styleButton({ variants: 'secondary', disabled: !isEditable })}
          onClick={() => {
            setIsDraft(true);
          }}>
          Save as Draft
        </div>
        <div
          className={styleButton({ variants: 'success', disabled: !isEditable })}
          onClick={() => {
            if (pathname.includes('new')) {
              handleSubmit();
            } else {
              handleEdit();
            }
          }}>
          Save
        </div>
      </div>
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

export default LeadsGeneratorConditionDetail;
