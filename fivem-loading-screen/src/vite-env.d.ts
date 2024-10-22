/// <reference types="vite/client" />

interface ImportMetaEnv {
    VITE_RESOURCE_NAME: string;
    VITE_CLOSE_KEY: string;
    // add any other environment variables you need here
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }


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
  
  
  

  declare function GetParentResourceName(): string;
