import React, { useEffect, useState } from "react";
import brokenIMG from "../../../assets/images/broken.jpg";

const Image = ({
  src,
  alt,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [isBrokenImgLoaded, setIsBrokenImgLoaded] = useState(false);

  useEffect(() => {
    if (src !== imgSrc) {
      setImgSrc(src);
      setHasError(false);
    }
    if (!src) {
      setImgSrc(brokenIMG);
    }
  }, [src]);

  const handleError = () => {
    console.warn(`فشل في تحميل الصورة: ${src}`);

    if (!hasError && !isBrokenImgLoaded) {
      setHasError(true);
      setImgSrc(brokenIMG);
    }
  };

  const handleBrokenImgLoad = () => {
    setIsBrokenImgLoaded(true);
  };

  const handleBrokenImgError = () => {
    console.error("فشل في تحميل الصورة الاحتياطية أيضاً");
    setIsBrokenImgLoaded(false);
  };

  return (
    <>
      {/* صورة مخفية للتحقق من تحميل الصورة الاحتياطية */}
      {!isBrokenImgLoaded && (
        <img
          src={brokenIMG}
          alt=""
          style={{ display: "none" }}
          onLoad={handleBrokenImgLoad}
          onError={handleBrokenImgError}
        />
      )}

      <img
        src={imgSrc}
        alt={
          hasError && imgSrc === brokenIMG
            ? `${alt || "Image"} - خطأ في عرض الصورة`
            : alt || "Image"
        }
        {...props}
        onError={handleError}
      />
    </>
  );
};

export default Image;
