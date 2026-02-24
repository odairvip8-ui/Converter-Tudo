import React, { useEffect, useRef } from 'react';

export function AdBanner() {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bannerRef.current && !bannerRef.current.firstChild) {
      const script = document.createElement('script');
      const configScript = document.createElement('script');
      
      configScript.innerHTML = `
        atOptions = {
          'key' : '6a114d56f4c30d0e87a20ce217d32787',
          'format' : 'iframe',
          'height' : 60,
          'width' : 468,
          'params' : {}
        };
      `;
      
      script.src = "https://www.highperformanceformat.com/6a114d56f4c30d0e87a20ce217d32787/invoke.js";
      script.async = true;

      bannerRef.current.appendChild(configScript);
      bannerRef.current.appendChild(script);
    }
  }, []);

  return (
    <div className="flex justify-center py-8 bg-bg-darker/50 border-y border-white/5">
      <div ref={bannerRef} className="min-h-[60px] min-w-[468px]"></div>
    </div>
  );
}
