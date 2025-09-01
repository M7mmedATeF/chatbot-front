import React from "react";
import style from "./RadioButton.module.css";

type RadioButtonProps = {
  children: React.ReactNode;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  theme?: "primary" | "secondary" | "success" | "warning" | "danger";
  name?: string;
};

const RadioButton = ({
  children,
  checked,
  onChange,
  theme,
  name = "",
}: RadioButtonProps) => {
  return (
    <label
      className={`${style.checkbox} ${checked ? style.checked : ""} ${
        theme ? style[theme] : ""
      }`}
    >
      <input
        type="radio"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        name={name}
      />
      <span>{children}</span>
    </label>
  );
};

export default RadioButton;
