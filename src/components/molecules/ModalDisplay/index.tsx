import Modal from '../../atoms/Modal';
import CloseIcon from '../../../assets/close.png';
import { IModalDisplay } from './types';

export default function ModalDisplay({
  open,
  width,
  height,
  title,
  cancelAction,
  children,
}: IModalDisplay) {
  const Header = () => {
    return (
      <div className="flex justify-between px-4 py-4">
        <p className="text-2xl font-bold">{title}</p>
        <img src={CloseIcon} className="cursor-pointer w-[20px] h-[20px]" onClick={cancelAction} />
      </div>
    );
  };
  return (
    <Modal
      open={open}
      toggle={() => null}
      title=""
      width={width ?? 725}
      height={height}
      header={<Header />}>
      <div className="p-2 flex flex-col gap-6">
        <div className="flex flex-col gap-3">{children}</div>
      </div>
    </Modal>
  );
}
