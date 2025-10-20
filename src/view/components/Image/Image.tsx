import React, { useEffect, useState } from "react";
import brokenIMG from "../../../assets/images/broken.jpg";

const Image = ({
  src,
  alt,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) => {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    if (!src) {
      setImgSrc(brokenIMG);
    } else {
      const img = src?.startsWith("uploads")
        ? `${import.meta.env.VITE_API_URL}/${src}`
        : src;

      setImgSrc(img);
    }
  }, [src]);

  const handleError = () => {
    setImgSrc(brokenIMG);
  };

  return (
    <>
      <img
        src={imgSrc}
        alt={alt || "Image"}
        style={{ background: "#fff" }}
        {...props}
        onError={handleError}
      />
    </>
  );
};

export default Image;
