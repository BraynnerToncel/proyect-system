export interface IFile {
  fileName: string;
  fileLength: number;
  fileUrl: string;
  fileType: string;
}

export interface IFindOneFile {
  fileName: string;
  fileType: string;
}
export type IDeleteFile = Pick<IFile, 'fileName' | 'fileType'>;
