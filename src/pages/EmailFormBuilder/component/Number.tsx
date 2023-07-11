import NumberIcon from "../../../assets/efb/number.svg";

const Number = () => {
  return (
    <div className="min-h-[65px] flex flex-row justify-between items-center py-2 px-4 bg-light-purple-2 rounded-xl">
      <p className="font-bold text-sm">Number</p>
      <div className="w-[28px] h-[28px] flex justify-center items-center">
        <img src={NumberIcon} className="w-[28px] h-[28px]" />
      </div>
    </div>
  )
};

export default Number;
