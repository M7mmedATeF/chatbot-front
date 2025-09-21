import React from "react";
import styles from "./Toggle.module.css";

type ToggleProps = {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  theme?:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | "tertiary";
} & React.InputHTMLAttributes<HTMLInputElement>;

const Toggle = ({
  checked,
  onChange,
  className,
  theme = "primary",
  ...props
}: ToggleProps) => {
  return (
    <label className={`${className} ${styles.toggle} ${styles[theme]}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        {...props}
      />
      <span></span>
    </label>
  );
};

export default Toggle;
