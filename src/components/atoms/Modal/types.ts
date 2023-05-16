export interface IModal {
  toggle: () => void;
  open: boolean;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  width?: number;
  height?: number;
  title?: React.ReactNode;
  fullscreen?: boolean;
}
