import React, { useState } from 'react'

const ImageFallback = ({ src, fallbackSrc, alt, ...props }) => {
    const [imgsrc, setImgSrc] = useState(src);
  return (
    <img src={imgsrc} alt={alt} onError={ () => setImgSrc(fallbackSrc)} {...props}/>
  )
}

export default ImageFallback;
