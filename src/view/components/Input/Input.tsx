import React from "react";
import styles from "./Input.module.css";

type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> & {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  error?: string;
};

const Input = ({
  placeholder,
  value,
  onChange,
  label,
  error,
  ...props
}: InputProps) => {
  return (
    <div className={styles.inputWrapper}>
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
      {error && <small className={styles.error}>{error}</small>}
    </div>
  );
};

export default Input;
