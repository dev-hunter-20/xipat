'use client';

import React, { useEffect } from 'react';

const GoogleAnalytics = () => {
  useEffect(() => {
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-W3WPY2DK7L';
    document.head.appendChild(script1);

    script1.onload = () => {
      const script2 = document.createElement('script');
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-W3WPY2DK7L');
      `;
      document.head.appendChild(script2);
    };

    return () => {
      document.head.removeChild(script1);
      if (script1.onload) {
        const script2 = document.head.querySelector('script[innerHTML*="gtag"]');
        if (script2) {
          document.head.removeChild(script2);
        }
      }
    };
  }, []);

  return null;
};

export default GoogleAnalytics;
