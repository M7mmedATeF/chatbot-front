import React, { useState } from "react";
import styles from "./ImageInput.module.css";
import Image from "../Image/Image";
import { uploadFile } from "../../../services/File.service";
import CircularProgress from "../CircularProgress/CircularProgress";

type ImageInputProps = {
  preview?: string;
  value?: string;
  onChange?: (value: string) => void;
  accept?: string;
} & React.HTMLAttributes<HTMLInputElement>;

const ImageInput = ({ value, onChange, ...props }: ImageInputProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const response = await uploadFile(file, {
        onUploadProgress: (event) => {
          if (event.total) {
            const percent = Math.round((event.loaded * 100) / event.total);
            console.log(percent);

            setProgress(percent);
          }
        },
      });
      if (response.success && response.data?.file_path) {
        onChange?.(response.data.file_path);
      }
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <label htmlFor="image" className={styles.image_input}>
      <Image src={value} alt="image" />
      {isUploading && (
        <div className={styles.upload_overlay}>
          <CircularProgress progress={progress} />
        </div>
      )}
      <input
        type="file"
        name="image"
        id="image"
        accept="image/*"
        disabled={isUploading}
        {...props}
        onChange={handleImageChange}
      />
    </label>
  );
};

export default ImageInput;
