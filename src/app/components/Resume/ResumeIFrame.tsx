"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Frame from "react-frame-component";
import {
  A4_HEIGHT_PT,
  A4_HEIGHT_PX,
  A4_WIDTH_PX,
  A4_WIDTH_PT,
  LETTER_HEIGHT_PT,
  LETTER_HEIGHT_PX,
  LETTER_WIDTH_PX,
  LETTER_WIDTH_PT,
} from "lib/constants";
import dynamic from "next/dynamic";
import { getAllFontFamiliesToLoad } from "components/fonts/lib";

const getIframeInitialContent = (isA4: boolean) => {
  const width = isA4 ? A4_WIDTH_PT : LETTER_WIDTH_PT;
  const pageHeightPt = isA4 ? A4_HEIGHT_PT : LETTER_HEIGHT_PT;
  const allFontFamilies = getAllFontFamiliesToLoad();

  const allFontFamiliesPreloadLinks = allFontFamilies
    .map(
      (
        font
      ) => `<link rel="preload" as="font" href="/fonts/${font}-Regular.ttf" type="font/ttf" crossorigin="anonymous">
<link rel="preload" as="font" href="/fonts/${font}-Bold.ttf" type="font/ttf" crossorigin="anonymous">`
    )
    .join("");

  const allFontFamiliesFontFaces = allFontFamilies
    .map(
      (
        font
      ) => `@font-face {font-family: "${font}"; src: url("/fonts/${font}-Regular.ttf");}
@font-face {font-family: "${font}"; src: url("/fonts/${font}-Bold.ttf"); font-weight: bold;}`
    )
    .join("");

  // Page-boundary visual indicator: a thin grey line painted at every
  // pageHeight on the body background. Approximates where react-pdf will
  // start a new page in the downloaded PDF.
  const pageBoundaryStyle = `
    body {
      background-image: repeating-linear-gradient(
        to bottom,
        transparent 0,
        transparent calc(${pageHeightPt}pt - 1px),
        #cbd5e1 calc(${pageHeightPt}pt - 1px),
        #cbd5e1 ${pageHeightPt}pt
      );
    }
  `;

  return `<!DOCTYPE html>
<html>
  <head>
    ${allFontFamiliesPreloadLinks}
    <style>
      ${allFontFamiliesFontFaces}
      ${pageBoundaryStyle}
    </style>
  </head>
  <body style='width: ${width}pt; margin: 0; padding: 0; -webkit-text-size-adjust:none;'>
    <div></div>
  </body>
</html>`;
};

/**
 * Iframe is used here for style isolation, since react pdf uses pt unit.
 * It creates a sandbox document body that uses letter/A4 pt size as width.
 * The wrapper auto-sizes vertically to the iframe content so multi-page
 * resumes are visible in the preview, with page-boundary lines drawn at
 * every pageHeight.
 */
const ResumeIframe = ({
  documentSize,
  scale,
  children,
  enablePDFViewer = false,
}: {
  documentSize: string;
  scale: number;
  children: React.ReactNode;
  enablePDFViewer?: boolean;
}) => {
  const isA4 = documentSize === "A4";
  const pageWidthPx = isA4 ? A4_WIDTH_PX : LETTER_WIDTH_PX;
  const pageHeightPx = isA4 ? A4_HEIGHT_PX : LETTER_HEIGHT_PX;

  const iframeInitialContent = useMemo(
    () => getIframeInitialContent(isA4),
    [isA4]
  );

  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const observerRef = useRef<ResizeObserver | null>(null);
  const [contentHeightPx, setContentHeightPx] = useState<number>(pageHeightPx);

  // Attach a ResizeObserver to the iframe body exactly once on mount. The
  // observer fires naturally on body resize, so re-attaching on every
  // update would create a re-render loop. We also gate setState with a
  // 1px tolerance to absorb sub-pixel measurement jitter.
  const attachObserver = useCallback(() => {
    const iframe = iframeRef.current;
    const body = iframe?.contentDocument?.body;
    if (!body) return;
    observerRef.current?.disconnect();
    const update = () => {
      const next = Math.max(pageHeightPx, body.scrollHeight);
      setContentHeightPx((prev) => (Math.abs(prev - next) < 1 ? prev : next));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(body);
    observerRef.current = observer;
  }, [pageHeightPx]);

  useEffect(() => {
    return () => observerRef.current?.disconnect();
  }, []);

  if (enablePDFViewer) {
    return (
      <DynamicPDFViewer className="h-full w-full">
        {children as any}
      </DynamicPDFViewer>
    );
  }

  return (
    <div
      style={{
        maxWidth: `${pageWidthPx * scale}px`,
        maxHeight: `${contentHeightPx * scale}px`,
      }}
    >
      <div
        style={{
          width: `${pageWidthPx}px`,
          height: `${contentHeightPx}px`,
          transform: `scale(${scale})`,
        }}
        className={`origin-top-left bg-white shadow-lg`}
      >
        <Frame
          ref={iframeRef}
          style={{ width: "100%", height: "100%" }}
          initialContent={iframeInitialContent}
          contentDidMount={attachObserver}
          // key is used to force component to re-mount when document size changes
          key={isA4 ? "A4" : "LETTER"}
        >
          {children}
        </Frame>
      </div>
    </div>
  );
};

/**
 * Load iframe client side since iframe can't be SSR
 */
export const ResumeIframeCSR = dynamic(() => Promise.resolve(ResumeIframe), {
  ssr: false,
});

// PDFViewer is only used for debugging. Its size is quite large, so we make it dynamic import
const DynamicPDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((module) => module.PDFViewer),
  {
    ssr: false,
  }
);
