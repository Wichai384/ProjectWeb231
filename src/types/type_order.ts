import type { InfoProduct } from "./type_infoProduct";

export type OrderStatus =
  | "Reserved"
  | "Sold";

export type Order = {
  id: string;
  product: InfoProduct;
  buyerName: string;
  buyerEmail: string;
  shippingAddress: string;
  phone: string;
  status: OrderStatus;
  notificationRead: boolean;
};