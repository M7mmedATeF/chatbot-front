import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import style from "./Modal.module.css";
import Button from "../Button/Button";
import Loader from "../Loader/Loader";

type modalProps = {
  children: React.ReactNode;
  title: string;
  open: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  onSave?: () => void;
  onClose: () => void;
  onReset?: () => void;
  isLoading?: boolean;
  cancellable?: boolean;
};

const Modal = ({
  open = false,
  className,
  children,
  title,
  onSave,
  onReset,
  onClose,
  size = "sm",
  isLoading = false,
  cancellable = false,
}: modalProps) => {
  return (
    <div
      className={`${style.modalContainer} ${
        open ? style.open : ""
      } ${className}`}
      onClick={onClose}
    >
      <div
        className={`${style.modalBox} ${style[size]}`}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className={style.modalHeader}>
          <h2>{title}</h2>
          <Button className={style.modalClose} onClick={onClose}>
            <FontAwesomeIcon icon={faXmark} />
          </Button>
        </div>
        <div className={style.modalBody}>{children}</div>
        {(onReset || onSave) && (
          <div className={style.modalFooter}>
            {onReset && <Button onClick={onReset}>Reset</Button>}
            {onSave && (
              <Button theme="primary" onClick={onSave} disabled={isLoading}>
                {isLoading ? <Loader /> : "Save"}
              </Button>
            )}
            {cancellable && (
              <Button theme="danger" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
