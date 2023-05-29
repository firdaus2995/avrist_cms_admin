import Modal from '../../atoms/Modal';
import { IModalConfirm } from './types';
export default function ModalConfirmLeave(props: IModalConfirm) {
  const { open, submitTitle, cancelTitle, message, title, loading, submitAction, cancelAction, icon, btnType } = props;
  return (
    <Modal open={open} toggle={() => null} title="" width={432} height={320}>
      <div className='py-2 flex items-center justify-center flex-col'>
        <img src={icon} alt="iconModal" className="h-12 mb-3" />
        <p className="text-xl font-bold mb-3 text-center">{title}</p>
        <div className="text-sm mb-7 text-center whitespace-pre-wrap">{message}</div>
        <div className="flex justify-center gap-3 w-full">
          <button className="btn btn-outline btn-md" onClick={cancelAction}>
            {cancelTitle}
          </button>
          <button className={`btn ${btnType || 'btn-error'} btn-md`} onClick={submitAction}>
            {loading ? 'Loading...' : submitTitle}
          </button>
        </div>
      </div>
    </Modal>
  );
}
