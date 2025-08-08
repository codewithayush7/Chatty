import { useState } from "react";
import { generateAvatarUrl } from "../lib/avatarUtils";

const Avatar = ({
  src,
  userId, // Add userId prop for generating Dicebear avatars
  alt = "Avatar",
  className = "",
  fallbackSrc = "/avatar.svg",
  size = "size-12",
}) => {
  // Priority: custom src -> Dicebear generated -> fallback
  const primarySrc = src || (userId ? generateAvatarUrl(userId) : fallbackSrc);
  const [imgSrc, setImgSrc] = useState(primarySrc);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      // If the primary source fails, try fallback
      if (imgSrc !== fallbackSrc) {
        setImgSrc(fallbackSrc);
      }
    }
  };

  const handleLoad = () => {
    setHasError(false);
  };

  return (
    <div className={`avatar ${size} ${className}`}>
      <img
        src={imgSrc || fallbackSrc}
        alt={alt}
        onError={handleError}
        onLoad={handleLoad}
        className="rounded-full"
      />
    </div>
  );
};

export default Avatar;
