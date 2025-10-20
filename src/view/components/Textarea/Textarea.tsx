import React from "react";
import styles from "./Textarea.module.css";

type InputProps = {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  label?: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = ({
  placeholder,
  value,
  onChange,
  error,
  label,
  ...props
}: InputProps) => {
  return (
    <div className={styles.input}>
      <label>
        {label && <span className={styles.label}>{label}</span>}
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          {...props}
        />
      </label>
      {error && <small className={styles.error}>{error}</small>}
    </div>
  );
};

export default Textarea;
