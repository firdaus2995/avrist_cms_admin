import Modal from "../../atoms/Modal";
import CloseIcon from "../../../assets/close.png";
import {
  IModalForm,
} from "./types";

export default function ModalForm ({
  open,
  width,
  height,
  formTitle,
  submitTitle,
  cancelTitle,
  loading,
  submitAction,
  cancelAction,
  children,
}: IModalForm ) {
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
          <p className="text-2xl font-bold">{formTitle}</p>
          <img src={CloseIcon} className="cursor-pointer w-[18px] h-[18px]" onClick={cancelAction} />
        </div>
        <div className="flex flex-col gap-3 items-center">
          {
            children
          }
        </div>
        <div className="flex justify-end gap-3">
          <button className="btn btn-outline w-[105px]" onClick={cancelAction}>
            {cancelTitle}
          </button>
          <button className="btn btn-success w-[105px]" onClick={submitAction}>
            {loading ? 'Loading...' : submitTitle}
          </button>
        </div>
      </div>
    </Modal>
  )
}