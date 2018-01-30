export interface IPeople {
  isFetching?: boolean;
  people?: IPerson[];
  error?: boolean;
  message?: any;
}

export interface IPeopleAction {
  type: string;
  payload?: {
    people?: IPerson[];
    message?: any;
  };
}

export interface IPerson {
  key: string;
  doc_count: number;
}
