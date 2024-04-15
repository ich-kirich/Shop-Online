export interface IOrderProduct {
  id: number;
  quantity: number;
}

export interface IUserCreationAttrs {
  email: string;
  password: string;
}

export interface IProductCreationAttrs {
  name: string;
  price: number;
  quantity: number;
}

export interface IOrderCreationAttrs {
  number: number;
  price: number;
  adress: string;
  status: string;
  country: string;
  userId: number;
}

export interface IFeedbackCreationAttrs {
  text: string;
  grade: number;
  userId: number;
  productId: number;
}
