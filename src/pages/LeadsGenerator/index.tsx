import { useEffect, useState } from 'react';
import { t } from 'i18next';
import { useAppDispatch } from '@/store';
import { TitleCard } from '@/components/molecules/Cards/TitleCard';
import Typography from '@/components/atoms/Typography';
import FormList from '@/components/molecules/FormList';
// import { colName } from '@/utils/colName';
import { styleButton } from '@/utils/styleButton';
import {
  useLazyGetQuestionsQuery,
  useUpdateQuestionsMutation,
} from '@/services/LeadsGenerator/leadsGeneratorApi';
import { addIcon, closeIcon, deleteIcon, docIcon, editIcon, trashIcon } from './svg';
import { openToast } from '@/components/atoms/Toast/slice';
import ModalConfirm from '@/components/molecules/ModalConfirm';
import { isNumber } from '@/utils/logicHelper';

export interface IQuestionProps {
  id: number | null;
  name: string;
  question: string;
  isDraft: boolean;
  isDelete: boolean;
  answers: IAnswer[];
}

export interface IAnswer {
  id: number | null;
  answerOrder?: string;
  answerDesc?: string;
  order?: string;
  answer?: string;
  weight: number;
  action: string;
}

const dummyOption: IAnswer = {
  id: null,
  answerOrder: '',
  answerDesc: '',
  weight: 0,
  action: 'create',
};

const initialData = [
  {
    id: null,
    name: '',
    question: '',
    isDraft: false,
    isDelete: false,
    answers: [
      {
        id: 1,
        answerOrder: 'A',
        answerDesc: '',
        weight: 0,
        action: 'create',
      },
      {
        id: 2,
        answerOrder: 'B',
        answerDesc: '',
        weight: 0,
        action: 'create',
      },
    ],
  },
];

const LeadsGenerator = () => {
  const dispatch = useAppDispatch();
  // RTK Query
  const [getQuestions] = useLazyGetQuestionsQuery();
  const [updateQuestoion] = useUpdateQuestionsMutation();

  const [isIdx, setIdx] = useState<number>(0);
  const [isType, setType] = useState<string>('');
  const [isEditable, setEditable] = useState<boolean>(false);
  const [isModal, setModal] = useState({
    show: false,
    title: 'Cancel and Back to Previous Page',
    desc: 'Do you want to cancel all the process?',
    icon: docIcon(),
  });
  const [isQuestion, setQuestion] = useState<IQuestionProps[]>(initialData);
  const [defaultQuestion, setDefaultQuestion] = useState<IQuestionProps[]>(initialData);

  const _handleCatch = () => {
    setEditable(true);
    setQuestion([
      {
        id: null,
        name: '',
        question: '',
        isDraft: false,
        isDelete: false,
        answers: [
          {
            id: null,
            answerOrder: '',
            answerDesc: '',
            weight: 0,
            action: 'create',
          },
          {
            id: null,
            answerOrder: '',
            answerDesc: '',
            weight: 0,
            action: 'create',
          },
        ],
      },
    ]);
  };

  const _handleResp = (e: any, type?: string) => {
    try {
      let val: string = 'Edit Data';
      const list = e?.getQuestion?.questions ?? [
        {
          name: '',
          question: '',
          isDraft: false,
          isDelete: false,
          answers: [
            {
              id: null,
              answerOrder: '',
              answerDesc: '',
              weight: 0,
              action: 'create',
            },
            {
              id: null,
              answerOrder: '',
              answerDesc: '',
              weight: 0,
              action: 'create',
            },
          ],
        },
      ];

      // if the question from API has more than 4 answers, add action 'delete' to the excessive answer
      const filteredList = list.map((question: IQuestionProps) => {
        if (question.answers.length > 4) {
          return {
            ...question,
            answers: question.answers.map((answer: IAnswer, index: number) =>
              index > 3 ? { ...answer, action: 'delete' } : answer,
            ),
          };
        }

        return {
          ...question,
          answers: question.answers.map((answer: IAnswer) => ({ ...answer, action: 'edit' })),
        };
      });
      type === 'fetch' && setQuestion(filteredList.length > 0 ? filteredList : initialData);
      defaultQuestion === initialData && setDefaultQuestion(filteredList);

      for (let i = 0; i < list.length; i++) {
        if (list[i].isDraft) {
          val = 'Edit Draft';
        }
      }

      setType(val);
    } catch {
      _handleCatch();
    }
  };

  useEffect(() => {
    const fetchQuestion = async () => {
      await _getQuestion();
    };
    void fetchQuestion();
  }, []);

  const _getQuestion = async () => {
    getQuestions()
      .unwrap()
      .then(e => {
        _handleResp(e, 'fetch');
      })
      .catch(() => {
        _handleCatch();
      });
  };

  const _updateQuestion = ({ type = '' }: { type?: string }) => {
    const request: IQuestionProps[] = [];
    const length = isQuestion.length;
    for (let i = 0; i < length; i++) {
      const answers = isQuestion[i].answers;
      const temp: IQuestionProps = { ...isQuestion[i], answers: [] };
      for (let j = 0; j < answers.length; j++) {
        const tempAction = answers[j]?.action;
        temp.answers.push({
          ...answers[j],
          id: answers[j]?.id ?? null,
          // answer: answers[j].answerDesc,
          // order: answers[j].answerOrder,
          // weight: answers[j].weight,
          action: tempAction === 'create' ? 'create' : tempAction === 'delete' ? 'delete' : 'edit',
        });
      }
      temp.isDraft = type === 'draft';
      temp.isDelete = temp.isDelete ?? false;
      request.push(temp);
    }

    updateQuestoion({ request })
      .unwrap()
      .then(e => {
        _handleResp(e, 'update');
        dispatch(
          openToast({
            type: 'success',
            title: t('toast-success'),
            message: type === 'draft' ? 'Save as draft success!' : 'Save success!',
          }),
        );
        void _getQuestion();
      })
      .catch(err => {
        setQuestion(defaultQuestion);
        dispatch(
          openToast({
            type: 'error',
            title: 'Failed',
            message: err.message.split(': ')[1],
          }),
        );
      })
      .finally(() => {
        setEditable(false);
      });
  };

  const questions: () => IQuestionProps[] = () => {
    const data: IQuestionProps[] = [];
    for (let i = 0; i < isQuestion.length; i++) {
      if (!isQuestion[i].isDelete) {
        data.push(isQuestion[i]);
      }
    }
    return data;
  };

  return (
    <>
      <TitleCard
        title="Questions"
        topMargin="mt-2"
        TopSideButtons={
          isType && (
            <div
              className={styleButton({ variants: 'secondary' })}
              onClick={() => {
                setEditable(true);
              }}>
              {editIcon()}
              {` ${isType}`}
            </div>
          )
        }>
        <div className="flex flex-col gap-y-4">
          {questions().map((item: IQuestionProps, i: number) => {
            const answers: () => IAnswer[] = () => {
              const list = item.answers;
              const data: IAnswer[] = [];
              for (let i = 0; i < list.length; i++) {
                data.push(list[i]);
              }
              return data;
            };
            return (
              <div className="flex gap-x-2" key={i}>
                <div className="flex flex-col gap-2 w-[65%] p-4 bg-light-purple-2 rounded-xl">
                  <div className="flex gap-x-2 items-center">
                    <div className="bg-reddist w-[8px] h-[8px] rounded-xl" />
                    <Typography type="body" size="l" weight="bold">
                      {`Question ${i + 1}`}
                    </Typography>
                  </div>
                  <FormList.TextAreaField
                    disabled={!isEditable}
                    // labelRequired
                    themeColor="primary"
                    placeholder={`Question ${i + 1}`}
                    value={item.question}
                    // error={!!attributesErrors.fieldId}
                    // helperText={attributesErrors.fieldId}
                    onChange={(e: any) => {
                      const temp = JSON.parse(JSON.stringify(isQuestion));
                      temp[i].question = e.target.value;
                      setQuestion(temp);
                    }}
                    // textAreaStyle="h-[72px]"
                    border={false}
                  />
                  <div className="flex flex-col gap-3 p-3 border border-light-grey bg-[linear-gradient(180deg,_#EAE1F4_0%,_#F9F5FD_100%)] rounded-xl">
                    <div className="flex gap-x-3">
                      <Typography type="body" size="s" weight="bold" className="w-[60px]">
                        Order
                      </Typography>
                      <Typography type="body" size="s" weight="bold" className="w-[55%]">
                        Answer
                      </Typography>
                      <Typography type="body" size="s" weight="bold" className="w-[22%]">
                        Answer Weight
                      </Typography>
                      <div className="w-[36px]" />
                    </div>
                    <hr className="border-black" />
                    {answers().map((jtem: IAnswer, idx: number) => {
                      return (
                        <div
                          className={`flex gap-x-3 items-center ${
                            jtem.action === 'delete' ? 'hidden' : ''
                          }`}
                          key={idx}>
                          <div className="w-[60px] bg-bright-purple rounded-xl text-white flex justify-center items-center">
                            {jtem.answerOrder}
                          </div>
                          <FormList.TextField
                            disabled={!isEditable}
                            wrapperClass="w-[55%]"
                            // key="fieldId"
                            // labelRequired
                            themeColor="primary"
                            placeholder="Answer"
                            value={jtem.answerDesc}
                            // error={!!attributesErrors.fieldId}
                            // helperText={attributesErrors.fieldId}
                            onChange={(e: any) => {
                              const temp = JSON.parse(JSON.stringify(isQuestion));
                              temp[i].answers[idx].answerDesc = e.target.value;
                              temp[i].answers[idx].action =
                                temp[i].answers[idx].action === 'create' ? 'create' : 'edit';
                              setQuestion(temp);
                            }}
                            border={false}
                          />
                          <FormList.TextField
                            disabled={!isEditable}
                            wrapperClass="w-[22%]"
                            key="fieldId"
                            // labelRequired
                            themeColor="primary"
                            placeholder="Answer Weight"
                            value={jtem.weight}
                            // error={!!attributesErrors.fieldId}
                            // helperText={attributesErrors.fieldId}
                            onChange={(e: any) => {
                              const val = e.target.value;
                              if (isNumber(val) || val === '') {
                                const temp = JSON.parse(JSON.stringify(isQuestion));
                                temp[i].answers[idx].weight = val === '' ? 0 : parseInt(val);
                                temp[i].answers[idx].action =
                                  temp[i].answers[idx].action === 'create' ? 'create' : 'edit';
                                setQuestion(temp);
                              }
                            }}
                            border={false}
                          />
                          {idx > 1 && (
                            <div
                              className={`!min-w-[36px] ${styleButton({
                                variants: 'error',
                                disabled: !isEditable,
                              })}`}
                              onClick={() => {
                                if (isEditable) {
                                  const temp = JSON.parse(JSON.stringify(isQuestion));
                                  const data: IAnswer[] = item.answers
                                    .map((i: IAnswer, idx: number) => {
                                      if (i.action === 'create' && i.id === jtem.id) {
                                        return null;
                                      }
                                      return i.id === jtem.id
                                        ? { ...i, action: 'delete' }
                                        : idx > 1 && i.answerOrder === 'D'
                                        ? {
                                            ...i,
                                            answerOrder: String.fromCharCode(
                                              (i.answerOrder as string).charCodeAt(0) - 1,
                                            ),
                                          }
                                        : i;
                                    })
                                    .filter((j): j is IAnswer => j !== null);
                                  temp[i].answers = data;
                                  setQuestion(temp);
                                }
                              }}>
                              {closeIcon(!isEditable ? '#798F9F' : undefined)}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    <div className="flex justify-between items-center">
                      <div className="text-xs">
                        Answers that can be added, up to a max. of 4 (four).
                      </div>
                      <div
                        className={styleButton({
                          variants: 'secondary',
                          className: 'min-w-[130px]',
                          disabled:
                            !isEditable ||
                            isQuestion[i].answers.filter(i => i.action !== 'delete').length > 3,
                        })}
                        onClick={() => {
                          const temp = JSON.parse(JSON.stringify(isQuestion));
                          if (
                            temp[i].answers.filter((i: any) => i.action !== 'delete').length < 4 &&
                            isEditable
                          ) {
                            const newOption = { ...dummyOption };
                            const previousData =
                              temp[i].answers[
                                temp[i].answers.filter((item: any) => item.action !== 'delete')
                                  .length - 1
                              ];
                            newOption.id =
                              Number(temp[i].answers[temp[i].answers.length - 1]?.id ?? 0) + 1;
                            const previousOrder = previousData?.answerOrder;
                            const newOrder = String.fromCharCode(
                              (previousOrder as string).charCodeAt(0) + 1,
                            );
                            newOption.answerOrder = newOrder;
                            temp[i].answers = [...item.answers, newOption];

                            setQuestion(temp);
                          }
                        }}>
                        {addIcon(
                          !isEditable ||
                            isQuestion[i].answers.filter(i => i.action !== 'delete').length > 3
                            ? '#798F9F'
                            : undefined,
                        )}
                        &nbsp;Add Answer
                      </div>
                    </div>
                  </div>
                </div>
                {isEditable && (
                  <>
                    <div
                      className={`!min-w-[36px] ${styleButton({
                        variants: 'error',
                        disabled: isQuestion?.length === 1,
                      })}`}
                      onClick={() => {
                        if (isQuestion?.length > 0) {
                          setIdx(item.id ? item.id : i);
                          setModal({
                            show: true,
                            title: 'Delete Question',
                            desc: `Do you want to delete Question ${i + 1}?`,
                            icon: deleteIcon(),
                          });
                        }
                      }}>
                      {isQuestion?.length > 1 ? trashIcon() : trashIcon('#798F9F')}
                    </div>
                    {i + 1 === isQuestion.filter(item => !item.isDelete).length && (
                      <div
                        className={`!min-w-[36px] ${styleButton({
                          variants: 'secondary',
                          disabled: isQuestion[i].question === '',
                        })}`}
                        onClick={() => {
                          if (isQuestion[i].question !== '') {
                            setQuestion(prev => [
                              ...prev,
                              {
                                id: null,
                                name: '',
                                question: '',
                                isDraft: false,
                                isDelete: false,
                                answers: [
                                  {
                                    id: null,
                                    answerOrder: 'A',
                                    answerDesc: '',
                                    weight: 0,
                                    action: 'create',
                                  },
                                  {
                                    id: null,
                                    answerOrder: 'B',
                                    answerDesc: '',
                                    weight: 0,
                                    action: 'create',
                                  },
                                ],
                              },
                            ]);
                          }
                        }}>
                        {addIcon(isQuestion[i].question === '' ? '#798F9F' : undefined)}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
        {isEditable && (
          <div className="flex gap-2 justify-end items-center">
            <div
              className={styleButton({ variants: 'third' })}
              onClick={() => {
                setModal({
                  show: true,
                  title: 'Cancel and Back to Previous Page',
                  desc: 'Do you want to cancel all the process?',
                  icon: docIcon(),
                });
              }}>
              Cancel
            </div>
            <div
              className={styleButton({ variants: 'secondary' })}
              onClick={() => {
                _updateQuestion({ type: 'draft' });
              }}>
              Save as Draft
            </div>
            <div
              className={styleButton({ variants: 'success' })}
              onClick={() => {
                _updateQuestion({});
              }}>
              Save
            </div>
          </div>
        )}
      </TitleCard>
      <ModalConfirm
        open={isModal.show}
        cancelAction={() => {
          setModal(prev => ({ ...prev, show: false }));
        }}
        title={isModal.title}
        cancelTitle="No"
        message={isModal.desc}
        submitAction={() => {
          if (isModal.title === 'Delete Question') {
            const data: IQuestionProps[] = isQuestion
              .map((item: IQuestionProps) =>
                item.id === isIdx ? { ...item, isDelete: true } : item,
              )
              .filter(item => item.id);

            setQuestion(data);
          } else {
            setQuestion(defaultQuestion);
          }
          setModal(prev => ({ ...prev, show: false }));
          setEditable(false);
        }}
        submitTitle="Yes"
        icon={isModal.icon}
        btnSubmitStyle="btn-primary"
      />
    </>
  );
};

export default LeadsGenerator;
