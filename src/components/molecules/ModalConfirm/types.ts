export interface IModalConfirm {
  open: boolean;
  submitTitle: string;
  cancelTitle: string;
  message: string;
  title: string;
  loading?: boolean;
  icon: any;
  submitAction: () => void;
  cancelAction: () => void;
  btnType: string;
}
