export interface IModalConfirm {
  modalHeight?: number;
  modalWidth?: number;
  open: boolean;
  submitTitle: string;
  cancelTitle: string;
  message?: string;
  title: string;
  loading?: boolean;
  icon: any;
  iconSize?: number;
  submitAction: () => void;
  cancelAction: () => void;
  btnSubmitStyle?: string;
  children?: any;
}
