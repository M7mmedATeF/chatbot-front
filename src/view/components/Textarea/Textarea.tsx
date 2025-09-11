import React from "react";
import styles from "./Textarea.module.css";

type InputProps = {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = ({
  placeholder,
  value,
  onChange,
  error,
  ...props
}: InputProps) => {
  return (
    <label className={styles.input}>
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        {...props}
      />
      {error && <small className={styles.error}>{error}</small>}
    </label>
  );
};

export default Textarea;
