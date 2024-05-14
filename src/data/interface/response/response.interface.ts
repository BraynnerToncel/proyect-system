export interface IResponse<T> {
  status: number;
  message: string;
  result: T;
}
