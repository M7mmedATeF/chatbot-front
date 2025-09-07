import React, { useEffect, useState } from "react";
import styles from "./ImageInput.module.css";
import Image from "../Image/Image";

type ImageInputProps = {
  preview?: string;
  value?: File[];
  onChange?: (value: string) => void;
} & React.HTMLAttributes<HTMLInputElement>;

const ImageInput = ({
  value,
  onChange,
  preview,
  ...props
}: ImageInputProps) => {
  const [imgSrc, setImgSrc] = useState<string>("");

  useEffect(() => {
    if (preview && !value) {
      setImgSrc(preview);
    }
  }, [preview]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImgSrc(url);
      onChange?.("test");
    }
  };

  return (
    <label htmlFor="image" className={styles.image_input}>
      <Image src={imgSrc} alt="image" />
      <input
        type="file"
        name="image"
        id="image"
        accept="image/*"
        {...props}
        onChange={handleImageChange}
      />
    </label>
  );
};

export default ImageInput;
