import ImageIcon from "../../../../assets/efb/image.svg";

const Image = () => {
  return (
    <div className="min-h-[65px] flex flex-row justify-between items-center py-2 px-4 bg-light-purple-2 rounded-xl">
      <p className="font-bold text-sm">Image</p>
      <div className="w-[28px] h-[28px] flex justify-center items-center">
        <img src={ImageIcon} className="w-[28px] h-[28px]" />
      </div>
    </div>
  )
};

export default Image;
