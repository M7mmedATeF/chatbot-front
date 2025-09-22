import React, { useState, useRef } from "react";
import styles from "./FileInput.module.css";
import Button from "../Button/Button";
import { PiArrowUp } from "react-icons/pi";
import { uploadMcpFile } from "../../../services/File.service";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onRemove?: (value: string) => void;
  label?: string;
  error?: string;
};

const FileInput = ({
  placeholder,
  value,
  onChange,
  label,
  error,
  onRemove = () => {},
  ...props
}: InputProps) => {
  const [progress, setProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setProgress(0);

    try {
      const response = await uploadMcpFile(file, {
        onUploadProgress: (event: any) => {
          if (event.total) {
            const percent = Math.round((event.loaded * 100) / event.total);
            setProgress(percent);
          }
        },
      });

      if (response.success && response.data?.file_path) {
        onChange?.(response.data.file_path);
      }
    } catch (error) {
      console.error("MCP file upload failed:", error);
      setProgress(0);
    } finally {
      setIsUploading(false);
      setProgress(100);
      // Reset progress after a short delay
      setTimeout(() => setProgress(0), 2000);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  return (
    <div className={styles.inputWrapper}>
      <input
        ref={fileInputRef}
        style={{
          display: "none",
        }}
        type="file"
        name="file"
        id="file"
        disabled={isUploading}
        {...props}
        onChange={handleFileChange}
      />
      <label className={styles.input}>
        {label && <span className={styles.label}>{label}</span>}
        <div className={styles.controls}>
          <input
            type="text"
            placeholder={placeholder}
            value={value}
            {...props}
            onChange={(e) => {
              onChange?.(e.target.value);
            }}
          />
          <Button
            theme="primary"
            className="tooltip"
            data-tooltip={isUploading ? "Uploading..." : "Upload File"}
            tabIndex={-1}
            onClick={handleUploadClick}
            disabled={isUploading}
          >
            <PiArrowUp />
          </Button>
        </div>
      </label>
      {error && <small className={styles.error}>{error}</small>}
      <div className={styles.progress}>
        <div className={styles.bar} style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
};

export default FileInput;
