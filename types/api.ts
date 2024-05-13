export interface Result<T = any> {
  status: number;
  statusText: string;
  data?: T;
}
