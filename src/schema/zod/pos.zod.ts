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
  transactionHeadDivision: z.union([
    z.literal("1"),
    z.literal("2"),
    z.literal("3"),
    z.literal("4"),
    z.literal("5"),
    z.literal("6"),
    z.literal("7"),
    z.literal("13"),
    z.literal("14"),
  ]),
  cancelDivision: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional(),
  subtotal: z.number(),
  subtotalDiscountPrice: z.union([z.number(), z.undefined()]).optional(),
  subtotalDiscountRate: z.union([z.number(), z.undefined()]).optional(),
  subtotalDiscountDivision: z.union([z.number(), z.undefined()]).optional(),
  pointDiscount: z.union([z.number(), z.undefined()]).optional(),
  total: z.number(),
  taxInclude: z.union([z.number(), z.undefined()]).optional(),
  taxExclude: z.union([z.number(), z.undefined()]).optional(),
  roundingDivision: z
    .union([
      z.literal("00"),
      z.literal("11"),
      z.literal("12"),
      z.literal("13"),
      z.literal("21"),
      z.literal("22"),
      z.literal("23"),
      z.literal("31"),
      z.literal("32"),
      z.literal("33"),
      z.literal("41"),
      z.literal("42"),
      z.literal("43"),
      z.literal("99"),
      z.undefined(),
    ])
    .optional(),
  roundingPrice: z.union([z.number(), z.undefined()]).optional(),
  deposit: z.union([z.number(), z.undefined()]).optional(),
  depositcash: z.union([z.number(), z.undefined()]).optional(),
  depositCredit: z.union([z.number(), z.undefined()]).optional(),
  change: z.union([z.number(), z.undefined()]).optional(),
  newPoint: z.union([z.number(), z.undefined()]).optional(),
  spendPoint: z.union([z.number(), z.undefined()]).optional(),
  point: z.union([z.number(), z.undefined()]).optional(),
  totalPoint: z.union([z.number(), z.undefined()]).optional(),
  currentMile: z.union([z.number(), z.undefined()]).optional(),
  earnMile: z.union([z.number(), z.undefined()]).optional(),
  totalMile: z.union([z.number(), z.undefined()]).optional(),
  adjustmentMile: z.union([z.number(), z.undefined()]).optional(),
  adjustmentMileDivision: z
    .union([z.literal("1"), z.literal("2"), z.literal("3"), z.literal("4"), z.undefined()])
    .optional(),
  adjustmentMileValue: z.union([z.number(), z.undefined()]).optional(),
  storeId: z.number(),
  terminalId: z.number(),
  customerId: z.union([z.number(), z.null(), z.undefined()]).optional(),
  customerCode: z.union([z.string(), z.undefined()]).optional(),
  terminalTranId: z.number(),
  terminalTranDateTime: z.string(),
  sumDivision: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.undefined()]).optional(),
  sumDate: z.union([z.string(), z.undefined()]).optional(),
  customerRank: z.union([z.string(), z.undefined()]).optional(),
  customerGroupId: z.union([z.number(), z.undefined()]).optional(),
  customerGroupId2: z.union([z.number(), z.undefined()]).optional(),
  customerGroupId3: z.union([z.number(), z.undefined()]).optional(),
  customerGroupId4: z.union([z.number(), z.undefined()]).optional(),
  customerGroupId5: z.union([z.number(), z.undefined()]).optional(),
  staffId: z.union([z.number(), z.undefined()]).optional(),
  memo: z.union([z.string(), z.undefined()]).optional(),
  receiptMemo: z.union([z.string(), z.undefined()]).optional(),
  carriage: z.union([z.number(), z.undefined()]).optional(),
  commission: z.union([z.number(), z.undefined()]).optional(),
  guestNumbers: z.union([z.number(), z.undefined()]).optional(),
  guestNumbersMale: z.union([z.number(), z.undefined()]).optional(),
  guestNumbersFemale: z.union([z.number(), z.undefined()]).optional(),
  guestNumbersUnknown: z.union([z.number(), z.undefined()]).optional(),
  enterDateTime: z.union([z.string(), z.undefined()]).optional(),
  taxFreeSalesDivision: z
    .union([
      z.literal("0"),
      z.literal("1"),
      z.literal("2"),
      z.literal("3"),
      z.literal("4"),
      z.literal("5"),
      z.undefined(),
    ])
    .optional(),
  netTaxFreeGeneralTaxInclude: z.union([z.number(), z.undefined()]).optional(),
  netTaxFreeGeneralTaxExclude: z.union([z.number(), z.undefined()]).optional(),
  netTaxFreeConsumableTaxInclude: z.union([z.number(), z.undefined()]).optional(),
  netTaxFreeConsumableTaxExclude: z.union([z.number(), z.undefined()]).optional(),
  tags: z.union([z.string(), z.undefined()]).optional(),
  pointGivingDivision: z
    .union([z.literal("1"), z.literal("2"), z.literal("3"), z.literal("4"), z.undefined()])
    .optional(),
  pointGivingUnitPrice: z.union([z.number(), z.undefined()]).optional(),
  pointGivingUnit: z.union([z.number(), z.undefined()]).optional(),
  pointSpendDivision: z.union([z.literal("1"), z.literal("2"), z.undefined()]).optional(),
  mileageDivision: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.undefined()]).optional(),
  mileageLabel: z.union([z.string(), z.undefined()]).optional(),
  customerPinCode: z.union([z.string(), z.undefined()]).optional(),
  sellDivision: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional(),
  taxRate: z.union([z.number(), z.undefined()]).optional(),
  taxRounding: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.undefined()]).optional(),
  discountRoundingDivision: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.undefined()]).optional(),
  transactionUuid: z.union([z.string(), z.undefined()]).optional(),
  exchangeTicketNo: z.union([z.string(), z.undefined()]).optional(),
  giftReceiptValidDays: z.union([z.number(), z.undefined()]).optional(),
  discountCalculateDivision: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional(),
  barcode: z.union([z.string(), z.undefined()]).optional(),
  layawayServerTransactionHeadId: z.union([z.number(), z.undefined()]).optional(),
  details: z
    .union([
      z.array(
        z.object({
          transactionDetailId: z.number(),
          parentTransactionDetailId: z.union([z.number(), z.undefined()]).optional(),
          transactionDetailDivision: z.union([z.literal("1"), z.literal("2"), z.literal("3")]),
          productId: z.union([z.number(), z.undefined()]).optional(),
          productCode: z.union([z.string(), z.null(), z.undefined()]).optional(),
          productName: z.union([z.string(), z.null(), z.undefined()]).optional(),
          printReceiptProductName: z.union([z.string(), z.null(), z.undefined()]).optional(),
          taxDivision: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.undefined()]).optional(),
          price: z.union([z.number(), z.undefined()]).optional(),
          salesPrice: z.number(),
          unitDiscountPrice: z.union([z.number(), z.undefined()]).optional(),
          unitDiscountRate: z.union([z.number(), z.undefined()]).optional(),
          unitDiscountDivision: z.union([z.number(), z.undefined()]).optional(),
          quantity: z.number(),
          categoryId: z.union([z.number(), z.undefined()]).optional(),
          categoryName: z.union([z.string(), z.undefined()]).optional(),
        }),
      ),
      z.undefined(),
    ])
    .optional(),
});

export type TransactionUpdate = z.infer<typeof TransactionUpdate>;
export const TransactionUpdate = z.object({
  customerGroupId: z.union([z.number(), z.null()]).optional(),
  customerGroupId2: z.union([z.number(), z.null()]).optional(),
  customerGroupId3: z.union([z.number(), z.null()]).optional(),
  customerGroupId4: z.union([z.number(), z.null()]).optional(),
  customerGroupId5: z.union([z.number(), z.null()]).optional(),
  staffId: z.union([z.number(), z.null()]).optional(),
  memo: z.union([z.string(), z.null()]).optional(),
  receiptMemo: z.union([z.string(), z.null()]).optional(),
  guestNumbers: z.union([z.number(), z.null()]).optional(),
  guestNumbersMale: z.union([z.number(), z.null()]).optional(),
  guestNumbersFemale: z.union([z.number(), z.null()]).optional(),
  guestNumbersUnknown: z.union([z.number(), z.null()]).optional(),
  tags: z.union([z.string(), z.null()]).optional(),
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
  firstName: z.string(),
  lastName: z.string(),
  firstKana: z.union([z.string(), z.undefined()]).optional(),
  lastKana: z.union([z.string(), z.undefined()]).optional(),
  postCode: z.union([z.string(), z.undefined()]).optional(),
  address: z.union([z.string(), z.undefined()]).optional(),
  phoneNumber: z.union([z.string(), z.undefined()]).optional(),
  faxNumber: z.union([z.string(), z.undefined()]).optional(),
  mobileNumber: z.union([z.string(), z.undefined()]).optional(),
  mailAddress: z.union([z.string(), z.undefined()]).optional(),
  mailAddress2: z.union([z.string(), z.undefined()]).optional(),
  mailAddress3: z.union([z.string(), z.undefined()]).optional(),
  companyName: z.union([z.string(), z.undefined()]).optional(),
  departmentName: z.union([z.string(), z.undefined()]).optional(),
  managerialPosition: z.union([z.boolean(), z.undefined()]).optional(),
  sex: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.undefined()]).optional(),
  birthDate: z.union([z.string(), z.undefined()]).optional(),
  pointExpireDate: z.union([z.string(), z.undefined()]).optional(),
  entryDate: z.union([z.string(), z.undefined()]).optional(),
  leaveDate: z.union([z.string(), z.undefined()]).optional(),
  pointGivingUnitPrice: z.union([z.number(), z.undefined()]).optional(),
  pointGivingUnit: z.union([z.number(), z.undefined()]).optional(),
  pinCode: z.union([z.string(), z.undefined()]).optional(),
  passportNo: z.union([z.string(), z.undefined()]).optional(),
  nationality: z.union([z.string(), z.undefined()]).optional(),
  alphabetName: z.union([z.string(), z.undefined()]).optional(),
  mailReceiveFlag: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional(),
  note: z.union([z.string(), z.undefined()]).optional(),
  note2: z.union([z.string(), z.undefined()]).optional(),
  favoriteList: z.union([z.string(), z.undefined()]).optional(),
  browsingList: z.union([z.string(), z.undefined()]).optional(),
  status: z
    .union([z.literal("0"), z.literal("1"), z.literal("2"), z.literal("3"), z.literal("4"), z.undefined()])
    .optional(),
  storeId: z.union([z.string(), z.undefined()]).optional(),
});

export type CustomerUpdate = z.infer<typeof CustomerUpdate>;
export const CustomerUpdate = z.object({
  customerCode: z.string().optional(),
  customerNo: z.string().optional(),
  rank: z.string().optional(),
  staffRank: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  firstKana: z.string().optional(),
  lastKana: z.string().optional(),
  postCode: z.string().optional(),
  address: z.string().optional(),
  phoneNumber: z.string().optional(),
  faxNumber: z.string().optional(),
  mobileNumber: z.string().optional(),
  mailAddress: z.string().optional(),
  mailAddress2: z.string().optional(),
  mailAddress3: z.string().optional(),
  companyName: z.string().optional(),
  departmentName: z.string().optional(),
  managerialPosition: z.boolean().optional(),
  sex: z.union([z.literal("0"), z.literal("1"), z.literal("2")]).optional(),
  birthDate: z.string().optional(),
  pointExpireDate: z.string().optional(),
  entryDate: z.string().optional(),
  leaveDate: z.string().optional(),
  pointGivingUnitPrice: z.number().optional(),
  pointGivingUnit: z.number().optional(),
  pinCode: z.string().optional(),
  passportNo: z.string().optional(),
  nationality: z.string().optional(),
  alphabetName: z.string().optional(),
  mailReceiveFlag: z.union([z.literal("0"), z.literal("1")]).optional(),
  note: z.string().optional(),
  note2: z.string().optional(),
  favoriteList: z.string().optional(),
  browsingList: z.string().optional(),
  status: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.literal("3"), z.literal("4")]).optional(),
  storeId: z.string().optional(),
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
  stockAmount: z.number(),
  layawayStockAmount: z.union([z.number(), z.undefined()]).optional(),
  originalQuantity: z.union([z.number(), z.undefined()]).optional(),
  upDateTime: z.union([z.string(), z.undefined()]).optional(),
});

export type StockUpdate = z.infer<typeof StockUpdate>;
export const StockUpdate = z.object({
  storeId: z.number(),
  productId: z.number(),
  stockAmount: z.number(),
  stockHistory: z
    .union([
      z.object({
        id: z.number().optional(),
        memo: z.string().optional(),
      }),
      z.undefined(),
    ])
    .optional(),
});

export type StockBulkUpdate = z.infer<typeof StockBulkUpdate>;
export const StockBulkUpdate = z.object({
  stocks: z.array(StockUpdate),
  callbackUrl: z.union([z.string(), z.undefined()]).optional(),
});

export type StockRelativeUpdate = z.infer<typeof StockRelativeUpdate>;
export const StockRelativeUpdate = z.object({
  storeId: z.number(),
  stockAmount: z.number(),
  stockHistory: z
    .union([
      z.object({
        memo: z.string().optional(),
      }),
      z.undefined(),
    ])
    .optional(),
});

export type StockBulkRelativeUpdate = z.infer<typeof StockBulkRelativeUpdate>;
export const StockBulkRelativeUpdate = z.object({
  stocks: z.array(StockRelativeUpdate),
  callbackUrl: z.string(),
});

export type StockChange = z.infer<typeof StockChange>;
export const StockChange = z.object({
  id: z.number().optional(),
  updDateTime: z.string().optional(),
  targetDateTime: z.string().optional(),
  productId: z.number().optional(),
  storeId: z.number().optional(),
  amount: z.number().optional(),
  stockAmount: z.number().optional(),
  layawayStockAmount: z.number().optional(),
  stockDivision: z
    .union([
      z.literal("01"),
      z.literal("02"),
      z.literal("03"),
      z.literal("04"),
      z.literal("05"),
      z.literal("06"),
      z.literal("07"),
      z.literal("08"),
      z.literal("09"),
      z.literal("10"),
      z.literal("12"),
      z.literal("13"),
      z.literal("14"),
      z.literal("15"),
      z.literal("16"),
      z.literal("17"),
      z.literal("18"),
    ])
    .optional(),
  fromStoreId: z.number().optional(),
  toStoreId: z.number().optional(),
  taxDivision: z.union([z.literal("0"), z.literal("1"), z.literal("2")]).optional(),
  price: z.number().optional(),
  cost: z.number().optional(),
  memo: z.string().optional(),
  staffId: z.number().optional(),
  staffName: z.string().optional(),
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
      product_id: z.number().optional(),
      product_code: z.string().optional(),
      group_code: z.string().optional(),
      category_id: z.number().optional(),
      display_flag: z.union([z.literal("0"), z.literal("1")]).optional(),
      division: z.union([z.literal("0"), z.literal("1"), z.literal("2")]).optional(),
      sales_division: z.union([z.literal("0"), z.literal("1")]).optional(),
      stock_control_division: z.union([z.literal("0"), z.literal("1")]).optional(),
      supplier_product_no: z.string().optional(),
      "upd_date_time-from": z.string().optional(),
      "upd_date_time-to": z.string().optional(),
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

export type get_GetProductPrices = typeof get_GetProductPrices;
export const get_GetProductPrices = {
  method: z.literal("GET"),
  path: z.literal("/products/{id}/prices"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      store_id: z.number().optional(),
      price_division: z.number().optional(),
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

export type get_GetProductPriceChanges = typeof get_GetProductPriceChanges;
export const get_GetProductPriceChanges = {
  method: z.literal("GET"),
  path: z.literal("/products/{id}/prices/changes"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      price_division: z.never().optional(),
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

export type get_GetProductReserveItems = typeof get_GetProductReserveItems;
export const get_GetProductReserveItems = {
  method: z.literal("GET"),
  path: z.literal("/products/{id}/reserve_items"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      limit: z.number().optional(),
      page: z.number().optional(),
      sort: z.literal("no").optional(),
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

export type get_GetProductAttributes = typeof get_GetProductAttributes;
export const get_GetProductAttributes = {
  method: z.literal("GET"),
  path: z.literal("/products/attributes"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      limit: z.number().optional(),
      page: z.number().optional(),
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
      no: z.number().optional(),
      code: z.string().optional(),
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

export type patch_UpdateProductAttributeItem = typeof patch_UpdateProductAttributeItem;
export const patch_UpdateProductAttributeItem = {
  method: z.literal("PATCH"),
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

export type get_GetProductStores = typeof get_GetProductStores;
export const get_GetProductStores = {
  method: z.literal("GET"),
  path: z.literal("/products/{id}/stores"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      store_id: z.number().optional(),
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

export type get_GetProductReserveItemLabels = typeof get_GetProductReserveItemLabels;
export const get_GetProductReserveItemLabels = {
  method: z.literal("GET"),
  path: z.literal("/products/reserve_item_labels"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      limit: z.number().optional(),
      page: z.number().optional(),
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

export type get_GetProductImages = typeof get_GetProductImages;
export const get_GetProductImages = {
  method: z.literal("GET"),
  path: z.literal("/products/images"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      limit: z.number().optional(),
      page: z.number().optional(),
      product_id: z.number().optional(),
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

export type get_Transactions = typeof get_Transactions;
export const get_Transactions = {
  method: z.literal("GET"),
  path: z.literal("/transactions"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      limit: z.number().optional(),
      page: z.number().optional(),
      "transaction_head_id-from": z.string().optional(),
      "transaction_head_id-to": z.string().optional(),
      "transaction_date_time-from": z.string().optional(),
      "transaction_date_time-to": z.string().optional(),
      transaction_head_division: z
        .union([
          z.literal("1"),
          z.literal("2"),
          z.literal("3"),
          z.literal("4"),
          z.literal("5"),
          z.literal("6"),
          z.literal("7"),
          z.literal("8"),
          z.literal("9"),
          z.literal("11"),
          z.literal("13"),
          z.literal("14"),
          z.literal("15"),
          z.literal("16"),
        ])
        .optional(),
      store_id: z.number().optional(),
      "terminal_tran_date_time-from": z.string().optional(),
      "terminal_tran_date_time-to": z.string().optional(),
      adjustment_date_time: z.string().optional(),
      sum_date: z.string().optional(),
      "sum_date-from": z.string().optional(),
      "sum_date-to": z.string().optional(),
      customer_code: z.string().optional(),
      transaction_uuid: z.string().optional(),
      barcode: z.string().optional(),
      "upd_date_time-from": z.string().optional(),
      "upd_date_time-to": z.string().optional(),
      with_details: z.union([z.literal("none"), z.literal("all"), z.literal("summary")]).optional(),
      with_deposit_others: z.union([z.literal("none"), z.literal("all")]).optional(),
      with_layaways: z.union([z.literal("none"), z.literal("all")]).optional(),
      with_layaway_pick_ups: z.union([z.literal("none"), z.literal("all")]).optional(),
      with_money_control: z.union([z.literal("none"), z.literal("all")]).optional(),
      with_detail_product_attributes: z.union([z.literal("none"), z.literal("all")]).optional(),
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
    query: z.object({
      with_details: z.union([z.literal("none"), z.literal("all"), z.literal("summary")]).optional(),
      with_deposit_others: z.union([z.literal("none"), z.literal("all")]).optional(),
      with_coupons: z.union([z.literal("none"), z.literal("all")]).optional(),
      with_coupon_items: z.union([z.literal("none"), z.literal("all")]).optional(),
      with_discounts: z.union([z.literal("none"), z.literal("all")]).optional(),
      with_store: z.union([z.literal("none"), z.literal("all")]).optional(),
      with_customer: z.union([z.literal("none"), z.literal("all")]).optional(),
      with_customer_groups: z.union([z.literal("none"), z.literal("all")]).optional(),
      with_staff: z.union([z.literal("none"), z.literal("all")]).optional(),
      with_recorded_staff: z.union([z.literal("none"), z.literal("all")]).optional(),
      with_layaways: z.union([z.literal("none"), z.literal("all")]).optional(),
      with_layaway_pick_ups: z.union([z.literal("none"), z.literal("all")]).optional(),
      with_money_control: z.union([z.literal("none"), z.literal("all")]).optional(),
      with_detail_product_attributes: z.union([z.literal("none"), z.literal("all")]).optional(),
    }),
    path: z.object({
      id: z.number(),
    }),
  }),
  response: Transaction,
};

export type patch_TransactionsId = typeof patch_TransactionsId;
export const patch_TransactionsId = {
  method: z.literal("PATCH"),
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
    query: z.object({
      limit: z.number().optional(),
      page: z.number().optional(),
      with_discounts: z.union([z.literal("none"), z.literal("all")]).optional(),
      with_detail_product_attributes: z.union([z.literal("none"), z.literal("all")]).optional(),
    }),
    path: z.object({
      id: z.number(),
    }),
  }),
  response: z.object({
    details: z.array(TransactionDetail).optional(),
  }),
};

export type post_TransactionsIdcancel = typeof post_TransactionsIdcancel;
export const post_TransactionsIdcancel = {
  method: z.literal("POST"),
  path: z.literal("/transactions/{id}/cancel"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.number(),
    }),
    body: z.object({
      cancelDateTime: z.union([z.string(), z.null()]).optional(),
      depositOthers: z
        .array(
          z.object({
            no: z.union([z.literal("1"), z.literal("2"), z.literal("3")]).optional(),
            cancelSlipNumber: z.string().optional(),
          }),
        )
        .optional(),
    }),
  }),
  response: z.object({
    message: z.string().optional(),
  }),
};

export type post_TransactionsIddispose = typeof post_TransactionsIddispose;
export const post_TransactionsIddispose = {
  method: z.literal("POST"),
  path: z.literal("/transactions/{id}/dispose"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.number(),
    }),
    body: z.object({
      terminalTranDateTime: z.union([z.string(), z.null()]).optional(),
      depositOthers: z
        .array(
          z.object({
            no: z.union([z.literal("1"), z.literal("2"), z.literal("3")]).optional(),
            cancelSlipNumber: z.string().optional(),
          }),
        )
        .optional(),
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
      customer_code: z.string().optional(),
      "customer_id-from": z.string().optional(),
      "customer_id-to": z.string().optional(),
      customer_no: z.string().optional(),
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

export type get_Customer_required_column_setting = typeof get_Customer_required_column_setting;
export const get_Customer_required_column_setting = {
  method: z.literal("GET"),
  path: z.literal("/customer_required_column_setting"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      fields: z.array(z.string()).optional(),
      sort: z.string().optional(),
      limit: z.number().optional(),
      page: z.number().optional(),
      column_name: z.string().optional(),
      value: z.union([z.literal("0"), z.literal("1")]).optional(),
    }),
  }),
  response: CustomerRequired,
};

export type get_GetStocks = typeof get_GetStocks;
export const get_GetStocks = {
  method: z.literal("GET"),
  path: z.literal("/stock"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      limit: z.number().optional(),
      page: z.number().optional(),
      store_id: z.number().optional(),
      product_id: z.number().optional(),
      "upd_date_time-from": z.string().optional(),
      "upd_date_time-to": z.string().optional(),
    }),
  }),
  response: z.object({
    stocks: z.array(Stock).optional(),
    pagination: Pagination.optional(),
  }),
};

export type patch_PatchProductStock = typeof patch_PatchProductStock;
export const patch_PatchProductStock = {
  method: z.literal("PATCH"),
  path: z.literal("/stock/{product_id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      product_id: z.number().optional(),
    }),
    body: StockUpdate,
  }),
  response: StockUpdate,
};

export type post_UpdateStockRelative = typeof post_UpdateStockRelative;
export const post_UpdateStockRelative = {
  method: z.literal("POST"),
  path: z.literal("/stock/{product_id}/add"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      product_id: z.number(),
    }),
    body: StockRelativeUpdate,
  }),
  response: StockUpdate,
};

export type get_GetStockChanges = typeof get_GetStockChanges;
export const get_GetStockChanges = {
  method: z.literal("GET"),
  path: z.literal("/stock/changes/{product_id}/{store_id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      limit: z.number().optional(),
      page: z.number().optional(),
      id: z.number().optional(),
      target_date: z.string().optional(),
      stock_amount: z.number().optional(),
      stock_division: z
        .union([
          z.literal("01"),
          z.literal("02"),
          z.literal("03"),
          z.literal("04"),
          z.literal("05"),
          z.literal("06"),
          z.literal("07"),
          z.literal("08"),
          z.literal("09"),
          z.literal("10"),
          z.literal("12"),
          z.literal("13"),
          z.literal("14"),
          z.literal("15"),
          z.literal("16"),
          z.literal("17"),
          z.literal("18"),
        ])
        .optional(),
      from_store_id: z.number().optional(),
      to_store_id: z.number().optional(),
    }),
    path: z.object({
      product_id: z.number(),
      store_id: z.number(),
    }),
  }),
  response: z.array(StockChange),
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
    "/transactions": get_Transactions,
    "/transactions/{id}": get_TransactionsId,
    "/transactions/{id}/details": get_TransactionsIddetails,
    "/customers": get_Customers,
    "/customers/{id}": get_CustomersId,
    "/customer_required_column_setting": get_Customer_required_column_setting,
    "/stock": get_GetStocks,
    "/stock/changes/{product_id}/{store_id}": get_GetStockChanges,
  },
  post: {
    "/categories": post_Categories,
    "/category_groups": post_Category_groups,
    "/products": post_CreateProduct,
    "/products/{id}/prices": post_CreateProductPrice,
    "/products/attributes": post_CreateProductAttribute,
    "/products/attribute_items": post_CreateProductAttributeItem,
    "/products/{id}/stores": post_CreateProductStore,
    "/products/{id}/inventory_reservations": post_CreateProductInventoryReservation,
    "/products/reserve_item_labels": post_CreateProductReserveItemLabel,
    "/products/images": post_UploadProductImage,
    "/transactions": post_Transactions,
    "/transactions/{id}/cancel": post_TransactionsIdcancel,
    "/transactions/{id}/dispose": post_TransactionsIddispose,
    "/customers": post_Customers,
    "/stock/{product_id}/add": post_UpdateStockRelative,
  },
  patch: {
    "/categories/{id}": patch_CategoriesId,
    "/category_groups/{id}": patch_Category_groupsId,
    "/products/attribute_items/{code}": patch_UpdateProductAttributeItem,
    "/transactions/{id}": patch_TransactionsId,
    "/stock/{product_id}": patch_PatchProductStock,
  },
  delete: {
    "/categories/{id}": delete_CategoriesId,
    "/category_groups/{id}": delete_Category_groupsId,
    "/products/{id}": delete_DeleteProduct,
    "/products/{product_id}/prices/{price_division}/{store_id}/{start_date}": delete_DeleteProductPrice,
    "/products/attributes/{no}": delete_DeleteProductAttribute,
    "/products/attribute_items/{code}": delete_DeleteProductAttributeItem,
    "/products/{id}/inventory_reservations/{reservation_product_id}": delete_DeleteProductInventoryReservation,
    "/products/{product_id}/reserve_items/{no}": delete_DeleteProductReserveItem,
    "/products/reserve_item_labels/{no}": delete_DeleteProductReserveItemLabel,
    "/products/{id}/image": delete_DeleteProductImage,
    "/products/{id}/icon_image": delete_DeleteProductIconImage,
    "/transactions/{id}": delete_TransactionsId,
    "/customers/{id}": delete_CustomersId,
  },
  put: {
    "/products/{id}": put_UpdateProduct,
    "/products/attributes/{no}": put_UpdateProductAttribute,
    "/products/{id}/stores": put_UpdateProductStores,
    "/products/{id}/inventory_reservations": put_UpdateProductInventoryReservations,
    "/products/reserve_item_labels/{no}": put_UpdateProductReserveItemLabel,
    "/products/{id}/image": put_UpdateProductImage,
    "/products/{id}/icon_image": put_UpdateProductIconImage,
    "/customers/{id}": put_CustomersId,
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
