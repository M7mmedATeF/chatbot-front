import React from "react";
import styles from "./Input.module.css";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
};

const Input = ({
  placeholder,
  value,
  onChange,
  label,
  ...props
}: InputProps) => {
  return (
    <label className={styles.input}>
      {label && <span className={styles.label}>{label}</span>}
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        {...props}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </label>
  );
};

export default Input;
