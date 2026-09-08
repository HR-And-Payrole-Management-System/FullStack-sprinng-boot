import { useState } from "react";

export default function LazyImage({ src, alt, className, ...props }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onLoad={() => setLoaded(true)}
      className={`${className} transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
      {...props}
    />
  );
}