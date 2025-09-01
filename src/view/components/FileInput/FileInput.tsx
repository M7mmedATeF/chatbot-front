import React from "react";
import styles from "./FileInput.module.css";
import Button from "../Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { faFile } from "@fortawesome/free-regular-svg-icons";

type InputProps = {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
};

const FileInput = ({ placeholder, value, onChange }: InputProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className={styles.fileInput}>
      <label className={styles.input}>
        <div className={styles.fileDropdown}>
          <span>
            <FontAwesomeIcon icon={faAngleDown} />
          </span>
          <div className={styles.fileList}>
            <div className={styles.fileItem}>
              <div className={styles.fileItemIcon}>
                <FontAwesomeIcon icon={faFile} />
              </div>
              <p>Filename</p>
            </div>
          </div>
        </div>
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
        />
        <input
          ref={inputRef}
          type="file"
          style={{
            display: "none",
          }}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
        />
        <Button onClick={handleButtonClick}>+</Button>
      </label>
    </div>
  );
};

export default FileInput;
