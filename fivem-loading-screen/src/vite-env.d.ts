/// <reference types="vite/client" />
  declare module '*.mp3' {
    const src: string;
    export default src;
  }
  
  declare module '*.mp4' {
    const src: string;
    export default src;
  }
  
  declare module '*.svg' {
    const content: string;
    export default content;
  }
  
  
  interface Window {
    nuiHandoverData: {
      name: string;
      serverAddress?: string;
    };
  }

  declare function GetParentResourceName(): string;
