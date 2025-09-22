import React, { useState } from "react";
import styles from "./ListInput.module.css";
import Button from "../Button/Button";
import { PiX } from "react-icons/pi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  placeholder?: string;
  value: string[];
  onChange: (value: string[]) => void;
  onRemove?: (value: string) => void;
  label?: string;
  error?: string;
  NoSpaces?: boolean;
  Uppercase?: boolean;
};

const ListInput = ({
  placeholder,
  value,
  onChange,
  label,
  error,
  NoSpaces = false,
  Uppercase = false,
  onRemove = () => {},
  ...props
}: InputProps) => {
  const [text, setText] = useState<string>("");

  const addValue = () => {
    if (text.trim() === "") return;

    onChange?.([
      ...(value ? value : []),
      (Uppercase ? text.toUpperCase() : text)
        .trim()
        .replaceAll(" ", NoSpaces ? "_" : " "),
    ]);
    setText("");
  };

  const removeValue = (idx: number) => {
    const val = value[idx];
    onRemove(val);
    onChange?.([...value.filter((_, i) => i !== idx)]);
  };

  return (
    <div className={styles.inputWrapper}>
      <label className={styles.input}>
        {label && <span className={styles.label}>{label}</span>}
        <div className={styles.controls}>
          <input
            type="text"
            placeholder={placeholder}
            value={text}
            {...props}
            onChange={(e) => {
              setText(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addValue();
              }
            }}
          />
          <Button theme="primary" onClick={addValue} tabIndex={-1}>
            <FontAwesomeIcon icon={faPlus} />
          </Button>
        </div>
      </label>
      {error && <small className={styles.error}>{error}</small>}
      {value && value.length > 0 && (
        <div className={styles.itemsList}>
          {value.map((v, idx) => (
            <div className="glass-bg" key={idx}>
              <Button theme="danger" onClick={() => removeValue(idx)}>
                <PiX />
              </Button>
              {v}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListInput;
