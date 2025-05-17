/// <reference types="vite/client" />

// Define the Spline viewer custom element for TypeScript
declare namespace JSX {
  interface IntrinsicElements {
    'spline-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      url?: string;
      'loading-anim-type'?: string;
    };
  }
}
