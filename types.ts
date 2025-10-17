
export interface ImageData {
  dataUrl: string;
  mimeType: string;
  base64: string;
}

export enum EditOperation {
  RemoveBackground = 'REMOVE_BACKGROUND',
  ReplaceBackground = 'REPLACE_BACKGROUND',
  Colorize = 'COLORIZE',
  Enhance = 'ENHANCE',
  AddObject = 'ADD_OBJECT',
  RemoveObject = 'REMOVE_OBJECT',
}
