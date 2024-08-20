import { useEffect, useState } from "react";
import { TitleCard } from "@/components/molecules/Cards/TitleCard";
import Typography from "@/components/atoms/Typography";
import FormList from "@/components/molecules/FormList";
import { colName } from "@/utils/colName";
import { styleButton } from "@/utils/styleButton";

interface IQuestionOption {
  desc: string;
  bobot: string;
}

interface IQuestionProps {
  question: string;
  option: IQuestionOption[];
}

const dummyOption: IQuestionOption = {
  desc: "",
  bobot: "",
}

const LeadsGenerator = () => {
  const [isUpdate, setUpdate] = useState<boolean>(false);
  const [isQuestion, setQuestion] = useState<IQuestionProps[]>([{
    question: "",
    option: [
      {
        desc: "",
        bobot: "",
      },
      {
        desc: "",
        bobot: "",
      },
    ],  
  }]);

  useEffect(() => {
    // setQuestion([dummy]);
  }, [])

  return (
    <TitleCard
      title="Questions"
      topMargin="mt-2"
      TopSideButtons={
        <div className={styleButton({variants: "secondary"})} onClick={() => {}}>
          Edit Data
        </div>
      }
    >
      <div className="flex flex-col gap-y-4">
        {isQuestion.map((item:IQuestionProps, i:number) => (
          <div className="flex gap-x-2" key={i}>   
            <div className="flex flex-col gap-2 w-1/2 p-4 bg-light-purple-2 rounded-xl">
              <div className="flex gap-x-2 items-center">
                <div className="bg-reddist w-[8px] h-[8px] rounded-xl" />
                <Typography type="body" size="l" weight="bold">
                  {`Question ${i+1}`}
                </Typography>
              </div>
              <FormList.TextAreaField
                // disabled
                labelRequired
                themeColor="primary"
                placeholder={`Question ${i+1}`}
                value={item.question}
                // error={!!attributesErrors.fieldId}
                // helperText={attributesErrors.fieldId}
                onChange={(e: any) => {
                  console.log(e);
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
                {item.option.map((jtem:IQuestionOption, idx:number) => {
                  return (
                    <div className="flex gap-x-3 items-center" key={idx}>
                      <div className="w-[60px] bg-bright-purple rounded-xl text-white flex justify-center items-center">{colName(idx)}</div>
                      <FormList.TextField
                        // disabled
                        wrapperClass="w-[55%]"
                        // key="fieldId"
                        // labelRequired
                        themeColor="primary"
                        placeholder="Answer"
                        value={jtem.desc}
                        // error={!!attributesErrors.fieldId}
                        // helperText={attributesErrors.fieldId}
                        // onChange={(e: any) => {
                        //   setNewAttributes({ ...newAttributes, fieldId: e.target.value });
                        // }}
                        border={false}
                      />
                      <FormList.TextField
                        // disabled
                        wrapperClass="w-[22%]"
                        key="fieldId"
                        // labelRequired
                        themeColor="primary"
                        placeholder="Answer Weight"
                        value={jtem.bobot}
                        // error={!!attributesErrors.fieldId}
                        // helperText={attributesErrors.fieldId}
                        // onChange={(e: any) => {
                        //   setNewAttributes({ ...newAttributes, fieldId: e.target.value });
                        // }}
                        border={false}
                      />
                      <div 
                        className={`!min-w-[36px] ${styleButton({variants: "error"})}`}
                        onClick={() => {
                          const data: IQuestionOption[] = [];
                          for (let n = 0; n < item.option.length; n++) {
                            if (idx !== n) {
                              data.push(item.option[n]);
                            }
                          }
                          isQuestion[i].option = data;
                          setUpdate(!isUpdate);                              
                          // setQuestion((prev) => {
                          //   let data: IQuestionOption[] = [];
                          //   for (let n = 0; n < prev[i].option.length; n++) {
                          //     if (idx !== n) {
                          //       data.push(prev[i].option[n]);
                          //     }
                          //   }
                          //   prev[i].option = data;
                          //   return prev;
                          // });    
                        }}
                      >x</div>
                    </div>
                  );
                })}
                <div className="flex justify-between items-center">
                  <div className="text-xs">Answers that can be added, up to a max. of 4 (four).</div>
                  <div 
                    className={styleButton({variants: "secondary"})} 
                    onClick={() => {
                      isQuestion[i].option = [...item.option, dummyOption];
                      setUpdate(!isUpdate);
                      // setQuestion((prev) => {
                      //   if (prev[i].option.length < 4) {
                      //     prev[i].option = [...prev[i].option, dummyOption];
                      //   }
                      //   return prev;
                      // });
                    }}
                  >
                    + Add Answer
                  </div>
                </div>
              </div>
            </div>
            <div className={`!min-w-[36px] ${styleButton({variants: "error"})}`}>x</div>
            {i+1 === isQuestion.length &&
              <div 
                className={`!min-w-[36px] ${styleButton({variants: "secondary"})}`}
                onClick={() => {
                  setQuestion((prev) => ([...prev, {
                    question: "",
                    option: [
                      {
                        desc: "",
                        bobot: "",
                      },
                      {
                        desc: "",
                        bobot: "",
                      },
                    ],
                  }]));
                }}
              >+</div>
            }
          </div>
       ))}
      </div>
      <div className="flex gap-2 justify-end items-center">
        <div className={styleButton({variants: "third"})} onClick={() => {}}>
          Cancel
        </div>
        <div className={styleButton({variants: "secondary"})} onClick={() => {}}>
          Save as Draft
        </div>
        <div className={styleButton({variants: "success"})} onClick={() => {}}>
          Save
        </div>
      </div>
    </TitleCard>
);
}

export default LeadsGenerator;