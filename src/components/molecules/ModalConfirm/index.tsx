import Modal from '../../atoms/Modal';
import { IModalConfirm } from './types';
export default function ModalConfirm(props: IModalConfirm) {
  const {
    open,
    modalHeight,
    modalWidth,
    icon,
    iconSize = 48,
    title,
    titleSize,
    message,
    submitTitle,
    cancelTitle,
    loading,
    submitAction,
    cancelAction,
    btnSubmitStyle,
    children,
  } = props;
  return (
    <Modal
      open={open}
      toggle={() => null}
      title=""
      width={modalWidth ?? 432}
      height={modalHeight ?? 320}>
      <div className="py-2 flex flex-col items-center justify-center gap-3">
        {icon ? (
          typeof icon === 'object' ? (
            icon
          ) : (
            <img src={icon} alt="iconModal" className={`h-[${iconSize}px]`} />
          )
        ) : (
          <div />
        )}
        <p
          className={`${!titleSize ? 'text-xl' : ''} font-bold text-center`}
          style={{ fontSize: titleSize }}>
          {title}
        </p>
        {message && <div className="text-sm text-center whitespace-pre-wrap">{message}</div>}
        {children && children}
        <div className="flex justify-center gap-3 w-full mt-3">
          {cancelTitle !== '' && (
            <button
              className="btn btn-outline rounded-xl w-[105px] min-h-0 h-[40px]"
              onClick={cancelAction}>
              {cancelTitle}
            </button>
          )}
          <button
            className={`btn ${btnSubmitStyle ?? ''} rounded-xl w-[105px] min-h-0 h-[40px]`}
            onClick={submitAction}>
            {loading ? 'Loading...' : submitTitle}
          </button>
        </div>
      </div>
    </Modal>
  );
}
