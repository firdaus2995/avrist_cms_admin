import Typography from '@/components/atoms/Typography';
import { TitleCard } from '@/components/molecules/Cards/TitleCard';
import FormList from '@/components/molecules/FormList';
import { styleButton } from '@/utils/styleButton';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const LeadsGeneratorResultDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname ?? '';

  const [isTitle, setTitle] = useState<string>('Edit Result Template');
  const [isEditable, setEditable] = useState<boolean>(false);

  useEffect(() => {
    if (pathname.includes('new')) {
      setEditable(true);
      setTitle('Add Result Template');
    }
  }, [pathname]);

  const arrData: () => number[] = () => {
    const arr: number[] = [];
    for (let i = 0; i < 3; i++) {
      arr.push(i);
    }
    return arr;
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
      <div className="flex flex-col gap-y-4">
        <div className="flex flex-col gap-y-2 w-1/2">
          <FormList.TextField
            disabled={!isEditable}
            // key="fieldId"
            // labelRequired
            labelTitle="Result Name"
            themeColor="primary"
            placeholder="Result Name"
            value={''}
            // error={!!attributesErrors.fieldId}
            // helperText={attributesErrors.fieldId}
            // onChange={(e: any) => {
            //   setNewAttributes({ ...newAttributes, fieldId: e.target.value });
            // }}
            border={false}
          />
          <div className="flex items-center">
            <Typography type="body" size="s" weight="bold" className="w-[222px] ml-1">
              Content Type
            </Typography>
            <FormList.DropDown
              disabled={!isEditable}
              defaultValue={''}
              items={[]}
              onChange={(e: any) => {
                console.log(e);
              }}
            />
          </div>
          <div className="flex items-center">
            <Typography type="body" size="s" weight="bold" className="w-[222px] ml-1">
              Content Data
            </Typography>
            <FormList.DropDown
              disabled={!isEditable}
              defaultValue={''}
              items={[]}
              onChange={(e: any) => {
                console.log(e);
              }}
            />
          </div>
          <div className="flex flex-wrap gap-2 items-end justify-end">
            {arrData().map((item: number) => (
              <div
                key={item}
                className="h-[33px] px-4 rounded-full text-[14px] bg-[#F0E4F3] flex items-center justify-center">
                Testing
                <div className="ml-4">x</div>
              </div>
            ))}
          </div>
        </div>
        <div className="">
          <Typography type="body" size="s" weight="bold" className="w-[222px] ml-1">
            Narrative
          </Typography>
          <div className="flex gap-x-3">
            <FormList.TextAreaField
              disabled={!isEditable}
              // labelRequired
              wrapperClass="w-1/2"
              themeColor="primary"
              placeholder="Narrative"
              value={''}
              // error={!!attributesErrors.fieldId}
              // helperText={attributesErrors.fieldId}
              onChange={(e: any) => {
                console.log(e);
              }}
              // textAreaStyle="h-[72px]"
              border={false}
            />
            <div className="w-2/5 rounded-xl h-fit py-2 px-3 bg-[#CFE3FB] text-[#829BC7] text-xs">
              It is informed that in the Narrative, you can use parameters from the selected Content
              Type ID field, for example: [[fieldIDname]].
            </div>
          </div>
        </div>
        <div className="w-1/2">
          <Typography type="body" size="s" weight="bold" className="w-[222px] ml-1">
            Disclaimer
          </Typography>
          <FormList.TextAreaField
            disabled={!isEditable}
            // labelRequired
            themeColor="primary"
            placeholder="Disclaimere"
            value={''}
            // error={!!attributesErrors.fieldId}
            // helperText={attributesErrors.fieldId}
            onChange={(e: any) => {
              console.log(e);
            }}
            // textAreaStyle="h-[72px]"
            border={false}
          />
        </div>
      </div>
      <div className="flex gap-2 justify-end items-center">
        <div className={styleButton({ variants: 'third' })} onClick={() => {}}>
          Cancel
        </div>
        <div
          className={styleButton({ variants: 'secondary', disabled: !isEditable })}
          onClick={() => {
            setEditable(false);
          }}>
          Save as Draft
        </div>
        <div
          className={styleButton({ variants: 'success', disabled: !isEditable })}
          onClick={() => {
            setEditable(false);
          }}>
          Save
        </div>
      </div>
    </TitleCard>
  );
};

export default LeadsGeneratorResultDetail;
