declare module 'qrcode' {
  interface QRCodeRenderOptions {
    margin?: number;
    width?: number;
    scale?: number;
    color?: {
      dark?: string;
      light?: string;
    };
  }

  export function toDataURL(
    text: string,
    options?: QRCodeRenderOptions
  ): Promise<string>;
}
