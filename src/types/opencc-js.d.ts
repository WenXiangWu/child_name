declare module 'opencc-js' {
  export interface OpenCCOptions {
    from: string;
    to: string;
  }

  export interface OpenCCConverter {
    (text: string): string;
  }

  export function Converter(options: OpenCCOptions): OpenCCConverter;
  export function ConverterFactory(options: OpenCCOptions): OpenCCConverter;
  export function CustomConverter(options: OpenCCOptions): OpenCCConverter;
  export function HTMLConverter(options: OpenCCOptions): OpenCCConverter;
  
  export const Locale: {
    from: Record<string, string[]>;
    to: Record<string, string[]>;
  };
  
  export class Trie {
    constructor();
  }
}
