'use client';
import { useEffect } from 'react';

export default function FBComments({ url }: { url: string }) {
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).FB) {
      (window as any).FB.XFBML.parse();
    }
  }, [url]);

  return (
    <>
      <div id="fb-root"></div>
      <div
        className="fb-comments"
        data-href={url}
        data-width="100%"
        data-numposts="5"
      />
    </>
  );
}