import Modal from "../../atoms/Modal";
import CloseIcon from "../../../assets/close.png";
import {
  IModalDisplay,
} from "./types";

export default function ModalDisplay ({
  open,
  width,
  height,
  title,
  cancelAction,
  children,
}: IModalDisplay ) {
  return (
    <Modal
      open={open}
      toggle={() => null}
      title=""
      width={width ?? 725}
      height={height}
    >
      <div className="p-2 flex flex-col gap-6">
        <div className="flex justify-between">
          <p className="text-2xl font-bold">{title}</p>
          <img src={CloseIcon} className="cursor-pointer w-[18px] h-[18px]" onClick={cancelAction} />
        </div>
        <div className="flex flex-col gap-3">
          {
            children
          }
        </div>
      </div>
    </Modal>
  )
}
