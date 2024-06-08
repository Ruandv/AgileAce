export interface ModalProps {
    title: string;
    close: () => void;
    content: JSX.Element;
    actions: JSX.Element;
  }