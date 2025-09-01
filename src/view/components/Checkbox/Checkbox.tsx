import React from "react";
import style from "./Checkbox.module.css";

type CheckboxProps = {
  children: React.ReactNode;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  theme?: "primary" | "secondary" | "success" | "warning" | "danger";
};

const Checkbox = ({ children, checked, onChange, theme }: CheckboxProps) => {
  return (
    <label
      className={`${style.checkbox} ${checked ? style.checked : ""} ${
        theme ? style[theme] : ""
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
      />
      <span>{children}</span>
    </label>
  );
};

export default Checkbox;
