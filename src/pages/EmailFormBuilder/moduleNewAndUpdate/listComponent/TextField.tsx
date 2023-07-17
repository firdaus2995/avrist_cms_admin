import TextFieldIcon from "../../../../assets/efb/text.svg";

const TextField = () => {
  return (
    <div className="min-h-[65px] flex flex-row justify-between items-center py-2 px-4 bg-light-purple-2 rounded-xl">
      <p className="font-bold text-sm">Text Field</p>
      <div className="w-[28px] h-[28px] flex justify-center items-center">
        <img src={TextFieldIcon} className="w-[28px] h-[28px]" />
      </div>
    </div>
  )
};

export default TextField;
