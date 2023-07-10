import CheckIcon from "../../../assets/efb/check.svg";

const Checkbox = () => {
  return (
    <div className="min-h-[65px] flex flex-row justify-between items-center py-2 px-4 bg-light-purple-2 rounded-xl">
      <p className="font-bold text-sm">CheckBox</p>
      <div className="w-[28px] h-[28px] flex justify-center items-center">
        <img src={CheckIcon} className="w-[20px] h-[20px]" />
      </div>
    </div>
  )
};

export default Checkbox;
