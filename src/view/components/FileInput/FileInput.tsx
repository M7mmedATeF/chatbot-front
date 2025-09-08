import React, { useState } from "react";
import styles from "./FileInput.module.css";
import Button from "../Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { faFile } from "@fortawesome/free-regular-svg-icons";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { uploadFile } from "../../../services/File.service";

type InputProps = {
  onChange?: (value: string) => void;
};

const FileInput = ({ onChange }: InputProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const response = await uploadFile(file);
      if (response.success && response.data?.file_path) {
        onChange?.(response.data.file_path);
      }
    } catch (error) {
      console.error("File upload failed:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsUploading(false);
    }
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
          ref={inputRef}
          type="file"
          style={{
            display: "none",
          }}
          onChange={handleFileChange}
        />
        <Button onClick={handleButtonClick} disabled={isUploading}>
          {isUploading ? <FontAwesomeIcon icon={faSpinner} spin /> : "+"}
        </Button>
      </label>
    </div>
  );
};

export default FileInput;
