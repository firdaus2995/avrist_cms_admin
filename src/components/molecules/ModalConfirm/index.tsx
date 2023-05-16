import Modal from '../../atoms/Modal';
import { IModalConfirm } from './types';
export default function ModalConfirmLeave(props: IModalConfirm) {
  const { open, submitTitle, cancelTitle, message, loading, submitAction, cancelAction } = props;
  return (
    <Modal open={open} toggle={() => null} title="" width={432} height={242}>
      <div>
        <p className="text-base mb-3">{message}</p>
        <div className="flex justify-center gap-3 w-full">
          <button className="btn btn-outline btn-md" onClick={cancelAction}>
            {cancelTitle}
          </button>
          <button className="btn btn-error btn-md" onClick={submitAction}>
            {loading ? 'Loading...' : submitTitle}
          </button>
        </div>
      </div>
    </Modal>
  );
}
