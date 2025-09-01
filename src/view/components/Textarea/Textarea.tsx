import React from "react";
import styles from "./Textarea.module.css";

type InputProps = {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = ({ placeholder, value, onChange, ...props }: InputProps) => {
  return (
    <label className={styles.input}>
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        {...props}
      />
    </label>
  );
};

export default Textarea;
