import { useEffect, useState } from 'react';
import { TitleCard } from '@/components/molecules/Cards/TitleCard';
import Typography from '@/components/atoms/Typography';
import FormList from '@/components/molecules/FormList';
import { colName } from '@/utils/colName';
import { styleButton } from '@/utils/styleButton';
import { useLazyGetQuestionsQuery, useUpdateQuestionsMutation } from '@/services/LeadsGenerator/leadsGeneratorApi';

export interface IQuestionProps {
  id?: number;
  name: string;
  question: string;
  isDraft: boolean;
  isDelete: boolean;
  answers: IAnswer[];
}

export interface IAnswer {
  answerOrder?: string;
  answerDesc?: string;
  order?: string;
  answer?: string;
  weight: number;
}

const dummyOption: IAnswer = {
  answerOrder: '',
  answerDesc: '',
  weight: 0,
};

const number = /^\d{1,3}(,\d{3})*(\.\d*)?$|^\d+(\.\d*)?$/;

const LeadsGenerator = () => {
  // RTK Query
  const [getQuestions] = useLazyGetQuestionsQuery();
  const [updateQuestoion] = useUpdateQuestionsMutation();
  const [isQuestion, setQuestion] = useState<IQuestionProps[]>([
    {
      name: '',
      question: '',
      isDraft: false,
      isDelete: false,
      answers: [
        {
          answerOrder: '',
          answerDesc: '',
          weight: 0,
        },
        {
          answerOrder: '',
          answerDesc: '',
          weight: 0,
        },
      ],
    },
  ]);

  const _handleCatch = () => {
    setQuestion([
      {
        name: '',
        question: '',
        isDraft: false,
        isDelete: false,
        answers: [
          {
            answerOrder: '',
            answerDesc: '',
            weight: 0,
          },
          {
            answerOrder: '',
            answerDesc: '',
            weight: 0,
          },
        ],
      },
    ]);    
  }

  const _handleResp = (e: any) => {
    try {
      const list = e?.getQuestion?.questions ?? [
        {
          name: '',
          question: '',
          isDraft: false,
          isDelete: false,
          answers: [
            {
              answerOrder: '',
              answerDesc: '',
              weight: 0,
            },
            {
              answerOrder: '',
              answerDesc: '',
              weight: 0,
            },
          ],
        },
      ];
      setQuestion(list);
    } catch {
      _handleCatch();
    }
  };

  useEffect(() => {
    getQuestions()
      .unwrap()
      .then(e => {
        _handleResp(e);
      })
      .catch(() => {
        _handleCatch();
      });
  }, []);

  const _updateQuestion = ({ type = '' }: { type?: string }) => {
    const request: IQuestionProps[] = [];
    const length = isQuestion.length;
    for (let i = 0; i < length; i++) {
      const answers = isQuestion[i].answers;
      const temp: IQuestionProps = { ...isQuestion[i], answers: []};
      if (!temp.id) {
        delete temp.id;
      }
      for (let j = 0; j < answers.length; j++) {
        temp.answers.push({
          answer: answers[j].answerDesc,
          order: answers[j].answerOrder,
          weight: answers[j].weight,
        })
      }
      temp.isDraft = type === "draft";
      request.push(temp);
    }

    updateQuestoion({ request })
      .unwrap()
      .then(e => {
        _handleResp(e);
      })
      .catch(() => {
        setQuestion([
          {
            name: '',
            question: '',
            isDraft: false,
            isDelete: false,
            answers: [
              {
                answerOrder: '',
                answerDesc: '',
                weight: 0,
              },
              {
                answerOrder: '',
                answerDesc: '',
                weight: 0,
              },
            ],
          },
        ]);
      });
  };

  return (
    <TitleCard
      title="Questions"
      topMargin="mt-2"
      TopSideButtons={
        <div className={styleButton({ variants: 'secondary' })} onClick={() => {}}>
          Edit Data
        </div>
      }>
      <div className="flex flex-col gap-y-4">
        {isQuestion.map((item: IQuestionProps, i: number) => (
          <div className="flex gap-x-2" key={i}>
            <div className="flex flex-col gap-2 w-1/2 p-4 bg-light-purple-2 rounded-xl">
              <div className="flex gap-x-2 items-center">
                <div className="bg-reddist w-[8px] h-[8px] rounded-xl" />
                <Typography type="body" size="l" weight="bold">
                  {`Question ${i + 1}`}
                </Typography>
              </div>
              <FormList.TextAreaField
                // disabled
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
                {item.answers.map((jtem: IAnswer, idx: number) => {
                  return (
                    <div className="flex gap-x-3 items-center" key={idx}>
                      <div className="w-[60px] bg-bright-purple rounded-xl text-white flex justify-center items-center">
                        {colName(idx)}
                      </div>
                      <FormList.TextField
                        // disabled
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
                          setQuestion(temp);
                        }}
                        border={false}
                      />
                      <FormList.TextField
                        // disabled
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
                          if (number.test(val)) {
                            const temp = JSON.parse(JSON.stringify(isQuestion));
                            temp[i].answers[idx].weight = val;
                            setQuestion(temp);
                          }
                        }}
                        border={false}
                      />
                      <div
                        className={`!min-w-[36px] ${styleButton({ variants: 'error' })}`}
                        onClick={() => {
                          const temp = JSON.parse(JSON.stringify(isQuestion));
                          const data: IAnswer[] = [];
                          for (let n = 0; n < item.answers.length; n++) {
                            if (idx !== n) {
                              data.push(item.answers[n]);
                            }
                          }
                          temp[i].answers = data;
                          setQuestion(temp);
                        }}>
                        x
                      </div>
                    </div>
                  );
                })}
                <div className="flex justify-between items-center">
                  <div className="text-xs">
                    Answers that can be added, up to a max. of 4 (four).
                  </div>
                  <div
                    className={styleButton({ variants: 'secondary' })}
                    onClick={() => {
                      const temp = JSON.parse(JSON.stringify(isQuestion));
                      temp[i].answers = [...item.answers, dummyOption];
                      setQuestion(temp);
                    }}>
                    + Add Answer
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`!min-w-[36px] ${styleButton({ variants: 'error' })}`}
              onClick={() => {
                const data: IQuestionProps[] = [];
                for (let n = 0; n < isQuestion.length; n++) {
                  if (i !== n) {
                    data.push(isQuestion[n]);
                  }
                }
                setQuestion(data);
              }}>
              x
            </div>
            {i + 1 === isQuestion.length && (
              <div
                className={`!min-w-[36px] ${styleButton({ variants: 'secondary' })}`}
                onClick={() => {
                  setQuestion(prev => [
                    ...prev,
                    {
                      name: '',
                      question: '',
                      isDraft: false,
                      isDelete: false,
                      answers: [
                        {
                          answerOrder: '',
                          answerDesc: '',
                          weight: 0,
                        },
                        {
                          answerOrder: '',
                          answerDesc: '',
                          weight: 0,
                        },
                      ],
                    },
                  ]);
                }}>
                +
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex gap-2 justify-end items-center">
        <div className={styleButton({ variants: 'third' })} onClick={() => {}}>
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
    </TitleCard>
  );
};

export default LeadsGenerator;
