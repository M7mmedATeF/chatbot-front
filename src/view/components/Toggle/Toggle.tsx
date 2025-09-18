import React from "react";
import styles from "./Toggle.module.css";

type ToggleProps = {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Toggle = ({ checked, onChange, className, ...props }: ToggleProps) => {
  return (
    <label className={`${className} ${styles.toggle}`}>
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
