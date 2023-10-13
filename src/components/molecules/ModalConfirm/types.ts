export interface IModalConfirm {
  modalHeight?: number | string;
  modalWidth?: number | string;
  open: boolean;
  submitTitle: string;
  cancelTitle: string;
  message?: string;
  title: string;
  titleSize?: number;
  loading?: boolean;
  icon: any;
  iconSize?: number;
  submitAction: () => void;
  cancelAction: () => void;
  btnSubmitStyle?: string;
  children?: any;
}
