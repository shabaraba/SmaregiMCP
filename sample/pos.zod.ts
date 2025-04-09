import { z } from "zod";

export type Error = z.infer<typeof Error>;
export const Error = z.object({
  type: z.string(),
  title: z.string(),
  detail: z.string(),
  status: z.number(),
});

export type Pagination = z.infer<typeof Pagination>;
export const Pagination = z.object({
  limit: z.number().optional(),
  page: z.number().optional(),
  sort: z.string().optional(),
});

export type Category = z.infer<typeof Category>;
export const Category = z.object({
  categoryId: z.string(),
  categoryCode: z.union([z.string(), z.undefined()]).optional(),
  categoryName: z.string(),
  categoryAbbr: z.union([z.string(), z.undefined()]).optional(),
  displaySequence: z.union([z.string(), z.undefined()]).optional(),
  displayFlag: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional(),
  taxDivision: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.undefined()]).optional(),
  pointNotApplicable: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional(),
  taxFreeDivision: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.undefined()]).optional(),
  reduceTaxId: z.union([z.string(), z.undefined()]).optional(),
  color: z.union([z.string(), z.undefined()]).optional(),
  categoryGroupId: z.union([z.string(), z.undefined()]).optional(),
  parentCategoryId: z.union([z.string(), z.undefined()]).optional(),
  level: z.union([z.literal("1"), z.literal("2"), z.literal("3"), z.undefined()]).optional(),
  tag: z.union([z.string(), z.undefined()]).optional(),
  insDateTime: z.union([z.string(), z.undefined()]).optional(),
  updDateTime: z.union([z.string(), z.undefined()]).optional(),
});

export type CategoryGroup = z.infer<typeof CategoryGroup>;
export const CategoryGroup = z.object({
  categoryGroupId: z.string(),
  categoryGroupCode: z.union([z.string(), z.undefined()]).optional(),
  categoryGroupName: z.string(),
  displaySequence: z.union([z.string(), z.undefined()]).optional(),
  insDateTime: z.union([z.string(), z.undefined()]).optional(),
  updDateTime: z.union([z.string(), z.undefined()]).optional(),
});

export type CategoryCreate = z.infer<typeof CategoryCreate>;
export const CategoryCreate = z.object({
  categoryCode: z.union([z.string(), z.undefined()]).optional(),
  categoryName: z.string(),
  categoryAbbr: z.union([z.string(), z.undefined()]).optional(),
  displaySequence: z.union([z.string(), z.undefined()]).optional(),
  displayFlag: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional(),
  taxDivision: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.undefined()]).optional(),
  pointNotApplicable: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional(),
  taxFreeDivision: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.undefined()]).optional(),
  reduceTaxId: z.union([z.string(), z.undefined()]).optional(),
  color: z.union([z.string(), z.undefined()]).optional(),
  categoryGroupId: z.union([z.string(), z.undefined()]).optional(),
  parentCategoryId: z.union([z.string(), z.undefined()]).optional(),
  tag: z.union([z.string(), z.undefined()]).optional(),
});

export type CategoryUpdate = z.infer<typeof CategoryUpdate>;
export const CategoryUpdate = z.object({
  categoryCode: z.string().optional(),
  categoryName: z.string().optional(),
  categoryAbbr: z.string().optional(),
  displaySequence: z.string().optional(),
  displayFlag: z.union([z.literal("0"), z.literal("1")]).optional(),
  taxDivision: z.union([z.literal("0"), z.literal("1"), z.literal("2")]).optional(),
  pointNotApplicable: z.union([z.literal("0"), z.literal("1")]).optional(),
  taxFreeDivision: z.union([z.literal("0"), z.literal("1"), z.literal("2")]).optional(),
  reduceTaxId: z.string().optional(),
  color: z.string().optional(),
  categoryGroupId: z.string().optional(),
  parentCategoryId: z.string().optional(),
  tag: z.string().optional(),
});

export type CategoryGroupCreate = z.infer<typeof CategoryGroupCreate>;
export const CategoryGroupCreate = z.object({
  categoryGroupCode: z.union([z.string(), z.undefined()]).optional(),
  categoryGroupName: z.string(),
  displaySequence: z.union([z.string(), z.undefined()]).optional(),
});

export type CategoryGroupUpdate = z.infer<typeof CategoryGroupUpdate>;
export const CategoryGroupUpdate = z.object({
  categoryGroupCode: z.string().optional(),
  categoryGroupName: z.string().optional(),
  displaySequence: z.string().optional(),
});

export type Product = z.infer<typeof Product>;
export const Product = z.object({
  productId: z.string(),
  categoryId: z.string(),
  productCode: z.union([z.string(), z.undefined()]).optional(),
  productName: z.string(),
  productKana: z.union([z.string(), z.undefined()]).optional(),
  taxDivision: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.undefined()]).optional(),
  productPriceDivision: z.union([z.literal("1"), z.literal("2"), z.undefined()]).optional(),
  price: z.string(),
  customerPrice: z.union([z.string(), z.undefined()]).optional(),
  cost: z.union([z.string(), z.undefined()]).optional(),
  attribute: z.union([z.string(), z.undefined()]).optional(),
  description: z.union([z.string(), z.undefined()]).optional(),
  catchCopy: z.union([z.string(), z.undefined()]).optional(),
  size: z.union([z.string(), z.undefined()]).optional(),
  color: z.union([z.string(), z.undefined()]).optional(),
  tag: z.union([z.string(), z.undefined()]).optional(),
  groupCode: z.union([z.string(), z.undefined()]).optional(),
  url: z.union([z.string(), z.undefined()]).optional(),
  printReceiptProductName: z.union([z.string(), z.undefined()]).optional(),
  displaySequence: z.union([z.string(), z.undefined()]).optional(),
  salesDivision: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional(),
  stockControlDivision: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional(),
  displayFlag: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional(),
  division: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.undefined()]).optional(),
  productOptionGroupId: z.union([z.string(), z.undefined()]).optional(),
  pointNotApplicable: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional(),
  taxFreeDivision: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.undefined()]).optional(),
  supplierProductNo: z.union([z.string(), z.undefined()]).optional(),
  calcDiscount: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional(),
  staffDiscountRate: z.union([z.string(), z.undefined()]).optional(),
  useCategoryReduceTax: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional(),
  reduceTaxId: z.union([z.string(), z.undefined()]).optional(),
  reduceTaxPrice: z.union([z.string(), z.undefined()]).optional(),
  reduceTaxCustomerPrice: z.union([z.string(), z.undefined()]).optional(),
  orderPoint: z.union([z.string(), z.undefined()]).optional(),
  purchaseCost: z.union([z.string(), z.undefined()]).optional(),
  appStartDateTime: z.union([z.string(), z.undefined()]).optional(),
  insDateTime: z.union([z.string(), z.undefined()]).optional(),
  updDateTime: z.union([z.string(), z.undefined()]).optional(),
});

export type ProductCreate = z.infer<typeof ProductCreate>;
export const ProductCreate = z.object({
  categoryId: z.string(),
  productCode: z.union([z.string(), z.undefined()]).optional(),
  productName: z.string(),
  productKana: z.union([z.string(), z.undefined()]).optional(),
  taxDivision: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.undefined()]).optional(),
  productPriceDivision: z.union([z.literal("1"), z.literal("2"), z.undefined()]).optional(),
  price: z.string(),
  customerPrice: z.union([z.string(), z.undefined()]).optional(),
  cost: z.union([z.string(), z.undefined()]).optional(),
  attribute: z.union([z.string(), z.undefined()]).optional(),
  description: z.union([z.string(), z.undefined()]).optional(),
  catchCopy: z.union([z.string(), z.undefined()]).optional(),
  size: z.union([z.string(), z.undefined()]).optional(),
  color: z.union([z.string(), z.undefined()]).optional(),
  tag: z.union([z.string(), z.undefined()]).optional(),
  groupCode: z.union([z.string(), z.undefined()]).optional(),
  url: z.union([z.string(), z.undefined()]).optional(),
  printReceiptProductName: z.union([z.string(), z.undefined()]).optional(),
  displaySequence: z.union([z.string(), z.undefined()]).optional(),
  displayFlag: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional(),
  division: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.undefined()]).optional(),
  productOptionGroupId: z.union([z.string(), z.undefined()]).optional(),
  salesDivision: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional(),
  stockControlDivision: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional(),
  pointNotApplicable: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional(),
  taxFreeDivision: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.undefined()]).optional(),
  calcDiscount: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional(),
  staffDiscountRate: z.union([z.string(), z.undefined()]).optional(),
  useCategoryReduceTax: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional(),
  reduceTaxId: z.union([z.string(), z.undefined()]).optional(),
  reduceTaxPrice: z.union([z.string(), z.undefined()]).optional(),
  reduceTaxCustomerPrice: z.union([z.string(), z.undefined()]).optional(),
  orderPoint: z.union([z.string(), z.undefined()]).optional(),
  purchaseCost: z.union([z.string(), z.undefined()]).optional(),
  supplierProductNo: z.union([z.string(), z.undefined()]).optional(),
  appStartDateTime: z.union([z.string(), z.undefined()]).optional(),
  reserveItems: z
    .union([
      z.array(
        z.object({
          no: z.string().optional(),
          value: z.string().optional(),
        }),
      ),
      z.undefined(),
    ])
    .optional(),
  prices: z
    .union([
      z.array(
        z.object({
          storeId: z.string().optional(),
          priceDivision: z.union([z.literal("1"), z.literal("2")]).optional(),
          startDate: z.string().optional(),
          endDate: z.string().optional(),
          price: z.string().optional(),
        }),
      ),
      z.undefined(),
    ])
    .optional(),
  stores: z
    .union([
      z.array(
        z.object({
          storeId: z.string().optional(),
          productOptionGroupId: z.string().optional(),
          assignDivision: z.union([z.literal("0"), z.literal("1")]).optional(),
        }),
      ),
      z.undefined(),
    ])
    .optional(),
  inventoryReservations: z
    .union([
      z.array(
        z.object({
          reservationProductId: z.string().optional(),
          reservationAmount: z.string().optional(),
        }),
      ),
      z.undefined(),
    ])
    .optional(),
  attributeItems: z
    .union([
      z.array(
        z.object({
          code: z.string().optional(),
          no: z.string().optional(),
        }),
      ),
      z.undefined(),
    ])
    .optional(),
  orderSetting: z
    .union([
      z.object({
        continuationDivision: z.string().optional(),
        orderStatusDivision: z.union([z.literal("0"), z.literal("1")]).optional(),
        orderNoReasonDivision: z.string().optional(),
        orderUnit: z
          .object({
            division: z.union([z.literal("0"), z.literal("1")]).optional(),
            num: z.string().optional(),
            name: z.string().optional(),
          })
          .optional(),
        orderLimitAmount: z.string().optional(),
        orderSupplierEditable: z.union([z.literal("0"), z.literal("1")]).optional(),
        pbDivision: z.union([z.literal("0"), z.literal("1")]).optional(),
        displayFlag: z.union([z.literal("0"), z.literal("1")]).optional(),
        stores: z
          .array(
            z.object({
              storeId: z.string().optional(),
              orderLimitAmount: z.string().optional(),
              displayFlag: z.union([z.literal("-1"), z.literal("0"), z.literal("1")]).optional(),
            }),
          )
          .optional(),
      }),
      z.undefined(),
    ])
    .optional(),
});

export type ProductUpdate = z.infer<typeof ProductUpdate>;
export const ProductUpdate = z.object({
  categoryId: z.string().optional(),
  productCode: z.string().optional(),
  productName: z.string().optional(),
  productKana: z.string().optional(),
  taxDivision: z.union([z.literal("0"), z.literal("1"), z.literal("2")]).optional(),
  productPriceDivision: z.union([z.literal("1"), z.literal("2")]).optional(),
  price: z.string().optional(),
  customerPrice: z.string().optional(),
  cost: z.string().optional(),
  attribute: z.string().optional(),
  description: z.string().optional(),
  catchCopy: z.string().optional(),
  size: z.string().optional(),
  color: z.string().optional(),
  tag: z.string().optional(),
  groupCode: z.string().optional(),
  url: z.string().optional(),
  printReceiptProductName: z.string().optional(),
  displaySequence: z.string().optional(),
  displayFlag: z.union([z.literal("0"), z.literal("1")]).optional(),
  division: z.union([z.literal("0"), z.literal("1"), z.literal("2")]).optional(),
  productOptionGroupId: z.string().optional(),
  salesDivision: z.union([z.literal("0"), z.literal("1")]).optional(),
  stockControlDivision: z.union([z.literal("0"), z.literal("1")]).optional(),
  pointNotApplicable: z.union([z.literal("0"), z.literal("1")]).optional(),
  taxFreeDivision: z.union([z.literal("0"), z.literal("1"), z.literal("2")]).optional(),
  calcDiscount: z.union([z.literal("0"), z.literal("1")]).optional(),
  staffDiscountRate: z.string().optional(),
  useCategoryReduceTax: z.union([z.literal("0"), z.literal("1")]).optional(),
  reduceTaxId: z.string().optional(),
  reduceTaxPrice: z.string().optional(),
  reduceTaxCustomerPrice: z.string().optional(),
  orderPoint: z.string().optional(),
  purchaseCost: z.string().optional(),
  supplierProductNo: z.string().optional(),
  appStartDateTime: z.string().optional(),
  prices: z
    .array(
      z.object({
        storeId: z.string().optional(),
        priceDivision: z.union([z.literal("1"), z.literal("2")]).optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        price: z.string().optional(),
      }),
    )
    .optional(),
  reserveItems: z
    .array(
      z.object({
        no: z.string().optional(),
        value: z.string().optional(),
      }),
    )
    .optional(),
  stores: z
    .array(
      z.object({
        storeId: z.string().optional(),
        productOptionGroupId: z.string().optional(),
        assignDivision: z.union([z.literal("0"), z.literal("1")]).optional(),
      }),
    )
    .optional(),
  inventoryReservations: z
    .array(
      z.object({
        reservationProductId: z.string().optional(),
        reservationAmount: z.string().optional(),
      }),
    )
    .optional(),
  attributeItems: z
    .array(
      z.object({
        code: z.string().optional(),
        no: z.string().optional(),
      }),
    )
    .optional(),
  orderSetting: z
    .object({
      continuationDivision: z.string().optional(),
      orderStatusDivision: z.union([z.literal("0"), z.literal("1")]).optional(),
      orderNoReasonDivision: z.string().optional(),
      orderUnit: z
        .object({
          division: z.union([z.literal("0"), z.literal("1")]).optional(),
          num: z.string().optional(),
          name: z.string().optional(),
        })
        .optional(),
      orderLimitAmount: z.string().optional(),
      orderSupplierEditable: z.union([z.literal("0"), z.literal("1")]).optional(),
      pbDivision: z.union([z.literal("0"), z.literal("1")]).optional(),
      displayFlag: z.union([z.literal("0"), z.literal("1")]).optional(),
      stores: z
        .array(
          z.object({
            storeId: z.string().optional(),
            orderLimitAmount: z.string().optional(),
            displayFlag: z.union([z.literal("-1"), z.literal("0"), z.literal("1")]).optional(),
          }),
        )
        .optional(),
    })
    .optional(),
});

export type ProductBulkCreate = z.infer<typeof ProductBulkCreate>;
export const ProductBulkCreate = z.object({
  items: z.array(ProductCreate),
});

export type ProductBulkUpdate = z.infer<typeof ProductBulkUpdate>;
export const ProductBulkUpdate = z.object({
  items: z.array(ProductUpdate),
});

export type ProductPrice = z.infer<typeof ProductPrice>;
export const ProductPrice = z.object({
  productId: z.string(),
  storeId: z.string(),
  priceDivision: z.union([z.literal("1"), z.literal("2")]),
  startDate: z.string(),
  endDate: z.union([z.string(), z.undefined()]).optional(),
  price: z.string(),
  insDateTime: z.union([z.string(), z.undefined()]).optional(),
  updDateTime: z.union([z.string(), z.undefined()]).optional(),
});

export type ProductPriceChange = z.infer<typeof ProductPriceChange>;
export const ProductPriceChange = z.object({
  productId: z.string(),
  storeId: z.string(),
  priceDivision: z.union([z.literal("1"), z.literal("2")]),
  startDate: z.string(),
  endDate: z.union([z.string(), z.undefined()]).optional(),
  price: z.string(),
  oldPrice: z.string(),
  staffId: z.union([z.string(), z.undefined()]).optional(),
  staffName: z.union([z.string(), z.undefined()]).optional(),
  insDateTime: z.string(),
});

export type ProductReserveItem = z.infer<typeof ProductReserveItem>;
export const ProductReserveItem = z.object({
  productId: z.string(),
  no: z.string(),
  labelNo: z.union([z.string(), z.undefined()]).optional(),
  value: z.string(),
  insDateTime: z.union([z.string(), z.undefined()]).optional(),
  updDateTime: z.union([z.string(), z.undefined()]).optional(),
});

export type ProductAttribute = z.infer<typeof ProductAttribute>;
export const ProductAttribute = z.object({
  attributeNo: z.union([z.string(), z.undefined()]).optional(),
  attributeName: z.string(),
  selectedDivision: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional(),
  selectedType: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional(),
  displayFlag: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional(),
  insDateTime: z.union([z.string(), z.undefined()]).optional(),
  updDateTime: z.union([z.string(), z.undefined()]).optional(),
});

export type ProductAttributeItem = z.infer<typeof ProductAttributeItem>;
export const ProductAttributeItem = z.object({
  code: z.union([z.string(), z.undefined()]).optional(),
  attributeNo: z.string(),
  attributeItemName: z.string(),
  displaySequence: z.union([z.string(), z.undefined()]).optional(),
  status: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional(),
  insDateTime: z.union([z.string(), z.undefined()]).optional(),
  updDateTime: z.union([z.string(), z.undefined()]).optional(),
});

export type ProductStore = z.infer<typeof ProductStore>;
export const ProductStore = z.object({
  productId: z.string(),
  storeId: z.string(),
  productOptionGroupId: z.union([z.string(), z.undefined()]).optional(),
  assignDivision: z.union([z.literal("0"), z.literal("1")]),
  insDateTime: z.union([z.string(), z.undefined()]).optional(),
  updDateTime: z.union([z.string(), z.undefined()]).optional(),
});

export type ProductInventoryReservation = z.infer<typeof ProductInventoryReservation>;
export const ProductInventoryReservation = z.object({
  productId: z.string(),
  reservationProductId: z.string(),
  reservationAmount: z.string(),
  insDateTime: z.union([z.string(), z.undefined()]).optional(),
  updDateTime: z.union([z.string(), z.undefined()]).optional(),
});

export type ProductReserveItemLabel = z.infer<typeof ProductReserveItemLabel>;
export const ProductReserveItemLabel = z.object({
  no: z.union([z.string(), z.undefined()]).optional(),
  name: z.string(),
  status: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional(),
  displaySequence: z.union([z.string(), z.undefined()]).optional(),
  insDateTime: z.union([z.string(), z.undefined()]).optional(),
  updDateTime: z.union([z.string(), z.undefined()]).optional(),
});

export type ProductImage = z.infer<typeof ProductImage>;
export const ProductImage = z.object({
  imageId: z.union([z.string(), z.undefined()]).optional(),
  productId: z.string(),
  displaySequence: z.union([z.string(), z.undefined()]).optional(),
  imageUrl: z.string(),
  imageType: z.union([z.literal("1"), z.literal("2"), z.literal("3")]),
  size: z.union([z.string(), z.undefined()]).optional(),
  width: z.union([z.string(), z.undefined()]).optional(),
  height: z.union([z.string(), z.undefined()]).optional(),
  staffId: z.union([z.string(), z.undefined()]).optional(),
  insDateTime: z.union([z.string(), z.undefined()]).optional(),
  updDateTime: z.union([z.string(), z.undefined()]).optional(),
});

export type ProductImageUpload = z.infer<typeof ProductImageUpload>;
export const ProductImageUpload = z.object({
  productId: z.string(),
  imageType: z.union([z.literal("1"), z.literal("2"), z.literal("3")]),
  displaySequence: z.union([z.string(), z.undefined()]).optional(),
  image: z.string(),
});

export type Transaction = z.infer<typeof Transaction>;
export const Transaction = z.object({
  id: z.number(),
  storeId: z.number(),
  terminalId: z.number(),
  terminalNo: z.string(),
  customerId: z.union([z.number(), z.null(), z.undefined()]).optional(),
  customerCode: z.union([z.string(), z.null(), z.undefined()]).optional(),
  customerName: z.union([z.string(), z.null(), z.undefined()]).optional(),
  staffId: z.union([z.number(), z.null(), z.undefined()]).optional(),
  staffCode: z.union([z.string(), z.null(), z.undefined()]).optional(),
  staffName: z.union([z.string(), z.null(), z.undefined()]).optional(),
  transactionDateTime: z.string(),
  totalAmount: z.number(),
  taxIncludedAmount: z.number(),
  taxExcludedAmount: z.number(),
  subtotalAmount: z.number(),
  paymentAmount: z.number(),
  changeAmount: z.number(),
  pointAmount: z.union([z.number(), z.null(), z.undefined()]).optional(),
  paymentType: z.number(),
  status: z.number(),
  receiptNo: z.string(),
  receiptText: z.union([z.string(), z.null(), z.undefined()]).optional(),
  memo: z.union([z.string(), z.null(), z.undefined()]).optional(),
  createdDateTime: z.string(),
  updatedDateTime: z.string(),
});

export type TransactionCreate = z.infer<typeof TransactionCreate>;
export const TransactionCreate = z.object({
  storeId: z.number(),
  terminalId: z.number(),
  customerId: z.union([z.number(), z.null(), z.undefined()]).optional(),
  staffId: z.union([z.number(), z.null(), z.undefined()]).optional(),
  transactionDateTime: z.string(),
  totalAmount: z.number(),
  taxIncludedAmount: z.number(),
  taxExcludedAmount: z.number(),
  subtotalAmount: z.number(),
  paymentAmount: z.number(),
  changeAmount: z.number(),
  pointAmount: z.union([z.number(), z.null(), z.undefined()]).optional(),
  paymentType: z.number(),
  status: z.number(),
  receiptNo: z.string(),
  receiptText: z.union([z.string(), z.null(), z.undefined()]).optional(),
  memo: z.union([z.string(), z.null(), z.undefined()]).optional(),
  details: z.array(
    z.object({
      productId: z.union([z.number(), z.null(), z.undefined()]).optional(),
      productCode: z.union([z.string(), z.null(), z.undefined()]).optional(),
      productName: z.string(),
      categoryId: z.union([z.number(), z.null(), z.undefined()]).optional(),
      price: z.number(),
      quantity: z.number(),
      unitDiscountAmount: z.union([z.number(), z.null(), z.undefined()]).optional(),
      unitDiscountRate: z.union([z.number(), z.null(), z.undefined()]).optional(),
      unitDiscountType: z.union([z.number(), z.null(), z.undefined()]).optional(),
      subtotalAmount: z.number(),
      taxRate: z.number(),
      taxType: z.number(),
      detailType: z.number(),
    }),
  ),
  payments: z.array(
    z.object({
      paymentMethodId: z.number(),
      paymentMethodName: z.string(),
      amount: z.number(),
      paymentNo: z.union([z.string(), z.null(), z.undefined()]).optional(),
      cardCompanyId: z.union([z.number(), z.null(), z.undefined()]).optional(),
      cardCompanyName: z.union([z.string(), z.null(), z.undefined()]).optional(),
    }),
  ),
});

export type TransactionUpdate = z.infer<typeof TransactionUpdate>;
export const TransactionUpdate = z.object({
  customerId: z.union([z.number(), z.null()]).optional(),
  staffId: z.union([z.number(), z.null()]).optional(),
  status: z.number().optional(),
  memo: z.union([z.string(), z.null()]).optional(),
});

export type TransactionDetail = z.infer<typeof TransactionDetail>;
export const TransactionDetail = z.object({
  id: z.number(),
  transactionId: z.number(),
  lineNo: z.number(),
  productId: z.union([z.number(), z.null(), z.undefined()]).optional(),
  productCode: z.union([z.string(), z.null(), z.undefined()]).optional(),
  productName: z.string(),
  categoryId: z.union([z.number(), z.null(), z.undefined()]).optional(),
  categoryName: z.union([z.string(), z.null(), z.undefined()]).optional(),
  price: z.number(),
  quantity: z.number(),
  unitDiscountAmount: z.union([z.number(), z.null(), z.undefined()]).optional(),
  unitDiscountRate: z.union([z.number(), z.null(), z.undefined()]).optional(),
  unitDiscountType: z.union([z.number(), z.null(), z.undefined()]).optional(),
  subtotalAmount: z.number(),
  taxRate: z.number(),
  taxType: z.number(),
  taxIncludedAmount: z.number(),
  taxExcludedAmount: z.number(),
  detailType: z.number(),
  parentLineNo: z.union([z.number(), z.null(), z.undefined()]).optional(),
  discountId: z.union([z.number(), z.null(), z.undefined()]).optional(),
  discountName: z.union([z.string(), z.null(), z.undefined()]).optional(),
  couponId: z.union([z.number(), z.null(), z.undefined()]).optional(),
  couponName: z.union([z.string(), z.null(), z.undefined()]).optional(),
  couponCode: z.union([z.string(), z.null(), z.undefined()]).optional(),
  taxFreeDivision: z.number(),
  remark: z.union([z.string(), z.null(), z.undefined()]).optional(),
  cost: z.union([z.number(), z.null(), z.undefined()]).optional(),
  stockTransactionType: z.union([z.number(), z.null(), z.undefined()]).optional(),
  costType: z.union([z.number(), z.null(), z.undefined()]).optional(),
  stockReserveId: z.union([z.number(), z.null(), z.undefined()]).optional(),
  serialCode: z.union([z.string(), z.null(), z.undefined()]).optional(),
  createdDateTime: z.string(),
  updatedDateTime: z.string(),
});

export type Layaway = z.infer<typeof Layaway>;
export const Layaway = z.object({
  id: z.number(),
  storeId: z.number(),
  terminalId: z.number(),
  customerId: z.union([z.number(), z.null(), z.undefined()]).optional(),
  customerCode: z.union([z.string(), z.null(), z.undefined()]).optional(),
  customerName: z.union([z.string(), z.null(), z.undefined()]).optional(),
  staffId: z.union([z.number(), z.null(), z.undefined()]).optional(),
  staffCode: z.union([z.string(), z.null(), z.undefined()]).optional(),
  staffName: z.union([z.string(), z.null(), z.undefined()]).optional(),
  layawayDateTime: z.string(),
  totalAmount: z.number(),
  taxIncludedAmount: z.number(),
  taxExcludedAmount: z.number(),
  status: z.number(),
  memo: z.union([z.string(), z.null(), z.undefined()]).optional(),
  transactionId: z.union([z.number(), z.null(), z.undefined()]).optional(),
  items: z.array(
    z.object({
      productId: z.union([z.number(), z.null()]).optional(),
      productCode: z.union([z.string(), z.null()]).optional(),
      productName: z.string().optional(),
      categoryId: z.union([z.number(), z.null()]).optional(),
      categoryName: z.union([z.string(), z.null()]).optional(),
      price: z.number().optional(),
      quantity: z.number().optional(),
      subtotalAmount: z.number().optional(),
      taxRate: z.number().optional(),
      taxType: z.number().optional(),
      taxIncludedAmount: z.number().optional(),
      taxExcludedAmount: z.number().optional(),
    }),
  ),
  createdDateTime: z.string(),
  updatedDateTime: z.string(),
});

export type LayawayCreate = z.infer<typeof LayawayCreate>;
export const LayawayCreate = z.object({
  storeId: z.number(),
  terminalId: z.number(),
  customerId: z.union([z.number(), z.null(), z.undefined()]).optional(),
  staffId: z.union([z.number(), z.null(), z.undefined()]).optional(),
  layawayDateTime: z.string(),
  totalAmount: z.number(),
  taxIncludedAmount: z.number(),
  taxExcludedAmount: z.number(),
  memo: z.union([z.string(), z.null(), z.undefined()]).optional(),
  items: z.array(
    z.object({
      productId: z.union([z.number(), z.null(), z.undefined()]).optional(),
      productCode: z.union([z.string(), z.null(), z.undefined()]).optional(),
      productName: z.string(),
      categoryId: z.union([z.number(), z.null(), z.undefined()]).optional(),
      price: z.number(),
      quantity: z.number(),
      subtotalAmount: z.number(),
      taxRate: z.number(),
      taxType: z.number(),
      taxIncludedAmount: z.number(),
      taxExcludedAmount: z.number(),
    }),
  ),
});

export type PreSale = z.infer<typeof PreSale>;
export const PreSale = z.object({
  id: z.number(),
  storeId: z.number(),
  terminalId: z.number(),
  customerId: z.union([z.number(), z.null(), z.undefined()]).optional(),
  customerCode: z.union([z.string(), z.null(), z.undefined()]).optional(),
  customerName: z.union([z.string(), z.null(), z.undefined()]).optional(),
  staffId: z.union([z.number(), z.null(), z.undefined()]).optional(),
  staffCode: z.union([z.string(), z.null(), z.undefined()]).optional(),
  staffName: z.union([z.string(), z.null(), z.undefined()]).optional(),
  preSaleDateTime: z.string(),
  totalAmount: z.number(),
  taxIncludedAmount: z.number(),
  taxExcludedAmount: z.number(),
  status: z.number(),
  memo: z.union([z.string(), z.null(), z.undefined()]).optional(),
  transactionId: z.union([z.number(), z.null(), z.undefined()]).optional(),
  items: z.array(
    z.object({
      productId: z.union([z.number(), z.null()]).optional(),
      productCode: z.union([z.string(), z.null()]).optional(),
      productName: z.string().optional(),
      categoryId: z.union([z.number(), z.null()]).optional(),
      categoryName: z.union([z.string(), z.null()]).optional(),
      price: z.number().optional(),
      quantity: z.number().optional(),
      subtotalAmount: z.number().optional(),
      taxRate: z.number().optional(),
      taxType: z.number().optional(),
      taxIncludedAmount: z.number().optional(),
      taxExcludedAmount: z.number().optional(),
    }),
  ),
  createdDateTime: z.string(),
  updatedDateTime: z.string(),
});

export type PreSaleCreate = z.infer<typeof PreSaleCreate>;
export const PreSaleCreate = z.object({
  storeId: z.number(),
  terminalId: z.number(),
  customerId: z.union([z.number(), z.null(), z.undefined()]).optional(),
  staffId: z.union([z.number(), z.null(), z.undefined()]).optional(),
  preSaleDateTime: z.string(),
  totalAmount: z.number(),
  taxIncludedAmount: z.number(),
  taxExcludedAmount: z.number(),
  memo: z.union([z.string(), z.null(), z.undefined()]).optional(),
  items: z.array(
    z.object({
      productId: z.union([z.number(), z.null(), z.undefined()]).optional(),
      productCode: z.union([z.string(), z.null(), z.undefined()]).optional(),
      productName: z.string(),
      categoryId: z.union([z.number(), z.null(), z.undefined()]).optional(),
      price: z.number(),
      quantity: z.number(),
      subtotalAmount: z.number(),
      taxRate: z.number(),
      taxType: z.number(),
      taxIncludedAmount: z.number(),
      taxExcludedAmount: z.number(),
    }),
  ),
});

export type PreSaleUpdate = z.infer<typeof PreSaleUpdate>;
export const PreSaleUpdate = z.object({
  customerId: z.union([z.number(), z.null()]).optional(),
  staffId: z.union([z.number(), z.null()]).optional(),
  status: z.number().optional(),
  memo: z.union([z.string(), z.null()]).optional(),
  transactionId: z.union([z.number(), z.null()]).optional(),
});

export type TicketTransaction = z.infer<typeof TicketTransaction>;
export const TicketTransaction = z.object({
  id: z.number(),
  storeId: z.number(),
  terminalId: z.number(),
  ticketCode: z.string(),
  customerId: z.union([z.number(), z.null(), z.undefined()]).optional(),
  customerCode: z.union([z.string(), z.null(), z.undefined()]).optional(),
  customerName: z.union([z.string(), z.null(), z.undefined()]).optional(),
  staffId: z.union([z.number(), z.null(), z.undefined()]).optional(),
  staffCode: z.union([z.string(), z.null(), z.undefined()]).optional(),
  staffName: z.union([z.string(), z.null(), z.undefined()]).optional(),
  ticketDateTime: z.string(),
  expirationDate: z.union([z.string(), z.null(), z.undefined()]).optional(),
  usedDateTime: z.union([z.string(), z.null(), z.undefined()]).optional(),
  statusType: z.number(),
  transactionId: z.number(),
  usedTransactionId: z.union([z.number(), z.null(), z.undefined()]).optional(),
  memo: z.union([z.string(), z.null(), z.undefined()]).optional(),
  productId: z.union([z.number(), z.null(), z.undefined()]).optional(),
  productCode: z.union([z.string(), z.null(), z.undefined()]).optional(),
  productName: z.string(),
  price: z.number(),
  quantity: z.number(),
  createdDateTime: z.string(),
  updatedDateTime: z.string(),
});

export type Customer = z.infer<typeof Customer>;
export const Customer = z.object({
  customerId: z.string().optional(),
  customerCode: z.string().optional(),
  customerNo: z.string().optional(),
  rank: z.string().optional(),
  staffRank: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  firstNameKana: z.string().optional(),
  lastNameKana: z.string().optional(),
  sex: z.union([z.literal("0"), z.literal("1"), z.literal("2")]).optional(),
  barcode: z.string().optional(),
  birthDate: z.string().optional(),
  zipCode: z.string().optional(),
  address: z.string().optional(),
  phoneNumber: z.string().optional(),
  faxNumber: z.string().optional(),
  mobileNumber: z.string().optional(),
  mailAddress: z.string().optional(),
  mailAddress2: z.string().optional(),
  mailAddress3: z.string().optional(),
  companyName: z.string().optional(),
  departmentName: z.string().optional(),
  managerFlag: z.boolean().optional(),
  isStaff: z.boolean().optional(),
  points: z.number().optional(),
  storeId: z.string().optional(),
  note: z.string().optional(),
  statusId: z.number().optional(),
  enterDate: z.string().optional(),
  suspendDate: z.string().optional(),
  pointExpireDate: z.string().optional(),
  insDateTime: z.string().optional(),
  updDateTime: z.string().optional(),
});

export type CustomerCreate = z.infer<typeof CustomerCreate>;
export const CustomerCreate = z.object({
  customerCode: z.string(),
  customerNo: z.union([z.string(), z.undefined()]).optional(),
  rank: z.union([z.string(), z.undefined()]).optional(),
  staffRank: z.union([z.string(), z.undefined()]).optional(),
  firstName: z.union([z.string(), z.undefined()]).optional(),
  lastName: z.union([z.string(), z.undefined()]).optional(),
  firstNameKana: z.union([z.string(), z.undefined()]).optional(),
  lastNameKana: z.union([z.string(), z.undefined()]).optional(),
  sex: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.undefined()]).optional(),
  barcode: z.union([z.string(), z.undefined()]).optional(),
  birthDate: z.union([z.string(), z.undefined()]).optional(),
  zipCode: z.union([z.string(), z.undefined()]).optional(),
  address: z.union([z.string(), z.undefined()]).optional(),
  phoneNumber: z.union([z.string(), z.undefined()]).optional(),
  faxNumber: z.union([z.string(), z.undefined()]).optional(),
  mobileNumber: z.union([z.string(), z.undefined()]).optional(),
  mailAddress: z.union([z.string(), z.undefined()]).optional(),
  mailAddress2: z.union([z.string(), z.undefined()]).optional(),
  mailAddress3: z.union([z.string(), z.undefined()]).optional(),
  companyName: z.union([z.string(), z.undefined()]).optional(),
  departmentName: z.union([z.string(), z.undefined()]).optional(),
  managerFlag: z.union([z.boolean(), z.undefined()]).optional(),
  isStaff: z.union([z.boolean(), z.undefined()]).optional(),
  points: z.union([z.number(), z.undefined()]).optional(),
  storeId: z.union([z.string(), z.undefined()]).optional(),
  note: z.union([z.string(), z.undefined()]).optional(),
  statusId: z.union([z.number(), z.undefined()]).optional(),
  enterDate: z.union([z.string(), z.undefined()]).optional(),
  suspendDate: z.union([z.string(), z.undefined()]).optional(),
  pointExpireDate: z.union([z.string(), z.undefined()]).optional(),
});

export type CustomerUpdate = z.infer<typeof CustomerUpdate>;
export const CustomerUpdate = z.object({
  customerCode: z.string().optional(),
  customerNo: z.string().optional(),
  rank: z.string().optional(),
  staffRank: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  firstNameKana: z.string().optional(),
  lastNameKana: z.string().optional(),
  sex: z.union([z.literal("0"), z.literal("1"), z.literal("2")]).optional(),
  barcode: z.string().optional(),
  birthDate: z.string().optional(),
  zipCode: z.string().optional(),
  address: z.string().optional(),
  phoneNumber: z.string().optional(),
  faxNumber: z.string().optional(),
  mobileNumber: z.string().optional(),
  mailAddress: z.string().optional(),
  mailAddress2: z.string().optional(),
  mailAddress3: z.string().optional(),
  companyName: z.string().optional(),
  departmentName: z.string().optional(),
  managerFlag: z.boolean().optional(),
  isStaff: z.boolean().optional(),
  points: z.number().optional(),
  storeId: z.string().optional(),
  note: z.string().optional(),
  statusId: z.number().optional(),
  enterDate: z.string().optional(),
  suspendDate: z.string().optional(),
  pointExpireDate: z.string().optional(),
});

export type CustomerBulkCreate = z.infer<typeof CustomerBulkCreate>;
export const CustomerBulkCreate = z.object({
  customers: z.array(CustomerCreate),
});

export type CustomerBulkUpdate = z.infer<typeof CustomerBulkUpdate>;
export const CustomerBulkUpdate = z.object({
  customers: z.array(
    z.intersection(
      z.object({
        customerId: z.string(),
      }),
      CustomerUpdate,
    ),
  ),
});

export type CustomerPoint = z.infer<typeof CustomerPoint>;
export const CustomerPoint = z.object({
  customerId: z.string().optional(),
  points: z.number().optional(),
  pointExpireDate: z.string().optional(),
});

export type CustomerPointUpdate = z.infer<typeof CustomerPointUpdate>;
export const CustomerPointUpdate = z.object({
  points: z.number(),
  pointExpireDate: z.union([z.string(), z.undefined()]).optional(),
});

export type CustomerPointRelativeUpdate = z.infer<typeof CustomerPointRelativeUpdate>;
export const CustomerPointRelativeUpdate = z.object({
  points: z.number(),
  pointExpireDate: z.union([z.string(), z.undefined()]).optional(),
});

export type CustomerRank = z.infer<typeof CustomerRank>;
export const CustomerRank = z.object({
  rankId: z.string().optional(),
  rankName: z.string().optional(),
  pointRate: z.number().optional(),
  pointExpirationType: z.union([z.literal("0"), z.literal("1"), z.literal("2")]).optional(),
  pointExpirationMonth: z.number().optional(),
  pointExpirationDay: z.number().optional(),
  pointExpirationPeriod: z.number().optional(),
  note: z.string().optional(),
  insDateTime: z.string().optional(),
  updDateTime: z.string().optional(),
});

export type CustomerRankCreate = z.infer<typeof CustomerRankCreate>;
export const CustomerRankCreate = z.object({
  rankName: z.string(),
  pointRate: z.union([z.number(), z.undefined()]).optional(),
  pointExpirationType: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.undefined()]).optional(),
  pointExpirationMonth: z.union([z.number(), z.undefined()]).optional(),
  pointExpirationDay: z.union([z.number(), z.undefined()]).optional(),
  pointExpirationPeriod: z.union([z.number(), z.undefined()]).optional(),
  note: z.union([z.string(), z.undefined()]).optional(),
});

export type CustomerRankUpdate = z.infer<typeof CustomerRankUpdate>;
export const CustomerRankUpdate = z.object({
  rankName: z.string().optional(),
  pointRate: z.number().optional(),
  pointExpirationType: z.union([z.literal("0"), z.literal("1"), z.literal("2")]).optional(),
  pointExpirationMonth: z.number().optional(),
  pointExpirationDay: z.number().optional(),
  pointExpirationPeriod: z.number().optional(),
  note: z.string().optional(),
});

export type StaffRank = z.infer<typeof StaffRank>;
export const StaffRank = z.object({
  staffRankId: z.string().optional(),
  staffRankName: z.string().optional(),
  discountRate: z.number().optional(),
  pointRate: z.number().optional(),
  note: z.string().optional(),
  insDateTime: z.string().optional(),
  updDateTime: z.string().optional(),
});

export type StaffRankCreate = z.infer<typeof StaffRankCreate>;
export const StaffRankCreate = z.object({
  staffRankName: z.string(),
  discountRate: z.union([z.number(), z.undefined()]).optional(),
  pointRate: z.union([z.number(), z.undefined()]).optional(),
  note: z.union([z.string(), z.undefined()]).optional(),
});

export type StaffRankUpdate = z.infer<typeof StaffRankUpdate>;
export const StaffRankUpdate = z.object({
  staffRankName: z.string().optional(),
  discountRate: z.number().optional(),
  pointRate: z.number().optional(),
  note: z.string().optional(),
});

export type CustomerRequired = z.infer<typeof CustomerRequired>;
export const CustomerRequired = z.object({
  firstName: z.boolean().optional(),
  lastName: z.boolean().optional(),
  firstNameKana: z.boolean().optional(),
  lastNameKana: z.boolean().optional(),
  sex: z.boolean().optional(),
  birthDate: z.boolean().optional(),
  zipCode: z.boolean().optional(),
  address: z.boolean().optional(),
  phoneNumber: z.boolean().optional(),
  mobileNumber: z.boolean().optional(),
  mailAddress: z.boolean().optional(),
  companyName: z.boolean().optional(),
  departmentName: z.boolean().optional(),
});

export type Stock = z.infer<typeof Stock>;
export const Stock = z.object({
  storeId: z.number(),
  storeName: z.union([z.string(), z.undefined()]).optional(),
  productId: z.number(),
  productCode: z.union([z.string(), z.undefined()]).optional(),
  productName: z.union([z.string(), z.undefined()]).optional(),
  barcode: z.union([z.string(), z.undefined()]).optional(),
  categoryId: z.union([z.number(), z.undefined()]).optional(),
  categoryName: z.union([z.string(), z.undefined()]).optional(),
  quantity: z.number(),
  reservedQuantity: z.union([z.number(), z.undefined()]).optional(),
  originalQuantity: z.union([z.number(), z.undefined()]).optional(),
  lastUpdateDate: z.union([z.string(), z.undefined()]).optional(),
});

export type StockUpdate = z.infer<typeof StockUpdate>;
export const StockUpdate = z.object({
  storeId: z.number(),
  productId: z.number(),
  quantity: z.number(),
});

export type StockBulkUpdate = z.infer<typeof StockBulkUpdate>;
export const StockBulkUpdate = z.object({
  stocks: z.array(StockUpdate),
});

export type StockRelativeUpdate = z.infer<typeof StockRelativeUpdate>;
export const StockRelativeUpdate = z.object({
  storeId: z.number(),
  productId: z.number(),
  addQuantity: z.number(),
  division: z.number(),
  memo: z.union([z.string(), z.undefined()]).optional(),
});

export type StockBulkRelativeUpdate = z.infer<typeof StockBulkRelativeUpdate>;
export const StockBulkRelativeUpdate = z.object({
  stocks: z.array(StockRelativeUpdate),
});

export type StockChange = z.infer<typeof StockChange>;
export const StockChange = z.object({
  stockChangeId: z.number(),
  storeId: z.number(),
  storeName: z.union([z.string(), z.undefined()]).optional(),
  productId: z.number(),
  productCode: z.union([z.string(), z.undefined()]).optional(),
  productName: z.union([z.string(), z.undefined()]).optional(),
  barcode: z.union([z.string(), z.undefined()]).optional(),
  categoryId: z.union([z.number(), z.undefined()]).optional(),
  categoryName: z.union([z.string(), z.undefined()]).optional(),
  division: z.number(),
  divisionName: z.union([z.string(), z.undefined()]).optional(),
  beforeQuantity: z.number(),
  changeQuantity: z.number(),
  afterQuantity: z.number(),
  targetDate: z.string(),
  staffId: z.union([z.number(), z.undefined()]).optional(),
  staffName: z.union([z.string(), z.undefined()]).optional(),
  refId: z.union([z.number(), z.undefined()]).optional(),
  memo: z.union([z.string(), z.undefined()]).optional(),
});

export type Bargain = z.infer<typeof Bargain>;
export const Bargain = z.object({
  bargainId: z.string(),
  bargainName: z.string(),
  termStart: z.string(),
  termEnd: z.string(),
  insDateTime: z.union([z.string(), z.undefined()]).optional(),
  updDateTime: z.union([z.string(), z.undefined()]).optional(),
});

export type BargainCreate = z.infer<typeof BargainCreate>;
export const BargainCreate = z.object({
  bargainName: z.string(),
  termStart: z.string(),
  termEnd: z.string(),
});

export type BargainUpdate = z.infer<typeof BargainUpdate>;
export const BargainUpdate = z.object({
  bargainName: z.string().optional(),
  termStart: z.string().optional(),
  termEnd: z.string().optional(),
});

export type BargainStore = z.infer<typeof BargainStore>;
export const BargainStore = z.object({
  bargainStoreId: z.string(),
  bargainId: z.string(),
  storeId: z.string(),
  insDateTime: z.union([z.string(), z.undefined()]).optional(),
  updDateTime: z.union([z.string(), z.undefined()]).optional(),
});

export type BargainStoreCreate = z.infer<typeof BargainStoreCreate>;
export const BargainStoreCreate = z.object({
  storeId: z.string(),
});

export type BargainStoreUpdate = z.infer<typeof BargainStoreUpdate>;
export const BargainStoreUpdate = z.object({
  storeId: z.string().optional(),
});

export type BargainProduct = z.infer<typeof BargainProduct>;
export const BargainProduct = z.object({
  bargainProductId: z.string(),
  bargainId: z.string(),
  targetDivision: z.union([z.literal("1"), z.literal("2"), z.literal("3")]),
  targetId: z.string(),
  division: z.union([z.literal("1"), z.literal("2"), z.literal("3")]),
  value: z.string(),
  insDateTime: z.union([z.string(), z.undefined()]).optional(),
  updDateTime: z.union([z.string(), z.undefined()]).optional(),
});

export type BargainProductCreate = z.infer<typeof BargainProductCreate>;
export const BargainProductCreate = z.object({
  targetDivision: z.union([z.literal("1"), z.literal("2"), z.literal("3")]),
  targetId: z.string(),
  division: z.union([z.literal("1"), z.literal("2"), z.literal("3")]),
  value: z.string(),
});

export type BargainProductUpdate = z.infer<typeof BargainProductUpdate>;
export const BargainProductUpdate = z.object({
  targetDivision: z.union([z.literal("1"), z.literal("2"), z.literal("3")]).optional(),
  targetId: z.string().optional(),
  division: z.union([z.literal("1"), z.literal("2"), z.literal("3")]).optional(),
  value: z.string().optional(),
});

export type ProductOptionGroup = z.infer<typeof ProductOptionGroup>;
export const ProductOptionGroup = z.object({
  productOptionGroupId: z.string(),
  productOptionGroupName: z.string(),
  conditionId: z.union([z.literal("0"), z.literal("1"), z.literal("2")]),
  max: z.union([z.string(), z.undefined()]).optional(),
  min: z.union([z.string(), z.undefined()]).optional(),
  syncDivision: z.union([z.string(), z.undefined()]).optional(),
  insDateTime: z.union([z.string(), z.undefined()]).optional(),
  updDateTime: z.union([z.string(), z.undefined()]).optional(),
});

export type ProductOptionGroupCreate = z.infer<typeof ProductOptionGroupCreate>;
export const ProductOptionGroupCreate = z.object({
  productOptionGroupName: z.string(),
  conditionId: z.union([z.literal("0"), z.literal("1"), z.literal("2")]),
  max: z.union([z.string(), z.undefined()]).optional(),
  min: z.union([z.string(), z.undefined()]).optional(),
  products: z.array(
    z.object({
      productId: z.string(),
    }),
  ),
});

export type ProductOptionGroupUpdate = z.infer<typeof ProductOptionGroupUpdate>;
export const ProductOptionGroupUpdate = z.object({
  productOptionGroupName: z.string().optional(),
  conditionId: z.union([z.literal("0"), z.literal("1"), z.literal("2")]).optional(),
  max: z.string().optional(),
  min: z.string().optional(),
  products: z
    .array(
      z.object({
        productId: z.string(),
      }),
    )
    .optional(),
});

export type Bundle = z.infer<typeof Bundle>;
export const Bundle = z.object({
  productBundleGroupId: z.string(),
  productBundleGroupName: z.string(),
  type: z.union([z.literal("1"), z.literal("2"), z.literal("3"), z.literal("4")]),
  taxDivision: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.undefined()]).optional(),
  reduceTaxId: z.union([z.string(), z.undefined()]).optional(),
  quantity: z.union([z.string(), z.undefined()]).optional(),
  value: z.string(),
  reduceTaxValue: z.union([z.string(), z.undefined()]).optional(),
  priority: z.union([z.string(), z.undefined()]).optional(),
  termFrom: z.string(),
  termTo: z.string(),
  pointNotApplicable: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional(),
  taxFreeDivision: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.undefined()]).optional(),
  calcDiscount: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional(),
  insDateTime: z.union([z.string(), z.undefined()]).optional(),
  updDateTime: z.union([z.string(), z.undefined()]).optional(),
});

export type BundleCreate = z.infer<typeof BundleCreate>;
export const BundleCreate = z.object({
  productBundleGroupName: z.string(),
  type: z.union([z.literal("1"), z.literal("2"), z.literal("3"), z.literal("4")]),
  taxDivision: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.undefined()]).optional(),
  reduceTaxId: z.union([z.string(), z.undefined()]).optional(),
  quantity: z.union([z.string(), z.undefined()]).optional(),
  value: z.string(),
  reduceTaxValue: z.union([z.string(), z.undefined()]).optional(),
  priority: z.union([z.string(), z.undefined()]).optional(),
  termFrom: z.string(),
  termTo: z.string(),
  pointNotApplicable: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional(),
  taxFreeDivision: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.undefined()]).optional(),
  calcDiscount: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional(),
  products: z.array(
    z.object({
      categoryId: z.string(),
      productId: z.string(),
      productGroupCode: z.string(),
    }),
  ),
});

export type BundleUpdate = z.infer<typeof BundleUpdate>;
export const BundleUpdate = z.object({
  productBundleGroupName: z.string().optional(),
  type: z.union([z.literal("1"), z.literal("2"), z.literal("3"), z.literal("4")]).optional(),
  taxDivision: z.union([z.literal("0"), z.literal("1"), z.literal("2")]).optional(),
  reduceTaxId: z.string().optional(),
  quantity: z.string().optional(),
  value: z.string().optional(),
  reduceTaxValue: z.string().optional(),
  priority: z.string().optional(),
  termFrom: z.string().optional(),
  termTo: z.string().optional(),
  pointNotApplicable: z.union([z.literal("0"), z.literal("1")]).optional(),
  taxFreeDivision: z.union([z.literal("0"), z.literal("1"), z.literal("2")]).optional(),
  calcDiscount: z.union([z.literal("0"), z.literal("1")]).optional(),
  products: z
    .array(
      z.object({
        categoryId: z.string().optional(),
        productId: z.string().optional(),
        productGroupCode: z.string().optional(),
      }),
    )
    .optional(),
});

export type BundleProduct = z.infer<typeof BundleProduct>;
export const BundleProduct = z.object({
  bundleProductId: z.string(),
  productBundleGroupId: z.string(),
  categoryId: z.union([z.string(), z.undefined()]).optional(),
  productId: z.union([z.string(), z.undefined()]).optional(),
  productGroupCode: z.union([z.string(), z.undefined()]).optional(),
  insDateTime: z.union([z.string(), z.undefined()]).optional(),
  updDateTime: z.union([z.string(), z.undefined()]).optional(),
});

export type Store = z.infer<typeof Store>;
export const Store = z.object({
  storeId: z.string(),
  storeName: z.string(),
  storeAbbr: z.union([z.string(), z.undefined()]).optional(),
  storeCode: z.union([z.string(), z.undefined()]).optional(),
  storeDivision: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional(),
  postalCode: z.union([z.string(), z.undefined()]).optional(),
  address: z.union([z.string(), z.undefined()]).optional(),
  phoneNumber: z.union([z.string(), z.undefined()]).optional(),
  faxNumber: z.union([z.string(), z.undefined()]).optional(),
  mailAddress: z.union([z.string(), z.undefined()]).optional(),
  openingTime: z.union([z.string(), z.undefined()]).optional(),
  closingTime: z.union([z.string(), z.undefined()]).optional(),
  regularHoliday: z.union([z.string(), z.undefined()]).optional(),
  url: z.union([z.string(), z.undefined()]).optional(),
  insDateTime: z.union([z.string(), z.undefined()]).optional(),
  updDateTime: z.union([z.string(), z.undefined()]).optional(),
});

export type StoreCreate = z.infer<typeof StoreCreate>;
export const StoreCreate = z.object({
  storeName: z.string(),
  storeAbbr: z.union([z.string(), z.undefined()]).optional(),
  storeCode: z.union([z.string(), z.undefined()]).optional(),
  storeDivision: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional(),
  postalCode: z.union([z.string(), z.undefined()]).optional(),
  address: z.union([z.string(), z.undefined()]).optional(),
  phoneNumber: z.union([z.string(), z.undefined()]).optional(),
  faxNumber: z.union([z.string(), z.undefined()]).optional(),
  mailAddress: z.union([z.string(), z.undefined()]).optional(),
  openingTime: z.union([z.string(), z.undefined()]).optional(),
  closingTime: z.union([z.string(), z.undefined()]).optional(),
  regularHoliday: z.union([z.string(), z.undefined()]).optional(),
  url: z.union([z.string(), z.undefined()]).optional(),
});

export type StoreUpdate = z.infer<typeof StoreUpdate>;
export const StoreUpdate = z.object({
  storeName: z.string().optional(),
  storeAbbr: z.string().optional(),
  storeCode: z.string().optional(),
  storeDivision: z.union([z.literal("0"), z.literal("1")]).optional(),
  postalCode: z.string().optional(),
  address: z.string().optional(),
  phoneNumber: z.string().optional(),
  faxNumber: z.string().optional(),
  mailAddress: z.string().optional(),
  openingTime: z.string().optional(),
  closingTime: z.string().optional(),
  regularHoliday: z.string().optional(),
  url: z.string().optional(),
});

export type StoreGroup = z.infer<typeof StoreGroup>;
export const StoreGroup = z.object({
  storeGroupId: z.string(),
  storeGroupName: z.string(),
  insDateTime: z.union([z.string(), z.undefined()]).optional(),
  updDateTime: z.union([z.string(), z.undefined()]).optional(),
});

export type StoreGroupCreate = z.infer<typeof StoreGroupCreate>;
export const StoreGroupCreate = z.object({
  storeGroupName: z.string(),
});

export type StoreGroupUpdate = z.infer<typeof StoreGroupUpdate>;
export const StoreGroupUpdate = z.object({
  storeGroupName: z.string().optional(),
});

export type StoreGroupItem = z.infer<typeof StoreGroupItem>;
export const StoreGroupItem = z.object({
  storeGroupItemId: z.string(),
  storeGroupId: z.string(),
  storeId: z.string(),
  insDateTime: z.union([z.string(), z.undefined()]).optional(),
  updDateTime: z.union([z.string(), z.undefined()]).optional(),
});

export type StoreGroupItemCreate = z.infer<typeof StoreGroupItemCreate>;
export const StoreGroupItemCreate = z.object({
  storeGroupId: z.string(),
  storeId: z.string(),
});

export type StoreGroupItemUpdate = z.infer<typeof StoreGroupItemUpdate>;
export const StoreGroupItemUpdate = z.object({
  storeGroupId: z.string().optional(),
  storeId: z.string().optional(),
});

export type Staff = z.infer<typeof Staff>;
export const Staff = z.object({
  staffId: z.string().optional(),
  staffCode: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  firstNameKana: z.string().optional(),
  lastNameKana: z.string().optional(),
  tel: z.string().optional(),
  mobilePhone: z.string().optional(),
  mail: z.string().optional(),
  zipCode: z.string().optional(),
  address: z.string().optional(),
  password: z.string().optional(),
  staffAuthorization: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.literal("3")]).optional(),
  salePassword: z.string().optional(),
  startAtHourOfDay: z.string().optional(),
  endAtHourOfDay: z.string().optional(),
  storeIds: z.array(z.string()).optional(),
  roleIds: z.array(z.string()).optional(),
  status: z.union([z.literal("1"), z.literal("2")]).optional(),
  insDateTime: z.string().optional(),
  updDateTime: z.string().optional(),
});

export type Role = z.infer<typeof Role>;
export const Role = z.object({
  roleId: z.string().optional(),
  roleName: z.string().optional(),
  permissions: z
    .array(
      z.object({
        permissionId: z.string().optional(),
        permissionName: z.string().optional(),
        value: z.union([z.literal(0), z.literal(1)]).optional(),
      }),
    )
    .optional(),
  note: z.string().optional(),
  insDateTime: z.string().optional(),
  updDateTime: z.string().optional(),
});

export type RoleCreate = z.infer<typeof RoleCreate>;
export const RoleCreate = z.object({
  roleName: z.string(),
  permissions: z.array(
    z.object({
      permissionId: z.string(),
      value: z.union([z.literal(0), z.literal(1)]),
    }),
  ),
  note: z.union([z.string(), z.undefined()]).optional(),
});

export type RoleUpdate = z.infer<typeof RoleUpdate>;
export const RoleUpdate = z.object({
  roleName: z.string().optional(),
  permissions: z
    .array(
      z.object({
        permissionId: z.string(),
        value: z.union([z.literal(0), z.literal(1)]),
      }),
    )
    .optional(),
  note: z.string().optional(),
});

export type MonthlyBudget = z.infer<typeof MonthlyBudget>;
export const MonthlyBudget = z.object({
  budgetId: z.string().optional(),
  storeId: z.string().optional(),
  storeName: z.string().optional(),
  yearMonth: z.string().optional(),
  salesBudget: z.number().optional(),
  salesTaxBudget: z.number().optional(),
  customerCountBudget: z.number().optional(),
  averageCustomerPriceBudget: z.number().optional(),
  grossProfitBudget: z.number().optional(),
  grossProfitRatioBudget: z.number().optional(),
  creditPointBudget: z.number().optional(),
  discountBudget: z.number().optional(),
  salesBudgetDetail: z
    .object({
      goods: z.number().optional(),
      food: z.number().optional(),
      service: z.number().optional(),
      other: z.number().optional(),
    })
    .optional(),
  salesTaxBudgetDetail: z
    .object({
      goods: z.number().optional(),
      food: z.number().optional(),
      service: z.number().optional(),
      other: z.number().optional(),
    })
    .optional(),
  customerCountBudgetDetail: z
    .object({
      goods: z.number().optional(),
      food: z.number().optional(),
      service: z.number().optional(),
      other: z.number().optional(),
    })
    .optional(),
  insDateTime: z.string().optional(),
  updDateTime: z.string().optional(),
});

export type DailyBudget = z.infer<typeof DailyBudget>;
export const DailyBudget = z.object({
  budgetId: z.string().optional(),
  storeId: z.string().optional(),
  storeName: z.string().optional(),
  date: z.string().optional(),
  salesBudget: z.number().optional(),
  salesTaxBudget: z.number().optional(),
  customerCountBudget: z.number().optional(),
  averageCustomerPriceBudget: z.number().optional(),
  grossProfitBudget: z.number().optional(),
  grossProfitRatioBudget: z.number().optional(),
  creditPointBudget: z.number().optional(),
  discountBudget: z.number().optional(),
  salesBudgetDetail: z
    .object({
      goods: z.number().optional(),
      food: z.number().optional(),
      service: z.number().optional(),
      other: z.number().optional(),
    })
    .optional(),
  salesTaxBudgetDetail: z
    .object({
      goods: z.number().optional(),
      food: z.number().optional(),
      service: z.number().optional(),
      other: z.number().optional(),
    })
    .optional(),
  customerCountBudgetDetail: z
    .object({
      goods: z.number().optional(),
      food: z.number().optional(),
      service: z.number().optional(),
      other: z.number().optional(),
    })
    .optional(),
  insDateTime: z.string().optional(),
  updDateTime: z.string().optional(),
});

export type DailyBudgetCreate = z.infer<typeof DailyBudgetCreate>;
export const DailyBudgetCreate = z.object({
  storeId: z.string(),
  date: z.string(),
  salesBudget: z.union([z.number(), z.undefined()]).optional(),
  salesTaxBudget: z.union([z.number(), z.undefined()]).optional(),
  customerCountBudget: z.union([z.number(), z.undefined()]).optional(),
  averageCustomerPriceBudget: z.union([z.number(), z.undefined()]).optional(),
  grossProfitBudget: z.union([z.number(), z.undefined()]).optional(),
  grossProfitRatioBudget: z.union([z.number(), z.undefined()]).optional(),
  creditPointBudget: z.union([z.number(), z.undefined()]).optional(),
  discountBudget: z.union([z.number(), z.undefined()]).optional(),
  salesBudgetDetail: z
    .union([
      z.object({
        goods: z.number().optional(),
        food: z.number().optional(),
        service: z.number().optional(),
        other: z.number().optional(),
      }),
      z.undefined(),
    ])
    .optional(),
  salesTaxBudgetDetail: z
    .union([
      z.object({
        goods: z.number().optional(),
        food: z.number().optional(),
        service: z.number().optional(),
        other: z.number().optional(),
      }),
      z.undefined(),
    ])
    .optional(),
  customerCountBudgetDetail: z
    .union([
      z.object({
        goods: z.number().optional(),
        food: z.number().optional(),
        service: z.number().optional(),
        other: z.number().optional(),
      }),
      z.undefined(),
    ])
    .optional(),
});

export type DailyBudgetUpdate = z.infer<typeof DailyBudgetUpdate>;
export const DailyBudgetUpdate = z.object({
  salesBudget: z.number().optional(),
  salesTaxBudget: z.number().optional(),
  customerCountBudget: z.number().optional(),
  averageCustomerPriceBudget: z.number().optional(),
  grossProfitBudget: z.number().optional(),
  grossProfitRatioBudget: z.number().optional(),
  creditPointBudget: z.number().optional(),
  discountBudget: z.number().optional(),
  salesBudgetDetail: z
    .object({
      goods: z.number().optional(),
      food: z.number().optional(),
      service: z.number().optional(),
      other: z.number().optional(),
    })
    .optional(),
  salesTaxBudgetDetail: z
    .object({
      goods: z.number().optional(),
      food: z.number().optional(),
      service: z.number().optional(),
      other: z.number().optional(),
    })
    .optional(),
  customerCountBudgetDetail: z
    .object({
      goods: z.number().optional(),
      food: z.number().optional(),
      service: z.number().optional(),
      other: z.number().optional(),
    })
    .optional(),
});

export type StaffBudget = z.infer<typeof StaffBudget>;
export const StaffBudget = z.object({
  budgetId: z.string().optional(),
  storeId: z.string().optional(),
  storeName: z.string().optional(),
  staffId: z.string().optional(),
  staffName: z.string().optional(),
  yearMonth: z.string().optional(),
  salesBudget: z.number().optional(),
  customerCountBudget: z.number().optional(),
  averageCustomerPriceBudget: z.number().optional(),
  insDateTime: z.string().optional(),
  updDateTime: z.string().optional(),
});

export type StaffBudgetCreate = z.infer<typeof StaffBudgetCreate>;
export const StaffBudgetCreate = z.object({
  storeId: z.string(),
  staffId: z.string(),
  yearMonth: z.string(),
  salesBudget: z.union([z.number(), z.undefined()]).optional(),
  customerCountBudget: z.union([z.number(), z.undefined()]).optional(),
  averageCustomerPriceBudget: z.union([z.number(), z.undefined()]).optional(),
});

export type StaffBudgetUpdate = z.infer<typeof StaffBudgetUpdate>;
export const StaffBudgetUpdate = z.object({
  salesBudget: z.number().optional(),
  customerCountBudget: z.number().optional(),
  averageCustomerPriceBudget: z.number().optional(),
});

export type Supplier = z.infer<typeof Supplier>;
export const Supplier = z.object({
  supplierId: z.string().optional(),
  supplierCode: z.string().optional(),
  supplierName: z.string().optional(),
  supplierAbbr: z.string().optional(),
  supplierDivisionId: z.string().optional(),
  supplierDivisionName: z.string().optional(),
  zipCode: z.string().optional(),
  address: z.string().optional(),
  phoneNumber: z.string().optional(),
  faxNumber: z.string().optional(),
  mailAddress: z.string().optional(),
  contactPersonName: z.string().optional(),
  note: z.string().optional(),
  status: z.union([z.literal("0"), z.literal("1")]).optional(),
  insDateTime: z.string().optional(),
  updDateTime: z.string().optional(),
});

export type SupplierCreate = z.infer<typeof SupplierCreate>;
export const SupplierCreate = z.object({
  supplierCode: z.string(),
  supplierName: z.string(),
  supplierAbbr: z.union([z.string(), z.undefined()]).optional(),
  supplierDivisionId: z.union([z.string(), z.undefined()]).optional(),
  zipCode: z.union([z.string(), z.undefined()]).optional(),
  address: z.union([z.string(), z.undefined()]).optional(),
  phoneNumber: z.union([z.string(), z.undefined()]).optional(),
  faxNumber: z.union([z.string(), z.undefined()]).optional(),
  mailAddress: z.union([z.string(), z.undefined()]).optional(),
  contactPersonName: z.union([z.string(), z.undefined()]).optional(),
  note: z.union([z.string(), z.undefined()]).optional(),
  status: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional(),
});

export type SupplierUpdate = z.infer<typeof SupplierUpdate>;
export const SupplierUpdate = z.object({
  supplierCode: z.string().optional(),
  supplierName: z.string().optional(),
  supplierAbbr: z.string().optional(),
  supplierDivisionId: z.string().optional(),
  zipCode: z.string().optional(),
  address: z.string().optional(),
  phoneNumber: z.string().optional(),
  faxNumber: z.string().optional(),
  mailAddress: z.string().optional(),
  contactPersonName: z.string().optional(),
  note: z.string().optional(),
  status: z.union([z.literal("0"), z.literal("1")]).optional(),
});

export type SupplierProduct = z.infer<typeof SupplierProduct>;
export const SupplierProduct = z.object({
  supplierProductId: z.string().optional(),
  supplierId: z.string().optional(),
  supplierName: z.string().optional(),
  productId: z.string().optional(),
  productCode: z.string().optional(),
  productName: z.string().optional(),
  supplierProductCode: z.string().optional(),
  supplierProductName: z.string().optional(),
  costPrice: z.number().optional(),
  orderPoint: z.number().optional(),
  orderLot: z.number().optional(),
  leadTime: z.number().optional(),
  status: z.union([z.literal("0"), z.literal("1")]).optional(),
  insDateTime: z.string().optional(),
  updDateTime: z.string().optional(),
});

export type SupplierProductCreate = z.infer<typeof SupplierProductCreate>;
export const SupplierProductCreate = z.object({
  productId: z.string(),
  supplierProductCode: z.union([z.string(), z.undefined()]).optional(),
  supplierProductName: z.union([z.string(), z.undefined()]).optional(),
  costPrice: z.union([z.number(), z.undefined()]).optional(),
  orderPoint: z.union([z.number(), z.undefined()]).optional(),
  orderLot: z.union([z.number(), z.undefined()]).optional(),
  leadTime: z.union([z.number(), z.undefined()]).optional(),
  status: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional(),
});

export type SupplierDivision = z.infer<typeof SupplierDivision>;
export const SupplierDivision = z.object({
  supplierDivisionId: z.string().optional(),
  supplierDivisionName: z.string().optional(),
  insDateTime: z.string().optional(),
  updDateTime: z.string().optional(),
});

export type SupplierDivisionCreate = z.infer<typeof SupplierDivisionCreate>;
export const SupplierDivisionCreate = z.object({
  supplierDivisionName: z.string(),
});

export type SupplierDivisionUpdate = z.infer<typeof SupplierDivisionUpdate>;
export const SupplierDivisionUpdate = z.object({
  supplierDivisionName: z.string().optional(),
});

export type Terminal = z.infer<typeof Terminal>;
export const Terminal = z.object({
  terminalId: z.string().optional(),
  terminalCode: z.string().optional(),
  terminalName: z.string().optional(),
  storeId: z.string().optional(),
  storeName: z.string().optional(),
  terminalType: z.union([z.literal("1"), z.literal("2"), z.literal("3")]).optional(),
  printerType: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.literal("3")]).optional(),
  printerName: z.string().optional(),
  printerIPAddress: z.string().optional(),
  printerPort: z.string().optional(),
  drawerType: z.union([z.literal("0"), z.literal("1")]).optional(),
  drawerName: z.string().optional(),
  drawerIPAddress: z.string().optional(),
  drawerPort: z.string().optional(),
  cardReaderType: z.union([z.literal("0"), z.literal("1"), z.literal("2")]).optional(),
  cardReaderName: z.string().optional(),
  cardReaderIPAddress: z.string().optional(),
  cardReaderPort: z.string().optional(),
  scannerType: z.union([z.literal("0"), z.literal("1")]).optional(),
  scannerName: z.string().optional(),
  scannerIPAddress: z.string().optional(),
  scannerPort: z.string().optional(),
  displayType: z.union([z.literal("0"), z.literal("1")]).optional(),
  displayName: z.string().optional(),
  displayIPAddress: z.string().optional(),
  displayPort: z.string().optional(),
  status: z.union([z.literal("0"), z.literal("1")]).optional(),
  insDateTime: z.string().optional(),
  updDateTime: z.string().optional(),
});

export type TerminalCreate = z.infer<typeof TerminalCreate>;
export const TerminalCreate = z.object({
  terminalCode: z.string(),
  terminalName: z.string(),
  storeId: z.string(),
  terminalType: z.union([z.literal("1"), z.literal("2"), z.literal("3"), z.undefined()]).optional(),
  printerType: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.literal("3"), z.undefined()]).optional(),
  printerName: z.union([z.string(), z.undefined()]).optional(),
  printerIPAddress: z.union([z.string(), z.undefined()]).optional(),
  printerPort: z.union([z.string(), z.undefined()]).optional(),
  drawerType: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional(),
  drawerName: z.union([z.string(), z.undefined()]).optional(),
  drawerIPAddress: z.union([z.string(), z.undefined()]).optional(),
  drawerPort: z.union([z.string(), z.undefined()]).optional(),
  cardReaderType: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.undefined()]).optional(),
  cardReaderName: z.union([z.string(), z.undefined()]).optional(),
  cardReaderIPAddress: z.union([z.string(), z.undefined()]).optional(),
  cardReaderPort: z.union([z.string(), z.undefined()]).optional(),
  scannerType: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional(),
  scannerName: z.union([z.string(), z.undefined()]).optional(),
  scannerIPAddress: z.union([z.string(), z.undefined()]).optional(),
  scannerPort: z.union([z.string(), z.undefined()]).optional(),
  displayType: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional(),
  displayName: z.union([z.string(), z.undefined()]).optional(),
  displayIPAddress: z.union([z.string(), z.undefined()]).optional(),
  displayPort: z.union([z.string(), z.undefined()]).optional(),
  status: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional(),
});

export type TerminalUpdate = z.infer<typeof TerminalUpdate>;
export const TerminalUpdate = z.object({
  terminalCode: z.string().optional(),
  terminalName: z.string().optional(),
  storeId: z.string().optional(),
  terminalType: z.union([z.literal("1"), z.literal("2"), z.literal("3")]).optional(),
  printerType: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.literal("3")]).optional(),
  printerName: z.string().optional(),
  printerIPAddress: z.string().optional(),
  printerPort: z.string().optional(),
  drawerType: z.union([z.literal("0"), z.literal("1")]).optional(),
  drawerName: z.string().optional(),
  drawerIPAddress: z.string().optional(),
  drawerPort: z.string().optional(),
  cardReaderType: z.union([z.literal("0"), z.literal("1"), z.literal("2")]).optional(),
  cardReaderName: z.string().optional(),
  cardReaderIPAddress: z.string().optional(),
  cardReaderPort: z.string().optional(),
  scannerType: z.union([z.literal("0"), z.literal("1")]).optional(),
  scannerName: z.string().optional(),
  scannerIPAddress: z.string().optional(),
  scannerPort: z.string().optional(),
  displayType: z.union([z.literal("0"), z.literal("1")]).optional(),
  displayName: z.string().optional(),
  displayIPAddress: z.string().optional(),
  displayPort: z.string().optional(),
  status: z.union([z.literal("0"), z.literal("1")]).optional(),
});

export type Settlement = z.infer<typeof Settlement>;
export const Settlement = z.object({
  settlementId: z.string().optional(),
  settlementNo: z.string().optional(),
  storeId: z.string().optional(),
  storeName: z.string().optional(),
  terminalId: z.string().optional(),
  terminalName: z.string().optional(),
  staffId: z.string().optional(),
  staffName: z.string().optional(),
  settlementDateTime: z.string().optional(),
  openingDateTime: z.string().optional(),
  closingDateTime: z.string().optional(),
  summary: z
    .object({
      salesTotal: z.number().optional(),
      returnTotal: z.number().optional(),
      discountTotal: z.number().optional(),
      transactionCount: z.number().optional(),
      customerCount: z.number().optional(),
    })
    .optional(),
  payments: z
    .array(
      z.object({
        paymentMethodId: z.string().optional(),
        paymentMethodName: z.string().optional(),
        amount: z.number().optional(),
        count: z.number().optional(),
      }),
    )
    .optional(),
  insDateTime: z.string().optional(),
  updDateTime: z.string().optional(),
});

export type SettlementCreate = z.infer<typeof SettlementCreate>;
export const SettlementCreate = z.object({
  storeId: z.string(),
  terminalId: z.string(),
  staffId: z.string(),
  settlementDateTime: z.union([z.string(), z.undefined()]).optional(),
  openingDateTime: z.string(),
  closingDateTime: z.string(),
  summary: z.object({
    salesTotal: z.number(),
    returnTotal: z.number(),
    discountTotal: z.number(),
    transactionCount: z.number(),
    customerCount: z.number(),
  }),
  payments: z.array(
    z.object({
      paymentMethodId: z.string(),
      amount: z.number(),
      count: z.number(),
    }),
  ),
});

export type DailySettlement = z.infer<typeof DailySettlement>;
export const DailySettlement = z.object({
  dailySettlementId: z.string().optional(),
  storeId: z.string().optional(),
  storeName: z.string().optional(),
  businessDate: z.string().optional(),
  closingDate: z.string().optional(),
  closingDateTime: z.string().optional(),
  staffId: z.string().optional(),
  staffName: z.string().optional(),
  summary: z
    .object({
      salesTotal: z.number().optional(),
      returnTotal: z.number().optional(),
      discountTotal: z.number().optional(),
      transactionCount: z.number().optional(),
      customerCount: z.number().optional(),
    })
    .optional(),
  payments: z
    .array(
      z.object({
        paymentMethodId: z.string().optional(),
        paymentMethodName: z.string().optional(),
        amount: z.number().optional(),
        count: z.number().optional(),
      }),
    )
    .optional(),
  status: z.union([z.literal("0"), z.literal("1")]).optional(),
  insDateTime: z.string().optional(),
  updDateTime: z.string().optional(),
});

export type DailySettlementCreate = z.infer<typeof DailySettlementCreate>;
export const DailySettlementCreate = z.object({
  storeId: z.string(),
  businessDate: z.string(),
  closingDate: z.string(),
  closingDateTime: z.union([z.string(), z.undefined()]).optional(),
  staffId: z.string(),
  summary: z.object({
    salesTotal: z.number(),
    returnTotal: z.number(),
    discountTotal: z.number(),
    transactionCount: z.number(),
    customerCount: z.number(),
  }),
  payments: z.array(
    z.object({
      paymentMethodId: z.string(),
      amount: z.number(),
      count: z.number(),
    }),
  ),
  status: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional(),
});

export type PaymentMethod = z.infer<typeof PaymentMethod>;
export const PaymentMethod = z.object({
  paymentMethodId: z.string().optional(),
  paymentMethodCode: z.string().optional(),
  paymentMethodName: z.string().optional(),
  paymentMethodDivisionId: z.string().optional(),
  paymentMethodDivisionName: z.string().optional(),
  amountInputType: z.union([z.literal("0"), z.literal("1"), z.literal("2")]).optional(),
  changeType: z.union([z.literal("0"), z.literal("1"), z.literal("2")]).optional(),
  sortNo: z.number().optional(),
  status: z.union([z.literal("0"), z.literal("1")]).optional(),
  insDateTime: z.string().optional(),
  updDateTime: z.string().optional(),
});

export type PaymentMethodCreate = z.infer<typeof PaymentMethodCreate>;
export const PaymentMethodCreate = z.object({
  paymentMethodCode: z.string(),
  paymentMethodName: z.string(),
  paymentMethodDivisionId: z.string(),
  amountInputType: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.undefined()]).optional(),
  changeType: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.undefined()]).optional(),
  sortNo: z.union([z.number(), z.undefined()]).optional(),
  status: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional(),
});

export type PaymentMethodUpdate = z.infer<typeof PaymentMethodUpdate>;
export const PaymentMethodUpdate = z.object({
  paymentMethodCode: z.string().optional(),
  paymentMethodName: z.string().optional(),
  paymentMethodDivisionId: z.string().optional(),
  amountInputType: z.union([z.literal("0"), z.literal("1"), z.literal("2")]).optional(),
  changeType: z.union([z.literal("0"), z.literal("1"), z.literal("2")]).optional(),
  sortNo: z.number().optional(),
  status: z.union([z.literal("0"), z.literal("1")]).optional(),
});

export type StorePaymentMethod = z.infer<typeof StorePaymentMethod>;
export const StorePaymentMethod = z.object({
  storePaymentMethodId: z.string().optional(),
  storeId: z.string().optional(),
  storeName: z.string().optional(),
  paymentMethodId: z.string().optional(),
  paymentMethodName: z.string().optional(),
  status: z.union([z.literal("0"), z.literal("1")]).optional(),
  insDateTime: z.string().optional(),
  updDateTime: z.string().optional(),
});

export type PaymentMethodDivision = z.infer<typeof PaymentMethodDivision>;
export const PaymentMethodDivision = z.object({
  paymentMethodDivisionId: z.string().optional(),
  paymentMethodDivisionName: z.string().optional(),
  insDateTime: z.string().optional(),
  updDateTime: z.string().optional(),
});

export type PaymentMethodDivisionCreate = z.infer<typeof PaymentMethodDivisionCreate>;
export const PaymentMethodDivisionCreate = z.object({
  paymentMethodDivisionName: z.string(),
});

export type PaymentMethodDivisionUpdate = z.infer<typeof PaymentMethodDivisionUpdate>;
export const PaymentMethodDivisionUpdate = z.object({
  paymentMethodDivisionName: z.string().optional(),
});

export type AppPaymentMethod = z.infer<typeof AppPaymentMethod>;
export const AppPaymentMethod = z.object({
  appPaymentMethodId: z.string().optional(),
  appId: z.string().optional(),
  appName: z.string().optional(),
  paymentMethodId: z.string().optional(),
  paymentMethodName: z.string().optional(),
  appPaymentCode: z.string().optional(),
  status: z.union([z.literal("0"), z.literal("1")]).optional(),
  insDateTime: z.string().optional(),
  updDateTime: z.string().optional(),
});

export type AppPaymentMethodCreate = z.infer<typeof AppPaymentMethodCreate>;
export const AppPaymentMethodCreate = z.object({
  paymentMethodId: z.string(),
  appPaymentCode: z.string(),
  status: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional(),
});

export type Coupon = z.infer<typeof Coupon>;
export const Coupon = z.object({
  id: z.number(),
  couponName: z.string(),
  couponCode: z.union([z.string(), z.undefined()]).optional(),
  couponType: z.number(),
  couponValue: z.number(),
  maxDiscount: z.union([z.number(), z.undefined()]).optional(),
  minAmount: z.union([z.number(), z.undefined()]).optional(),
  startDate: z.string(),
  endDate: z.string(),
  bonusDay: z.union([z.string(), z.undefined()]).optional(),
  bonusMonth: z.union([z.number(), z.undefined()]).optional(),
  uniqueUse: z.union([z.boolean(), z.undefined()]).optional(),
  validDays: z.union([z.number(), z.undefined()]).optional(),
  validCount: z.union([z.number(), z.undefined()]).optional(),
  limitCount: z.union([z.number(), z.undefined()]).optional(),
  isPublic: z.union([z.boolean(), z.undefined()]).optional(),
  description: z.union([z.string(), z.undefined()]).optional(),
  image: z.union([z.string(), z.undefined()]).optional(),
  storeTarget: z.union([z.string(), z.undefined()]).optional(),
  stores: z
    .union([
      z.array(
        z.object({
          id: z.number().optional(),
          storeName: z.string().optional(),
        }),
      ),
      z.undefined(),
    ])
    .optional(),
  productTarget: z.union([z.string(), z.undefined()]).optional(),
  isExcludeProductTarget: z.union([z.boolean(), z.undefined()]).optional(),
  isApplyBargain: z.union([z.boolean(), z.undefined()]).optional(),
  isApplyOtherCoupon: z.union([z.boolean(), z.undefined()]).optional(),
  createDate: z.union([z.string(), z.undefined()]).optional(),
  updateDate: z.union([z.string(), z.undefined()]).optional(),
});

export type CouponCreate = z.infer<typeof CouponCreate>;
export const CouponCreate = z.object({
  couponName: z.string(),
  couponCode: z.union([z.string(), z.undefined()]).optional(),
  couponType: z.number(),
  couponValue: z.number(),
  maxDiscount: z.union([z.number(), z.undefined()]).optional(),
  minAmount: z.union([z.number(), z.undefined()]).optional(),
  startDate: z.string(),
  endDate: z.string(),
  bonusDay: z.union([z.string(), z.undefined()]).optional(),
  bonusMonth: z.union([z.number(), z.undefined()]).optional(),
  uniqueUse: z.union([z.boolean(), z.undefined()]).optional(),
  validDays: z.union([z.number(), z.undefined()]).optional(),
  validCount: z.union([z.number(), z.undefined()]).optional(),
  limitCount: z.union([z.number(), z.undefined()]).optional(),
  isPublic: z.union([z.boolean(), z.undefined()]).optional(),
  description: z.union([z.string(), z.undefined()]).optional(),
  image: z.union([z.string(), z.undefined()]).optional(),
  storeTarget: z.union([z.string(), z.undefined()]).optional(),
  storeIds: z.union([z.array(z.number()), z.undefined()]).optional(),
  productTarget: z.union([z.string(), z.undefined()]).optional(),
  isExcludeProductTarget: z.union([z.boolean(), z.undefined()]).optional(),
  isApplyBargain: z.union([z.boolean(), z.undefined()]).optional(),
  isApplyOtherCoupon: z.union([z.boolean(), z.undefined()]).optional(),
});

export type CouponUpdate = z.infer<typeof CouponUpdate>;
export const CouponUpdate = z.object({
  couponName: z.string().optional(),
  couponCode: z.string().optional(),
  couponType: z.number().optional(),
  couponValue: z.number().optional(),
  maxDiscount: z.number().optional(),
  minAmount: z.number().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  bonusDay: z.string().optional(),
  bonusMonth: z.number().optional(),
  uniqueUse: z.boolean().optional(),
  validDays: z.number().optional(),
  validCount: z.number().optional(),
  limitCount: z.number().optional(),
  isPublic: z.boolean().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  storeTarget: z.string().optional(),
  storeIds: z.array(z.number()).optional(),
  productTarget: z.string().optional(),
  isExcludeProductTarget: z.boolean().optional(),
  isApplyBargain: z.boolean().optional(),
  isApplyOtherCoupon: z.boolean().optional(),
});

export type CouponProduct = z.infer<typeof CouponProduct>;
export const CouponProduct = z.object({
  id: z.number(),
  couponId: z.number(),
  productId: z.number(),
  productCode: z.union([z.string(), z.undefined()]).optional(),
  productName: z.union([z.string(), z.undefined()]).optional(),
  categoryId: z.union([z.number(), z.undefined()]).optional(),
  categoryName: z.union([z.string(), z.undefined()]).optional(),
  discountType: z.number(),
  discountValue: z.number(),
  createDate: z.union([z.string(), z.undefined()]).optional(),
  updateDate: z.union([z.string(), z.undefined()]).optional(),
});

export type CouponProductCreate = z.infer<typeof CouponProductCreate>;
export const CouponProductCreate = z.object({
  productId: z.number(),
  discountType: z.number(),
  discountValue: z.number(),
});

export type CouponProductUpdate = z.infer<typeof CouponProductUpdate>;
export const CouponProductUpdate = z.object({
  productId: z.number().optional(),
  discountType: z.number().optional(),
  discountValue: z.number().optional(),
});

export type Loss = z.infer<typeof Loss>;
export const Loss = z.object({
  lossId: z.string().optional(),
  storeId: z.string().optional(),
  lossDivisionId: z.string().optional(),
  lossDate: z.string().optional(),
  memo: z.string().optional(),
  insDateTime: z.string().optional(),
  updDateTime: z.string().optional(),
});

export type LossCreate = z.infer<typeof LossCreate>;
export const LossCreate = z.object({
  storeId: z.string(),
  lossDivisionId: z.string(),
  lossDate: z.string(),
  memo: z.union([z.string(), z.undefined()]).optional(),
  details: z.array(
    z.object({
      productId: z.string(),
      quantity: z.string(),
      unitCost: z.union([z.string(), z.undefined()]).optional(),
      memo: z.union([z.string(), z.undefined()]).optional(),
    }),
  ),
});

export type LossUpdate = z.infer<typeof LossUpdate>;
export const LossUpdate = z.object({
  storeId: z.string().optional(),
  lossDivisionId: z.string().optional(),
  lossDate: z.string().optional(),
  memo: z.string().optional(),
});

export type LossDetail = z.infer<typeof LossDetail>;
export const LossDetail = z.object({
  lossId: z.string().optional(),
  lossDetailId: z.string().optional(),
  productId: z.string().optional(),
  productName: z.string().optional(),
  quantity: z.string().optional(),
  unitCost: z.string().optional(),
  memo: z.string().optional(),
  insDateTime: z.string().optional(),
  updDateTime: z.string().optional(),
});

export type LossDivision = z.infer<typeof LossDivision>;
export const LossDivision = z.object({
  lossDivisionId: z.string().optional(),
  lossDivisionName: z.string().optional(),
  insDateTime: z.string().optional(),
  updDateTime: z.string().optional(),
});

export type LossDivisionCreate = z.infer<typeof LossDivisionCreate>;
export const LossDivisionCreate = z.object({
  lossDivisionName: z.string(),
});

export type LossDivisionUpdate = z.infer<typeof LossDivisionUpdate>;
export const LossDivisionUpdate = z.object({
  lossDivisionName: z.string().optional(),
});

export type Order = z.infer<typeof Order>;
export const Order = z.object({
  orderId: z.string().optional(),
  storeId: z.string().optional(),
  supplierId: z.string().optional(),
  estimatedArrivalDate: z.string().optional(),
  orderDate: z.string().optional(),
  memo: z.string().optional(),
  status: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.literal("3")]).optional(),
  insDateTime: z.string().optional(),
  updDateTime: z.string().optional(),
});

export type OrderCreate = z.infer<typeof OrderCreate>;
export const OrderCreate = z.object({
  storeId: z.string(),
  supplierId: z.string(),
  estimatedArrivalDate: z.union([z.string(), z.undefined()]).optional(),
  orderDate: z.string(),
  memo: z.union([z.string(), z.undefined()]).optional(),
  status: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.literal("3"), z.undefined()]).optional(),
  details: z
    .union([
      z.array(
        z.object({
          productId: z.string().optional(),
          quantity: z.string().optional(),
          memo: z.string().optional(),
        }),
      ),
      z.undefined(),
    ])
    .optional(),
});

export type OrderUpdate = z.infer<typeof OrderUpdate>;
export const OrderUpdate = z.object({
  storeId: z.string().optional(),
  supplierId: z.string().optional(),
  estimatedArrivalDate: z.string().optional(),
  orderDate: z.string().optional(),
  memo: z.string().optional(),
  status: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.literal("3")]).optional(),
});

export type OrderProduct = z.infer<typeof OrderProduct>;
export const OrderProduct = z.object({
  productId: z.string().optional(),
  productCode: z.string().optional(),
  productName: z.string().optional(),
  categoryId: z.string().optional(),
  categoryName: z.string().optional(),
  inventoryQuantity: z.string().optional(),
  remainsInventories: z.string().optional(),
  orderPoint: z.string().optional(),
});

export type OrderStore = z.infer<typeof OrderStore>;
export const OrderStore = z.object({
  storeId: z.string().optional(),
  storeName: z.string().optional(),
  storeCode: z.string().optional(),
});

export type Arrival = z.infer<typeof Arrival>;
export const Arrival = z.object({
  arrivalId: z.string().optional(),
  orderId: z.string().optional(),
  storeId: z.string().optional(),
  supplierId: z.string().optional(),
  arrivalDate: z.string().optional(),
  memo: z.string().optional(),
  status: z.union([z.literal("0"), z.literal("1"), z.literal("2")]).optional(),
  insDateTime: z.string().optional(),
  updDateTime: z.string().optional(),
});

export type ArrivalCreate = z.infer<typeof ArrivalCreate>;
export const ArrivalCreate = z.object({
  orderId: z.union([z.string(), z.undefined()]).optional(),
  storeId: z.string(),
  supplierId: z.union([z.string(), z.undefined()]).optional(),
  arrivalDate: z.string(),
  memo: z.union([z.string(), z.undefined()]).optional(),
  status: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.undefined()]).optional(),
});

export type ArrivalUpdate = z.infer<typeof ArrivalUpdate>;
export const ArrivalUpdate = z.object({
  orderId: z.string().optional(),
  storeId: z.string().optional(),
  supplierId: z.string().optional(),
  arrivalDate: z.string().optional(),
  memo: z.string().optional(),
  status: z.union([z.literal("0"), z.literal("1"), z.literal("2")]).optional(),
});

export type ArrivalDetail = z.infer<typeof ArrivalDetail>;
export const ArrivalDetail = z.object({
  arrivalId: z.string().optional(),
  arrivalDetailId: z.string().optional(),
  productId: z.string().optional(),
  orderDetailId: z.string().optional(),
  quantity: z.string().optional(),
  cost: z.string().optional(),
  memo: z.string().optional(),
  insDateTime: z.string().optional(),
  updDateTime: z.string().optional(),
});

export type Shipment = z.infer<typeof Shipment>;
export const Shipment = z.object({
  shipmentId: z.string().optional(),
  storeId: z.string().optional(),
  shipmentDate: z.string().optional(),
  destinationStoreId: z.string().optional(),
  memo: z.string().optional(),
  status: z.union([z.literal("0"), z.literal("1"), z.literal("2")]).optional(),
  insDateTime: z.string().optional(),
  updDateTime: z.string().optional(),
});

export type ShipmentCreate = z.infer<typeof ShipmentCreate>;
export const ShipmentCreate = z.object({
  storeId: z.string(),
  shipmentDate: z.string(),
  destinationStoreId: z.string(),
  memo: z.union([z.string(), z.undefined()]).optional(),
  status: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.undefined()]).optional(),
});

export type ShipmentUpdate = z.infer<typeof ShipmentUpdate>;
export const ShipmentUpdate = z.object({
  storeId: z.string().optional(),
  shipmentDate: z.string().optional(),
  destinationStoreId: z.string().optional(),
  memo: z.string().optional(),
  status: z.union([z.literal("0"), z.literal("1"), z.literal("2")]).optional(),
});

export type ShipmentDetail = z.infer<typeof ShipmentDetail>;
export const ShipmentDetail = z.object({
  shipmentId: z.string().optional(),
  shipmentDetailId: z.string().optional(),
  productId: z.string().optional(),
  quantity: z.string().optional(),
  memo: z.string().optional(),
  insDateTime: z.string().optional(),
  updDateTime: z.string().optional(),
});

export type IncomingStock = z.infer<typeof IncomingStock>;
export const IncomingStock = z.object({
  id: z.number(),
  division: z.number(),
  divisionName: z.union([z.string(), z.undefined()]).optional(),
  status: z.number(),
  statusName: z.union([z.string(), z.undefined()]).optional(),
  storeId: z.number(),
  storeName: z.union([z.string(), z.undefined()]).optional(),
  supplierStoreId: z.union([z.number(), z.undefined()]).optional(),
  supplierStoreName: z.union([z.string(), z.undefined()]).optional(),
  supplierId: z.union([z.number(), z.undefined()]).optional(),
  supplierName: z.union([z.string(), z.undefined()]).optional(),
  arrivalId: z.union([z.number(), z.undefined()]).optional(),
  arrivalDate: z.union([z.string(), z.undefined()]).optional(),
  orderId: z.union([z.number(), z.undefined()]).optional(),
  targetDate: z.string(),
  estimatedDate: z.union([z.string(), z.undefined()]).optional(),
  staffId: z.union([z.number(), z.undefined()]).optional(),
  staffName: z.union([z.string(), z.undefined()]).optional(),
  memo: z.union([z.string(), z.undefined()]).optional(),
  totalAmount: z.union([z.number(), z.undefined()]).optional(),
  productCount: z.union([z.number(), z.undefined()]).optional(),
  createDate: z.union([z.string(), z.undefined()]).optional(),
  updateDate: z.union([z.string(), z.undefined()]).optional(),
});

export type IncomingStockUpdate = z.infer<typeof IncomingStockUpdate>;
export const IncomingStockUpdate = z.object({
  division: z.number().optional(),
  status: z.number().optional(),
  storeId: z.number().optional(),
  supplierStoreId: z.number().optional(),
  supplierId: z.number().optional(),
  arrivalId: z.number().optional(),
  arrivalDate: z.string().optional(),
  orderId: z.number().optional(),
  targetDate: z.string().optional(),
  estimatedDate: z.string().optional(),
  staffId: z.number().optional(),
  memo: z.string().optional(),
});

export type IncomingStockDetail = z.infer<typeof IncomingStockDetail>;
export const IncomingStockDetail = z.object({
  id: z.number(),
  incomingStockId: z.number(),
  productId: z.number(),
  productCode: z.union([z.string(), z.undefined()]).optional(),
  productName: z.union([z.string(), z.undefined()]).optional(),
  barcode: z.union([z.string(), z.undefined()]).optional(),
  categoryId: z.union([z.number(), z.undefined()]).optional(),
  categoryName: z.union([z.string(), z.undefined()]).optional(),
  quantity: z.number(),
  costPrice: z.union([z.number(), z.undefined()]).optional(),
  price: z.union([z.number(), z.undefined()]).optional(),
  memo: z.union([z.string(), z.undefined()]).optional(),
  createDate: z.union([z.string(), z.undefined()]).optional(),
  updateDate: z.union([z.string(), z.undefined()]).optional(),
});

export type OutgoingStock = z.infer<typeof OutgoingStock>;
export const OutgoingStock = z.object({
  id: z.number(),
  division: z.number(),
  divisionName: z.union([z.string(), z.undefined()]).optional(),
  status: z.number(),
  statusName: z.union([z.string(), z.undefined()]).optional(),
  storeId: z.number(),
  storeName: z.union([z.string(), z.undefined()]).optional(),
  destinationStoreId: z.union([z.number(), z.undefined()]).optional(),
  destinationStoreName: z.union([z.string(), z.undefined()]).optional(),
  supplierId: z.union([z.number(), z.undefined()]).optional(),
  supplierName: z.union([z.string(), z.undefined()]).optional(),
  shipmentId: z.union([z.number(), z.undefined()]).optional(),
  shipmentDate: z.union([z.string(), z.undefined()]).optional(),
  targetDate: z.string(),
  estimatedDate: z.union([z.string(), z.undefined()]).optional(),
  staffId: z.union([z.number(), z.undefined()]).optional(),
  staffName: z.union([z.string(), z.undefined()]).optional(),
  memo: z.union([z.string(), z.undefined()]).optional(),
  totalAmount: z.union([z.number(), z.undefined()]).optional(),
  productCount: z.union([z.number(), z.undefined()]).optional(),
  createDate: z.union([z.string(), z.undefined()]).optional(),
  updateDate: z.union([z.string(), z.undefined()]).optional(),
});

export type OutgoingStockCreate = z.infer<typeof OutgoingStockCreate>;
export const OutgoingStockCreate = z.object({
  division: z.number(),
  status: z.number(),
  storeId: z.number(),
  destinationStoreId: z.union([z.number(), z.undefined()]).optional(),
  supplierId: z.union([z.number(), z.undefined()]).optional(),
  shipmentId: z.union([z.number(), z.undefined()]).optional(),
  shipmentDate: z.union([z.string(), z.undefined()]).optional(),
  targetDate: z.string(),
  estimatedDate: z.union([z.string(), z.undefined()]).optional(),
  staffId: z.union([z.number(), z.undefined()]).optional(),
  memo: z.union([z.string(), z.undefined()]).optional(),
  details: z.array(
    z.object({
      productId: z.number(),
      quantity: z.number(),
      costPrice: z.union([z.number(), z.undefined()]).optional(),
      memo: z.union([z.string(), z.undefined()]).optional(),
    }),
  ),
});

export type OutgoingStockUpdate = z.infer<typeof OutgoingStockUpdate>;
export const OutgoingStockUpdate = z.object({
  division: z.number().optional(),
  status: z.number().optional(),
  storeId: z.number().optional(),
  destinationStoreId: z.number().optional(),
  supplierId: z.number().optional(),
  shipmentId: z.number().optional(),
  shipmentDate: z.string().optional(),
  targetDate: z.string().optional(),
  estimatedDate: z.string().optional(),
  staffId: z.number().optional(),
  memo: z.string().optional(),
});

export type OutgoingStockDetail = z.infer<typeof OutgoingStockDetail>;
export const OutgoingStockDetail = z.object({
  id: z.number(),
  outgoingStockId: z.number(),
  productId: z.number(),
  productCode: z.union([z.string(), z.undefined()]).optional(),
  productName: z.union([z.string(), z.undefined()]).optional(),
  barcode: z.union([z.string(), z.undefined()]).optional(),
  categoryId: z.union([z.number(), z.undefined()]).optional(),
  categoryName: z.union([z.string(), z.undefined()]).optional(),
  quantity: z.number(),
  costPrice: z.union([z.number(), z.undefined()]).optional(),
  price: z.union([z.number(), z.undefined()]).optional(),
  memo: z.union([z.string(), z.undefined()]).optional(),
  createDate: z.union([z.string(), z.undefined()]).optional(),
  updateDate: z.union([z.string(), z.undefined()]).optional(),
});

export type CorrectionRequestOutgoingStock = z.infer<typeof CorrectionRequestOutgoingStock>;
export const CorrectionRequestOutgoingStock = z.object({
  id: z.number(),
  outgoingStockId: z.number(),
  storeId: z.number(),
  storeName: z.union([z.string(), z.undefined()]).optional(),
  status: z.number(),
  statusName: z.union([z.string(), z.undefined()]).optional(),
  requestDate: z.string(),
  requestReason: z.union([z.string(), z.undefined()]).optional(),
  requestStaffId: z.union([z.number(), z.undefined()]).optional(),
  requestStaffName: z.union([z.string(), z.undefined()]).optional(),
  approvalDate: z.union([z.string(), z.undefined()]).optional(),
  approvalReason: z.union([z.string(), z.undefined()]).optional(),
  approvalStaffId: z.union([z.number(), z.undefined()]).optional(),
  approvalStaffName: z.union([z.string(), z.undefined()]).optional(),
  createDate: z.union([z.string(), z.undefined()]).optional(),
  updateDate: z.union([z.string(), z.undefined()]).optional(),
});

export type Stocktaking = z.infer<typeof Stocktaking>;
export const Stocktaking = z.object({
  id: z.number(),
  stocktakingName: z.string(),
  storeId: z.number(),
  storeName: z.union([z.string(), z.undefined()]).optional(),
  stocktakingStatus: z.number(),
  startDate: z.string(),
  endDate: z.union([z.string(), z.undefined()]).optional(),
  stockAmount: z.union([z.number(), z.undefined()]).optional(),
  staffId: z.union([z.number(), z.undefined()]).optional(),
  staffName: z.union([z.string(), z.undefined()]).optional(),
  memo: z.union([z.string(), z.undefined()]).optional(),
  isExcludeOutOfStock: z.union([z.boolean(), z.undefined()]).optional(),
  categoryTarget: z.union([z.number(), z.undefined()]).optional(),
  createDate: z.union([z.string(), z.undefined()]).optional(),
  updateDate: z.union([z.string(), z.undefined()]).optional(),
});

export type StocktakingCategory = z.infer<typeof StocktakingCategory>;
export const StocktakingCategory = z.object({
  id: z.number(),
  stocktakingId: z.number(),
  storeId: z.number(),
  categoryId: z.number(),
  categoryCode: z.union([z.string(), z.undefined()]).optional(),
  categoryName: z.union([z.string(), z.undefined()]).optional(),
  isComplete: z.boolean(),
  productCount: z.union([z.number(), z.undefined()]).optional(),
  countedProductCount: z.union([z.number(), z.undefined()]).optional(),
  countedRatio: z.union([z.number(), z.undefined()]).optional(),
  createDate: z.union([z.string(), z.undefined()]).optional(),
  updateDate: z.union([z.string(), z.undefined()]).optional(),
});

export type StocktakingProduct = z.infer<typeof StocktakingProduct>;
export const StocktakingProduct = z.object({
  id: z.number(),
  stocktakingId: z.number(),
  storeId: z.number(),
  productId: z.number(),
  productCode: z.union([z.string(), z.undefined()]).optional(),
  productName: z.union([z.string(), z.undefined()]).optional(),
  barcode: z.union([z.string(), z.undefined()]).optional(),
  categoryId: z.union([z.number(), z.undefined()]).optional(),
  categoryName: z.union([z.string(), z.undefined()]).optional(),
  price: z.union([z.number(), z.undefined()]).optional(),
  cost: z.union([z.number(), z.undefined()]).optional(),
  isTaxIncluded: z.union([z.boolean(), z.undefined()]).optional(),
  taxRate: z.union([z.number(), z.undefined()]).optional(),
  inventoryQuantity: z.number(),
  countedQuantity: z.union([z.number(), z.undefined()]).optional(),
  differenceQuantity: z.union([z.number(), z.undefined()]).optional(),
  isCounted: z.boolean(),
  createDate: z.union([z.string(), z.undefined()]).optional(),
  updateDate: z.union([z.string(), z.undefined()]).optional(),
});

export type StocktakingStock = z.infer<typeof StocktakingStock>;
export const StocktakingStock = z.object({
  id: z.number(),
  stocktakingId: z.number(),
  storeId: z.number(),
  productId: z.number(),
  productCode: z.union([z.string(), z.undefined()]).optional(),
  productName: z.union([z.string(), z.undefined()]).optional(),
  inventoryQuantity: z.number(),
  countedQuantity: z.number(),
  differenceQuantity: z.number(),
  price: z.union([z.number(), z.undefined()]).optional(),
  inventoryAmount: z.union([z.number(), z.undefined()]).optional(),
  countedAmount: z.union([z.number(), z.undefined()]).optional(),
  differenceAmount: z.union([z.number(), z.undefined()]).optional(),
  createDate: z.union([z.string(), z.undefined()]).optional(),
  updateDate: z.union([z.string(), z.undefined()]).optional(),
});

export type TaxRate = z.infer<typeof TaxRate>;
export const TaxRate = z.object({
  id: z.number(),
  name: z.string(),
  rate: z.number(),
  effectiveFrom: z.string(),
  displayOrder: z.union([z.number(), z.undefined()]).optional(),
  description: z.union([z.string(), z.undefined()]).optional(),
  isDefault: z.union([z.boolean(), z.undefined()]).optional(),
  createDate: z.union([z.string(), z.undefined()]).optional(),
  updateDate: z.union([z.string(), z.undefined()]).optional(),
});

export type ReduceTaxRate = z.infer<typeof ReduceTaxRate>;
export const ReduceTaxRate = z.object({
  id: z.number(),
  name: z.string(),
  rate: z.number(),
  effectiveFrom: z.string(),
  displayOrder: z.union([z.number(), z.undefined()]).optional(),
  description: z.union([z.string(), z.undefined()]).optional(),
  createDate: z.union([z.string(), z.undefined()]).optional(),
  updateDate: z.union([z.string(), z.undefined()]).optional(),
});

export type ReceiptRemark = z.infer<typeof ReceiptRemark>;
export const ReceiptRemark = z.object({
  id: z.number(),
  text: z.string(),
  displayOrder: z.union([z.number(), z.undefined()]).optional(),
  isDefault: z.union([z.boolean(), z.undefined()]).optional(),
  createDate: z.union([z.string(), z.undefined()]).optional(),
  updateDate: z.union([z.string(), z.undefined()]).optional(),
});

export type ReceiptRemarkCreate = z.infer<typeof ReceiptRemarkCreate>;
export const ReceiptRemarkCreate = z.object({
  text: z.string(),
  displayOrder: z.union([z.number(), z.undefined()]).optional(),
  isDefault: z.union([z.boolean(), z.undefined()]).optional(),
});

export type DiscountDivision = z.infer<typeof DiscountDivision>;
export const DiscountDivision = z.object({
  id: z.number(),
  divisionName: z.string(),
  code: z.union([z.string(), z.undefined()]).optional(),
  displayOrder: z.union([z.number(), z.undefined()]).optional(),
  createDate: z.union([z.string(), z.undefined()]).optional(),
  updateDate: z.union([z.string(), z.undefined()]).optional(),
});

export type CatCctCardCompany = z.infer<typeof CatCctCardCompany>;
export const CatCctCardCompany = z.object({
  id: z.number(),
  cardCompanyName: z.string(),
  cardCompanyCode: z.string(),
  inputMode: z.number(),
  displayOrder: z.union([z.number(), z.undefined()]).optional(),
  createDate: z.union([z.string(), z.undefined()]).optional(),
  updateDate: z.union([z.string(), z.undefined()]).optional(),
});

export type CustomerType = z.infer<typeof CustomerType>;
export const CustomerType = z.object({
  id: z.number(),
  code: z.string(),
  name: z.string(),
  isDefault: z.union([z.boolean(), z.undefined()]).optional(),
  displayOrder: z.union([z.number(), z.undefined()]).optional(),
  createDate: z.union([z.string(), z.undefined()]).optional(),
  updateDate: z.union([z.string(), z.undefined()]).optional(),
});

export type CustomerTypeCreate = z.infer<typeof CustomerTypeCreate>;
export const CustomerTypeCreate = z.object({
  code: z.string(),
  name: z.string(),
  isDefault: z.union([z.boolean(), z.undefined()]).optional(),
  displayOrder: z.union([z.number(), z.undefined()]).optional(),
});

export type CustomerTypeUpdate = z.infer<typeof CustomerTypeUpdate>;
export const CustomerTypeUpdate = z.object({
  code: z.string().optional(),
  name: z.string().optional(),
  isDefault: z.boolean().optional(),
  displayOrder: z.number().optional(),
});

export type CustomerTypeSection = z.infer<typeof CustomerTypeSection>;
export const CustomerTypeSection = z.object({
  id: z.number(),
  customerTypeId: z.number(),
  name: z.string(),
  value: z.union([z.string(), z.undefined()]).optional(),
  fieldType: z.number(),
  isRequired: z.union([z.boolean(), z.undefined()]).optional(),
  choices: z.union([z.string(), z.undefined()]).optional(),
  displayOrder: z.union([z.number(), z.undefined()]).optional(),
  createDate: z.union([z.string(), z.undefined()]).optional(),
  updateDate: z.union([z.string(), z.undefined()]).optional(),
});

export type CustomerTypeSectionUpdate = z.infer<typeof CustomerTypeSectionUpdate>;
export const CustomerTypeSectionUpdate = z.object({
  id: z.number(),
  name: z.union([z.string(), z.undefined()]).optional(),
  fieldType: z.union([z.number(), z.undefined()]).optional(),
  isRequired: z.union([z.boolean(), z.undefined()]).optional(),
  choices: z.union([z.string(), z.undefined()]).optional(),
  displayOrder: z.union([z.number(), z.undefined()]).optional(),
});

export type get_Categories = typeof get_Categories;
export const get_Categories = {
  method: z.literal("GET"),
  path: z.literal("/categories"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      fields: z.array(z.string()).optional(),
      sort: z.string().optional(),
      limit: z.number().optional(),
      page: z.number().optional(),
      category_code: z.string().optional(),
      level: z.union([z.literal("1"), z.literal("2"), z.literal("3")]).optional(),
    }),
    path: z.object({
      contract_id: z.string(),
    }),
  }),
  response: z.array(Category),
};

export type post_Categories = typeof post_Categories;
export const post_Categories = {
  method: z.literal("POST"),
  path: z.literal("/categories"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      contract_id: z.string(),
    }),
    body: CategoryCreate,
  }),
  response: Category,
};

export type get_CategoriesId = typeof get_CategoriesId;
export const get_CategoriesId = {
  method: z.literal("GET"),
  path: z.literal("/categories/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      fields: z.array(z.string()).optional(),
    }),
    path: z.object({
      contract_id: z.string(),
      id: z.string(),
    }),
  }),
  response: Category,
};

export type patch_CategoriesId = typeof patch_CategoriesId;
export const patch_CategoriesId = {
  method: z.literal("PATCH"),
  path: z.literal("/categories/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      contract_id: z.string(),
      id: z.string(),
    }),
    body: CategoryUpdate,
  }),
  response: Category,
};

export type delete_CategoriesId = typeof delete_CategoriesId;
export const delete_CategoriesId = {
  method: z.literal("DELETE"),
  path: z.literal("/categories/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      contract_id: z.string(),
      id: z.string(),
    }),
  }),
  response: z.unknown(),
};

export type get_Category_groups = typeof get_Category_groups;
export const get_Category_groups = {
  method: z.literal("GET"),
  path: z.literal("/category_groups"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      fields: z.array(z.string()).optional(),
      sort: z.string().optional(),
      limit: z.number().optional(),
      page: z.number().optional(),
      category_group_id: z.string().optional(),
      category_group_code: z.string().optional(),
    }),
    path: z.object({
      contract_id: z.string(),
    }),
  }),
  response: z.array(CategoryGroup),
};

export type post_Category_groups = typeof post_Category_groups;
export const post_Category_groups = {
  method: z.literal("POST"),
  path: z.literal("/category_groups"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      contract_id: z.string(),
    }),
    body: CategoryGroupCreate,
  }),
  response: CategoryGroup,
};

export type patch_Category_groupsId = typeof patch_Category_groupsId;
export const patch_Category_groupsId = {
  method: z.literal("PATCH"),
  path: z.literal("/category_groups/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      contract_id: z.string(),
      id: z.string(),
    }),
    body: CategoryGroupUpdate,
  }),
  response: CategoryGroup,
};

export type delete_Category_groupsId = typeof delete_Category_groupsId;
export const delete_Category_groupsId = {
  method: z.literal("DELETE"),
  path: z.literal("/category_groups/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      contract_id: z.string(),
      id: z.string(),
    }),
  }),
  response: z.unknown(),
};

export type get_GetProducts = typeof get_GetProducts;
export const get_GetProducts = {
  method: z.literal("GET"),
  path: z.literal("/products"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      limit: z.number().optional(),
      page: z.number().optional(),
      sort: z
        .union([
          z.literal("productId"),
          z.literal("productCode"),
          z.literal("productName"),
          z.literal("categoryId"),
          z.literal("supplierName"),
          z.literal("price"),
          z.literal("cost"),
          z.literal("modified"),
        ])
        .optional(),
      order: z.union([z.literal("asc"), z.literal("desc")]).optional(),
      productId: z.number().optional(),
      productCode: z.string().optional(),
      janCode: z.string().optional(),
      productName: z.string().optional(),
      categoryId: z.number().optional(),
      categoryCode: z.string().optional(),
      supplierId: z.number().optional(),
      supplierCode: z.string().optional(),
      storeId: z.number().optional(),
      status: z.union([z.literal(0), z.literal(1)]).optional(),
      productType: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(9)]).optional(),
      fields: z.array(z.string()).optional(),
    }),
  }),
  response: z.object({
    items: z.array(Product).optional(),
    total: z.number().optional(),
    limit: z.number().optional(),
    page: z.number().optional(),
  }),
};

export type post_CreateProduct = typeof post_CreateProduct;
export const post_CreateProduct = {
  method: z.literal("POST"),
  path: z.literal("/products"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    body: ProductCreate,
  }),
  response: Product,
};

export type get_GetProduct = typeof get_GetProduct;
export const get_GetProduct = {
  method: z.literal("GET"),
  path: z.literal("/products/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      fields: z.array(z.string()).optional(),
    }),
    path: z.object({
      id: z.number(),
    }),
  }),
  response: Product,
};

export type put_UpdateProduct = typeof put_UpdateProduct;
export const put_UpdateProduct = {
  method: z.literal("PUT"),
  path: z.literal("/products/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.number(),
    }),
    body: ProductUpdate,
  }),
  response: Product,
};

export type delete_DeleteProduct = typeof delete_DeleteProduct;
export const delete_DeleteProduct = {
  method: z.literal("DELETE"),
  path: z.literal("/products/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.number(),
    }),
  }),
  response: z.unknown(),
};

export type post_BulkCreateProducts = typeof post_BulkCreateProducts;
export const post_BulkCreateProducts = {
  method: z.literal("POST"),
  path: z.literal("/products/bulk"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    body: ProductBulkCreate,
  }),
  response: z.object({
    items: z.array(Product).optional(),
  }),
};

export type put_BulkUpdateProducts = typeof put_BulkUpdateProducts;
export const put_BulkUpdateProducts = {
  method: z.literal("PUT"),
  path: z.literal("/products/bulk"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    body: ProductBulkUpdate,
  }),
  response: z.object({
    items: z.array(Product).optional(),
  }),
};

export type get_GetProductPrices = typeof get_GetProductPrices;
export const get_GetProductPrices = {
  method: z.literal("GET"),
  path: z.literal("/products/{id}/prices"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      storeId: z.number().optional(),
      priceDivision: z.number().optional(),
      startDate: z.string().optional(),
      fields: z.array(z.string()).optional(),
    }),
    path: z.object({
      id: z.number(),
    }),
  }),
  response: z.object({
    items: z.array(ProductPrice).optional(),
    total: z.number().optional(),
  }),
};

export type post_CreateProductPrice = typeof post_CreateProductPrice;
export const post_CreateProductPrice = {
  method: z.literal("POST"),
  path: z.literal("/products/{id}/prices"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.number(),
    }),
    body: ProductPrice,
  }),
  response: ProductPrice,
};

export type put_UpdateProductPrices = typeof put_UpdateProductPrices;
export const put_UpdateProductPrices = {
  method: z.literal("PUT"),
  path: z.literal("/products/{id}/prices"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.number(),
    }),
    body: z.object({
      items: z.array(ProductPrice).optional(),
    }),
  }),
  response: z.object({
    items: z.array(ProductPrice).optional(),
  }),
};

export type get_GetProductPriceChanges = typeof get_GetProductPriceChanges;
export const get_GetProductPriceChanges = {
  method: z.literal("GET"),
  path: z.literal("/products/{id}/prices/changes"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      storeId: z.number().optional(),
      priceDivision: z.number().optional(),
      limit: z.number().optional(),
      page: z.number().optional(),
      fields: z.array(z.string()).optional(),
    }),
    path: z.object({
      id: z.number(),
    }),
  }),
  response: z.object({
    items: z.array(ProductPriceChange).optional(),
    total: z.number().optional(),
    limit: z.number().optional(),
    page: z.number().optional(),
  }),
};

export type get_GetProductReserveItems = typeof get_GetProductReserveItems;
export const get_GetProductReserveItems = {
  method: z.literal("GET"),
  path: z.literal("/products/{id}/reserve_items"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      fields: z.array(z.string()).optional(),
    }),
    path: z.object({
      id: z.number(),
    }),
  }),
  response: z.object({
    items: z.array(ProductReserveItem).optional(),
    total: z.number().optional(),
  }),
};

export type post_CreateProductReserveItem = typeof post_CreateProductReserveItem;
export const post_CreateProductReserveItem = {
  method: z.literal("POST"),
  path: z.literal("/products/{id}/reserve_items"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.number(),
    }),
    body: ProductReserveItem,
  }),
  response: ProductReserveItem,
};

export type put_UpdateProductReserveItems = typeof put_UpdateProductReserveItems;
export const put_UpdateProductReserveItems = {
  method: z.literal("PUT"),
  path: z.literal("/products/{id}/reserve_items"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.number(),
    }),
    body: z.object({
      items: z.array(ProductReserveItem).optional(),
    }),
  }),
  response: z.object({
    items: z.array(ProductReserveItem).optional(),
  }),
};

export type get_GetProductAttributes = typeof get_GetProductAttributes;
export const get_GetProductAttributes = {
  method: z.literal("GET"),
  path: z.literal("/products/attributes"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      limit: z.number().optional(),
      page: z.number().optional(),
      attributeNo: z.number().optional(),
      attributeName: z.string().optional(),
      fields: z.array(z.string()).optional(),
    }),
  }),
  response: z.object({
    items: z.array(ProductAttribute).optional(),
    total: z.number().optional(),
    limit: z.number().optional(),
    page: z.number().optional(),
  }),
};

export type post_CreateProductAttribute = typeof post_CreateProductAttribute;
export const post_CreateProductAttribute = {
  method: z.literal("POST"),
  path: z.literal("/products/attributes"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    body: ProductAttribute,
  }),
  response: ProductAttribute,
};

export type get_GetProductAttributeItems = typeof get_GetProductAttributeItems;
export const get_GetProductAttributeItems = {
  method: z.literal("GET"),
  path: z.literal("/products/attribute_items"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      limit: z.number().optional(),
      page: z.number().optional(),
      attributeNo: z.number().optional(),
      attributeItemCode: z.string().optional(),
      attributeItemName: z.string().optional(),
      fields: z.array(z.string()).optional(),
    }),
  }),
  response: z.object({
    items: z.array(ProductAttributeItem).optional(),
    total: z.number().optional(),
    limit: z.number().optional(),
    page: z.number().optional(),
  }),
};

export type post_CreateProductAttributeItem = typeof post_CreateProductAttributeItem;
export const post_CreateProductAttributeItem = {
  method: z.literal("POST"),
  path: z.literal("/products/attribute_items"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    body: ProductAttributeItem,
  }),
  response: ProductAttributeItem,
};

export type get_GetProductStores = typeof get_GetProductStores;
export const get_GetProductStores = {
  method: z.literal("GET"),
  path: z.literal("/products/{id}/stores"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      storeId: z.number().optional(),
      fields: z.array(z.string()).optional(),
    }),
    path: z.object({
      id: z.number(),
    }),
  }),
  response: z.object({
    items: z.array(ProductStore).optional(),
    total: z.number().optional(),
  }),
};

export type post_CreateProductStore = typeof post_CreateProductStore;
export const post_CreateProductStore = {
  method: z.literal("POST"),
  path: z.literal("/products/{id}/stores"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.number(),
    }),
    body: ProductStore,
  }),
  response: ProductStore,
};

export type put_UpdateProductStores = typeof put_UpdateProductStores;
export const put_UpdateProductStores = {
  method: z.literal("PUT"),
  path: z.literal("/products/{id}/stores"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.number(),
    }),
    body: z.object({
      items: z.array(ProductStore).optional(),
    }),
  }),
  response: z.object({
    items: z.array(ProductStore).optional(),
  }),
};

export type get_GetProductInventoryReservations = typeof get_GetProductInventoryReservations;
export const get_GetProductInventoryReservations = {
  method: z.literal("GET"),
  path: z.literal("/products/{id}/inventory_reservations"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      reservationProductId: z.number().optional(),
      fields: z.array(z.string()).optional(),
    }),
    path: z.object({
      id: z.number(),
    }),
  }),
  response: z.object({
    items: z.array(ProductInventoryReservation).optional(),
    total: z.number().optional(),
  }),
};

export type post_CreateProductInventoryReservation = typeof post_CreateProductInventoryReservation;
export const post_CreateProductInventoryReservation = {
  method: z.literal("POST"),
  path: z.literal("/products/{id}/inventory_reservations"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.number(),
    }),
    body: ProductInventoryReservation,
  }),
  response: ProductInventoryReservation,
};

export type put_UpdateProductInventoryReservations = typeof put_UpdateProductInventoryReservations;
export const put_UpdateProductInventoryReservations = {
  method: z.literal("PUT"),
  path: z.literal("/products/{id}/inventory_reservations"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.number(),
    }),
    body: z.object({
      items: z.array(ProductInventoryReservation).optional(),
    }),
  }),
  response: z.object({
    items: z.array(ProductInventoryReservation).optional(),
  }),
};

export type get_GetProductReserveItemLabels = typeof get_GetProductReserveItemLabels;
export const get_GetProductReserveItemLabels = {
  method: z.literal("GET"),
  path: z.literal("/products/reserve_item_labels"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      limit: z.number().optional(),
      page: z.number().optional(),
      no: z.number().optional(),
      name: z.string().optional(),
      fields: z.array(z.string()).optional(),
    }),
  }),
  response: z.object({
    items: z.array(ProductReserveItemLabel).optional(),
    total: z.number().optional(),
    limit: z.number().optional(),
    page: z.number().optional(),
  }),
};

export type post_CreateProductReserveItemLabel = typeof post_CreateProductReserveItemLabel;
export const post_CreateProductReserveItemLabel = {
  method: z.literal("POST"),
  path: z.literal("/products/reserve_item_labels"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    body: ProductReserveItemLabel,
  }),
  response: ProductReserveItemLabel,
};

export type get_GetProductImages = typeof get_GetProductImages;
export const get_GetProductImages = {
  method: z.literal("GET"),
  path: z.literal("/products/images"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      limit: z.number().optional(),
      page: z.number().optional(),
      productId: z.number().optional(),
      fields: z.array(z.string()).optional(),
    }),
  }),
  response: z.object({
    items: z.array(ProductImage).optional(),
    total: z.number().optional(),
    limit: z.number().optional(),
    page: z.number().optional(),
  }),
};

export type post_UploadProductImage = typeof post_UploadProductImage;
export const post_UploadProductImage = {
  method: z.literal("POST"),
  path: z.literal("/products/images"),
  requestFormat: z.literal("form-data"),
  parameters: z.object({
    body: ProductImageUpload,
  }),
  response: ProductImage,
};

export type get_GetProductImage = typeof get_GetProductImage;
export const get_GetProductImage = {
  method: z.literal("GET"),
  path: z.literal("/products/{id}/image"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.number(),
    }),
  }),
  response: z.unknown(),
};

export type put_UpdateProductImage = typeof put_UpdateProductImage;
export const put_UpdateProductImage = {
  method: z.literal("PUT"),
  path: z.literal("/products/{id}/image"),
  requestFormat: z.literal("form-data"),
  parameters: z.object({
    path: z.object({
      id: z.number(),
    }),
    body: z.object({
      image: z.string().optional(),
    }),
  }),
  response: ProductImage,
};

export type delete_DeleteProductImage = typeof delete_DeleteProductImage;
export const delete_DeleteProductImage = {
  method: z.literal("DELETE"),
  path: z.literal("/products/{id}/image"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.number(),
    }),
  }),
  response: z.unknown(),
};

export type get_GetProductIconImage = typeof get_GetProductIconImage;
export const get_GetProductIconImage = {
  method: z.literal("GET"),
  path: z.literal("/products/{id}/icon_image"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.number(),
    }),
  }),
  response: z.unknown(),
};

export type put_UpdateProductIconImage = typeof put_UpdateProductIconImage;
export const put_UpdateProductIconImage = {
  method: z.literal("PUT"),
  path: z.literal("/products/{id}/icon_image"),
  requestFormat: z.literal("form-data"),
  parameters: z.object({
    path: z.object({
      id: z.number(),
    }),
    body: z.object({
      image: z.string().optional(),
    }),
  }),
  response: ProductImage,
};

export type delete_DeleteProductIconImage = typeof delete_DeleteProductIconImage;
export const delete_DeleteProductIconImage = {
  method: z.literal("DELETE"),
  path: z.literal("/products/{id}/icon_image"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.number(),
    }),
  }),
  response: z.unknown(),
};

export type delete_DeleteProductPrice = typeof delete_DeleteProductPrice;
export const delete_DeleteProductPrice = {
  method: z.literal("DELETE"),
  path: z.literal("/products/{product_id}/prices/{price_division}/{store_id}/{start_date}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      product_id: z.number(),
      price_division: z.number(),
      store_id: z.number(),
      start_date: z.string(),
    }),
  }),
  response: z.unknown(),
};

export type get_GetProductReserveItem = typeof get_GetProductReserveItem;
export const get_GetProductReserveItem = {
  method: z.literal("GET"),
  path: z.literal("/products/{product_id}/reserve_items/{no}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      fields: z.array(z.string()).optional(),
    }),
    path: z.object({
      product_id: z.number(),
      no: z.number(),
    }),
  }),
  response: ProductReserveItem,
};

export type put_UpdateProductReserveItem = typeof put_UpdateProductReserveItem;
export const put_UpdateProductReserveItem = {
  method: z.literal("PUT"),
  path: z.literal("/products/{product_id}/reserve_items/{no}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      product_id: z.number(),
      no: z.number(),
    }),
    body: ProductReserveItem,
  }),
  response: ProductReserveItem,
};

export type delete_DeleteProductReserveItem = typeof delete_DeleteProductReserveItem;
export const delete_DeleteProductReserveItem = {
  method: z.literal("DELETE"),
  path: z.literal("/products/{product_id}/reserve_items/{no}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      product_id: z.number(),
      no: z.number(),
    }),
  }),
  response: z.unknown(),
};

export type get_GetProductAttribute = typeof get_GetProductAttribute;
export const get_GetProductAttribute = {
  method: z.literal("GET"),
  path: z.literal("/products/attributes/{no}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      fields: z.array(z.string()).optional(),
    }),
    path: z.object({
      no: z.number(),
    }),
  }),
  response: ProductAttribute,
};

export type put_UpdateProductAttribute = typeof put_UpdateProductAttribute;
export const put_UpdateProductAttribute = {
  method: z.literal("PUT"),
  path: z.literal("/products/attributes/{no}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      no: z.number(),
    }),
    body: ProductAttribute,
  }),
  response: ProductAttribute,
};

export type delete_DeleteProductAttribute = typeof delete_DeleteProductAttribute;
export const delete_DeleteProductAttribute = {
  method: z.literal("DELETE"),
  path: z.literal("/products/attributes/{no}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      no: z.number(),
    }),
  }),
  response: z.unknown(),
};

export type get_GetProductAttributeItem = typeof get_GetProductAttributeItem;
export const get_GetProductAttributeItem = {
  method: z.literal("GET"),
  path: z.literal("/products/attribute_items/{code}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      fields: z.array(z.string()).optional(),
    }),
    path: z.object({
      code: z.string(),
    }),
  }),
  response: ProductAttributeItem,
};

export type put_UpdateProductAttributeItem = typeof put_UpdateProductAttributeItem;
export const put_UpdateProductAttributeItem = {
  method: z.literal("PUT"),
  path: z.literal("/products/attribute_items/{code}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      code: z.string(),
    }),
    body: ProductAttributeItem,
  }),
  response: ProductAttributeItem,
};

export type delete_DeleteProductAttributeItem = typeof delete_DeleteProductAttributeItem;
export const delete_DeleteProductAttributeItem = {
  method: z.literal("DELETE"),
  path: z.literal("/products/attribute_items/{code}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      code: z.string(),
    }),
  }),
  response: z.unknown(),
};

export type get_GetProductInventoryReservation = typeof get_GetProductInventoryReservation;
export const get_GetProductInventoryReservation = {
  method: z.literal("GET"),
  path: z.literal("/products/{id}/inventory_reservations/{reservation_product_id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      fields: z.array(z.string()).optional(),
    }),
    path: z.object({
      id: z.number(),
      reservation_product_id: z.number(),
    }),
  }),
  response: ProductInventoryReservation,
};

export type put_UpdateProductInventoryReservation = typeof put_UpdateProductInventoryReservation;
export const put_UpdateProductInventoryReservation = {
  method: z.literal("PUT"),
  path: z.literal("/products/{id}/inventory_reservations/{reservation_product_id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.number(),
      reservation_product_id: z.number(),
    }),
    body: ProductInventoryReservation,
  }),
  response: ProductInventoryReservation,
};

export type delete_DeleteProductInventoryReservation = typeof delete_DeleteProductInventoryReservation;
export const delete_DeleteProductInventoryReservation = {
  method: z.literal("DELETE"),
  path: z.literal("/products/{id}/inventory_reservations/{reservation_product_id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.number(),
      reservation_product_id: z.number(),
    }),
  }),
  response: z.unknown(),
};

export type get_GetProductReserveItemLabel = typeof get_GetProductReserveItemLabel;
export const get_GetProductReserveItemLabel = {
  method: z.literal("GET"),
  path: z.literal("/products/reserve_item_labels/{no}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      fields: z.array(z.string()).optional(),
    }),
    path: z.object({
      no: z.number(),
    }),
  }),
  response: ProductReserveItemLabel,
};

export type put_UpdateProductReserveItemLabel = typeof put_UpdateProductReserveItemLabel;
export const put_UpdateProductReserveItemLabel = {
  method: z.literal("PUT"),
  path: z.literal("/products/reserve_item_labels/{no}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      no: z.number(),
    }),
    body: ProductReserveItemLabel,
  }),
  response: ProductReserveItemLabel,
};

export type delete_DeleteProductReserveItemLabel = typeof delete_DeleteProductReserveItemLabel;
export const delete_DeleteProductReserveItemLabel = {
  method: z.literal("DELETE"),
  path: z.literal("/products/reserve_item_labels/{no}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      no: z.number(),
    }),
  }),
  response: z.unknown(),
};

export type get_Transactions = typeof get_Transactions;
export const get_Transactions = {
  method: z.literal("GET"),
  path: z.literal("/transactions"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      storeId: z.number().optional(),
      customerId: z.number().optional(),
      customerCode: z.string().optional(),
      "transactionHead.transactionDateTime": z.string().optional(),
      "transactionHead.transactionDateTimeFrom": z.string().optional(),
      "transactionHead.transactionDateTimeTo": z.string().optional(),
      "transactionHead.transactionHeadId": z.number().optional(),
      terminal: z.number().optional(),
      paymentMethod: z.number().optional(),
      limit: z.number().optional(),
      page: z.number().optional(),
    }),
  }),
  response: z.object({
    transactions: z.array(Transaction).optional(),
    pagination: Pagination.optional(),
  }),
};

export type post_Transactions = typeof post_Transactions;
export const post_Transactions = {
  method: z.literal("POST"),
  path: z.literal("/transactions"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    body: TransactionCreate,
  }),
  response: z.object({
    id: z.number().optional(),
  }),
};

export type get_TransactionsId = typeof get_TransactionsId;
export const get_TransactionsId = {
  method: z.literal("GET"),
  path: z.literal("/transactions/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.number(),
    }),
  }),
  response: Transaction,
};

export type put_TransactionsId = typeof put_TransactionsId;
export const put_TransactionsId = {
  method: z.literal("PUT"),
  path: z.literal("/transactions/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.number(),
    }),
    body: TransactionUpdate,
  }),
  response: z.object({
    message: z.string().optional(),
  }),
};

export type delete_TransactionsId = typeof delete_TransactionsId;
export const delete_TransactionsId = {
  method: z.literal("DELETE"),
  path: z.literal("/transactions/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.number(),
    }),
  }),
  response: z.unknown(),
};

export type get_TransactionsIddetails = typeof get_TransactionsIddetails;
export const get_TransactionsIddetails = {
  method: z.literal("GET"),
  path: z.literal("/transactions/{id}/details"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.number(),
    }),
  }),
  response: z.object({
    details: z.array(TransactionDetail).optional(),
  }),
};

export type get_Layaways = typeof get_Layaways;
export const get_Layaways = {
  method: z.literal("GET"),
  path: z.literal("/layaways"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      storeId: z.number().optional(),
      status: z.union([z.literal(1), z.literal(2)]).optional(),
      "layaway.layawayDateTimeFrom": z.string().optional(),
      "layaway.layawayDateTimeTo": z.string().optional(),
      limit: z.number().optional(),
      page: z.number().optional(),
    }),
  }),
  response: z.object({
    layaways: z.array(Layaway).optional(),
    pagination: Pagination.optional(),
  }),
};

export type post_Layaways = typeof post_Layaways;
export const post_Layaways = {
  method: z.literal("POST"),
  path: z.literal("/layaways"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    body: LayawayCreate,
  }),
  response: z.object({
    id: z.number().optional(),
  }),
};

export type get_LayawaysId = typeof get_LayawaysId;
export const get_LayawaysId = {
  method: z.literal("GET"),
  path: z.literal("/layaways/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.number(),
    }),
  }),
  response: Layaway,
};

export type delete_LayawaysId = typeof delete_LayawaysId;
export const delete_LayawaysId = {
  method: z.literal("DELETE"),
  path: z.literal("/layaways/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.number(),
    }),
  }),
  response: z.unknown(),
};

export type get_Pre_sales = typeof get_Pre_sales;
export const get_Pre_sales = {
  method: z.literal("GET"),
  path: z.literal("/pre_sales"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      storeId: z.number().optional(),
      status: z.union([z.literal(1), z.literal(2)]).optional(),
      "preSale.preSaleDateTimeFrom": z.string().optional(),
      "preSale.preSaleDateTimeTo": z.string().optional(),
      limit: z.number().optional(),
      page: z.number().optional(),
    }),
  }),
  response: z.object({
    preSales: z.array(PreSale).optional(),
    pagination: Pagination.optional(),
  }),
};

export type post_Pre_sales = typeof post_Pre_sales;
export const post_Pre_sales = {
  method: z.literal("POST"),
  path: z.literal("/pre_sales"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    body: PreSaleCreate,
  }),
  response: z.object({
    id: z.number().optional(),
  }),
};

export type get_Pre_salesId = typeof get_Pre_salesId;
export const get_Pre_salesId = {
  method: z.literal("GET"),
  path: z.literal("/pre_sales/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.number(),
    }),
  }),
  response: PreSale,
};

export type put_Pre_salesId = typeof put_Pre_salesId;
export const put_Pre_salesId = {
  method: z.literal("PUT"),
  path: z.literal("/pre_sales/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.number(),
    }),
    body: PreSaleUpdate,
  }),
  response: z.object({
    message: z.string().optional(),
  }),
};

export type delete_Pre_salesId = typeof delete_Pre_salesId;
export const delete_Pre_salesId = {
  method: z.literal("DELETE"),
  path: z.literal("/pre_sales/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.number(),
    }),
  }),
  response: z.unknown(),
};

export type get_Ticket_transactions = typeof get_Ticket_transactions;
export const get_Ticket_transactions = {
  method: z.literal("GET"),
  path: z.literal("/ticket_transactions"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      storeId: z.number().optional(),
      statusType: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]).optional(),
      "ticketTransaction.ticketDateTimeFrom": z.string().optional(),
      "ticketTransaction.ticketDateTimeTo": z.string().optional(),
      "ticketTransaction.ticketCode": z.string().optional(),
      limit: z.number().optional(),
      page: z.number().optional(),
    }),
  }),
  response: z.object({
    ticketTransactions: z.array(TicketTransaction).optional(),
    pagination: Pagination.optional(),
  }),
};

export type get_Ticket_transactionsId = typeof get_Ticket_transactionsId;
export const get_Ticket_transactionsId = {
  method: z.literal("GET"),
  path: z.literal("/ticket_transactions/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.number(),
    }),
  }),
  response: TicketTransaction,
};

export type put_Ticket_transactionsId = typeof put_Ticket_transactionsId;
export const put_Ticket_transactionsId = {
  method: z.literal("PUT"),
  path: z.literal("/ticket_transactions/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.number(),
    }),
    body: z.object({
      statusType: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
    }),
  }),
  response: z.object({
    message: z.string().optional(),
  }),
};

export type get_Customers = typeof get_Customers;
export const get_Customers = {
  method: z.literal("GET"),
  path: z.literal("/customers"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      fields: z.array(z.string()).optional(),
      sort: z.string().optional(),
      limit: z.number().optional(),
      page: z.number().optional(),
      customer_id: z.string().optional(),
      customer_code: z.string().optional(),
      customer_no: z.string().optional(),
      rank: z.string().optional(),
      staff_rank: z.string().optional(),
      first_name: z.string().optional(),
      last_name: z.string().optional(),
      first_name_kana: z.string().optional(),
      last_name_kana: z.string().optional(),
      sex: z.union([z.literal("0"), z.literal("1"), z.literal("2")]).optional(),
      barcode: z.string().optional(),
      "birth_date-from": z.string().optional(),
      "birth_date-to": z.string().optional(),
      zip_code: z.string().optional(),
      address: z.string().optional(),
      phone_number: z.string().optional(),
      fax_number: z.string().optional(),
      mobile_number: z.string().optional(),
      mail_address: z.string().optional(),
      company_name: z.string().optional(),
      department_name: z.string().optional(),
      manager_flag: z.boolean().optional(),
      is_staff: z.boolean().optional(),
      "points-from": z.number().optional(),
      "points-to": z.number().optional(),
      store_id: z.string().optional(),
      note: z.string().optional(),
      status_id: z.union([z.literal(1), z.literal(2)]).optional(),
      "enter_date-from": z.string().optional(),
      "enter_date-to": z.string().optional(),
      "suspend_date-from": z.string().optional(),
      "suspend_date-to": z.string().optional(),
      "point_expire_date-from": z.string().optional(),
      "point_expire_date-to": z.string().optional(),
      "ins_date_time-from": z.string().optional(),
      "ins_date_time-to": z.string().optional(),
      "upd_date_time-from": z.string().optional(),
      "upd_date_time-to": z.string().optional(),
    }),
  }),
  response: z.array(Customer),
};

export type post_Customers = typeof post_Customers;
export const post_Customers = {
  method: z.literal("POST"),
  path: z.literal("/customers"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    body: CustomerCreate,
  }),
  response: Customer,
};

export type get_CustomersId = typeof get_CustomersId;
export const get_CustomersId = {
  method: z.literal("GET"),
  path: z.literal("/customers/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.string(),
    }),
  }),
  response: Customer,
};

export type put_CustomersId = typeof put_CustomersId;
export const put_CustomersId = {
  method: z.literal("PUT"),
  path: z.literal("/customers/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.string(),
    }),
    body: CustomerUpdate,
  }),
  response: Customer,
};

export type delete_CustomersId = typeof delete_CustomersId;
export const delete_CustomersId = {
  method: z.literal("DELETE"),
  path: z.literal("/customers/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.string(),
    }),
  }),
  response: z.unknown(),
};

export type post_Customersbulk = typeof post_Customersbulk;
export const post_Customersbulk = {
  method: z.literal("POST"),
  path: z.literal("/customers/bulk"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    body: CustomerBulkCreate,
  }),
  response: z.array(Customer),
};

export type put_Customersbulk = typeof put_Customersbulk;
export const put_Customersbulk = {
  method: z.literal("PUT"),
  path: z.literal("/customers/bulk"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    body: CustomerBulkUpdate,
  }),
  response: z.array(Customer),
};

export type get_CustomersIdpoints = typeof get_CustomersIdpoints;
export const get_CustomersIdpoints = {
  method: z.literal("GET"),
  path: z.literal("/customers/{id}/points"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.string(),
    }),
  }),
  response: CustomerPoint,
};

export type put_CustomersIdpoints = typeof put_CustomersIdpoints;
export const put_CustomersIdpoints = {
  method: z.literal("PUT"),
  path: z.literal("/customers/{id}/points"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.string(),
    }),
    body: CustomerPointUpdate,
  }),
  response: CustomerPoint,
};

export type patch_CustomersIdpoints = typeof patch_CustomersIdpoints;
export const patch_CustomersIdpoints = {
  method: z.literal("PATCH"),
  path: z.literal("/customers/{id}/points"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.string(),
    }),
    body: CustomerPointRelativeUpdate,
  }),
  response: CustomerPoint,
};

export type get_Customer_ranks = typeof get_Customer_ranks;
export const get_Customer_ranks = {
  method: z.literal("GET"),
  path: z.literal("/customer_ranks"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      fields: z.array(z.string()).optional(),
      sort: z.string().optional(),
      limit: z.number().optional(),
      page: z.number().optional(),
      rank_id: z.string().optional(),
      rank_name: z.string().optional(),
      "point_rate-from": z.number().optional(),
      "point_rate-to": z.number().optional(),
      point_expiration_type: z.union([z.literal("0"), z.literal("1"), z.literal("2")]).optional(),
      "ins_date_time-from": z.string().optional(),
      "ins_date_time-to": z.string().optional(),
      "upd_date_time-from": z.string().optional(),
      "upd_date_time-to": z.string().optional(),
    }),
  }),
  response: z.array(CustomerRank),
};

export type post_Customer_ranks = typeof post_Customer_ranks;
export const post_Customer_ranks = {
  method: z.literal("POST"),
  path: z.literal("/customer_ranks"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    body: CustomerRankCreate,
  }),
  response: CustomerRank,
};

export type get_Customer_ranksId = typeof get_Customer_ranksId;
export const get_Customer_ranksId = {
  method: z.literal("GET"),
  path: z.literal("/customer_ranks/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.string(),
    }),
  }),
  response: CustomerRank,
};

export type put_Customer_ranksId = typeof put_Customer_ranksId;
export const put_Customer_ranksId = {
  method: z.literal("PUT"),
  path: z.literal("/customer_ranks/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.string(),
    }),
    body: CustomerRankUpdate,
  }),
  response: CustomerRank,
};

export type delete_Customer_ranksId = typeof delete_Customer_ranksId;
export const delete_Customer_ranksId = {
  method: z.literal("DELETE"),
  path: z.literal("/customer_ranks/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.string(),
    }),
  }),
  response: z.unknown(),
};

export type get_Staff_ranks = typeof get_Staff_ranks;
export const get_Staff_ranks = {
  method: z.literal("GET"),
  path: z.literal("/staff_ranks"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      fields: z.array(z.string()).optional(),
      sort: z.string().optional(),
      limit: z.number().optional(),
      page: z.number().optional(),
      staff_rank_id: z.string().optional(),
      staff_rank_name: z.string().optional(),
      "discount_rate-from": z.number().optional(),
      "discount_rate-to": z.number().optional(),
      "point_rate-from": z.number().optional(),
      "point_rate-to": z.number().optional(),
      "ins_date_time-from": z.string().optional(),
      "ins_date_time-to": z.string().optional(),
      "upd_date_time-from": z.string().optional(),
      "upd_date_time-to": z.string().optional(),
    }),
  }),
  response: z.array(StaffRank),
};

export type post_Staff_ranks = typeof post_Staff_ranks;
export const post_Staff_ranks = {
  method: z.literal("POST"),
  path: z.literal("/staff_ranks"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    body: StaffRankCreate,
  }),
  response: StaffRank,
};

export type get_Staff_ranksId = typeof get_Staff_ranksId;
export const get_Staff_ranksId = {
  method: z.literal("GET"),
  path: z.literal("/staff_ranks/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.string(),
    }),
  }),
  response: StaffRank,
};

export type put_Staff_ranksId = typeof put_Staff_ranksId;
export const put_Staff_ranksId = {
  method: z.literal("PUT"),
  path: z.literal("/staff_ranks/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.string(),
    }),
    body: StaffRankUpdate,
  }),
  response: StaffRank,
};

export type delete_Staff_ranksId = typeof delete_Staff_ranksId;
export const delete_Staff_ranksId = {
  method: z.literal("DELETE"),
  path: z.literal("/staff_ranks/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.string(),
    }),
  }),
  response: z.unknown(),
};

export type get_Customersrequired = typeof get_Customersrequired;
export const get_Customersrequired = {
  method: z.literal("GET"),
  path: z.literal("/customers/required"),
  requestFormat: z.literal("json"),
  parameters: z.never(),
  response: CustomerRequired,
};

export type get_GetStocks = typeof get_GetStocks;
export const get_GetStocks = {
  method: z.literal("GET"),
  path: z.literal("/stocks"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      store_id: z.number().optional(),
      product_id: z.number().optional(),
      product_code: z.string().optional(),
      product_name: z.string().optional(),
      category_id: z.number().optional(),
      barcode: z.string().optional(),
      limit: z.number().optional(),
      page: z.number().optional(),
    }),
  }),
  response: z.object({
    stocks: z.array(Stock).optional(),
    pagination: Pagination.optional(),
  }),
};

export type patch_UpdateStock = typeof patch_UpdateStock;
export const patch_UpdateStock = {
  method: z.literal("PATCH"),
  path: z.literal("/stocks"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    body: StockUpdate,
  }),
  response: z.unknown(),
};

export type get_GetStockChanges = typeof get_GetStockChanges;
export const get_GetStockChanges = {
  method: z.literal("GET"),
  path: z.literal("/stocks/changes"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      store_id: z.number().optional(),
      product_id: z.number().optional(),
      product_code: z.string().optional(),
      product_name: z.string().optional(),
      division: z.number().optional(),
      target_date_from: z.string().optional(),
      target_date_to: z.string().optional(),
      limit: z.number().optional(),
      page: z.number().optional(),
    }),
  }),
  response: z.object({
    stockChanges: z.array(StockChange).optional(),
    pagination: Pagination.optional(),
  }),
};

export type get_Bargain = typeof get_Bargain;
export const get_Bargain = {
  method: z.literal("GET"),
  path: z.literal("/bargain"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      fields: z.array(z.string()).optional(),
      sort: z.string().optional(),
      limit: z.number().optional(),
      page: z.number().optional(),
      bargain_id: z.string().optional(),
      term_start: z.string().optional(),
      term_end: z.string().optional(),
    }),
    path: z.object({
      contract_id: z.string(),
    }),
  }),
  response: z.array(Bargain),
};

export type post_Bargain = typeof post_Bargain;
export const post_Bargain = {
  method: z.literal("POST"),
  path: z.literal("/bargain"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      contract_id: z.string(),
    }),
    body: BargainCreate,
  }),
  response: Bargain,
};

export type patch_BargainId = typeof patch_BargainId;
export const patch_BargainId = {
  method: z.literal("PATCH"),
  path: z.literal("/bargain/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      contract_id: z.string(),
      id: z.string(),
    }),
    body: BargainUpdate,
  }),
  response: Bargain,
};

export type delete_BargainId = typeof delete_BargainId;
export const delete_BargainId = {
  method: z.literal("DELETE"),
  path: z.literal("/bargain/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      contract_id: z.string(),
      id: z.string(),
    }),
  }),
  response: z.unknown(),
};

export type get_BargainIdstores = typeof get_BargainIdstores;
export const get_BargainIdstores = {
  method: z.literal("GET"),
  path: z.literal("/bargain/{id}/stores"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      fields: z.array(z.string()).optional(),
      sort: z.string().optional(),
      limit: z.number().optional(),
      page: z.number().optional(),
      store_id: z.string().optional(),
    }),
    path: z.object({
      contract_id: z.string(),
      id: z.string(),
    }),
  }),
  response: z.array(BargainStore),
};

export type post_BargainIdstores = typeof post_BargainIdstores;
export const post_BargainIdstores = {
  method: z.literal("POST"),
  path: z.literal("/bargain/{id}/stores"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      contract_id: z.string(),
      id: z.string(),
    }),
    body: BargainStoreCreate,
  }),
  response: BargainStore,
};

export type patch_BargainIdstoresBargainStoreId = typeof patch_BargainIdstoresBargainStoreId;
export const patch_BargainIdstoresBargainStoreId = {
  method: z.literal("PATCH"),
  path: z.literal("/bargain/{id}/stores/{bargainStoreId}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      contract_id: z.string(),
      id: z.string(),
      bargainStoreId: z.string(),
    }),
    body: BargainStoreUpdate,
  }),
  response: BargainStore,
};

export type delete_BargainIdstoresBargainStoreId = typeof delete_BargainIdstoresBargainStoreId;
export const delete_BargainIdstoresBargainStoreId = {
  method: z.literal("DELETE"),
  path: z.literal("/bargain/{id}/stores/{bargainStoreId}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      contract_id: z.string(),
      id: z.string(),
      bargainStoreId: z.string(),
    }),
  }),
  response: z.unknown(),
};

export type get_BargainIdproducts = typeof get_BargainIdproducts;
export const get_BargainIdproducts = {
  method: z.literal("GET"),
  path: z.literal("/bargain/{id}/products"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      fields: z.array(z.string()).optional(),
      sort: z.string().optional(),
      limit: z.number().optional(),
      page: z.number().optional(),
      target_division: z.union([z.literal("1"), z.literal("2"), z.literal("3")]).optional(),
      target_id: z.string().optional(),
    }),
    path: z.object({
      contract_id: z.string(),
      id: z.string(),
    }),
  }),
  response: z.array(BargainProduct),
};

export type post_BargainIdproducts = typeof post_BargainIdproducts;
export const post_BargainIdproducts = {
  method: z.literal("POST"),
  path: z.literal("/bargain/{id}/products"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      contract_id: z.string(),
      id: z.string(),
    }),
    body: BargainProductCreate,
  }),
  response: BargainProduct,
};

export type patch_BargainIdproductsBargainProductId = typeof patch_BargainIdproductsBargainProductId;
export const patch_BargainIdproductsBargainProductId = {
  method: z.literal("PATCH"),
  path: z.literal("/bargain/{id}/products/{bargainProductId}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      contract_id: z.string(),
      id: z.string(),
      bargainProductId: z.string(),
    }),
    body: BargainProductUpdate,
  }),
  response: BargainProduct,
};

export type delete_BargainIdproductsBargainProductId = typeof delete_BargainIdproductsBargainProductId;
export const delete_BargainIdproductsBargainProductId = {
  method: z.literal("DELETE"),
  path: z.literal("/bargain/{id}/products/{bargainProductId}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      contract_id: z.string(),
      id: z.string(),
      bargainProductId: z.string(),
    }),
  }),
  response: z.unknown(),
};

export type get_Product_option_groups = typeof get_Product_option_groups;
export const get_Product_option_groups = {
  method: z.literal("GET"),
  path: z.literal("/product_option_groups"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      fields: z.array(z.string()).optional(),
      sort: z.string().optional(),
      limit: z.number().optional(),
      page: z.number().optional(),
      product_option_group_name: z.string().optional(),
      condition_id: z.string().optional(),
    }),
    path: z.object({
      contract_id: z.string(),
    }),
  }),
  response: z.array(ProductOptionGroup),
};

export type post_Product_option_groups = typeof post_Product_option_groups;
export const post_Product_option_groups = {
  method: z.literal("POST"),
  path: z.literal("/product_option_groups"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      contract_id: z.string(),
    }),
    body: ProductOptionGroupCreate,
  }),
  response: ProductOptionGroup,
};

export type get_Product_option_groupsId = typeof get_Product_option_groupsId;
export const get_Product_option_groupsId = {
  method: z.literal("GET"),
  path: z.literal("/product_option_groups/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      fields: z.array(z.string()).optional(),
      with_products: z.union([z.literal("all"), z.literal("none")]).optional(),
    }),
    path: z.object({
      contract_id: z.string(),
      id: z.string(),
    }),
  }),
  response: ProductOptionGroup,
};

export type patch_Product_option_groupsId = typeof patch_Product_option_groupsId;
export const patch_Product_option_groupsId = {
  method: z.literal("PATCH"),
  path: z.literal("/product_option_groups/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      contract_id: z.string(),
      id: z.string(),
    }),
    body: ProductOptionGroupUpdate,
  }),
  response: ProductOptionGroup,
};

export type delete_Product_option_groupsId = typeof delete_Product_option_groupsId;
export const delete_Product_option_groupsId = {
  method: z.literal("DELETE"),
  path: z.literal("/product_option_groups/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      contract_id: z.string(),
      id: z.string(),
    }),
  }),
  response: z.unknown(),
};

export type delete_Product_option_groupsIdproductsProduct_id = typeof delete_Product_option_groupsIdproductsProduct_id;
export const delete_Product_option_groupsIdproductsProduct_id = {
  method: z.literal("DELETE"),
  path: z.literal("/product_option_groups/{id}/products/{product_id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      contract_id: z.string(),
      id: z.string(),
      product_id: z.string(),
    }),
  }),
  response: z.unknown(),
};

export type get_Bundles = typeof get_Bundles;
export const get_Bundles = {
  method: z.literal("GET"),
  path: z.literal("/bundles"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      fields: z.array(z.string()).optional(),
      sort: z.string().optional(),
      limit: z.number().optional(),
      page: z.number().optional(),
      product_bundle_group_id: z.string().optional(),
      term_from: z.string().optional(),
      term_to: z.string().optional(),
    }),
    path: z.object({
      contract_id: z.string(),
    }),
  }),
  response: z.array(Bundle),
};

export type post_Bundles = typeof post_Bundles;
export const post_Bundles = {
  method: z.literal("POST"),
  path: z.literal("/bundles"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      contract_id: z.string(),
    }),
    body: BundleCreate,
  }),
  response: Bundle,
};

export type get_BundlesId = typeof get_BundlesId;
export const get_BundlesId = {
  method: z.literal("GET"),
  path: z.literal("/bundles/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      fields: z.array(z.string()).optional(),
    }),
    path: z.object({
      contract_id: z.string(),
      id: z.string(),
    }),
  }),
  response: Bundle,
};

export type patch_BundlesId = typeof patch_BundlesId;
export const patch_BundlesId = {
  method: z.literal("PATCH"),
  path: z.literal("/bundles/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      contract_id: z.string(),
      id: z.string(),
    }),
    body: BundleUpdate,
  }),
  response: Bundle,
};

export type delete_BundlesId = typeof delete_BundlesId;
export const delete_BundlesId = {
  method: z.literal("DELETE"),
  path: z.literal("/bundles/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      contract_id: z.string(),
      id: z.string(),
    }),
  }),
  response: z.unknown(),
};

export type delete_BundlesIdproductsBundleProductId = typeof delete_BundlesIdproductsBundleProductId;
export const delete_BundlesIdproductsBundleProductId = {
  method: z.literal("DELETE"),
  path: z.literal("/bundles/{id}/products/{bundleProductId}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      contract_id: z.string(),
      id: z.string(),
      bundleProductId: z.string(),
    }),
  }),
  response: z.unknown(),
};

export type get_Stores = typeof get_Stores;
export const get_Stores = {
  method: z.literal("GET"),
  path: z.literal("/stores"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      fields: z.array(z.string()).optional(),
      sort: z.string().optional(),
      limit: z.number().optional(),
      page: z.number().optional(),
      store_id: z.string().optional(),
      store_code: z.string().optional(),
      store_division: z.union([z.literal("0"), z.literal("1")]).optional(),
    }),
    path: z.object({
      contract_id: z.string(),
    }),
  }),
  response: z.array(Store),
};

export type post_Stores = typeof post_Stores;
export const post_Stores = {
  method: z.literal("POST"),
  path: z.literal("/stores"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      contract_id: z.string(),
    }),
    body: StoreCreate,
  }),
  response: Store,
};

export type get_StoresId = typeof get_StoresId;
export const get_StoresId = {
  method: z.literal("GET"),
  path: z.literal("/stores/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      fields: z.array(z.string()).optional(),
    }),
    path: z.object({
      contract_id: z.string(),
      id: z.string(),
    }),
  }),
  response: Store,
};

export type patch_StoresId = typeof patch_StoresId;
export const patch_StoresId = {
  method: z.literal("PATCH"),
  path: z.literal("/stores/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      contract_id: z.string(),
      id: z.string(),
    }),
    body: StoreUpdate,
  }),
  response: Store,
};

export type delete_StoresId = typeof delete_StoresId;
export const delete_StoresId = {
  method: z.literal("DELETE"),
  path: z.literal("/stores/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      contract_id: z.string(),
      id: z.string(),
    }),
  }),
  response: z.unknown(),
};

export type get_StoresStore_idproducts = typeof get_StoresStore_idproducts;
export const get_StoresStore_idproducts = {
  method: z.literal("GET"),
  path: z.literal("/stores/{store_id}/products"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      fields: z.array(z.string()).optional(),
      limit: z.number().optional(),
      page: z.number().optional(),
    }),
    path: z.object({
      contract_id: z.string(),
      store_id: z.string(),
    }),
  }),
  response: z.array(
    z.object({
      storeId: z.string(),
      productId: z.string(),
      orderPoint: z.string(),
    }),
  ),
};

export type post_StoresStore_idproducts = typeof post_StoresStore_idproducts;
export const post_StoresStore_idproducts = {
  method: z.literal("POST"),
  path: z.literal("/stores/{store_id}/products"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      contract_id: z.string(),
      store_id: z.string(),
    }),
    body: z.object({
      productId: z.string(),
      orderPoint: z.string(),
    }),
  }),
  response: z.object({
    storeId: z.string(),
    productId: z.string(),
    orderPoint: z.string(),
  }),
};

export type get_GetStoreProductPrices = typeof get_GetStoreProductPrices;
export const get_GetStoreProductPrices = {
  method: z.literal("GET"),
  path: z.literal("/stores/{store_id}/product_prices"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      productId: z.number().optional(),
      priceDivision: z.union([z.literal(1), z.literal(2)]).optional(),
      startDate: z.string().optional(),
      limit: z.number().optional(),
      page: z.number().optional(),
      fields: z.array(z.string()).optional(),
    }),
    path: z.object({
      store_id: z.number(),
    }),
  }),
  response: z.object({
    items: z.array(ProductPrice).optional(),
    total: z.number().optional(),
    limit: z.number().optional(),
    page: z.number().optional(),
  }),
};

export type post_CreateOrUpdateStoreProductPrice = typeof post_CreateOrUpdateStoreProductPrice;
export const post_CreateOrUpdateStoreProductPrice = {
  method: z.literal("POST"),
  path: z.literal("/stores/{store_id}/product_prices"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      store_id: z.number(),
    }),
    body: z.object({
      items: z.array(ProductPrice),
    }),
  }),
  response: z.object({
    items: z.array(ProductPrice).optional(),
  }),
};

export type get_Store_groups = typeof get_Store_groups;
export const get_Store_groups = {
  method: z.literal("GET"),
  path: z.literal("/store_groups"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      fields: z.array(z.string()).optional(),
      sort: z.string().optional(),
      limit: z.number().optional(),
      page: z.number().optional(),
      store_group_id: z.string().optional(),
    }),
    path: z.object({
      contract_id: z.string(),
    }),
  }),
  response: z.array(StoreGroup),
};

export type post_Store_groups = typeof post_Store_groups;
export const post_Store_groups = {
  method: z.literal("POST"),
  path: z.literal("/store_groups"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      contract_id: z.string(),
    }),
    body: StoreGroupCreate,
  }),
  response: StoreGroup,
};

export type patch_Store_groupsId = typeof patch_Store_groupsId;
export const patch_Store_groupsId = {
  method: z.literal("PATCH"),
  path: z.literal("/store_groups/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      contract_id: z.string(),
      id: z.string(),
    }),
    body: StoreGroupUpdate,
  }),
  response: StoreGroup,
};

export type delete_Store_groupsId = typeof delete_Store_groupsId;
export const delete_Store_groupsId = {
  method: z.literal("DELETE"),
  path: z.literal("/store_groups/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      contract_id: z.string(),
      id: z.string(),
    }),
  }),
  response: z.unknown(),
};

export type get_Store_group_items = typeof get_Store_group_items;
export const get_Store_group_items = {
  method: z.literal("GET"),
  path: z.literal("/store_group_items"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      fields: z.array(z.string()).optional(),
      sort: z.string().optional(),
      limit: z.number().optional(),
      page: z.number().optional(),
      store_group_item_id: z.string().optional(),
      store_group_id: z.string().optional(),
      store_id: z.string().optional(),
    }),
    path: z.object({
      contract_id: z.string(),
    }),
  }),
  response: z.array(StoreGroupItem),
};

export type post_Store_group_items = typeof post_Store_group_items;
export const post_Store_group_items = {
  method: z.literal("POST"),
  path: z.literal("/store_group_items"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      contract_id: z.string(),
    }),
    body: StoreGroupItemCreate,
  }),
  response: StoreGroupItem,
};

export type patch_Store_group_itemsId = typeof patch_Store_group_itemsId;
export const patch_Store_group_itemsId = {
  method: z.literal("PATCH"),
  path: z.literal("/store_group_items/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      contract_id: z.string(),
      id: z.string(),
    }),
    body: StoreGroupItemUpdate,
  }),
  response: StoreGroupItem,
};

export type delete_Store_group_itemsId = typeof delete_Store_group_itemsId;
export const delete_Store_group_itemsId = {
  method: z.literal("DELETE"),
  path: z.literal("/store_group_items/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      contract_id: z.string(),
      id: z.string(),
    }),
  }),
  response: z.unknown(),
};

export type get_Staffs = typeof get_Staffs;
export const get_Staffs = {
  method: z.literal("GET"),
  path: z.literal("/staffs"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      fields: z.array(z.string()).optional(),
      sort: z.string().optional(),
      limit: z.number().optional(),
      page: z.number().optional(),
      staff_id: z.string().optional(),
      staff_code: z.string().optional(),
      first_name: z.string().optional(),
      last_name: z.string().optional(),
      first_name_kana: z.string().optional(),
      last_name_kana: z.string().optional(),
      tel: z.string().optional(),
      mobile_phone: z.string().optional(),
      mail: z.string().optional(),
      staff_authorization: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.literal("3")]).optional(),
      store_id: z.string().optional(),
      role_id: z.string().optional(),
      status: z.union([z.literal("1"), z.literal("2")]).optional(),
      "ins_date_time-from": z.string().optional(),
      "ins_date_time-to": z.string().optional(),
      "upd_date_time-from": z.string().optional(),
      "upd_date_time-to": z.string().optional(),
    }),
  }),
  response: z.array(Staff),
};

export type post_Staffs = typeof post_Staffs;
export const post_Staffs = {
  method: z.literal("POST"),
  path: z.literal("/staffs"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    body: z.object({
      staffCode: z.string(),
      firstName: z.union([z.string(), z.undefined()]).optional(),
      lastName: z.union([z.string(), z.undefined()]).optional(),
      firstNameKana: z.union([z.string(), z.undefined()]).optional(),
      lastNameKana: z.union([z.string(), z.undefined()]).optional(),
      tel: z.union([z.string(), z.undefined()]).optional(),
      mobilePhone: z.union([z.string(), z.undefined()]).optional(),
      mail: z.union([z.string(), z.undefined()]).optional(),
      zipCode: z.union([z.string(), z.undefined()]).optional(),
      address: z.union([z.string(), z.undefined()]).optional(),
      password: z.string(),
      staffAuthorization: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.literal("3")]),
      salePassword: z.union([z.string(), z.undefined()]).optional(),
      startAtHourOfDay: z.union([z.string(), z.undefined()]).optional(),
      endAtHourOfDay: z.union([z.string(), z.undefined()]).optional(),
      storeIds: z.union([z.array(z.string()), z.undefined()]).optional(),
      roleIds: z.union([z.array(z.string()), z.undefined()]).optional(),
      status: z.union([z.literal("1"), z.literal("2"), z.undefined()]).optional(),
    }),
  }),
  response: Staff,
};

export type get_StaffsId = typeof get_StaffsId;
export const get_StaffsId = {
  method: z.literal("GET"),
  path: z.literal("/staffs/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.string(),
    }),
  }),
  response: Staff,
};

export type put_StaffsId = typeof put_StaffsId;
export const put_StaffsId = {
  method: z.literal("PUT"),
  path: z.literal("/staffs/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.string(),
    }),
    body: z.object({
      staffCode: z.string().optional(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      firstNameKana: z.string().optional(),
      lastNameKana: z.string().optional(),
      tel: z.string().optional(),
      mobilePhone: z.string().optional(),
      mail: z.string().optional(),
      zipCode: z.string().optional(),
      address: z.string().optional(),
      password: z.string().optional(),
      staffAuthorization: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.literal("3")]).optional(),
      salePassword: z.string().optional(),
      startAtHourOfDay: z.string().optional(),
      endAtHourOfDay: z.string().optional(),
      storeIds: z.array(z.string()).optional(),
      roleIds: z.array(z.string()).optional(),
      status: z.union([z.literal("1"), z.literal("2")]).optional(),
    }),
  }),
  response: Staff,
};

export type delete_StaffsId = typeof delete_StaffsId;
export const delete_StaffsId = {
  method: z.literal("DELETE"),
  path: z.literal("/staffs/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.string(),
    }),
  }),
  response: z.unknown(),
};

export type get_Roles = typeof get_Roles;
export const get_Roles = {
  method: z.literal("GET"),
  path: z.literal("/roles"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      fields: z.array(z.string()).optional(),
      sort: z.string().optional(),
      limit: z.number().optional(),
      page: z.number().optional(),
      role_id: z.string().optional(),
      role_name: z.string().optional(),
      permission_id: z.string().optional(),
      permission_value: z.union([z.literal(0), z.literal(1)]).optional(),
      "ins_date_time-from": z.string().optional(),
      "ins_date_time-to": z.string().optional(),
      "upd_date_time-from": z.string().optional(),
      "upd_date_time-to": z.string().optional(),
    }),
  }),
  response: z.array(Role),
};

export type post_Roles = typeof post_Roles;
export const post_Roles = {
  method: z.literal("POST"),
  path: z.literal("/roles"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    body: RoleCreate,
  }),
  response: Role,
};

export type get_RolesId = typeof get_RolesId;
export const get_RolesId = {
  method: z.literal("GET"),
  path: z.literal("/roles/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.string(),
    }),
  }),
  response: Role,
};

export type put_RolesId = typeof put_RolesId;
export const put_RolesId = {
  method: z.literal("PUT"),
  path: z.literal("/roles/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.string(),
    }),
    body: RoleUpdate,
  }),
  response: Role,
};

export type delete_RolesId = typeof delete_RolesId;
export const delete_RolesId = {
  method: z.literal("DELETE"),
  path: z.literal("/roles/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.string(),
    }),
  }),
  response: z.unknown(),
};

export type get_Budgetsmonthly = typeof get_Budgetsmonthly;
export const get_Budgetsmonthly = {
  method: z.literal("GET"),
  path: z.literal("/budgets/monthly"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      fields: z.array(z.string()).optional(),
      sort: z.string().optional(),
      limit: z.number().optional(),
      page: z.number().optional(),
      budget_id: z.string().optional(),
      store_id: z.string().optional(),
      "year_month-from": z.string().optional(),
      "year_month-to": z.string().optional(),
      "ins_date_time-from": z.string().optional(),
      "ins_date_time-to": z.string().optional(),
      "upd_date_time-from": z.string().optional(),
      "upd_date_time-to": z.string().optional(),
    }),
  }),
  response: z.array(MonthlyBudget),
};

export type get_BudgetsdailyDate = typeof get_BudgetsdailyDate;
export const get_BudgetsdailyDate = {
  method: z.literal("GET"),
  path: z.literal("/budgets/daily/{date}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      fields: z.array(z.string()).optional(),
      sort: z.string().optional(),
      limit: z.number().optional(),
      page: z.number().optional(),
      budget_id: z.string().optional(),
      store_id: z.string().optional(),
      "ins_date_time-from": z.string().optional(),
      "ins_date_time-to": z.string().optional(),
      "upd_date_time-from": z.string().optional(),
      "upd_date_time-to": z.string().optional(),
    }),
    path: z.object({
      date: z.string(),
    }),
  }),
  response: z.array(DailyBudget),
};

export type post_BudgetsdailyDate = typeof post_BudgetsdailyDate;
export const post_BudgetsdailyDate = {
  method: z.literal("POST"),
  path: z.literal("/budgets/daily/{date}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      date: z.string(),
    }),
    body: DailyBudgetCreate,
  }),
  response: DailyBudget,
};

export type put_BudgetsdailyDate = typeof put_BudgetsdailyDate;
export const put_BudgetsdailyDate = {
  method: z.literal("PUT"),
  path: z.literal("/budgets/daily/{date}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      store_id: z.string(),
    }),
    path: z.object({
      date: z.string(),
    }),
    body: DailyBudgetUpdate,
  }),
  response: DailyBudget,
};

export type delete_BudgetsdailyDate = typeof delete_BudgetsdailyDate;
export const delete_BudgetsdailyDate = {
  method: z.literal("DELETE"),
  path: z.literal("/budgets/daily/{date}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      store_id: z.string(),
    }),
    path: z.object({
      date: z.string(),
    }),
  }),
  response: z.unknown(),
};

export type get_Budgetsstaff = typeof get_Budgetsstaff;
export const get_Budgetsstaff = {
  method: z.literal("GET"),
  path: z.literal("/budgets/staff"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      fields: z.array(z.string()).optional(),
      sort: z.string().optional(),
      limit: z.number().optional(),
      page: z.number().optional(),
      budget_id: z.string().optional(),
      store_id: z.string().optional(),
      staff_id: z.string().optional(),
      "year_month-from": z.string().optional(),
      "year_month-to": z.string().optional(),
      "ins_date_time-from": z.string().optional(),
      "ins_date_time-to": z.string().optional(),
      "upd_date_time-from": z.string().optional(),
      "upd_date_time-to": z.string().optional(),
    }),
  }),
  response: z.array(StaffBudget),
};

export type post_Budgetsstaff = typeof post_Budgetsstaff;
export const post_Budgetsstaff = {
  method: z.literal("POST"),
  path: z.literal("/budgets/staff"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    body: StaffBudgetCreate,
  }),
  response: StaffBudget,
};

export type put_Budgetsstaff = typeof put_Budgetsstaff;
export const put_Budgetsstaff = {
  method: z.literal("PUT"),
  path: z.literal("/budgets/staff"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      budget_id: z.string(),
    }),
    body: StaffBudgetUpdate,
  }),
  response: StaffBudget,
};

export type delete_Budgetsstaff = typeof delete_Budgetsstaff;
export const delete_Budgetsstaff = {
  method: z.literal("DELETE"),
  path: z.literal("/budgets/staff"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      budget_id: z.string(),
    }),
  }),
  response: z.unknown(),
};

export type get_Suppliers = typeof get_Suppliers;
export const get_Suppliers = {
  method: z.literal("GET"),
  path: z.literal("/suppliers"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      fields: z.array(z.string()).optional(),
      sort: z.string().optional(),
      limit: z.number().optional(),
      page: z.number().optional(),
      supplier_id: z.string().optional(),
      supplier_code: z.string().optional(),
      supplier_name: z.string().optional(),
      supplier_abbr: z.string().optional(),
      supplier_division_id: z.string().optional(),
      phone_number: z.string().optional(),
      status: z.union([z.literal("0"), z.literal("1")]).optional(),
      "ins_date_time-from": z.string().optional(),
      "ins_date_time-to": z.string().optional(),
      "upd_date_time-from": z.string().optional(),
      "upd_date_time-to": z.string().optional(),
    }),
  }),
  response: z.array(Supplier),
};

export type post_Suppliers = typeof post_Suppliers;
export const post_Suppliers = {
  method: z.literal("POST"),
  path: z.literal("/suppliers"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    body: SupplierCreate,
  }),
  response: Supplier,
};

export type get_SuppliersId = typeof get_SuppliersId;
export const get_SuppliersId = {
  method: z.literal("GET"),
  path: z.literal("/suppliers/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.string(),
    }),
  }),
  response: Supplier,
};

export type put_SuppliersId = typeof put_SuppliersId;
export const put_SuppliersId = {
  method: z.literal("PUT"),
  path: z.literal("/suppliers/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.string(),
    }),
    body: SupplierUpdate,
  }),
  response: Supplier,
};

export type delete_SuppliersId = typeof delete_SuppliersId;
export const delete_SuppliersId = {
  method: z.literal("DELETE"),
  path: z.literal("/suppliers/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.string(),
    }),
  }),
  response: z.unknown(),
};

export type get_SuppliersIdproducts = typeof get_SuppliersIdproducts;
export const get_SuppliersIdproducts = {
  method: z.literal("GET"),
  path: z.literal("/suppliers/{id}/products"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      fields: z.array(z.string()).optional(),
      sort: z.string().optional(),
      limit: z.number().optional(),
      page: z.number().optional(),
      supplier_product_id: z.string().optional(),
      product_id: z.string().optional(),
      product_code: z.string().optional(),
      product_name: z.string().optional(),
      supplier_product_code: z.string().optional(),
      supplier_product_name: z.string().optional(),
      status: z.union([z.literal("0"), z.literal("1")]).optional(),
      "ins_date_time-from": z.string().optional(),
      "ins_date_time-to": z.string().optional(),
      "upd_date_time-from": z.string().optional(),
      "upd_date_time-to": z.string().optional(),
    }),
    path: z.object({
      id: z.string(),
    }),
  }),
  response: z.array(SupplierProduct),
};

export type post_SuppliersIdproducts = typeof post_SuppliersIdproducts;
export const post_SuppliersIdproducts = {
  method: z.literal("POST"),
  path: z.literal("/suppliers/{id}/products"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.string(),
    }),
    body: SupplierProductCreate,
  }),
  response: SupplierProduct,
};

export type get_Supplier_divisions = typeof get_Supplier_divisions;
export const get_Supplier_divisions = {
  method: z.literal("GET"),
  path: z.literal("/supplier_divisions"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      fields: z.array(z.string()).optional(),
      sort: z.string().optional(),
      limit: z.number().optional(),
      page: z.number().optional(),
      supplier_division_id: z.string().optional(),
      supplier_division_name: z.string().optional(),
      "ins_date_time-from": z.string().optional(),
      "ins_date_time-to": z.string().optional(),
      "upd_date_time-from": z.string().optional(),
      "upd_date_time-to": z.string().optional(),
    }),
  }),
  response: z.array(SupplierDivision),
};

export type post_Supplier_divisions = typeof post_Supplier_divisions;
export const post_Supplier_divisions = {
  method: z.literal("POST"),
  path: z.literal("/supplier_divisions"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    body: SupplierDivisionCreate,
  }),
  response: SupplierDivision,
};

export type get_Supplier_divisionsId = typeof get_Supplier_divisionsId;
export const get_Supplier_divisionsId = {
  method: z.literal("GET"),
  path: z.literal("/supplier_divisions/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.string(),
    }),
  }),
  response: SupplierDivision,
};

export type put_Supplier_divisionsId = typeof put_Supplier_divisionsId;
export const put_Supplier_divisionsId = {
  method: z.literal("PUT"),
  path: z.literal("/supplier_divisions/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.string(),
    }),
    body: SupplierDivisionUpdate,
  }),
  response: SupplierDivision,
};

export type delete_Supplier_divisionsId = typeof delete_Supplier_divisionsId;
export const delete_Supplier_divisionsId = {
  method: z.literal("DELETE"),
  path: z.literal("/supplier_divisions/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.string(),
    }),
  }),
  response: z.unknown(),
};

export type get_Terminals = typeof get_Terminals;
export const get_Terminals = {
  method: z.literal("GET"),
  path: z.literal("/terminals"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      fields: z.array(z.string()).optional(),
      sort: z.string().optional(),
      limit: z.number().optional(),
      page: z.number().optional(),
      terminal_id: z.string().optional(),
      terminal_code: z.string().optional(),
      terminal_name: z.string().optional(),
      store_id: z.string().optional(),
      terminal_type: z.union([z.literal("1"), z.literal("2"), z.literal("3")]).optional(),
      status: z.union([z.literal("0"), z.literal("1")]).optional(),
      "ins_date_time-from": z.string().optional(),
      "ins_date_time-to": z.string().optional(),
      "upd_date_time-from": z.string().optional(),
      "upd_date_time-to": z.string().optional(),
    }),
  }),
  response: z.array(Terminal),
};

export type post_Terminals = typeof post_Terminals;
export const post_Terminals = {
  method: z.literal("POST"),
  path: z.literal("/terminals"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    body: TerminalCreate,
  }),
  response: Terminal,
};

export type get_TerminalsId = typeof get_TerminalsId;
export const get_TerminalsId = {
  method: z.literal("GET"),
  path: z.literal("/terminals/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.string(),
    }),
  }),
  response: Terminal,
};

export type put_TerminalsId = typeof put_TerminalsId;
export const put_TerminalsId = {
  method: z.literal("PUT"),
  path: z.literal("/terminals/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.string(),
    }),
    body: TerminalUpdate,
  }),
  response: Terminal,
};

export type delete_TerminalsId = typeof delete_TerminalsId;
export const delete_TerminalsId = {
  method: z.literal("DELETE"),
  path: z.literal("/terminals/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.string(),
    }),
  }),
  response: z.unknown(),
};

export type get_Settlements = typeof get_Settlements;
export const get_Settlements = {
  method: z.literal("GET"),
  path: z.literal("/settlements"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      fields: z.array(z.string()).optional(),
      sort: z.string().optional(),
      limit: z.number().optional(),
      page: z.number().optional(),
      settlement_id: z.string().optional(),
      settlement_no: z.string().optional(),
      store_id: z.string().optional(),
      terminal_id: z.string().optional(),
      staff_id: z.string().optional(),
      "settlement_date_time-from": z.string().optional(),
      "settlement_date_time-to": z.string().optional(),
      "opening_date_time-from": z.string().optional(),
      "opening_date_time-to": z.string().optional(),
      "closing_date_time-from": z.string().optional(),
      "closing_date_time-to": z.string().optional(),
      "ins_date_time-from": z.string().optional(),
      "ins_date_time-to": z.string().optional(),
      "upd_date_time-from": z.string().optional(),
      "upd_date_time-to": z.string().optional(),
    }),
  }),
  response: z.array(Settlement),
};

export type post_Settlements = typeof post_Settlements;
export const post_Settlements = {
  method: z.literal("POST"),
  path: z.literal("/settlements"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    body: SettlementCreate,
  }),
  response: Settlement,
};

export type get_Daily_settlements = typeof get_Daily_settlements;
export const get_Daily_settlements = {
  method: z.literal("GET"),
  path: z.literal("/daily_settlements"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      fields: z.array(z.string()).optional(),
      sort: z.string().optional(),
      limit: z.number().optional(),
      page: z.number().optional(),
      daily_settlement_id: z.string().optional(),
      store_id: z.string().optional(),
      "business_date-from": z.string().optional(),
      "business_date-to": z.string().optional(),
      "closing_date-from": z.string().optional(),
      "closing_date-to": z.string().optional(),
      "closing_date_time-from": z.string().optional(),
      "closing_date_time-to": z.string().optional(),
      staff_id: z.string().optional(),
      status: z.union([z.literal("0"), z.literal("1")]).optional(),
      "ins_date_time-from": z.string().optional(),
      "ins_date_time-to": z.string().optional(),
      "upd_date_time-from": z.string().optional(),
      "upd_date_time-to": z.string().optional(),
    }),
  }),
  response: z.array(DailySettlement),
};

export type post_Daily_settlements = typeof post_Daily_settlements;
export const post_Daily_settlements = {
  method: z.literal("POST"),
  path: z.literal("/daily_settlements"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    body: DailySettlementCreate,
  }),
  response: DailySettlement,
};

export type get_Payment_methods = typeof get_Payment_methods;
export const get_Payment_methods = {
  method: z.literal("GET"),
  path: z.literal("/payment_methods"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      fields: z.array(z.string()).optional(),
      sort: z.string().optional(),
      limit: z.number().optional(),
      page: z.number().optional(),
      payment_method_id: z.string().optional(),
      payment_method_code: z.string().optional(),
      payment_method_name: z.string().optional(),
      payment_method_division_id: z.string().optional(),
      amount_input_type: z.union([z.literal("0"), z.literal("1"), z.literal("2")]).optional(),
      change_type: z.union([z.literal("0"), z.literal("1"), z.literal("2")]).optional(),
      status: z.union([z.literal("0"), z.literal("1")]).optional(),
      "ins_date_time-from": z.string().optional(),
      "ins_date_time-to": z.string().optional(),
      "upd_date_time-from": z.string().optional(),
      "upd_date_time-to": z.string().optional(),
    }),
  }),
  response: z.array(PaymentMethod),
};

export type post_Payment_methods = typeof post_Payment_methods;
export const post_Payment_methods = {
  method: z.literal("POST"),
  path: z.literal("/payment_methods"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    body: PaymentMethodCreate,
  }),
  response: PaymentMethod,
};

export type get_Payment_methodsId = typeof get_Payment_methodsId;
export const get_Payment_methodsId = {
  method: z.literal("GET"),
  path: z.literal("/payment_methods/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.string(),
    }),
  }),
  response: PaymentMethod,
};

export type put_Payment_methodsId = typeof put_Payment_methodsId;
export const put_Payment_methodsId = {
  method: z.literal("PUT"),
  path: z.literal("/payment_methods/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.string(),
    }),
    body: PaymentMethodUpdate,
  }),
  response: PaymentMethod,
};

export type delete_Payment_methodsId = typeof delete_Payment_methodsId;
export const delete_Payment_methodsId = {
  method: z.literal("DELETE"),
  path: z.literal("/payment_methods/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.string(),
    }),
  }),
  response: z.unknown(),
};

export type get_StoresStore_idpayment_methods = typeof get_StoresStore_idpayment_methods;
export const get_StoresStore_idpayment_methods = {
  method: z.literal("GET"),
  path: z.literal("/stores/{store_id}/payment_methods"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      fields: z.array(z.string()).optional(),
      sort: z.string().optional(),
      limit: z.number().optional(),
      page: z.number().optional(),
      store_payment_method_id: z.string().optional(),
      payment_method_id: z.string().optional(),
      status: z.union([z.literal("0"), z.literal("1")]).optional(),
      "ins_date_time-from": z.string().optional(),
      "ins_date_time-to": z.string().optional(),
      "upd_date_time-from": z.string().optional(),
      "upd_date_time-to": z.string().optional(),
    }),
    path: z.object({
      store_id: z.string(),
    }),
  }),
  response: z.array(StorePaymentMethod),
};

export type get_Payment_method_divisions = typeof get_Payment_method_divisions;
export const get_Payment_method_divisions = {
  method: z.literal("GET"),
  path: z.literal("/payment_method_divisions"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      fields: z.array(z.string()).optional(),
      sort: z.string().optional(),
      limit: z.number().optional(),
      page: z.number().optional(),
      payment_method_division_id: z.string().optional(),
      payment_method_division_name: z.string().optional(),
      "ins_date_time-from": z.string().optional(),
      "ins_date_time-to": z.string().optional(),
      "upd_date_time-from": z.string().optional(),
      "upd_date_time-to": z.string().optional(),
    }),
  }),
  response: z.array(PaymentMethodDivision),
};

export type post_Payment_method_divisions = typeof post_Payment_method_divisions;
export const post_Payment_method_divisions = {
  method: z.literal("POST"),
  path: z.literal("/payment_method_divisions"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    body: PaymentMethodDivisionCreate,
  }),
  response: PaymentMethodDivision,
};

export type get_Payment_method_divisionsId = typeof get_Payment_method_divisionsId;
export const get_Payment_method_divisionsId = {
  method: z.literal("GET"),
  path: z.literal("/payment_method_divisions/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.string(),
    }),
  }),
  response: PaymentMethodDivision,
};

export type put_Payment_method_divisionsId = typeof put_Payment_method_divisionsId;
export const put_Payment_method_divisionsId = {
  method: z.literal("PUT"),
  path: z.literal("/payment_method_divisions/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.string(),
    }),
    body: PaymentMethodDivisionUpdate,
  }),
  response: PaymentMethodDivision,
};

export type delete_Payment_method_divisionsId = typeof delete_Payment_method_divisionsId;
export const delete_Payment_method_divisionsId = {
  method: z.literal("DELETE"),
  path: z.literal("/payment_method_divisions/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.string(),
    }),
  }),
  response: z.unknown(),
};

export type get_App_payment_methods = typeof get_App_payment_methods;
export const get_App_payment_methods = {
  method: z.literal("GET"),
  path: z.literal("/app_payment_methods"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      fields: z.array(z.string()).optional(),
      sort: z.string().optional(),
      limit: z.number().optional(),
      page: z.number().optional(),
      app_payment_method_id: z.string().optional(),
      payment_method_id: z.string().optional(),
      app_payment_code: z.string().optional(),
      status: z.union([z.literal("0"), z.literal("1")]).optional(),
      "ins_date_time-from": z.string().optional(),
      "ins_date_time-to": z.string().optional(),
      "upd_date_time-from": z.string().optional(),
      "upd_date_time-to": z.string().optional(),
    }),
  }),
  response: z.array(AppPaymentMethod),
};

export type post_App_payment_methods = typeof post_App_payment_methods;
export const post_App_payment_methods = {
  method: z.literal("POST"),
  path: z.literal("/app_payment_methods"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    body: AppPaymentMethodCreate,
  }),
  response: AppPaymentMethod,
};

export type get_App_payment_methodsId = typeof get_App_payment_methodsId;
export const get_App_payment_methodsId = {
  method: z.literal("GET"),
  path: z.literal("/app_payment_methods/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.string(),
    }),
  }),
  response: AppPaymentMethod,
};

export type delete_App_payment_methodsId = typeof delete_App_payment_methodsId;
export const delete_App_payment_methodsId = {
  method: z.literal("DELETE"),
  path: z.literal("/app_payment_methods/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.string(),
    }),
  }),
  response: z.unknown(),
};

export type get_GetCoupons = typeof get_GetCoupons;
export const get_GetCoupons = {
  method: z.literal("GET"),
  path: z.literal("/coupons"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      coupon_id: z.number().optional(),
      coupon_name: z.string().optional(),
      start_date_from: z.string().optional(),
      start_date_to: z.string().optional(),
      end_date_from: z.string().optional(),
      end_date_to: z.string().optional(),
      limit: z.number().optional(),
      page: z.number().optional(),
    }),
  }),
  response: z.object({
    couponInfos: z.array(Coupon).optional(),
    pagination: Pagination.optional(),
  }),
};

export type post_CreateCoupon = typeof post_CreateCoupon;
export const post_CreateCoupon = {
  method: z.literal("POST"),
  path: z.literal("/coupons"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    body: CouponCreate,
  }),
  response: z.object({
    id: z.number().optional(),
  }),
};

export type get_GetCoupon = typeof get_GetCoupon;
export const get_GetCoupon = {
  method: z.literal("GET"),
  path: z.literal("/coupons/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.number(),
    }),
  }),
  response: Coupon,
};

export type patch_UpdateCoupon = typeof patch_UpdateCoupon;
export const patch_UpdateCoupon = {
  method: z.literal("PATCH"),
  path: z.literal("/coupons/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.number(),
    }),
    body: CouponUpdate,
  }),
  response: z.unknown(),
};

export type delete_DeleteCoupon = typeof delete_DeleteCoupon;
export const delete_DeleteCoupon = {
  method: z.literal("DELETE"),
  path: z.literal("/coupons/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.number(),
    }),
  }),
  response: z.unknown(),
};

export type get_GetCouponProducts = typeof get_GetCouponProducts;
export const get_GetCouponProducts = {
  method: z.literal("GET"),
  path: z.literal("/coupons/{id}/products"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      limit: z.number().optional(),
      page: z.number().optional(),
    }),
    path: z.object({
      id: z.number(),
    }),
  }),
  response: z.object({
    couponProducts: z.array(CouponProduct).optional(),
    pagination: Pagination.optional(),
  }),
};

export type post_CreateCouponProduct = typeof post_CreateCouponProduct;
export const post_CreateCouponProduct = {
  method: z.literal("POST"),
  path: z.literal("/coupons/{id}/products"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.number(),
    }),
    body: CouponProductCreate,
  }),
  response: z.object({
    id: z.number().optional(),
  }),
};

export type get_GetCouponProduct = typeof get_GetCouponProduct;
export const get_GetCouponProduct = {
  method: z.literal("GET"),
  path: z.literal("/coupons/{id}/products/{couponProductId}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.number(),
      couponProductId: z.number(),
    }),
  }),
  response: CouponProduct,
};

export type patch_UpdateCouponProduct = typeof patch_UpdateCouponProduct;
export const patch_UpdateCouponProduct = {
  method: z.literal("PATCH"),
  path: z.literal("/coupons/{id}/products/{couponProductId}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.number(),
      couponProductId: z.number(),
    }),
    body: CouponProductUpdate,
  }),
  response: z.unknown(),
};

export type delete_DeleteCouponProduct = typeof delete_DeleteCouponProduct;
export const delete_DeleteCouponProduct = {
  method: z.literal("DELETE"),
  path: z.literal("/coupons/{id}/products/{couponProductId}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.number(),
      couponProductId: z.number(),
    }),
  }),
  response: z.unknown(),
};

export type get_Losses = typeof get_Losses;
export const get_Losses = {
  method: z.literal("GET"),
  path: z.literal("/losses"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      fields: z.array(z.string()).optional(),
      sort: z.string().optional(),
      limit: z.number().optional(),
      page: z.number().optional(),
      loss_id: z.string().optional(),
      store_id: z.string().optional(),
      "loss_date-from": z.string().optional(),
      "loss_date-to": z.string().optional(),
      loss_division_id: z.string().optional(),
      "upd_date_time-from": z.string().optional(),
      "upd_date_time-to": z.string().optional(),
    }),
  }),
  response: z.array(Loss),
};

export type post_Losses = typeof post_Losses;
export const post_Losses = {
  method: z.literal("POST"),
  path: z.literal("/losses"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    body: LossCreate,
  }),
  response: Loss,
};

export type get_LossesId = typeof get_LossesId;
export const get_LossesId = {
  method: z.literal("GET"),
  path: z.literal("/losses/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      fields: z.array(z.string()).optional(),
    }),
    path: z.object({
      id: z.string(),
    }),
  }),
  response: Loss,
};

export type patch_LossesId = typeof patch_LossesId;
export const patch_LossesId = {
  method: z.literal("PATCH"),
  path: z.literal("/losses/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.string(),
    }),
    body: LossUpdate,
  }),
  response: Loss,
};

export type delete_LossesId = typeof delete_LossesId;
export const delete_LossesId = {
  method: z.literal("DELETE"),
  path: z.literal("/losses/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.string(),
    }),
  }),
  response: z.unknown(),
};

export type get_LossesIddetails = typeof get_LossesIddetails;
export const get_LossesIddetails = {
  method: z.literal("GET"),
  path: z.literal("/losses/{id}/details"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      fields: z.array(z.string()).optional(),
      sort: z.string().optional(),
      limit: z.number().optional(),
      page: z.number().optional(),
    }),
    path: z.object({
      id: z.string(),
    }),
  }),
  response: z.array(LossDetail),
};

export type get_Loss_divisions = typeof get_Loss_divisions;
export const get_Loss_divisions = {
  method: z.literal("GET"),
  path: z.literal("/loss_divisions"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      fields: z.array(z.string()).optional(),
      sort: z.string().optional(),
      limit: z.number().optional(),
      page: z.number().optional(),
      loss_division_id: z.string().optional(),
    }),
  }),
  response: z.array(LossDivision),
};

export type post_Loss_divisions = typeof post_Loss_divisions;
export const post_Loss_divisions = {
  method: z.literal("POST"),
  path: z.literal("/loss_divisions"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    body: LossDivisionCreate,
  }),
  response: LossDivision,
};

export type get_Loss_divisionsId = typeof get_Loss_divisionsId;
export const get_Loss_divisionsId = {
  method: z.literal("GET"),
  path: z.literal("/loss_divisions/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      fields: z.array(z.string()).optional(),
    }),
    path: z.object({
      id: z.string(),
    }),
  }),
  response: LossDivision,
};

export type patch_Loss_divisionsId = typeof patch_Loss_divisionsId;
export const patch_Loss_divisionsId = {
  method: z.literal("PATCH"),
  path: z.literal("/loss_divisions/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.string(),
    }),
    body: LossDivisionUpdate,
  }),
  response: LossDivision,
};

export type delete_Loss_divisionsId = typeof delete_Loss_divisionsId;
export const delete_Loss_divisionsId = {
  method: z.literal("DELETE"),
  path: z.literal("/loss_divisions/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.string(),
    }),
  }),
  response: z.unknown(),
};

export type get_Orders = typeof get_Orders;
export const get_Orders = {
  method: z.literal("GET"),
  path: z.literal("/orders"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      fields: z.array(z.string()).optional(),
      sort: z.string().optional(),
      limit: z.number().optional(),
      page: z.number().optional(),
      order_id: z.string().optional(),
      store_id: z.string().optional(),
      supplier_id: z.string().optional(),
      "estimated_arrival_date-from": z.string().optional(),
      "estimated_arrival_date-to": z.string().optional(),
      "order_date-from": z.string().optional(),
      "order_date-to": z.string().optional(),
      status: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.literal("3")]).optional(),
      "upd_date_time-from": z.string().optional(),
      "upd_date_time-to": z.string().optional(),
    }),
  }),
  response: z.array(Order),
};

export type post_Orders = typeof post_Orders;
export const post_Orders = {
  method: z.literal("POST"),
  path: z.literal("/orders"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    body: OrderCreate,
  }),
  response: Order,
};

export type get_OrdersId = typeof get_OrdersId;
export const get_OrdersId = {
  method: z.literal("GET"),
  path: z.literal("/orders/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      fields: z.array(z.string()).optional(),
    }),
    path: z.object({
      id: z.string(),
    }),
  }),
  response: Order,
};

export type patch_OrdersId = typeof patch_OrdersId;
export const patch_OrdersId = {
  method: z.literal("PATCH"),
  path: z.literal("/orders/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.string(),
    }),
    body: OrderUpdate,
  }),
  response: Order,
};

export type delete_OrdersId = typeof delete_OrdersId;
export const delete_OrdersId = {
  method: z.literal("DELETE"),
  path: z.literal("/orders/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.string(),
    }),
  }),
  response: z.unknown(),
};

export type get_Ordersproducts = typeof get_Ordersproducts;
export const get_Ordersproducts = {
  method: z.literal("GET"),
  path: z.literal("/orders/products"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      fields: z.array(z.string()).optional(),
      sort: z.string().optional(),
      limit: z.number().optional(),
      page: z.number().optional(),
      product_id: z.string().optional(),
      product_code: z.string().optional(),
      supplier_id: z.string().optional(),
      category_id: z.string().optional(),
      min_remains_inventories: z.boolean().optional(),
      store_id: z.string().optional(),
    }),
  }),
  response: z.array(OrderProduct),
};

export type get_Ordersstores = typeof get_Ordersstores;
export const get_Ordersstores = {
  method: z.literal("GET"),
  path: z.literal("/orders/stores"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      fields: z.array(z.string()).optional(),
      sort: z.string().optional(),
      limit: z.number().optional(),
      page: z.number().optional(),
    }),
  }),
  response: z.array(OrderStore),
};

export type get_Arrivals = typeof get_Arrivals;
export const get_Arrivals = {
  method: z.literal("GET"),
  path: z.literal("/arrivals"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      fields: z.array(z.string()).optional(),
      sort: z.string().optional(),
      limit: z.number().optional(),
      page: z.number().optional(),
      arrival_id: z.string().optional(),
      order_id: z.string().optional(),
      store_id: z.string().optional(),
      supplier_id: z.string().optional(),
      "arrival_date-from": z.string().optional(),
      "arrival_date-to": z.string().optional(),
      "upd_date_time-from": z.string().optional(),
      "upd_date_time-to": z.string().optional(),
    }),
  }),
  response: z.array(Arrival),
};

export type post_Arrivals = typeof post_Arrivals;
export const post_Arrivals = {
  method: z.literal("POST"),
  path: z.literal("/arrivals"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    body: ArrivalCreate,
  }),
  response: Arrival,
};

export type get_ArrivalsId = typeof get_ArrivalsId;
export const get_ArrivalsId = {
  method: z.literal("GET"),
  path: z.literal("/arrivals/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      fields: z.array(z.string()).optional(),
    }),
    path: z.object({
      id: z.string(),
    }),
  }),
  response: Arrival,
};

export type patch_ArrivalsId = typeof patch_ArrivalsId;
export const patch_ArrivalsId = {
  method: z.literal("PATCH"),
  path: z.literal("/arrivals/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.string(),
    }),
    body: ArrivalUpdate,
  }),
  response: Arrival,
};

export type get_ArrivalsIddetails = typeof get_ArrivalsIddetails;
export const get_ArrivalsIddetails = {
  method: z.literal("GET"),
  path: z.literal("/arrivals/{id}/details"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      fields: z.array(z.string()).optional(),
      sort: z.string().optional(),
      limit: z.number().optional(),
      page: z.number().optional(),
    }),
    path: z.object({
      id: z.string(),
    }),
  }),
  response: z.array(ArrivalDetail),
};

export type get_Shipments = typeof get_Shipments;
export const get_Shipments = {
  method: z.literal("GET"),
  path: z.literal("/shipments"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      fields: z.array(z.string()).optional(),
      sort: z.string().optional(),
      limit: z.number().optional(),
      page: z.number().optional(),
      shipment_id: z.string().optional(),
      store_id: z.string().optional(),
      "shipment_date-from": z.string().optional(),
      "shipment_date-to": z.string().optional(),
      destination_store_id: z.string().optional(),
      "upd_date_time-from": z.string().optional(),
      "upd_date_time-to": z.string().optional(),
    }),
  }),
  response: z.array(Shipment),
};

export type post_Shipments = typeof post_Shipments;
export const post_Shipments = {
  method: z.literal("POST"),
  path: z.literal("/shipments"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    body: ShipmentCreate,
  }),
  response: Shipment,
};

export type get_ShipmentsId = typeof get_ShipmentsId;
export const get_ShipmentsId = {
  method: z.literal("GET"),
  path: z.literal("/shipments/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      fields: z.array(z.string()).optional(),
    }),
    path: z.object({
      id: z.string(),
    }),
  }),
  response: Shipment,
};

export type patch_ShipmentsId = typeof patch_ShipmentsId;
export const patch_ShipmentsId = {
  method: z.literal("PATCH"),
  path: z.literal("/shipments/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.string(),
    }),
    body: ShipmentUpdate,
  }),
  response: Shipment,
};

export type delete_ShipmentsId = typeof delete_ShipmentsId;
export const delete_ShipmentsId = {
  method: z.literal("DELETE"),
  path: z.literal("/shipments/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.string(),
    }),
  }),
  response: z.unknown(),
};

export type get_ShipmentsIddetails = typeof get_ShipmentsIddetails;
export const get_ShipmentsIddetails = {
  method: z.literal("GET"),
  path: z.literal("/shipments/{id}/details"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      fields: z.array(z.string()).optional(),
      sort: z.string().optional(),
      limit: z.number().optional(),
      page: z.number().optional(),
    }),
    path: z.object({
      id: z.string(),
    }),
  }),
  response: z.array(ShipmentDetail),
};

export type get_GetIncomingStocks = typeof get_GetIncomingStocks;
export const get_GetIncomingStocks = {
  method: z.literal("GET"),
  path: z.literal("/incoming_stocks"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      incoming_stock_id: z.number().optional(),
      store_id: z.number().optional(),
      division: z.number().optional(),
      status: z.number().optional(),
      target_date_from: z.string().optional(),
      target_date_to: z.string().optional(),
      limit: z.number().optional(),
      page: z.number().optional(),
    }),
  }),
  response: z.object({
    incomingStocks: z.array(IncomingStock).optional(),
    pagination: Pagination.optional(),
  }),
};

export type post_CreateIncomingStock = typeof post_CreateIncomingStock;
export const post_CreateIncomingStock = {
  method: z.literal("POST"),
  path: z.literal("/incoming_stocks"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    body: z.object({
      division: z.number(),
      status: z.number(),
      storeId: z.number(),
      supplierStoreId: z.union([z.number(), z.undefined()]).optional(),
      supplierId: z.union([z.number(), z.undefined()]).optional(),
      arrivalId: z.union([z.number(), z.undefined()]).optional(),
      arrivalDate: z.union([z.string(), z.undefined()]).optional(),
      orderId: z.union([z.number(), z.undefined()]).optional(),
      targetDate: z.string(),
      estimatedDate: z.union([z.string(), z.undefined()]).optional(),
      staffId: z.union([z.number(), z.undefined()]).optional(),
      memo: z.union([z.string(), z.undefined()]).optional(),
      details: z.array(
        z.object({
          productId: z.number(),
          quantity: z.number(),
          costPrice: z.union([z.number(), z.undefined()]).optional(),
          memo: z.union([z.string(), z.undefined()]).optional(),
        }),
      ),
    }),
  }),
  response: z.object({
    id: z.number().optional(),
  }),
};

export type get_GetIncomingStock = typeof get_GetIncomingStock;
export const get_GetIncomingStock = {
  method: z.literal("GET"),
  path: z.literal("/incoming_stocks/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.number(),
    }),
  }),
  response: IncomingStock,
};

export type patch_UpdateIncomingStock = typeof patch_UpdateIncomingStock;
export const patch_UpdateIncomingStock = {
  method: z.literal("PATCH"),
  path: z.literal("/incoming_stocks/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.number(),
    }),
    body: IncomingStockUpdate,
  }),
  response: z.unknown(),
};

export type delete_DeleteIncomingStock = typeof delete_DeleteIncomingStock;
export const delete_DeleteIncomingStock = {
  method: z.literal("DELETE"),
  path: z.literal("/incoming_stocks/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.number(),
    }),
  }),
  response: z.unknown(),
};

export type get_GetIncomingStockDetails = typeof get_GetIncomingStockDetails;
export const get_GetIncomingStockDetails = {
  method: z.literal("GET"),
  path: z.literal("/incoming_stocks/{id}/details"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      limit: z.number().optional(),
      page: z.number().optional(),
    }),
    path: z.object({
      id: z.number(),
    }),
  }),
  response: z.object({
    incomingStockDetails: z.array(IncomingStockDetail).optional(),
    pagination: Pagination.optional(),
  }),
};

export type patch_UpdateIncomingStockDetails = typeof patch_UpdateIncomingStockDetails;
export const patch_UpdateIncomingStockDetails = {
  method: z.literal("PATCH"),
  path: z.literal("/incoming_stocks/{id}/details"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.number(),
    }),
    body: z.object({
      details: z.array(
        z.object({
          id: z.number(),
          productId: z.number(),
          quantity: z.number(),
          costPrice: z.union([z.number(), z.undefined()]).optional(),
          memo: z.union([z.string(), z.undefined()]).optional(),
        }),
      ),
    }),
  }),
  response: z.unknown(),
};

export type get_GetOutgoingStocks = typeof get_GetOutgoingStocks;
export const get_GetOutgoingStocks = {
  method: z.literal("GET"),
  path: z.literal("/outgoing_stocks"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      outgoing_stock_id: z.number().optional(),
      store_id: z.number().optional(),
      division: z.number().optional(),
      status: z.number().optional(),
      target_date_from: z.string().optional(),
      target_date_to: z.string().optional(),
      limit: z.number().optional(),
      page: z.number().optional(),
    }),
  }),
  response: z.object({
    outgoingStocks: z.array(OutgoingStock).optional(),
    pagination: Pagination.optional(),
  }),
};

export type post_CreateOutgoingStock = typeof post_CreateOutgoingStock;
export const post_CreateOutgoingStock = {
  method: z.literal("POST"),
  path: z.literal("/outgoing_stocks"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    body: OutgoingStockCreate,
  }),
  response: z.object({
    id: z.number().optional(),
  }),
};

export type get_GetOutgoingStock = typeof get_GetOutgoingStock;
export const get_GetOutgoingStock = {
  method: z.literal("GET"),
  path: z.literal("/outgoing_stocks/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.number(),
    }),
  }),
  response: OutgoingStock,
};

export type patch_UpdateOutgoingStock = typeof patch_UpdateOutgoingStock;
export const patch_UpdateOutgoingStock = {
  method: z.literal("PATCH"),
  path: z.literal("/outgoing_stocks/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.number(),
    }),
    body: OutgoingStockUpdate,
  }),
  response: z.unknown(),
};

export type delete_DeleteOutgoingStock = typeof delete_DeleteOutgoingStock;
export const delete_DeleteOutgoingStock = {
  method: z.literal("DELETE"),
  path: z.literal("/outgoing_stocks/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.number(),
    }),
  }),
  response: z.unknown(),
};

export type get_GetOutgoingStockDetails = typeof get_GetOutgoingStockDetails;
export const get_GetOutgoingStockDetails = {
  method: z.literal("GET"),
  path: z.literal("/outgoing_stocks/{id}/details"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      limit: z.number().optional(),
      page: z.number().optional(),
    }),
    path: z.object({
      id: z.number(),
    }),
  }),
  response: z.object({
    outgoingStockDetails: z.array(OutgoingStockDetail).optional(),
    pagination: Pagination.optional(),
  }),
};

export type patch_UpdateOutgoingStockDetails = typeof patch_UpdateOutgoingStockDetails;
export const patch_UpdateOutgoingStockDetails = {
  method: z.literal("PATCH"),
  path: z.literal("/outgoing_stocks/{id}/details"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.number(),
    }),
    body: z.object({
      details: z.array(
        z.object({
          id: z.number(),
          productId: z.number(),
          quantity: z.number(),
          costPrice: z.union([z.number(), z.undefined()]).optional(),
          memo: z.union([z.string(), z.undefined()]).optional(),
        }),
      ),
    }),
  }),
  response: z.unknown(),
};

export type get_GetCorrectionOutgoingStocks = typeof get_GetCorrectionOutgoingStocks;
export const get_GetCorrectionOutgoingStocks = {
  method: z.literal("GET"),
  path: z.literal("/correction_requests/outgoing_stocks"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      correction_outgoing_stock_id: z.number().optional(),
      store_id: z.number().optional(),
      status: z.number().optional(),
      target_date_from: z.string().optional(),
      target_date_to: z.string().optional(),
      limit: z.number().optional(),
      page: z.number().optional(),
    }),
  }),
  response: z.object({
    correctionOutgoingStocks: z.array(CorrectionRequestOutgoingStock).optional(),
    pagination: Pagination.optional(),
  }),
};

export type post_CreateCorrectionOutgoingStock = typeof post_CreateCorrectionOutgoingStock;
export const post_CreateCorrectionOutgoingStock = {
  method: z.literal("POST"),
  path: z.literal("/correction_requests/outgoing_stocks"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    body: z.object({
      outgoingStockId: z.number(),
      storeId: z.number(),
      requestDate: z.string(),
      requestReason: z.string(),
      requestStaffId: z.union([z.number(), z.undefined()]).optional(),
    }),
  }),
  response: z.object({
    id: z.number().optional(),
  }),
};

export type get_GetCorrectionOutgoingStock = typeof get_GetCorrectionOutgoingStock;
export const get_GetCorrectionOutgoingStock = {
  method: z.literal("GET"),
  path: z.literal("/correction_requests/outgoing_stocks/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.number(),
    }),
  }),
  response: CorrectionRequestOutgoingStock,
};

export type patch_UpdateCorrectionOutgoingStock = typeof patch_UpdateCorrectionOutgoingStock;
export const patch_UpdateCorrectionOutgoingStock = {
  method: z.literal("PATCH"),
  path: z.literal("/correction_requests/outgoing_stocks/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.number(),
    }),
    body: z.object({
      status: z.number(),
      approvalDate: z.string(),
      approvalReason: z.union([z.string(), z.undefined()]).optional(),
      approvalStaffId: z.union([z.number(), z.undefined()]).optional(),
    }),
  }),
  response: z.unknown(),
};

export type delete_DeleteCorrectionOutgoingStock = typeof delete_DeleteCorrectionOutgoingStock;
export const delete_DeleteCorrectionOutgoingStock = {
  method: z.literal("DELETE"),
  path: z.literal("/correction_requests/outgoing_stocks/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.number(),
    }),
  }),
  response: z.unknown(),
};

export type get_GetStocktakings = typeof get_GetStocktakings;
export const get_GetStocktakings = {
  method: z.literal("GET"),
  path: z.literal("/stocktakings"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      stocktaking_id: z.number().optional(),
      store_id: z.number().optional(),
      stocktaking_name: z.string().optional(),
      stocktaking_status: z.number().optional(),
      start_date_from: z.string().optional(),
      start_date_to: z.string().optional(),
      end_date_from: z.string().optional(),
      end_date_to: z.string().optional(),
      limit: z.number().optional(),
      page: z.number().optional(),
    }),
  }),
  response: z.object({
    stocktakings: z.array(Stocktaking).optional(),
    pagination: Pagination.optional(),
  }),
};

export type post_CreateStocktaking = typeof post_CreateStocktaking;
export const post_CreateStocktaking = {
  method: z.literal("POST"),
  path: z.literal("/stocktakings"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    body: z.object({
      stocktakingName: z.string(),
      storeId: z.number(),
      stocktakingStatus: z.number(),
      startDate: z.string(),
      endDate: z.union([z.string(), z.undefined()]).optional(),
      stockAmount: z.union([z.number(), z.undefined()]).optional(),
      staffId: z.union([z.number(), z.undefined()]).optional(),
      memo: z.union([z.string(), z.undefined()]).optional(),
      isExcludeOutOfStock: z.union([z.boolean(), z.undefined()]).optional(),
      categoryTarget: z.union([z.number(), z.undefined()]).optional(),
      categoryIds: z.union([z.array(z.number()), z.undefined()]).optional(),
    }),
  }),
  response: z.object({
    id: z.number().optional(),
  }),
};

export type get_GetStocktakingCategories = typeof get_GetStocktakingCategories;
export const get_GetStocktakingCategories = {
  method: z.literal("GET"),
  path: z.literal("/stocktakings/categories"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      stocktaking_id: z.number().optional(),
      store_id: z.number().optional(),
      category_id: z.number().optional(),
      category_code: z.string().optional(),
      category_name: z.string().optional(),
      is_complete: z.number().optional(),
      limit: z.number().optional(),
      page: z.number().optional(),
    }),
  }),
  response: z.object({
    stocktakingCategories: z.array(StocktakingCategory).optional(),
    pagination: Pagination.optional(),
  }),
};

export type patch_UpdateStocktakingCategory = typeof patch_UpdateStocktakingCategory;
export const patch_UpdateStocktakingCategory = {
  method: z.literal("PATCH"),
  path: z.literal("/stocktakings/categories"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    body: z.object({
      stocktakingId: z.number(),
      storeId: z.number(),
      categoryId: z.number(),
      isComplete: z.boolean(),
    }),
  }),
  response: z.unknown(),
};

export type get_GetStocktakingProducts = typeof get_GetStocktakingProducts;
export const get_GetStocktakingProducts = {
  method: z.literal("GET"),
  path: z.literal("/stocktakings/products"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      stocktaking_id: z.number().optional(),
      store_id: z.number().optional(),
      category_id: z.number().optional(),
      product_id: z.number().optional(),
      product_code: z.string().optional(),
      product_name: z.string().optional(),
      barcode: z.string().optional(),
      is_counted: z.number().optional(),
      limit: z.number().optional(),
      page: z.number().optional(),
    }),
  }),
  response: z.object({
    stocktakingProducts: z.array(StocktakingProduct).optional(),
    pagination: Pagination.optional(),
  }),
};

export type patch_UpdateStocktakingProduct = typeof patch_UpdateStocktakingProduct;
export const patch_UpdateStocktakingProduct = {
  method: z.literal("PATCH"),
  path: z.literal("/stocktakings/products"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    body: z.object({
      stocktakingId: z.number(),
      storeId: z.number(),
      productId: z.number(),
      countedQuantity: z.number(),
      isCounted: z.boolean(),
    }),
  }),
  response: z.unknown(),
};

export type get_GetStocktakingStocks = typeof get_GetStocktakingStocks;
export const get_GetStocktakingStocks = {
  method: z.literal("GET"),
  path: z.literal("/stocktakings/stocks"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      stocktaking_id: z.number().optional(),
      store_id: z.number().optional(),
      product_id: z.number().optional(),
      limit: z.number().optional(),
      page: z.number().optional(),
    }),
  }),
  response: z.object({
    stocktakingStocks: z.array(StocktakingStock).optional(),
    pagination: Pagination.optional(),
  }),
};

export type post_CreateStocktakingStock = typeof post_CreateStocktakingStock;
export const post_CreateStocktakingStock = {
  method: z.literal("POST"),
  path: z.literal("/stocktakings/stocks"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    body: z.object({
      stocktakingId: z.number(),
      storeId: z.number(),
      productId: z.number(),
      inventoryQuantity: z.number(),
      countedQuantity: z.number(),
    }),
  }),
  response: z.object({
    id: z.number().optional(),
  }),
};

export type patch_UpdateStocktakingStock = typeof patch_UpdateStocktakingStock;
export const patch_UpdateStocktakingStock = {
  method: z.literal("PATCH"),
  path: z.literal("/stocktakings/stocks"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    body: z.object({
      stocktakingId: z.number(),
      storeId: z.number(),
      productId: z.number(),
      countedQuantity: z.number(),
    }),
  }),
  response: z.unknown(),
};

export type get_GetTaxRates = typeof get_GetTaxRates;
export const get_GetTaxRates = {
  method: z.literal("GET"),
  path: z.literal("/tax_rates"),
  requestFormat: z.literal("json"),
  parameters: z.never(),
  response: z.object({
    taxRates: z.array(TaxRate).optional(),
  }),
};

export type get_GetReduceTaxRates = typeof get_GetReduceTaxRates;
export const get_GetReduceTaxRates = {
  method: z.literal("GET"),
  path: z.literal("/reduce_tax_rates"),
  requestFormat: z.literal("json"),
  parameters: z.never(),
  response: z.object({
    reduceTaxRates: z.array(ReduceTaxRate).optional(),
  }),
};

export type get_GetReceiptRemarks = typeof get_GetReceiptRemarks;
export const get_GetReceiptRemarks = {
  method: z.literal("GET"),
  path: z.literal("/receipt_remarks"),
  requestFormat: z.literal("json"),
  parameters: z.never(),
  response: z.object({
    receiptRemarks: z.array(ReceiptRemark).optional(),
  }),
};

export type post_CreateReceiptRemark = typeof post_CreateReceiptRemark;
export const post_CreateReceiptRemark = {
  method: z.literal("POST"),
  path: z.literal("/receipt_remarks"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    body: ReceiptRemarkCreate,
  }),
  response: z.object({
    id: z.number().optional(),
  }),
};

export type get_GetDiscountDivisions = typeof get_GetDiscountDivisions;
export const get_GetDiscountDivisions = {
  method: z.literal("GET"),
  path: z.literal("/discount_divisions"),
  requestFormat: z.literal("json"),
  parameters: z.never(),
  response: z.object({
    discountDivisions: z.array(DiscountDivision).optional(),
  }),
};

export type get_GetCatCctCardCompanies = typeof get_GetCatCctCardCompanies;
export const get_GetCatCctCardCompanies = {
  method: z.literal("GET"),
  path: z.literal("/cat_cct_card_companies"),
  requestFormat: z.literal("json"),
  parameters: z.never(),
  response: z.object({
    catCctCardCompanies: z.array(CatCctCardCompany).optional(),
  }),
};

export type get_GetCustomerTypes = typeof get_GetCustomerTypes;
export const get_GetCustomerTypes = {
  method: z.literal("GET"),
  path: z.literal("/customer_types"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      customer_type_id: z.number().optional(),
      code: z.string().optional(),
      name: z.string().optional(),
      limit: z.number().optional(),
      page: z.number().optional(),
    }),
  }),
  response: z.object({
    customerTypes: z.array(CustomerType).optional(),
    pagination: Pagination.optional(),
  }),
};

export type post_CreateCustomerType = typeof post_CreateCustomerType;
export const post_CreateCustomerType = {
  method: z.literal("POST"),
  path: z.literal("/customer_types"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    body: CustomerTypeCreate,
  }),
  response: z.object({
    id: z.number().optional(),
  }),
};

export type get_GetCustomerTypeSections = typeof get_GetCustomerTypeSections;
export const get_GetCustomerTypeSections = {
  method: z.literal("GET"),
  path: z.literal("/customer_type_sections"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      customer_type_section_id: z.number().optional(),
      customer_type_id: z.number().optional(),
      name: z.string().optional(),
      limit: z.number().optional(),
      page: z.number().optional(),
    }),
  }),
  response: z.object({
    customerTypeSections: z.array(CustomerTypeSection).optional(),
    pagination: Pagination.optional(),
  }),
};

export type patch_UpdateCustomerTypeSection = typeof patch_UpdateCustomerTypeSection;
export const patch_UpdateCustomerTypeSection = {
  method: z.literal("PATCH"),
  path: z.literal("/customer_type_sections"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    body: CustomerTypeSectionUpdate,
  }),
  response: z.unknown(),
};

// <EndpointByMethod>
export const EndpointByMethod = {
  get: {
    "/categories": get_Categories,
    "/categories/{id}": get_CategoriesId,
    "/category_groups": get_Category_groups,
    "/products": get_GetProducts,
    "/products/{id}": get_GetProduct,
    "/products/{id}/prices": get_GetProductPrices,
    "/products/{id}/prices/changes": get_GetProductPriceChanges,
    "/products/{id}/reserve_items": get_GetProductReserveItems,
    "/products/attributes": get_GetProductAttributes,
    "/products/attribute_items": get_GetProductAttributeItems,
    "/products/{id}/stores": get_GetProductStores,
    "/products/{id}/inventory_reservations": get_GetProductInventoryReservations,
    "/products/reserve_item_labels": get_GetProductReserveItemLabels,
    "/products/images": get_GetProductImages,
    "/products/{id}/image": get_GetProductImage,
    "/products/{id}/icon_image": get_GetProductIconImage,
    "/products/{product_id}/reserve_items/{no}": get_GetProductReserveItem,
    "/products/attributes/{no}": get_GetProductAttribute,
    "/products/attribute_items/{code}": get_GetProductAttributeItem,
    "/products/{id}/inventory_reservations/{reservation_product_id}": get_GetProductInventoryReservation,
    "/products/reserve_item_labels/{no}": get_GetProductReserveItemLabel,
    "/transactions": get_Transactions,
    "/transactions/{id}": get_TransactionsId,
    "/transactions/{id}/details": get_TransactionsIddetails,
    "/layaways": get_Layaways,
    "/layaways/{id}": get_LayawaysId,
    "/pre_sales": get_Pre_sales,
    "/pre_sales/{id}": get_Pre_salesId,
    "/ticket_transactions": get_Ticket_transactions,
    "/ticket_transactions/{id}": get_Ticket_transactionsId,
    "/customers": get_Customers,
    "/customers/{id}": get_CustomersId,
    "/customers/{id}/points": get_CustomersIdpoints,
    "/customer_ranks": get_Customer_ranks,
    "/customer_ranks/{id}": get_Customer_ranksId,
    "/staff_ranks": get_Staff_ranks,
    "/staff_ranks/{id}": get_Staff_ranksId,
    "/customers/required": get_Customersrequired,
    "/stocks": get_GetStocks,
    "/stocks/changes": get_GetStockChanges,
    "/bargain": get_Bargain,
    "/bargain/{id}/stores": get_BargainIdstores,
    "/bargain/{id}/products": get_BargainIdproducts,
    "/product_option_groups": get_Product_option_groups,
    "/product_option_groups/{id}": get_Product_option_groupsId,
    "/bundles": get_Bundles,
    "/bundles/{id}": get_BundlesId,
    "/stores": get_Stores,
    "/stores/{id}": get_StoresId,
    "/stores/{store_id}/products": get_StoresStore_idproducts,
    "/stores/{store_id}/product_prices": get_GetStoreProductPrices,
    "/store_groups": get_Store_groups,
    "/store_group_items": get_Store_group_items,
    "/staffs": get_Staffs,
    "/staffs/{id}": get_StaffsId,
    "/roles": get_Roles,
    "/roles/{id}": get_RolesId,
    "/budgets/monthly": get_Budgetsmonthly,
    "/budgets/daily/{date}": get_BudgetsdailyDate,
    "/budgets/staff": get_Budgetsstaff,
    "/suppliers": get_Suppliers,
    "/suppliers/{id}": get_SuppliersId,
    "/suppliers/{id}/products": get_SuppliersIdproducts,
    "/supplier_divisions": get_Supplier_divisions,
    "/supplier_divisions/{id}": get_Supplier_divisionsId,
    "/terminals": get_Terminals,
    "/terminals/{id}": get_TerminalsId,
    "/settlements": get_Settlements,
    "/daily_settlements": get_Daily_settlements,
    "/payment_methods": get_Payment_methods,
    "/payment_methods/{id}": get_Payment_methodsId,
    "/stores/{store_id}/payment_methods": get_StoresStore_idpayment_methods,
    "/payment_method_divisions": get_Payment_method_divisions,
    "/payment_method_divisions/{id}": get_Payment_method_divisionsId,
    "/app_payment_methods": get_App_payment_methods,
    "/app_payment_methods/{id}": get_App_payment_methodsId,
    "/coupons": get_GetCoupons,
    "/coupons/{id}": get_GetCoupon,
    "/coupons/{id}/products": get_GetCouponProducts,
    "/coupons/{id}/products/{couponProductId}": get_GetCouponProduct,
    "/losses": get_Losses,
    "/losses/{id}": get_LossesId,
    "/losses/{id}/details": get_LossesIddetails,
    "/loss_divisions": get_Loss_divisions,
    "/loss_divisions/{id}": get_Loss_divisionsId,
    "/orders": get_Orders,
    "/orders/{id}": get_OrdersId,
    "/orders/products": get_Ordersproducts,
    "/orders/stores": get_Ordersstores,
    "/arrivals": get_Arrivals,
    "/arrivals/{id}": get_ArrivalsId,
    "/arrivals/{id}/details": get_ArrivalsIddetails,
    "/shipments": get_Shipments,
    "/shipments/{id}": get_ShipmentsId,
    "/shipments/{id}/details": get_ShipmentsIddetails,
    "/incoming_stocks": get_GetIncomingStocks,
    "/incoming_stocks/{id}": get_GetIncomingStock,
    "/incoming_stocks/{id}/details": get_GetIncomingStockDetails,
    "/outgoing_stocks": get_GetOutgoingStocks,
    "/outgoing_stocks/{id}": get_GetOutgoingStock,
    "/outgoing_stocks/{id}/details": get_GetOutgoingStockDetails,
    "/correction_requests/outgoing_stocks": get_GetCorrectionOutgoingStocks,
    "/correction_requests/outgoing_stocks/{id}": get_GetCorrectionOutgoingStock,
    "/stocktakings": get_GetStocktakings,
    "/stocktakings/categories": get_GetStocktakingCategories,
    "/stocktakings/products": get_GetStocktakingProducts,
    "/stocktakings/stocks": get_GetStocktakingStocks,
    "/tax_rates": get_GetTaxRates,
    "/reduce_tax_rates": get_GetReduceTaxRates,
    "/receipt_remarks": get_GetReceiptRemarks,
    "/discount_divisions": get_GetDiscountDivisions,
    "/cat_cct_card_companies": get_GetCatCctCardCompanies,
    "/customer_types": get_GetCustomerTypes,
    "/customer_type_sections": get_GetCustomerTypeSections,
  },
  post: {
    "/categories": post_Categories,
    "/category_groups": post_Category_groups,
    "/products": post_CreateProduct,
    "/products/bulk": post_BulkCreateProducts,
    "/products/{id}/prices": post_CreateProductPrice,
    "/products/{id}/reserve_items": post_CreateProductReserveItem,
    "/products/attributes": post_CreateProductAttribute,
    "/products/attribute_items": post_CreateProductAttributeItem,
    "/products/{id}/stores": post_CreateProductStore,
    "/products/{id}/inventory_reservations": post_CreateProductInventoryReservation,
    "/products/reserve_item_labels": post_CreateProductReserveItemLabel,
    "/products/images": post_UploadProductImage,
    "/transactions": post_Transactions,
    "/layaways": post_Layaways,
    "/pre_sales": post_Pre_sales,
    "/customers": post_Customers,
    "/customers/bulk": post_Customersbulk,
    "/customer_ranks": post_Customer_ranks,
    "/staff_ranks": post_Staff_ranks,
    "/bargain": post_Bargain,
    "/bargain/{id}/stores": post_BargainIdstores,
    "/bargain/{id}/products": post_BargainIdproducts,
    "/product_option_groups": post_Product_option_groups,
    "/bundles": post_Bundles,
    "/stores": post_Stores,
    "/stores/{store_id}/products": post_StoresStore_idproducts,
    "/stores/{store_id}/product_prices": post_CreateOrUpdateStoreProductPrice,
    "/store_groups": post_Store_groups,
    "/store_group_items": post_Store_group_items,
    "/staffs": post_Staffs,
    "/roles": post_Roles,
    "/budgets/daily/{date}": post_BudgetsdailyDate,
    "/budgets/staff": post_Budgetsstaff,
    "/suppliers": post_Suppliers,
    "/suppliers/{id}/products": post_SuppliersIdproducts,
    "/supplier_divisions": post_Supplier_divisions,
    "/terminals": post_Terminals,
    "/settlements": post_Settlements,
    "/daily_settlements": post_Daily_settlements,
    "/payment_methods": post_Payment_methods,
    "/payment_method_divisions": post_Payment_method_divisions,
    "/app_payment_methods": post_App_payment_methods,
    "/coupons": post_CreateCoupon,
    "/coupons/{id}/products": post_CreateCouponProduct,
    "/losses": post_Losses,
    "/loss_divisions": post_Loss_divisions,
    "/orders": post_Orders,
    "/arrivals": post_Arrivals,
    "/shipments": post_Shipments,
    "/incoming_stocks": post_CreateIncomingStock,
    "/outgoing_stocks": post_CreateOutgoingStock,
    "/correction_requests/outgoing_stocks": post_CreateCorrectionOutgoingStock,
    "/stocktakings": post_CreateStocktaking,
    "/stocktakings/stocks": post_CreateStocktakingStock,
    "/receipt_remarks": post_CreateReceiptRemark,
    "/customer_types": post_CreateCustomerType,
  },
  patch: {
    "/categories/{id}": patch_CategoriesId,
    "/category_groups/{id}": patch_Category_groupsId,
    "/customers/{id}/points": patch_CustomersIdpoints,
    "/stocks": patch_UpdateStock,
    "/bargain/{id}": patch_BargainId,
    "/bargain/{id}/stores/{bargainStoreId}": patch_BargainIdstoresBargainStoreId,
    "/bargain/{id}/products/{bargainProductId}": patch_BargainIdproductsBargainProductId,
    "/product_option_groups/{id}": patch_Product_option_groupsId,
    "/bundles/{id}": patch_BundlesId,
    "/stores/{id}": patch_StoresId,
    "/store_groups/{id}": patch_Store_groupsId,
    "/store_group_items/{id}": patch_Store_group_itemsId,
    "/coupons/{id}": patch_UpdateCoupon,
    "/coupons/{id}/products/{couponProductId}": patch_UpdateCouponProduct,
    "/losses/{id}": patch_LossesId,
    "/loss_divisions/{id}": patch_Loss_divisionsId,
    "/orders/{id}": patch_OrdersId,
    "/arrivals/{id}": patch_ArrivalsId,
    "/shipments/{id}": patch_ShipmentsId,
    "/incoming_stocks/{id}": patch_UpdateIncomingStock,
    "/incoming_stocks/{id}/details": patch_UpdateIncomingStockDetails,
    "/outgoing_stocks/{id}": patch_UpdateOutgoingStock,
    "/outgoing_stocks/{id}/details": patch_UpdateOutgoingStockDetails,
    "/correction_requests/outgoing_stocks/{id}": patch_UpdateCorrectionOutgoingStock,
    "/stocktakings/categories": patch_UpdateStocktakingCategory,
    "/stocktakings/products": patch_UpdateStocktakingProduct,
    "/stocktakings/stocks": patch_UpdateStocktakingStock,
    "/customer_type_sections": patch_UpdateCustomerTypeSection,
  },
  delete: {
    "/categories/{id}": delete_CategoriesId,
    "/category_groups/{id}": delete_Category_groupsId,
    "/products/{id}": delete_DeleteProduct,
    "/products/{id}/image": delete_DeleteProductImage,
    "/products/{id}/icon_image": delete_DeleteProductIconImage,
    "/products/{product_id}/prices/{price_division}/{store_id}/{start_date}": delete_DeleteProductPrice,
    "/products/{product_id}/reserve_items/{no}": delete_DeleteProductReserveItem,
    "/products/attributes/{no}": delete_DeleteProductAttribute,
    "/products/attribute_items/{code}": delete_DeleteProductAttributeItem,
    "/products/{id}/inventory_reservations/{reservation_product_id}": delete_DeleteProductInventoryReservation,
    "/products/reserve_item_labels/{no}": delete_DeleteProductReserveItemLabel,
    "/transactions/{id}": delete_TransactionsId,
    "/layaways/{id}": delete_LayawaysId,
    "/pre_sales/{id}": delete_Pre_salesId,
    "/customers/{id}": delete_CustomersId,
    "/customer_ranks/{id}": delete_Customer_ranksId,
    "/staff_ranks/{id}": delete_Staff_ranksId,
    "/bargain/{id}": delete_BargainId,
    "/bargain/{id}/stores/{bargainStoreId}": delete_BargainIdstoresBargainStoreId,
    "/bargain/{id}/products/{bargainProductId}": delete_BargainIdproductsBargainProductId,
    "/product_option_groups/{id}": delete_Product_option_groupsId,
    "/product_option_groups/{id}/products/{product_id}": delete_Product_option_groupsIdproductsProduct_id,
    "/bundles/{id}": delete_BundlesId,
    "/bundles/{id}/products/{bundleProductId}": delete_BundlesIdproductsBundleProductId,
    "/stores/{id}": delete_StoresId,
    "/store_groups/{id}": delete_Store_groupsId,
    "/store_group_items/{id}": delete_Store_group_itemsId,
    "/staffs/{id}": delete_StaffsId,
    "/roles/{id}": delete_RolesId,
    "/budgets/daily/{date}": delete_BudgetsdailyDate,
    "/budgets/staff": delete_Budgetsstaff,
    "/suppliers/{id}": delete_SuppliersId,
    "/supplier_divisions/{id}": delete_Supplier_divisionsId,
    "/terminals/{id}": delete_TerminalsId,
    "/payment_methods/{id}": delete_Payment_methodsId,
    "/payment_method_divisions/{id}": delete_Payment_method_divisionsId,
    "/app_payment_methods/{id}": delete_App_payment_methodsId,
    "/coupons/{id}": delete_DeleteCoupon,
    "/coupons/{id}/products/{couponProductId}": delete_DeleteCouponProduct,
    "/losses/{id}": delete_LossesId,
    "/loss_divisions/{id}": delete_Loss_divisionsId,
    "/orders/{id}": delete_OrdersId,
    "/shipments/{id}": delete_ShipmentsId,
    "/incoming_stocks/{id}": delete_DeleteIncomingStock,
    "/outgoing_stocks/{id}": delete_DeleteOutgoingStock,
    "/correction_requests/outgoing_stocks/{id}": delete_DeleteCorrectionOutgoingStock,
  },
  put: {
    "/products/{id}": put_UpdateProduct,
    "/products/bulk": put_BulkUpdateProducts,
    "/products/{id}/prices": put_UpdateProductPrices,
    "/products/{id}/reserve_items": put_UpdateProductReserveItems,
    "/products/{id}/stores": put_UpdateProductStores,
    "/products/{id}/inventory_reservations": put_UpdateProductInventoryReservations,
    "/products/{id}/image": put_UpdateProductImage,
    "/products/{id}/icon_image": put_UpdateProductIconImage,
    "/products/{product_id}/reserve_items/{no}": put_UpdateProductReserveItem,
    "/products/attributes/{no}": put_UpdateProductAttribute,
    "/products/attribute_items/{code}": put_UpdateProductAttributeItem,
    "/products/{id}/inventory_reservations/{reservation_product_id}": put_UpdateProductInventoryReservation,
    "/products/reserve_item_labels/{no}": put_UpdateProductReserveItemLabel,
    "/transactions/{id}": put_TransactionsId,
    "/pre_sales/{id}": put_Pre_salesId,
    "/ticket_transactions/{id}": put_Ticket_transactionsId,
    "/customers/{id}": put_CustomersId,
    "/customers/bulk": put_Customersbulk,
    "/customers/{id}/points": put_CustomersIdpoints,
    "/customer_ranks/{id}": put_Customer_ranksId,
    "/staff_ranks/{id}": put_Staff_ranksId,
    "/staffs/{id}": put_StaffsId,
    "/roles/{id}": put_RolesId,
    "/budgets/daily/{date}": put_BudgetsdailyDate,
    "/budgets/staff": put_Budgetsstaff,
    "/suppliers/{id}": put_SuppliersId,
    "/supplier_divisions/{id}": put_Supplier_divisionsId,
    "/terminals/{id}": put_TerminalsId,
    "/payment_methods/{id}": put_Payment_methodsId,
    "/payment_method_divisions/{id}": put_Payment_method_divisionsId,
  },
};
export type EndpointByMethod = typeof EndpointByMethod;
// </EndpointByMethod>

// <EndpointByMethod.Shorthands>
export type GetEndpoints = EndpointByMethod["get"];
export type PostEndpoints = EndpointByMethod["post"];
export type PatchEndpoints = EndpointByMethod["patch"];
export type DeleteEndpoints = EndpointByMethod["delete"];
export type PutEndpoints = EndpointByMethod["put"];
export type AllEndpoints = EndpointByMethod[keyof EndpointByMethod];
// </EndpointByMethod.Shorthands>

// <ApiClientTypes>
export type EndpointParameters = {
  body?: unknown;
  query?: Record<string, unknown>;
  header?: Record<string, unknown>;
  path?: Record<string, unknown>;
};

export type MutationMethod = "post" | "put" | "patch" | "delete";
export type Method = "get" | "head" | "options" | MutationMethod;

type RequestFormat = "json" | "form-data" | "form-url" | "binary" | "text";

export type DefaultEndpoint = {
  parameters?: EndpointParameters | undefined;
  response: unknown;
};

export type Endpoint<TConfig extends DefaultEndpoint = DefaultEndpoint> = {
  operationId: string;
  method: Method;
  path: string;
  requestFormat: RequestFormat;
  parameters?: TConfig["parameters"];
  meta: {
    alias: string;
    hasParameters: boolean;
    areParametersRequired: boolean;
  };
  response: TConfig["response"];
};

type Fetcher = (
  method: Method,
  url: string,
  parameters?: EndpointParameters | undefined,
) => Promise<Endpoint["response"]>;

type RequiredKeys<T> = {
  [P in keyof T]-?: undefined extends T[P] ? never : P;
}[keyof T];

type MaybeOptionalArg<T> = RequiredKeys<T> extends never ? [config?: T] : [config: T];

// </ApiClientTypes>

// <ApiClient>
export class ApiClient {
  baseUrl: string = "";

  constructor(public fetcher: Fetcher) {}

  setBaseUrl(baseUrl: string) {
    this.baseUrl = baseUrl;
    return this;
  }

  // <ApiClient.get>
  get<Path extends keyof GetEndpoints, TEndpoint extends GetEndpoints[Path]>(
    path: Path,
    ...params: MaybeOptionalArg<z.infer<TEndpoint["parameters"]>>
  ): Promise<z.infer<TEndpoint["response"]>> {
    return this.fetcher("get", this.baseUrl + path, params[0]) as Promise<z.infer<TEndpoint["response"]>>;
  }
  // </ApiClient.get>

  // <ApiClient.post>
  post<Path extends keyof PostEndpoints, TEndpoint extends PostEndpoints[Path]>(
    path: Path,
    ...params: MaybeOptionalArg<z.infer<TEndpoint["parameters"]>>
  ): Promise<z.infer<TEndpoint["response"]>> {
    return this.fetcher("post", this.baseUrl + path, params[0]) as Promise<z.infer<TEndpoint["response"]>>;
  }
  // </ApiClient.post>

  // <ApiClient.patch>
  patch<Path extends keyof PatchEndpoints, TEndpoint extends PatchEndpoints[Path]>(
    path: Path,
    ...params: MaybeOptionalArg<z.infer<TEndpoint["parameters"]>>
  ): Promise<z.infer<TEndpoint["response"]>> {
    return this.fetcher("patch", this.baseUrl + path, params[0]) as Promise<z.infer<TEndpoint["response"]>>;
  }
  // </ApiClient.patch>

  // <ApiClient.delete>
  delete<Path extends keyof DeleteEndpoints, TEndpoint extends DeleteEndpoints[Path]>(
    path: Path,
    ...params: MaybeOptionalArg<z.infer<TEndpoint["parameters"]>>
  ): Promise<z.infer<TEndpoint["response"]>> {
    return this.fetcher("delete", this.baseUrl + path, params[0]) as Promise<z.infer<TEndpoint["response"]>>;
  }
  // </ApiClient.delete>

  // <ApiClient.put>
  put<Path extends keyof PutEndpoints, TEndpoint extends PutEndpoints[Path]>(
    path: Path,
    ...params: MaybeOptionalArg<z.infer<TEndpoint["parameters"]>>
  ): Promise<z.infer<TEndpoint["response"]>> {
    return this.fetcher("put", this.baseUrl + path, params[0]) as Promise<z.infer<TEndpoint["response"]>>;
  }
  // </ApiClient.put>
}

export function createApiClient(fetcher: Fetcher, baseUrl?: string) {
  return new ApiClient(fetcher).setBaseUrl(baseUrl ?? "");
}

/**
 Example usage:
 const api = createApiClient((method, url, params) =>
   fetch(url, { method, body: JSON.stringify(params) }).then((res) => res.json()),
 );
 api.get("/users").then((users) => console.log(users));
 api.post("/users", { body: { name: "John" } }).then((user) => console.log(user));
 api.put("/users/:id", { path: { id: 1 }, body: { name: "John" } }).then((user) => console.log(user));
*/

// </ApiClient
