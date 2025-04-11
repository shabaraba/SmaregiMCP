import { z } from "zod";

export type Error = z.infer<typeof Error>;
export const Error = z.object({
  type: z.string().describe("エラータイプ"),
  title: z.string().describe("エラータイトル"),
  detail: z.string().describe("エラーの詳細メッセージ"),
  status: z.number().describe("HTTPステータスコード"),
}).describe("エラー情報");

export type Pagination = z.infer<typeof Pagination>;
export const Pagination = z.object({
  limit: z.number().optional().describe("1ページあたりの最大件数 (1-1000)"),
  page: z.number().optional().describe("ページ番号 (1始まり)"),
  sort: z.string().optional().describe("並び順の指定 (カンマ区切りで複数指定可能。降順は「:desc」を付加)"),
}).describe("ページネーション情報");

export type Category = z.infer<typeof Category>;
export const Category = z.object({
  categoryId: z.string().describe("部門ID"),
  categoryCode: z.union([z.string(), z.undefined()]).optional().describe("部門コード (20文字以内)"),
  categoryName: z.string().describe("部門名 (85文字以内)"),
  categoryAbbr: z.union([z.string(), z.undefined()]).optional().describe("部門名略称 (85文字以内)"),
  displaySequence: z.union([z.string(), z.undefined()]).optional().describe("表示順序 (0-999999999)"),
  displayFlag: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional().describe("端末表示フラグ (0:表示しない、1:表示する)"),
  taxDivision: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.undefined()]).optional().describe("税区分 (0:税込、1:税抜、2:非課税)"),
  pointNotApplicable: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional().describe("ポイント対象区分 (0:ポイント対象、1:ポイント対象外)"),
  taxFreeDivision: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.undefined()]).optional().describe("免税区分 (0:対象外、1:一般品、2:消耗品)"),
  reduceTaxId: z.union([z.string(), z.undefined()]).optional().describe(`軽減税率ID
標準:null（または未設定）
軽減:10000001（特定商品の軽減税率適用）
選択[標準]:10000002（状態による適用[適用しない]）
選択[軽減]:10000003（状態による適用[適用する]）
選択[選択]:10000004（状態による適用[都度選択する]）
`),
  color: z.union([z.string(), z.undefined()]).optional().describe("端末表示カラー (#000000形式)"),
  categoryGroupId: z.union([z.string(), z.undefined()]).optional().describe("部門グループID"),
  parentCategoryId: z.union([z.string(), z.undefined()]).optional().describe("親部門ID"),
  level: z.union([z.literal("1"), z.literal("2"), z.literal("3"), z.undefined()]).optional().describe("階層レベル (1-3)"),
  tag: z.union([z.string(), z.undefined()]).optional().describe("タグ (85文字以内)"),
  insDateTime: z.union([z.string(), z.undefined()]).optional().describe("登録日時"),
  updDateTime: z.union([z.string(), z.undefined()]).optional().describe("更新日時"),
}).describe("部門情報");

export type CategoryGroup = z.infer<typeof CategoryGroup>;
export const CategoryGroup = z.object({
  categoryGroupId: z.string().describe("部門グループID"),
  categoryGroupCode: z.union([z.string(), z.undefined()]).optional().describe("部門グループコード (10文字以内)"),
  categoryGroupName: z.string().describe("部門グループ名 (85文字以内)"),
  displaySequence: z.union([z.string(), z.undefined()]).optional().describe("表示順序 (0-999999999)"),
  insDateTime: z.union([z.string(), z.undefined()]).optional().describe("登録日時"),
  updDateTime: z.union([z.string(), z.undefined()]).optional().describe("更新日時"),
}).describe("部門グループ情報");

export type CategoryCreate = z.infer<typeof CategoryCreate>;
export const CategoryCreate = z.object({
  categoryCode: z.union([z.string(), z.undefined()]).optional().describe("部門コード (20文字以内)"),
  categoryName: z.string().describe("部門名 (85文字以内)"),
  categoryAbbr: z.union([z.string(), z.undefined()]).optional().describe("部門名略称 (85文字以内)"),
  displaySequence: z.union([z.string(), z.undefined()]).optional().describe("表示順序 (0-999999999)"),
  displayFlag: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional().describe("端末表示フラグ (0:表示しない、1:表示する)"),
  taxDivision: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.undefined()]).optional().describe("税区分 (0:税込、1:税抜、2:非課税)"),
  pointNotApplicable: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional().describe("ポイント対象区分 (0:ポイント対象、1:ポイント対象外)"),
  taxFreeDivision: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.undefined()]).optional().describe("免税区分 (0:対象外、1:一般品、2:消耗品)"),
  reduceTaxId: z.union([z.string(), z.undefined()]).optional().describe(`軽減税率ID
標準:null（または未設定）
軽減:10000001（特定商品の軽減税率適用）
選択[標準]:10000002（状態による適用[適用しない]）
選択[軽減]:10000003（状態による適用[適用する]）
選択[選択]:10000004（状態による適用[都度選択する]）
`),
  color: z.union([z.string(), z.undefined()]).optional().describe("端末表示カラー (#000000形式)"),
  categoryGroupId: z.union([z.string(), z.undefined()]).optional().describe("部門グループID"),
  parentCategoryId: z.union([z.string(), z.undefined()]).optional().describe("親部門ID"),
  tag: z.union([z.string(), z.undefined()]).optional().describe("タグ (85文字以内)"),
}).describe("部門情報の登録用データ");

export type CategoryUpdate = z.infer<typeof CategoryUpdate>;
export const CategoryUpdate = z.object({
  categoryCode: z.string().optional().describe("部門コード (20文字以内)"),
  categoryName: z.string().optional().describe("部門名 (85文字以内)"),
  categoryAbbr: z.string().optional().describe("部門名略称 (85文字以内)"),
  displaySequence: z.string().optional().describe("表示順序 (0-999999999)"),
  displayFlag: z.union([z.literal("0"), z.literal("1")]).optional().describe("端末表示フラグ (0:表示しない、1:表示する)"),
  taxDivision: z.union([z.literal("0"), z.literal("1"), z.literal("2")]).optional().describe("税区分 (0:税込、1:税抜、2:非課税)"),
  pointNotApplicable: z.union([z.literal("0"), z.literal("1")]).optional().describe("ポイント対象区分 (0:ポイント対象、1:ポイント対象外)"),
  taxFreeDivision: z.union([z.literal("0"), z.literal("1"), z.literal("2")]).optional().describe("免税区分 (0:対象外、1:一般品、2:消耗品)"),
  reduceTaxId: z.string().optional().describe(`軽減税率ID
標準:null
軽減:10000001（特定商品の軽減税率適用）
選択[標準]:10000002（状態による適用[適用しない]）
選択[軽減]:10000003（状態による適用[適用する]）
選択[選択]:10000004（状態による適用[都度選択する]）
`),
  color: z.string().optional().describe("端末表示カラー (#000000形式)"),
  categoryGroupId: z.string().optional().describe("部門グループID"),
  parentCategoryId: z.string().optional().describe("親部門ID"),
  tag: z.string().optional().describe("タグ (85文字以内)"),
}).describe("部門情報の更新用データ");

export type CategoryGroupCreate = z.infer<typeof CategoryGroupCreate>;
export const CategoryGroupCreate = z.object({
  categoryGroupCode: z.union([z.string(), z.undefined()]).optional().describe("部門グループコード (10文字以内)"),
  categoryGroupName: z.string().describe("部門グループ名 (85文字以内)"),
  displaySequence: z.union([z.string(), z.undefined()]).optional().describe("表示順序 (0-999999999)"),
}).describe("部門グループ情報の登録用データ");

export type CategoryGroupUpdate = z.infer<typeof CategoryGroupUpdate>;
export const CategoryGroupUpdate = z.object({
  categoryGroupCode: z.string().optional().describe("部門グループコード (10文字以内)"),
  categoryGroupName: z.string().optional().describe("部門グループ名 (85文字以内)"),
  displaySequence: z.string().optional().describe("表示順序 (0-999999999)"),
}).describe("部門グループ情報の更新用データ");

export type Product = z.infer<typeof Product>;
export const Product = z.object({
  productId: z.string().describe("商品ID"),
  categoryId: z.string().describe("部門ID"),
  productCode: z.union([z.string(), z.undefined()]).optional().describe("商品コード (20文字以内)"),
  productName: z.string().describe("商品名 (85文字以内)"),
  productKana: z.union([z.string(), z.undefined()]).optional().describe("商品カナ (85文字以内)"),
  taxDivision: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.undefined()]).optional().describe("税区分 (0:税込、1:税抜、2:非課税)"),
  productPriceDivision: z.union([z.literal("1"), z.literal("2"), z.undefined()]).optional().describe("商品価格区分 (1:通常価格、2:オープン価格)"),
  price: z.string().describe("商品単価"),
  customerPrice: z.union([z.string(), z.undefined()]).optional().describe("会員価格"),
  cost: z.union([z.string(), z.undefined()]).optional().describe("原価"),
  attribute: z.union([z.string(), z.undefined()]).optional().describe("規格 (1000文字以内)"),
  description: z.union([z.string(), z.undefined()]).optional().describe("説明 (1000文字以内)"),
  catchCopy: z.union([z.string(), z.undefined()]).optional().describe("キャッチコピー (1000文字以内)"),
  size: z.union([z.string(), z.undefined()]).optional().describe("サイズ (85文字以内)"),
  color: z.union([z.string(), z.undefined()]).optional().describe("カラー (85文字以内)"),
  tag: z.union([z.string(), z.undefined()]).optional().describe("タグ (85文字以内)"),
  groupCode: z.union([z.string(), z.undefined()]).optional().describe("グループコード (85文字以内)"),
  url: z.union([z.string(), z.undefined()]).optional().describe("URL (255文字以内)"),
  printReceiptProductName: z.union([z.string(), z.undefined()]).optional().describe("レシート印字商品名 (64文字以内)"),
  displaySequence: z.union([z.string(), z.undefined()]).optional().describe("表示順序"),
  salesDivision: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional().describe("売上区分 (0:売上対象、1:売上対象外)"),
  stockControlDivision: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional().describe("在庫管理区分 (0:在庫管理対象、1:在庫管理対象外)"),
  displayFlag: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional().describe("端末表示フラグ (0:表示しない、1:表示する)"),
  division: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.undefined()]).optional().describe("商品区分 (0:通常商品、1:回数券、2:オプション商品)"),
  productOptionGroupId: z.union([z.string(), z.undefined()]).optional().describe("商品オプショングループID"),
  pointNotApplicable: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional().describe("ポイント対象区分 (0:ポイント対象、1:ポイント対象外)"),
  taxFreeDivision: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.undefined()]).optional().describe("免税区分 (0:対象外、1:一般品、2:消耗品)"),
  supplierProductNo: z.union([z.string(), z.undefined()]).optional().describe("品番"),
  calcDiscount: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional().describe("値引割引計算対象 (0:対象外、1:対象)"),
  staffDiscountRate: z.union([z.string(), z.undefined()]).optional().describe("社員販売割引率"),
  useCategoryReduceTax: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional().describe("部門税設定参照フラグ (0:reduceTaxIdを使用、1:部門の税設定を使用)"),
  reduceTaxId: z.union([z.string(), z.undefined()]).optional().describe(`軽減税率ID
標準:null（または未設定）
軽減:10000001（特定商品の軽減税率適用）
選択[標準]:10000002（状態による適用[適用しない]）
選択[軽減]:10000003（状態による適用[適用する]）
選択[選択]:10000004（状態による適用[都度選択する]）
`),
  reduceTaxPrice: z.union([z.string(), z.undefined()]).optional().describe("軽減税率用商品単価"),
  reduceTaxCustomerPrice: z.union([z.string(), z.undefined()]).optional().describe("軽減税率用商品会員単価"),
  orderPoint: z.union([z.string(), z.undefined()]).optional().describe("発注点"),
  purchaseCost: z.union([z.string(), z.undefined()]).optional().describe("仕入原価"),
  appStartDateTime: z.union([z.string(), z.undefined()]).optional().describe("適用開始日時"),
  insDateTime: z.union([z.string(), z.undefined()]).optional().describe("登録日時"),
  updDateTime: z.union([z.string(), z.undefined()]).optional().describe("更新日時"),
}).describe("商品情報");

export type ProductCreate = z.infer<typeof ProductCreate>;
export const ProductCreate = z.object({
  categoryId: z.string().describe("部門ID"),
  productCode: z.union([z.string(), z.undefined()]).optional().describe("商品コード (20文字以内)"),
  productName: z.string().describe("商品名 (85文字以内)"),
  productKana: z.union([z.string(), z.undefined()]).optional().describe("商品カナ (85文字以内)"),
  taxDivision: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.undefined()]).optional().describe("税区分 (0:税込、1:税抜、2:非課税)"),
  productPriceDivision: z.union([z.literal("1"), z.literal("2"), z.undefined()]).optional().describe("商品価格区分 (1:通常価格、2:オープン価格)"),
  price: z.string().describe("商品単価"),
  customerPrice: z.union([z.string(), z.undefined()]).optional().describe("会員価格"),
  cost: z.union([z.string(), z.undefined()]).optional().describe("原価"),
  attribute: z.union([z.string(), z.undefined()]).optional().describe("規格 (1000文字以内)"),
  description: z.union([z.string(), z.undefined()]).optional().describe("説明 (1000文字以内)"),
  catchCopy: z.union([z.string(), z.undefined()]).optional().describe("キャッチコピー (1000文字以内)"),
  size: z.union([z.string(), z.undefined()]).optional().describe("サイズ (85文字以内)"),
  color: z.union([z.string(), z.undefined()]).optional().describe("カラー (85文字以内)"),
  tag: z.union([z.string(), z.undefined()]).optional().describe("タグ (85文字以内)"),
  groupCode: z.union([z.string(), z.undefined()]).optional().describe("グループコード (85文字以内)"),
  url: z.union([z.string(), z.undefined()]).optional().describe("URL (255文字以内)"),
  printReceiptProductName: z.union([z.string(), z.undefined()]).optional().describe("レシート印字商品名 (64文字以内)"),
  displaySequence: z.union([z.string(), z.undefined()]).optional().describe("表示順序"),
  displayFlag: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional().describe("端末表示フラグ (0:表示しない、1:表示する)"),
  division: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.undefined()]).optional().describe("商品区分 (0:通常商品、1:回数券、2:オプション商品)"),
  productOptionGroupId: z.union([z.string(), z.undefined()]).optional().describe("商品オプショングループID"),
  salesDivision: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional().describe("売上区分 (0:売上対象、1:売上対象外)"),
  stockControlDivision: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional().describe("在庫管理区分 (0:在庫管理対象、1:在庫管理対象外)"),
  pointNotApplicable: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional().describe("ポイント対象区分 (0:ポイント対象、1:ポイント対象外)"),
  taxFreeDivision: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.undefined()]).optional().describe("免税区分 (0:対象外、1:一般品、2:消耗品)"),
  calcDiscount: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional().describe("値引割引計算対象 (0:対象外、1:対象)"),
  staffDiscountRate: z.union([z.string(), z.undefined()]).optional().describe("社員販売割引率"),
  useCategoryReduceTax: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional().describe("部門税設定参照フラグ (0:reduceTaxIdを使用、1:部門の税設定を使用)"),
  reduceTaxId: z.union([z.string(), z.undefined()]).optional().describe(`軽減税率ID
標準:null（または未設定）
軽減:10000001（特定商品の軽減税率適用）
選択[標準]:10000002（状態による適用[適用しない]）
選択[軽減]:10000003（状態による適用[適用する]）
選択[選択]:10000004（状態による適用[都度選択する]）
`),
  reduceTaxPrice: z.union([z.string(), z.undefined()]).optional().describe("軽減税率用商品単価"),
  reduceTaxCustomerPrice: z.union([z.string(), z.undefined()]).optional().describe("軽減税率用商品会員単価"),
  orderPoint: z.union([z.string(), z.undefined()]).optional().describe("発注点"),
  purchaseCost: z.union([z.string(), z.undefined()]).optional().describe("仕入原価"),
  supplierProductNo: z.union([z.string(), z.undefined()]).optional().describe("品番"),
  appStartDateTime: z.union([z.string(), z.undefined()]).optional().describe("適用開始日時"),
  reserveItems: z
    .union([
      z.array(
        z.object({
          no: z.string().optional().describe("予約項目ラベル番号"),
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
          storeId: z.string().optional().describe("店舗ID"),
          priceDivision: z.union([z.literal("1"), z.literal("2")]).optional().describe("価格区分"),
          startDate: z.string().optional().describe("適用開始日"),
          endDate: z.string().optional(),
          price: z.string().optional().describe("商品単価"),
        }),
      ),
      z.undefined(),
    ])
    .optional(),
  stores: z
    .union([
      z.array(
        z.object({
          storeId: z.string().optional().describe("店舗ID"),
          productOptionGroupId: z.string().optional().describe("商品オプショングループID"),
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
          reservationProductId: z.string().optional().describe("引当商品ID"),
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
          code: z.string().optional().describe("顧客タイプコード"),
          no: z.string().optional().describe("予約項目ラベル番号"),
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
            division: z.union([z.literal("0"), z.literal("1")]).optional().describe("商品区分 (0:通常商品、1:回数券、2:オプション商品)"),
            num: z.string().optional(),
            name: z.string().optional().describe("セクション名"),
          })
          .optional(),
        orderLimitAmount: z.string().optional(),
        orderSupplierEditable: z.union([z.literal("0"), z.literal("1")]).optional(),
        pbDivision: z.union([z.literal("0"), z.literal("1")]).optional(),
        displayFlag: z.union([z.literal("0"), z.literal("1")]).optional().describe("端末表示フラグ (0:表示しない、1:表示する)"),
        stores: z
          .array(
            z.object({
              storeId: z.string().optional().describe("店舗ID"),
              orderLimitAmount: z.string().optional(),
              displayFlag: z.union([z.literal("-1"), z.literal("0"), z.literal("1")]).optional().describe("端末表示フラグ (0:表示しない、1:表示する)"),
            }),
          )
          .optional(),
      }),
      z.undefined(),
    ])
    .optional(),
}).describe("商品情報の登録用データ");

export type ProductUpdate = z.infer<typeof ProductUpdate>;
export const ProductUpdate = z.object({
  categoryId: z.string().optional().describe("部門ID"),
  productCode: z.string().optional().describe("商品コード (20文字以内)"),
  productName: z.string().optional().describe("商品名 (85文字以内)"),
  productKana: z.string().optional().describe("商品カナ (85文字以内)"),
  taxDivision: z.union([z.literal("0"), z.literal("1"), z.literal("2")]).optional().describe("税区分 (0:税込、1:税抜、2:非課税)"),
  productPriceDivision: z.union([z.literal("1"), z.literal("2")]).optional().describe("商品価格区分 (1:通常価格、2:オープン価格)"),
  price: z.string().optional().describe("商品単価"),
  customerPrice: z.string().optional().describe("会員価格"),
  cost: z.string().optional().describe("原価"),
  attribute: z.string().optional().describe("規格 (1000文字以内)"),
  description: z.string().optional().describe("説明 (1000文字以内)"),
  catchCopy: z.string().optional().describe("キャッチコピー (1000文字以内)"),
  size: z.string().optional().describe("サイズ (85文字以内)"),
  color: z.string().optional().describe("カラー (85文字以内)"),
  tag: z.string().optional().describe("タグ (85文字以内)"),
  groupCode: z.string().optional().describe("グループコード (85文字以内)"),
  url: z.string().optional().describe("URL (255文字以内)"),
  printReceiptProductName: z.string().optional().describe("レシート印字商品名 (64文字以内)"),
  displaySequence: z.string().optional().describe("表示順序"),
  displayFlag: z.union([z.literal("0"), z.literal("1")]).optional().describe("端末表示フラグ (0:表示しない、1:表示する)"),
  division: z.union([z.literal("0"), z.literal("1"), z.literal("2")]).optional().describe("商品区分 (0:通常商品、1:回数券、2:オプション商品)"),
  productOptionGroupId: z.string().optional().describe("商品オプショングループID"),
  salesDivision: z.union([z.literal("0"), z.literal("1")]).optional().describe("売上区分 (0:売上対象、1:売上対象外)"),
  stockControlDivision: z.union([z.literal("0"), z.literal("1")]).optional().describe("在庫管理区分 (0:在庫管理対象、1:在庫管理対象外)"),
  pointNotApplicable: z.union([z.literal("0"), z.literal("1")]).optional().describe("ポイント対象区分 (0:ポイント対象、1:ポイント対象外)"),
  taxFreeDivision: z.union([z.literal("0"), z.literal("1"), z.literal("2")]).optional().describe("免税区分 (0:対象外、1:一般品、2:消耗品)"),
  calcDiscount: z.union([z.literal("0"), z.literal("1")]).optional().describe("値引割引計算対象 (0:対象外、1:対象)"),
  staffDiscountRate: z.string().optional().describe("社員販売割引率"),
  useCategoryReduceTax: z.union([z.literal("0"), z.literal("1")]).optional().describe("部門税設定参照フラグ (0:reduceTaxIdを使用、1:部門の税設定を使用)"),
  reduceTaxId: z.string().optional().describe(`軽減税率ID
標準:null
軽減:10000001（特定商品の軽減税率適用）
選択[標準]:10000002（状態による適用[適用しない]）
選択[軽減]:10000003（状態による適用[適用する]）
選択[選択]:10000004（状態による適用[都度選択する]）
`),
  reduceTaxPrice: z.string().optional().describe("軽減税率用商品単価"),
  reduceTaxCustomerPrice: z.string().optional().describe("軽減税率用商品会員単価"),
  orderPoint: z.string().optional().describe("発注点"),
  purchaseCost: z.string().optional().describe("仕入原価"),
  supplierProductNo: z.string().optional().describe("品番"),
  appStartDateTime: z.string().optional().describe("適用開始日時"),
  prices: z
    .array(
      z.object({
        storeId: z.string().optional().describe("店舗ID"),
        priceDivision: z.union([z.literal("1"), z.literal("2")]).optional().describe("価格区分"),
        startDate: z.string().optional().describe("適用開始日"),
        endDate: z.string().optional(),
        price: z.string().optional().describe("商品単価"),
      }),
    )
    .optional(),
  reserveItems: z
    .array(
      z.object({
        no: z.string().optional().describe("予約項目ラベル番号"),
        value: z.string().optional(),
      }),
    )
    .optional(),
  stores: z
    .array(
      z.object({
        storeId: z.string().optional().describe("店舗ID"),
        productOptionGroupId: z.string().optional().describe("商品オプショングループID"),
        assignDivision: z.union([z.literal("0"), z.literal("1")]).optional(),
      }),
    )
    .optional(),
  inventoryReservations: z
    .array(
      z.object({
        reservationProductId: z.string().optional().describe("引当商品ID"),
        reservationAmount: z.string().optional(),
      }),
    )
    .optional(),
  attributeItems: z
    .array(
      z.object({
        code: z.string().optional().describe("顧客タイプコード"),
        no: z.string().optional().describe("予約項目ラベル番号"),
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
          division: z.union([z.literal("0"), z.literal("1")]).optional().describe("商品区分 (0:通常商品、1:回数券、2:オプション商品)"),
          num: z.string().optional(),
          name: z.string().optional().describe("セクション名"),
        })
        .optional(),
      orderLimitAmount: z.string().optional(),
      orderSupplierEditable: z.union([z.literal("0"), z.literal("1")]).optional(),
      pbDivision: z.union([z.literal("0"), z.literal("1")]).optional(),
      displayFlag: z.union([z.literal("0"), z.literal("1")]).optional().describe("端末表示フラグ (0:表示しない、1:表示する)"),
      stores: z
        .array(
          z.object({
            storeId: z.string().optional().describe("店舗ID"),
            orderLimitAmount: z.string().optional(),
            displayFlag: z.union([z.literal("-1"), z.literal("0"), z.literal("1")]).optional().describe("端末表示フラグ (0:表示しない、1:表示する)"),
          }),
        )
        .optional(),
    })
    .optional(),
}).describe("商品情報の更新用データ");

export type ProductBulkCreate = z.infer<typeof ProductBulkCreate>;
export const ProductBulkCreate = z.object({
  items: z.array(ProductCreate).describe("登録する商品の配列"),
});

export type ProductBulkUpdate = z.infer<typeof ProductBulkUpdate>;
export const ProductBulkUpdate = z.object({
  items: z.array(ProductUpdate).describe("更新する商品の配列"),
});

export type ProductPrice = z.infer<typeof ProductPrice>;
export const ProductPrice = z.object({
  productId: z.string().describe("商品ID"),
  storeId: z.string().describe("店舗ID"),
  priceDivision: z.union([z.literal("1"), z.literal("2")]).describe("価格区分 (1:商品単価、2:会員単価)"),
  startDate: z.string().describe("適用開始日"),
  endDate: z.union([z.string(), z.undefined()]).optional().describe("適用終了日"),
  price: z.string().describe("価格"),
  insDateTime: z.union([z.string(), z.undefined()]).optional().describe("登録日時"),
  updDateTime: z.union([z.string(), z.undefined()]).optional().describe("更新日時"),
});

export type ProductPriceChange = z.infer<typeof ProductPriceChange>;
export const ProductPriceChange = z.object({
  productId: z.string().describe("商品ID"),
  storeId: z.string().describe("店舗ID"),
  priceDivision: z.union([z.literal("1"), z.literal("2")]).describe("価格区分 (1:商品単価、2:会員単価)"),
  startDate: z.string().describe("適用開始日"),
  endDate: z.union([z.string(), z.undefined()]).optional().describe("適用終了日"),
  price: z.string().describe("価格"),
  oldPrice: z.string().describe("変更前価格"),
  staffId: z.union([z.string(), z.undefined()]).optional().describe("変更スタッフID"),
  staffName: z.union([z.string(), z.undefined()]).optional().describe("変更スタッフ名"),
  insDateTime: z.string().describe("登録日時"),
});

export type ProductReserveItem = z.infer<typeof ProductReserveItem>;
export const ProductReserveItem = z.object({
  productId: z.string().describe("商品ID"),
  no: z.string().describe("予約項目番号"),
  labelNo: z.union([z.string(), z.undefined()]).optional().describe("予約項目ラベル番号"),
  value: z.string().describe("予約項目値"),
  insDateTime: z.union([z.string(), z.undefined()]).optional().describe("登録日時"),
  updDateTime: z.union([z.string(), z.undefined()]).optional().describe("更新日時"),
});

export type ProductAttribute = z.infer<typeof ProductAttribute>;
export const ProductAttribute = z.object({
  attributeNo: z.union([z.string(), z.undefined()]).optional().describe("属性番号"),
  attributeName: z.string().describe("属性名称"),
  selectedDivision: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional().describe("選択区分 (0:任意選択、1:必須選択)"),
  selectedType: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional().describe("選択タイプ (0:一つ選択、1:複数選択)"),
  displayFlag: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional().describe("表示フラグ (0:表示しない、1:表示する)"),
  insDateTime: z.union([z.string(), z.undefined()]).optional().describe("登録日時"),
  updDateTime: z.union([z.string(), z.undefined()]).optional().describe("更新日時"),
});

export type ProductAttributeItem = z.infer<typeof ProductAttributeItem>;
export const ProductAttributeItem = z.object({
  code: z.union([z.string(), z.undefined()]).optional().describe("属性項目コード"),
  attributeNo: z.string().describe("属性番号"),
  attributeItemName: z.string().describe("属性項目名称"),
  displaySequence: z.union([z.string(), z.undefined()]).optional().describe("表示順序"),
  status: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional().describe("ステータス (0:無効、1:有効)"),
  insDateTime: z.union([z.string(), z.undefined()]).optional().describe("登録日時"),
  updDateTime: z.union([z.string(), z.undefined()]).optional().describe("更新日時"),
});

export type ProductStore = z.infer<typeof ProductStore>;
export const ProductStore = z.object({
  productId: z.string().describe("商品ID"),
  storeId: z.string().describe("店舗ID"),
  productOptionGroupId: z.union([z.string(), z.undefined()]).optional().describe("商品オプショングループID"),
  assignDivision: z.union([z.literal("0"), z.literal("1")]).describe("取扱区分 (0:販売する、1:販売しない)"),
  insDateTime: z.union([z.string(), z.undefined()]).optional().describe("登録日時"),
  updDateTime: z.union([z.string(), z.undefined()]).optional().describe("更新日時"),
});

export type ProductInventoryReservation = z.infer<typeof ProductInventoryReservation>;
export const ProductInventoryReservation = z.object({
  productId: z.string().describe("商品ID"),
  reservationProductId: z.string().describe("引当商品ID"),
  reservationAmount: z.string().describe("引当個数"),
  insDateTime: z.union([z.string(), z.undefined()]).optional().describe("登録日時"),
  updDateTime: z.union([z.string(), z.undefined()]).optional().describe("更新日時"),
});

export type ProductReserveItemLabel = z.infer<typeof ProductReserveItemLabel>;
export const ProductReserveItemLabel = z.object({
  no: z.union([z.string(), z.undefined()]).optional().describe("予約項目ラベル番号"),
  name: z.string().describe("予約項目ラベル名"),
  status: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional().describe("ステータス (0:無効、1:有効)"),
  displaySequence: z.union([z.string(), z.undefined()]).optional().describe("表示順序"),
  insDateTime: z.union([z.string(), z.undefined()]).optional().describe("登録日時"),
  updDateTime: z.union([z.string(), z.undefined()]).optional().describe("更新日時"),
});

export type ProductImage = z.infer<typeof ProductImage>;
export const ProductImage = z.object({
  imageId: z.union([z.string(), z.undefined()]).optional().describe("商品画像ID"),
  productId: z.string().describe("商品ID"),
  displaySequence: z.union([z.string(), z.undefined()]).optional().describe("表示順序"),
  imageUrl: z.string().describe("画像URL"),
  imageType: z.union([z.literal("1"), z.literal("2"), z.literal("3")]).describe("画像タイプ (1:メイン画像、2:アイコン画像、3:詳細画像)"),
  size: z.union([z.string(), z.undefined()]).optional().describe("画像サイズ(バイト)"),
  width: z.union([z.string(), z.undefined()]).optional().describe("画像幅"),
  height: z.union([z.string(), z.undefined()]).optional().describe("画像高さ"),
  staffId: z.union([z.string(), z.undefined()]).optional().describe("登録スタッフID"),
  insDateTime: z.union([z.string(), z.undefined()]).optional().describe("登録日時"),
  updDateTime: z.union([z.string(), z.undefined()]).optional().describe("更新日時"),
});

export type ProductImageUpload = z.infer<typeof ProductImageUpload>;
export const ProductImageUpload = z.object({
  productId: z.string().describe("商品ID"),
  imageType: z.union([z.literal("1"), z.literal("2"), z.literal("3")]).describe("画像タイプ (1:メイン画像、2:アイコン画像、3:詳細画像)"),
  displaySequence: z.union([z.string(), z.undefined()]).optional().describe("表示順序"),
  image: z.string().describe("画像ファイル（JPEG、PNG形式）"),
});

export type Transaction = z.infer<typeof Transaction>;
export const Transaction = z.object({
  id: z.number().describe("取引ID"),
  storeId: z.number().describe("店舗ID"),
  terminalId: z.number().describe("端末ID"),
  terminalNo: z.string().describe("端末番号"),
  customerId: z.union([z.number(), z.null(), z.undefined()]).optional().describe("会員ID"),
  customerCode: z.union([z.string(), z.null(), z.undefined()]).optional().describe("会員コード"),
  customerName: z.union([z.string(), z.null(), z.undefined()]).optional().describe("会員名"),
  staffId: z.union([z.number(), z.null(), z.undefined()]).optional().describe("スタッフID"),
  staffCode: z.union([z.string(), z.null(), z.undefined()]).optional().describe("スタッフコード"),
  staffName: z.union([z.string(), z.null(), z.undefined()]).optional().describe("スタッフ名"),
  transactionDateTime: z.string().describe("取引日時"),
  totalAmount: z.number().describe("合計金額"),
  taxIncludedAmount: z.number().describe("内税額"),
  taxExcludedAmount: z.number().describe("外税額"),
  subtotalAmount: z.number().describe("小計金額"),
  paymentAmount: z.number().describe("支払金額"),
  changeAmount: z.number().describe("お釣り金額"),
  pointAmount: z.union([z.number(), z.null(), z.undefined()]).optional().describe("ポイント使用額"),
  paymentType: z.number().describe(`支払種別
* 1: 現金
* 2: クレジットカード
* 3: 電子マネー
* 4: 商品券
* 5: 複合決済
* 6: その他`),
  status: z.number().describe(`取引ステータス
* 1: 会計済
* 2: 返品
* 3: 取消`),
  receiptNo: z.string().describe("レシート番号"),
  receiptText: z.union([z.string(), z.null(), z.undefined()]).optional().describe("レシートテキスト"),
  memo: z.union([z.string(), z.null(), z.undefined()]).optional().describe("メモ"),
  createdDateTime: z.string().describe("作成日時"),
  updatedDateTime: z.string().describe("更新日時"),
}).describe("取引情報");

export type TransactionCreate = z.infer<typeof TransactionCreate>;
export const TransactionCreate = z.object({
  storeId: z.number().describe("店舗ID"),
  terminalId: z.number().describe("端末ID"),
  customerId: z.union([z.number(), z.null(), z.undefined()]).optional().describe("会員ID"),
  staffId: z.union([z.number(), z.null(), z.undefined()]).optional().describe("スタッフID"),
  transactionDateTime: z.string().describe("取引日時"),
  totalAmount: z.number().describe("合計金額"),
  taxIncludedAmount: z.number().describe("内税額"),
  taxExcludedAmount: z.number().describe("外税額"),
  subtotalAmount: z.number().describe("小計金額"),
  paymentAmount: z.number().describe("支払金額"),
  changeAmount: z.number().describe("お釣り金額"),
  pointAmount: z.union([z.number(), z.null(), z.undefined()]).optional().describe("ポイント使用額"),
  paymentType: z.number().describe(`支払種別
* 1: 現金
* 2: クレジットカード
* 3: 電子マネー
* 4: 商品券
* 5: 複合決済
* 6: その他`),
  status: z.number().describe(`取引ステータス
* 1: 会計済
* 2: 返品
* 3: 取消`),
  receiptNo: z.string().describe("レシート番号"),
  receiptText: z.union([z.string(), z.null(), z.undefined()]).optional().describe("レシートテキスト"),
  memo: z.union([z.string(), z.null(), z.undefined()]).optional().describe("メモ"),
  details: z.array(
    z.object({
      productId: z.union([z.number(), z.null(), z.undefined()]).optional().describe("商品ID"),
      productCode: z.union([z.string(), z.null(), z.undefined()]).optional().describe("商品コード"),
      productName: z.string().describe("商品名"),
      categoryId: z.union([z.number(), z.null(), z.undefined()]).optional().describe("部門ID"),
      price: z.number(),
      quantity: z.number(),
      unitDiscountAmount: z.union([z.number(), z.null(), z.undefined()]).optional(),
      unitDiscountRate: z.union([z.number(), z.null(), z.undefined()]).optional(),
      unitDiscountType: z.union([z.number(), z.null(), z.undefined()]).optional(),
      subtotalAmount: z.number().describe("小計金額"),
      taxRate: z.number(),
      taxType: z.number(),
      detailType: z.number(),
    }),
  ),
  payments: z.array(
    z.object({
      paymentMethodId: z.number().describe("支払方法ID"),
      paymentMethodName: z.string().describe("支払方法名（部分一致）"),
      amount: z.number(),
      paymentNo: z.union([z.string(), z.null(), z.undefined()]).optional(),
      cardCompanyId: z.union([z.number(), z.null(), z.undefined()]).optional(),
      cardCompanyName: z.union([z.string(), z.null(), z.undefined()]).optional(),
    }),
  ),
}).describe("取引情報の登録用データ");

export type TransactionUpdate = z.infer<typeof TransactionUpdate>;
export const TransactionUpdate = z.object({
  customerId: z.union([z.number(), z.null()]).optional().describe("会員ID"),
  staffId: z.union([z.number(), z.null()]).optional().describe("スタッフID"),
  status: z.number().optional().describe(`取引ステータス
* 1: 会計済
* 2: 返品
* 3: 取消`),
  memo: z.union([z.string(), z.null()]).optional().describe("メモ"),
}).describe("取引情報の更新用データ");

export type TransactionDetail = z.infer<typeof TransactionDetail>;
export const TransactionDetail = z.object({
  id: z.number().describe("取引明細ID"),
  transactionId: z.number().describe("取引ID"),
  lineNo: z.number().describe("行番号"),
  productId: z.union([z.number(), z.null(), z.undefined()]).optional().describe("商品ID"),
  productCode: z.union([z.string(), z.null(), z.undefined()]).optional().describe("商品コード"),
  productName: z.string().describe("商品名"),
  categoryId: z.union([z.number(), z.null(), z.undefined()]).optional().describe("部門ID"),
  categoryName: z.union([z.string(), z.null(), z.undefined()]).optional().describe("部門名"),
  price: z.number().describe("単価"),
  quantity: z.number().describe("数量"),
  unitDiscountAmount: z.union([z.number(), z.null(), z.undefined()]).optional().describe("単品値引額"),
  unitDiscountRate: z.union([z.number(), z.null(), z.undefined()]).optional().describe("単品値引率"),
  unitDiscountType: z.union([z.number(), z.null(), z.undefined()]).optional().describe(`単品値引種別
* 1: 金額値引
* 2: 率値引`),
  subtotalAmount: z.number().describe("小計金額"),
  taxRate: z.number().describe("税率"),
  taxType: z.number().describe(`税種別
* 1: 内税
* 2: 外税`),
  taxIncludedAmount: z.number().describe("内税額"),
  taxExcludedAmount: z.number().describe("外税額"),
  detailType: z.number().describe(`明細種別
* 1: 通常商品
* 2: セット親商品
* 3: セット子商品
* 4: 返品親明細
* 5: 返品子明細
* 6: 訂正明細
* 7: 取引値引
* 8: 小計値引
* 9: 小計割引
* 10: クーポン明細`),
  parentLineNo: z.union([z.number(), z.null(), z.undefined()]).optional().describe("親明細行番号"),
  discountId: z.union([z.number(), z.null(), z.undefined()]).optional().describe("値引ID"),
  discountName: z.union([z.string(), z.null(), z.undefined()]).optional().describe("値引名"),
  couponId: z.union([z.number(), z.null(), z.undefined()]).optional().describe("クーポンID"),
  couponName: z.union([z.string(), z.null(), z.undefined()]).optional().describe("クーポン名"),
  couponCode: z.union([z.string(), z.null(), z.undefined()]).optional().describe("クーポンコード"),
  taxFreeDivision: z.number().describe(`免税区分
* 0: 課税
* 1: 免税
* 2: 非課税`),
  remark: z.union([z.string(), z.null(), z.undefined()]).optional().describe("備考"),
  cost: z.union([z.number(), z.null(), z.undefined()]).optional().describe("原価"),
  stockTransactionType: z.union([z.number(), z.null(), z.undefined()]).optional().describe(`在庫取引区分
* 1: 在庫引当あり
* 2: 在庫引当なし`),
  costType: z.union([z.number(), z.null(), z.undefined()]).optional().describe(`原価区分
* 1: 移動平均原価
* 2: 最終仕入原価
* 3: 前日在庫単価`),
  stockReserveId: z.union([z.number(), z.null(), z.undefined()]).optional().describe("在庫引当ID"),
  serialCode: z.union([z.string(), z.null(), z.undefined()]).optional().describe("シリアルコード"),
  createdDateTime: z.string().describe("作成日時"),
  updatedDateTime: z.string().describe("更新日時"),
});

export type Layaway = z.infer<typeof Layaway>;
export const Layaway = z.object({
  id: z.number().describe("預かり取引ID"),
  storeId: z.number().describe("店舗ID"),
  terminalId: z.number().describe("端末ID"),
  customerId: z.union([z.number(), z.null(), z.undefined()]).optional().describe("会員ID"),
  customerCode: z.union([z.string(), z.null(), z.undefined()]).optional().describe("会員コード"),
  customerName: z.union([z.string(), z.null(), z.undefined()]).optional().describe("会員名"),
  staffId: z.union([z.number(), z.null(), z.undefined()]).optional().describe("スタッフID"),
  staffCode: z.union([z.string(), z.null(), z.undefined()]).optional().describe("スタッフコード"),
  staffName: z.union([z.string(), z.null(), z.undefined()]).optional().describe("スタッフ名"),
  layawayDateTime: z.string().describe("預かり日時"),
  totalAmount: z.number().describe("合計金額"),
  taxIncludedAmount: z.number().describe("内税額"),
  taxExcludedAmount: z.number().describe("外税額"),
  status: z.number().describe(`ステータス
* 1: 預かり
* 2: 終了`),
  memo: z.union([z.string(), z.null(), z.undefined()]).optional().describe("メモ"),
  transactionId: z.union([z.number(), z.null(), z.undefined()]).optional().describe("取引ID"),
  items: z.array(
    z.object({
      productId: z.union([z.number(), z.null()]).optional().describe("商品ID"),
      productCode: z.union([z.string(), z.null()]).optional().describe("商品コード"),
      productName: z.string().optional().describe("商品名"),
      categoryId: z.union([z.number(), z.null()]).optional().describe("部門ID"),
      categoryName: z.union([z.string(), z.null()]).optional().describe("部門名"),
      price: z.number().optional(),
      quantity: z.number().optional(),
      subtotalAmount: z.number().optional(),
      taxRate: z.number().optional(),
      taxType: z.number().optional(),
      taxIncludedAmount: z.number().optional().describe("内税額"),
      taxExcludedAmount: z.number().optional().describe("外税額"),
    }),
  ),
  createdDateTime: z.string().describe("作成日時"),
  updatedDateTime: z.string().describe("更新日時"),
}).describe("取置情報");

export type LayawayCreate = z.infer<typeof LayawayCreate>;
export const LayawayCreate = z.object({
  storeId: z.number().describe("店舗ID"),
  terminalId: z.number().describe("端末ID"),
  customerId: z.union([z.number(), z.null(), z.undefined()]).optional().describe("会員ID"),
  staffId: z.union([z.number(), z.null(), z.undefined()]).optional().describe("スタッフID"),
  layawayDateTime: z.string().describe("預かり日時"),
  totalAmount: z.number().describe("合計金額"),
  taxIncludedAmount: z.number().describe("内税額"),
  taxExcludedAmount: z.number().describe("外税額"),
  memo: z.union([z.string(), z.null(), z.undefined()]).optional().describe("メモ"),
  items: z.array(
    z.object({
      productId: z.union([z.number(), z.null(), z.undefined()]).optional().describe("商品ID"),
      productCode: z.union([z.string(), z.null(), z.undefined()]).optional().describe("商品コード"),
      productName: z.string().describe("商品名"),
      categoryId: z.union([z.number(), z.null(), z.undefined()]).optional().describe("部門ID"),
      price: z.number(),
      quantity: z.number(),
      subtotalAmount: z.number(),
      taxRate: z.number(),
      taxType: z.number(),
      taxIncludedAmount: z.number().describe("内税額"),
      taxExcludedAmount: z.number().describe("外税額"),
    }),
  ),
}).describe("取置情報の登録用データ");

export type PreSale = z.infer<typeof PreSale>;
export const PreSale = z.object({
  id: z.number().describe("事前会計ID"),
  storeId: z.number().describe("店舗ID"),
  terminalId: z.number().describe("端末ID"),
  customerId: z.union([z.number(), z.null(), z.undefined()]).optional().describe("会員ID"),
  customerCode: z.union([z.string(), z.null(), z.undefined()]).optional().describe("会員コード"),
  customerName: z.union([z.string(), z.null(), z.undefined()]).optional().describe("会員名"),
  staffId: z.union([z.number(), z.null(), z.undefined()]).optional().describe("スタッフID"),
  staffCode: z.union([z.string(), z.null(), z.undefined()]).optional().describe("スタッフコード"),
  staffName: z.union([z.string(), z.null(), z.undefined()]).optional().describe("スタッフ名"),
  preSaleDateTime: z.string().describe("事前会計日時"),
  totalAmount: z.number().describe("合計金額"),
  taxIncludedAmount: z.number().describe("内税額"),
  taxExcludedAmount: z.number().describe("外税額"),
  status: z.number().describe(`ステータス
* 1: 未会計
* 2: 会計済`),
  memo: z.union([z.string(), z.null(), z.undefined()]).optional().describe("メモ"),
  transactionId: z.union([z.number(), z.null(), z.undefined()]).optional().describe("取引ID"),
  items: z.array(
    z.object({
      productId: z.union([z.number(), z.null()]).optional().describe("商品ID"),
      productCode: z.union([z.string(), z.null()]).optional().describe("商品コード"),
      productName: z.string().optional().describe("商品名"),
      categoryId: z.union([z.number(), z.null()]).optional().describe("部門ID"),
      categoryName: z.union([z.string(), z.null()]).optional().describe("部門名"),
      price: z.number().optional(),
      quantity: z.number().optional(),
      subtotalAmount: z.number().optional(),
      taxRate: z.number().optional(),
      taxType: z.number().optional(),
      taxIncludedAmount: z.number().optional().describe("内税額"),
      taxExcludedAmount: z.number().optional().describe("外税額"),
    }),
  ),
  createdDateTime: z.string().describe("作成日時"),
  updatedDateTime: z.string().describe("更新日時"),
}).describe("予約販売情報");

export type PreSaleCreate = z.infer<typeof PreSaleCreate>;
export const PreSaleCreate = z.object({
  storeId: z.number().describe("店舗ID"),
  terminalId: z.number().describe("端末ID"),
  customerId: z.union([z.number(), z.null(), z.undefined()]).optional().describe("会員ID"),
  staffId: z.union([z.number(), z.null(), z.undefined()]).optional().describe("スタッフID"),
  preSaleDateTime: z.string().describe("事前会計日時"),
  totalAmount: z.number().describe("合計金額"),
  taxIncludedAmount: z.number().describe("内税額"),
  taxExcludedAmount: z.number().describe("外税額"),
  memo: z.union([z.string(), z.null(), z.undefined()]).optional().describe("メモ"),
  items: z.array(
    z.object({
      productId: z.union([z.number(), z.null(), z.undefined()]).optional().describe("商品ID"),
      productCode: z.union([z.string(), z.null(), z.undefined()]).optional().describe("商品コード"),
      productName: z.string().describe("商品名"),
      categoryId: z.union([z.number(), z.null(), z.undefined()]).optional().describe("部門ID"),
      price: z.number(),
      quantity: z.number(),
      subtotalAmount: z.number(),
      taxRate: z.number(),
      taxType: z.number(),
      taxIncludedAmount: z.number().describe("内税額"),
      taxExcludedAmount: z.number().describe("外税額"),
    }),
  ),
}).describe("予約販売情報の登録用データ");

export type PreSaleUpdate = z.infer<typeof PreSaleUpdate>;
export const PreSaleUpdate = z.object({
  customerId: z.union([z.number(), z.null()]).optional().describe("会員ID"),
  staffId: z.union([z.number(), z.null()]).optional().describe("スタッフID"),
  status: z.number().optional().describe(`ステータス
* 1: 未会計
* 2: 会計済`),
  memo: z.union([z.string(), z.null()]).optional().describe("メモ"),
  transactionId: z.union([z.number(), z.null()]).optional().describe("取引ID"),
}).describe("予約販売情報の更新用データ");

export type TicketTransaction = z.infer<typeof TicketTransaction>;
export const TicketTransaction = z.object({
  id: z.number().describe("チケット取引ID"),
  storeId: z.number().describe("店舗ID"),
  terminalId: z.number().describe("端末ID"),
  ticketCode: z.string().describe("チケットコード"),
  customerId: z.union([z.number(), z.null(), z.undefined()]).optional().describe("会員ID"),
  customerCode: z.union([z.string(), z.null(), z.undefined()]).optional().describe("会員コード"),
  customerName: z.union([z.string(), z.null(), z.undefined()]).optional().describe("会員名"),
  staffId: z.union([z.number(), z.null(), z.undefined()]).optional().describe("スタッフID"),
  staffCode: z.union([z.string(), z.null(), z.undefined()]).optional().describe("スタッフコード"),
  staffName: z.union([z.string(), z.null(), z.undefined()]).optional().describe("スタッフ名"),
  ticketDateTime: z.string().describe("チケット発行日時"),
  expirationDate: z.union([z.string(), z.null(), z.undefined()]).optional().describe("有効期限"),
  usedDateTime: z.union([z.string(), z.null(), z.undefined()]).optional().describe("使用日時"),
  statusType: z.number().describe(`ステータスタイプ
* 1: 未使用
* 2: 使用済
* 3: 期限切れ
* 4: 取消`),
  transactionId: z.number().describe("発行時取引ID"),
  usedTransactionId: z.union([z.number(), z.null(), z.undefined()]).optional().describe("使用時取引ID"),
  memo: z.union([z.string(), z.null(), z.undefined()]).optional().describe("メモ"),
  productId: z.union([z.number(), z.null(), z.undefined()]).optional().describe("商品ID"),
  productCode: z.union([z.string(), z.null(), z.undefined()]).optional().describe("商品コード"),
  productName: z.string().describe("商品名"),
  price: z.number().describe("価格"),
  quantity: z.number().describe("数量"),
  createdDateTime: z.string().describe("作成日時"),
  updatedDateTime: z.string().describe("更新日時"),
}).describe("チケット取引情報");

export type Customer = z.infer<typeof Customer>;
export const Customer = z.object({
  customerId: z.string().optional().describe("会員ID"),
  customerCode: z.string().optional().describe("会員コード"),
  customerNo: z.string().optional().describe("会員番号"),
  rank: z.string().optional().describe("会員ランク"),
  staffRank: z.string().optional().describe("スタッフランク"),
  firstName: z.string().optional().describe("名前"),
  lastName: z.string().optional().describe("苗字"),
  firstNameKana: z.string().optional().describe("名前カナ"),
  lastNameKana: z.string().optional().describe("苗字カナ"),
  sex: z.union([z.literal("0"), z.literal("1"), z.literal("2")]).optional().describe("性別(0:不明, 1:男性, 2:女性)"),
  barcode: z.string().optional().describe("バーコード"),
  birthDate: z.string().optional().describe("生年月日"),
  zipCode: z.string().optional().describe("郵便番号"),
  address: z.string().optional().describe("住所"),
  phoneNumber: z.string().optional().describe("電話番号"),
  faxNumber: z.string().optional().describe("FAX番号"),
  mobileNumber: z.string().optional().describe("携帯電話番号"),
  mailAddress: z.string().optional().describe("メールアドレス"),
  mailAddress2: z.string().optional().describe("メールアドレス2"),
  mailAddress3: z.string().optional().describe("メールアドレス3"),
  companyName: z.string().optional().describe("会社名"),
  departmentName: z.string().optional().describe("部署名"),
  managerFlag: z.boolean().optional().describe("担当者フラグ"),
  isStaff: z.boolean().optional().describe("スタッフフラグ"),
  points: z.number().optional().describe("ポイント"),
  storeId: z.string().optional().describe("店舗ID"),
  note: z.string().optional().describe("備考"),
  statusId: z.number().optional().describe("状態(1:利用, 2:停止)"),
  enterDate: z.string().optional().describe("入会日"),
  suspendDate: z.string().optional().describe("退会日"),
  pointExpireDate: z.string().optional().describe("ポイント有効期限"),
  insDateTime: z.string().optional().describe("登録日時"),
  updDateTime: z.string().optional().describe("更新日時"),
}).describe("会員情報");

export type CustomerCreate = z.infer<typeof CustomerCreate>;
export const CustomerCreate = z.object({
  customerCode: z.string().describe("会員コード"),
  customerNo: z.union([z.string(), z.undefined()]).optional().describe("会員番号"),
  rank: z.union([z.string(), z.undefined()]).optional().describe("会員ランク"),
  staffRank: z.union([z.string(), z.undefined()]).optional().describe("スタッフランク"),
  firstName: z.union([z.string(), z.undefined()]).optional().describe("名前"),
  lastName: z.union([z.string(), z.undefined()]).optional().describe("苗字"),
  firstNameKana: z.union([z.string(), z.undefined()]).optional().describe("名前カナ"),
  lastNameKana: z.union([z.string(), z.undefined()]).optional().describe("苗字カナ"),
  sex: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.undefined()]).optional().describe("性別(0:不明, 1:男性, 2:女性)"),
  barcode: z.union([z.string(), z.undefined()]).optional().describe("バーコード"),
  birthDate: z.union([z.string(), z.undefined()]).optional().describe("生年月日"),
  zipCode: z.union([z.string(), z.undefined()]).optional().describe("郵便番号"),
  address: z.union([z.string(), z.undefined()]).optional().describe("住所"),
  phoneNumber: z.union([z.string(), z.undefined()]).optional().describe("電話番号"),
  faxNumber: z.union([z.string(), z.undefined()]).optional().describe("FAX番号"),
  mobileNumber: z.union([z.string(), z.undefined()]).optional().describe("携帯電話番号"),
  mailAddress: z.union([z.string(), z.undefined()]).optional().describe("メールアドレス"),
  mailAddress2: z.union([z.string(), z.undefined()]).optional().describe("メールアドレス2"),
  mailAddress3: z.union([z.string(), z.undefined()]).optional().describe("メールアドレス3"),
  companyName: z.union([z.string(), z.undefined()]).optional().describe("会社名"),
  departmentName: z.union([z.string(), z.undefined()]).optional().describe("部署名"),
  managerFlag: z.union([z.boolean(), z.undefined()]).optional().describe("担当者フラグ"),
  isStaff: z.union([z.boolean(), z.undefined()]).optional().describe("スタッフフラグ"),
  points: z.union([z.number(), z.undefined()]).optional().describe("ポイント"),
  storeId: z.union([z.string(), z.undefined()]).optional().describe("店舗ID"),
  note: z.union([z.string(), z.undefined()]).optional().describe("備考"),
  statusId: z.union([z.number(), z.undefined()]).optional().describe("状態(1:利用, 2:停止)"),
  enterDate: z.union([z.string(), z.undefined()]).optional().describe("入会日"),
  suspendDate: z.union([z.string(), z.undefined()]).optional().describe("退会日"),
  pointExpireDate: z.union([z.string(), z.undefined()]).optional().describe("ポイント有効期限"),
}).describe("会員情報の登録用データ");

export type CustomerUpdate = z.infer<typeof CustomerUpdate>;
export const CustomerUpdate = z.object({
  customerCode: z.string().optional().describe("会員コード"),
  customerNo: z.string().optional().describe("会員番号"),
  rank: z.string().optional().describe("会員ランク"),
  staffRank: z.string().optional().describe("スタッフランク"),
  firstName: z.string().optional().describe("名前"),
  lastName: z.string().optional().describe("苗字"),
  firstNameKana: z.string().optional().describe("名前カナ"),
  lastNameKana: z.string().optional().describe("苗字カナ"),
  sex: z.union([z.literal("0"), z.literal("1"), z.literal("2")]).optional().describe("性別(0:不明, 1:男性, 2:女性)"),
  barcode: z.string().optional().describe("バーコード"),
  birthDate: z.string().optional().describe("生年月日"),
  zipCode: z.string().optional().describe("郵便番号"),
  address: z.string().optional().describe("住所"),
  phoneNumber: z.string().optional().describe("電話番号"),
  faxNumber: z.string().optional().describe("FAX番号"),
  mobileNumber: z.string().optional().describe("携帯電話番号"),
  mailAddress: z.string().optional().describe("メールアドレス"),
  mailAddress2: z.string().optional().describe("メールアドレス2"),
  mailAddress3: z.string().optional().describe("メールアドレス3"),
  companyName: z.string().optional().describe("会社名"),
  departmentName: z.string().optional().describe("部署名"),
  managerFlag: z.boolean().optional().describe("担当者フラグ"),
  isStaff: z.boolean().optional().describe("スタッフフラグ"),
  points: z.number().optional().describe("ポイント"),
  storeId: z.string().optional().describe("店舗ID"),
  note: z.string().optional().describe("備考"),
  statusId: z.number().optional().describe("状態(1:利用, 2:停止)"),
  enterDate: z.string().optional().describe("入会日"),
  suspendDate: z.string().optional().describe("退会日"),
  pointExpireDate: z.string().optional().describe("ポイント有効期限"),
}).describe("会員情報の更新用データ");

export type CustomerBulkCreate = z.infer<typeof CustomerBulkCreate>;
export const CustomerBulkCreate = z.object({
  customers: z.array(CustomerCreate).describe("会員情報リスト"),
});

export type CustomerBulkUpdate = z.infer<typeof CustomerBulkUpdate>;
export const CustomerBulkUpdate = z.object({
  customers: z.array(
    z.intersection(
      z.object({
        customerId: z.string().describe("会員ID"),
      }),
      CustomerUpdate,
    ),
  ),
});

export type CustomerPoint = z.infer<typeof CustomerPoint>;
export const CustomerPoint = z.object({
  customerId: z.string().optional().describe("会員ID"),
  points: z.number().optional().describe("ポイント"),
  pointExpireDate: z.string().optional().describe("ポイント有効期限"),
});

export type CustomerPointUpdate = z.infer<typeof CustomerPointUpdate>;
export const CustomerPointUpdate = z.object({
  points: z.number().describe("ポイント"),
  pointExpireDate: z.union([z.string(), z.undefined()]).optional().describe("ポイント有効期限"),
});

export type CustomerPointRelativeUpdate = z.infer<typeof CustomerPointRelativeUpdate>;
export const CustomerPointRelativeUpdate = z.object({
  points: z.number().describe("加減算ポイント（マイナスの場合は減算）"),
  pointExpireDate: z.union([z.string(), z.undefined()]).optional().describe("ポイント有効期限"),
});

export type CustomerRank = z.infer<typeof CustomerRank>;
export const CustomerRank = z.object({
  rankId: z.string().optional().describe("会員ランクID"),
  rankName: z.string().optional().describe("会員ランク名"),
  pointRate: z.number().optional().describe("ポイント付与率"),
  pointExpirationType: z.union([z.literal("0"), z.literal("1"), z.literal("2")]).optional().describe("ポイント有効期限タイプ（0:なし, 1:年月設定, 2:付与から一定期間）"),
  pointExpirationMonth: z.number().optional().describe("ポイント有効期限月"),
  pointExpirationDay: z.number().optional().describe("ポイント有効期限日"),
  pointExpirationPeriod: z.number().optional().describe("ポイント有効期間（日）"),
  note: z.string().optional().describe("備考"),
  insDateTime: z.string().optional().describe("登録日時"),
  updDateTime: z.string().optional().describe("更新日時"),
});

export type CustomerRankCreate = z.infer<typeof CustomerRankCreate>;
export const CustomerRankCreate = z.object({
  rankName: z.string().describe("会員ランク名"),
  pointRate: z.union([z.number(), z.undefined()]).optional().describe("ポイント付与率"),
  pointExpirationType: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.undefined()]).optional().describe("ポイント有効期限タイプ（0:なし, 1:年月設定, 2:付与から一定期間）"),
  pointExpirationMonth: z.union([z.number(), z.undefined()]).optional().describe("ポイント有効期限月"),
  pointExpirationDay: z.union([z.number(), z.undefined()]).optional().describe("ポイント有効期限日"),
  pointExpirationPeriod: z.union([z.number(), z.undefined()]).optional().describe("ポイント有効期間（日）"),
  note: z.union([z.string(), z.undefined()]).optional().describe("備考"),
});

export type CustomerRankUpdate = z.infer<typeof CustomerRankUpdate>;
export const CustomerRankUpdate = z.object({
  rankName: z.string().optional().describe("会員ランク名"),
  pointRate: z.number().optional().describe("ポイント付与率"),
  pointExpirationType: z.union([z.literal("0"), z.literal("1"), z.literal("2")]).optional().describe("ポイント有効期限タイプ（0:なし, 1:年月設定, 2:付与から一定期間）"),
  pointExpirationMonth: z.number().optional().describe("ポイント有効期限月"),
  pointExpirationDay: z.number().optional().describe("ポイント有効期限日"),
  pointExpirationPeriod: z.number().optional().describe("ポイント有効期間（日）"),
  note: z.string().optional().describe("備考"),
});

export type StaffRank = z.infer<typeof StaffRank>;
export const StaffRank = z.object({
  staffRankId: z.string().optional().describe("スタッフランクID"),
  staffRankName: z.string().optional().describe("スタッフランク名"),
  discountRate: z.number().optional().describe("社員割引率"),
  pointRate: z.number().optional().describe("ポイント付与率"),
  note: z.string().optional().describe("備考"),
  insDateTime: z.string().optional().describe("登録日時"),
  updDateTime: z.string().optional().describe("更新日時"),
});

export type StaffRankCreate = z.infer<typeof StaffRankCreate>;
export const StaffRankCreate = z.object({
  staffRankName: z.string().describe("スタッフランク名"),
  discountRate: z.union([z.number(), z.undefined()]).optional().describe("社員割引率"),
  pointRate: z.union([z.number(), z.undefined()]).optional().describe("ポイント付与率"),
  note: z.union([z.string(), z.undefined()]).optional().describe("備考"),
});

export type StaffRankUpdate = z.infer<typeof StaffRankUpdate>;
export const StaffRankUpdate = z.object({
  staffRankName: z.string().optional().describe("スタッフランク名"),
  discountRate: z.number().optional().describe("社員割引率"),
  pointRate: z.number().optional().describe("ポイント付与率"),
  note: z.string().optional().describe("備考"),
});

export type CustomerRequired = z.infer<typeof CustomerRequired>;
export const CustomerRequired = z.object({
  firstName: z.boolean().optional().describe("名前必須フラグ"),
  lastName: z.boolean().optional().describe("苗字必須フラグ"),
  firstNameKana: z.boolean().optional().describe("名前カナ必須フラグ"),
  lastNameKana: z.boolean().optional().describe("苗字カナ必須フラグ"),
  sex: z.boolean().optional().describe("性別必須フラグ"),
  birthDate: z.boolean().optional().describe("生年月日必須フラグ"),
  zipCode: z.boolean().optional().describe("郵便番号必須フラグ"),
  address: z.boolean().optional().describe("住所必須フラグ"),
  phoneNumber: z.boolean().optional().describe("電話番号必須フラグ"),
  mobileNumber: z.boolean().optional().describe("携帯電話番号必須フラグ"),
  mailAddress: z.boolean().optional().describe("メールアドレス必須フラグ"),
  companyName: z.boolean().optional().describe("会社名必須フラグ"),
  departmentName: z.boolean().optional().describe("部署名必須フラグ"),
});

export type Stock = z.infer<typeof Stock>;
export const Stock = z.object({
  storeId: z.number().describe("店舗ID"),
  storeName: z.union([z.string(), z.undefined()]).optional().describe("店舗名"),
  productId: z.number().describe("商品ID"),
  productCode: z.union([z.string(), z.undefined()]).optional().describe("商品コード"),
  productName: z.union([z.string(), z.undefined()]).optional().describe("商品名"),
  barcode: z.union([z.string(), z.undefined()]).optional().describe("バーコード"),
  categoryId: z.union([z.number(), z.undefined()]).optional().describe("部門ID"),
  categoryName: z.union([z.string(), z.undefined()]).optional().describe("部門名"),
  quantity: z.number().describe("在庫数"),
  reservedQuantity: z.union([z.number(), z.undefined()]).optional().describe("予約在庫数"),
  originalQuantity: z.union([z.number(), z.undefined()]).optional().describe("棚卸前在庫数"),
  lastUpdateDate: z.union([z.string(), z.undefined()]).optional().describe("最終更新日時"),
}).describe("在庫情報");

export type StockUpdate = z.infer<typeof StockUpdate>;
export const StockUpdate = z.object({
  storeId: z.number().describe("店舗ID"),
  productId: z.number().describe("商品ID"),
  quantity: z.number().describe("在庫数"),
}).describe("在庫情報の更新用データ");

export type StockBulkUpdate = z.infer<typeof StockBulkUpdate>;
export const StockBulkUpdate = z.object({
  stocks: z.array(StockUpdate).describe("在庫更新情報の配列"),
});

export type StockRelativeUpdate = z.infer<typeof StockRelativeUpdate>;
export const StockRelativeUpdate = z.object({
  storeId: z.number().describe("店舗ID"),
  productId: z.number().describe("商品ID"),
  addQuantity: z.number().describe("増減数量（正の値で増加、負の値で減少）"),
  division: z.number().describe("区分（1:取引、2:入庫、3:出庫、4:棚卸、5:発注、6:受注、7:ロス、8:その他）"),
  memo: z.union([z.string(), z.undefined()]).optional().describe("メモ"),
});

export type StockBulkRelativeUpdate = z.infer<typeof StockBulkRelativeUpdate>;
export const StockBulkRelativeUpdate = z.object({
  stocks: z.array(StockRelativeUpdate).describe("在庫相対更新情報の配列"),
});

export type StockChange = z.infer<typeof StockChange>;
export const StockChange = z.object({
  stockChangeId: z.number().describe("在庫変動ID"),
  storeId: z.number().describe("店舗ID"),
  storeName: z.union([z.string(), z.undefined()]).optional().describe("店舗名"),
  productId: z.number().describe("商品ID"),
  productCode: z.union([z.string(), z.undefined()]).optional().describe("商品コード"),
  productName: z.union([z.string(), z.undefined()]).optional().describe("商品名"),
  barcode: z.union([z.string(), z.undefined()]).optional().describe("バーコード"),
  categoryId: z.union([z.number(), z.undefined()]).optional().describe("部門ID"),
  categoryName: z.union([z.string(), z.undefined()]).optional().describe("部門名"),
  division: z.number().describe("区分（1:取引、2:入庫、3:出庫、4:棚卸、5:発注、6:受注、7:ロス、8:その他）"),
  divisionName: z.union([z.string(), z.undefined()]).optional().describe("区分名"),
  beforeQuantity: z.number().describe("変動前在庫数"),
  changeQuantity: z.number().describe("変動数"),
  afterQuantity: z.number().describe("変動後在庫数"),
  targetDate: z.string().describe("変動日"),
  staffId: z.union([z.number(), z.undefined()]).optional().describe("担当スタッフID"),
  staffName: z.union([z.string(), z.undefined()]).optional().describe("担当スタッフ名"),
  refId: z.union([z.number(), z.undefined()]).optional().describe("関連ID（取引ID、入庫ID、出庫ID等）"),
  memo: z.union([z.string(), z.undefined()]).optional().describe("メモ"),
}).describe("在庫変動履歴情報");

export type Bargain = z.infer<typeof Bargain>;
export const Bargain = z.object({
  bargainId: z.string().describe("セールID"),
  bargainName: z.string().describe("セール名"),
  termStart: z.string().describe("セール開始日 [YYYY-MM-DD]"),
  termEnd: z.string().describe("セール終了日 [YYYY-MM-DD]"),
  insDateTime: z.union([z.string(), z.undefined()]).optional().describe("登録日時"),
  updDateTime: z.union([z.string(), z.undefined()]).optional().describe("更新日時"),
});

export type BargainCreate = z.infer<typeof BargainCreate>;
export const BargainCreate = z.object({
  bargainName: z.string().describe("セール名"),
  termStart: z.string().describe("セール開始日 [YYYY-MM-DD]"),
  termEnd: z.string().describe("セール終了日 [YYYY-MM-DD]"),
});

export type BargainUpdate = z.infer<typeof BargainUpdate>;
export const BargainUpdate = z.object({
  bargainName: z.string().optional().describe("セール名"),
  termStart: z.string().optional().describe("セール開始日 [YYYY-MM-DD]"),
  termEnd: z.string().optional().describe("セール終了日 [YYYY-MM-DD]"),
});

export type BargainStore = z.infer<typeof BargainStore>;
export const BargainStore = z.object({
  bargainStoreId: z.string().describe("セール店舗ID"),
  bargainId: z.string().describe("セールID"),
  storeId: z.string().describe("店舗ID"),
  insDateTime: z.union([z.string(), z.undefined()]).optional().describe("登録日時"),
  updDateTime: z.union([z.string(), z.undefined()]).optional().describe("更新日時"),
});

export type BargainStoreCreate = z.infer<typeof BargainStoreCreate>;
export const BargainStoreCreate = z.object({
  storeId: z.string().describe("店舗ID"),
});

export type BargainStoreUpdate = z.infer<typeof BargainStoreUpdate>;
export const BargainStoreUpdate = z.object({
  storeId: z.string().optional().describe("店舗ID"),
});

export type BargainProduct = z.infer<typeof BargainProduct>;
export const BargainProduct = z.object({
  bargainProductId: z.string().describe("セール商品ID"),
  bargainId: z.string().describe("セールID"),
  targetDivision: z.union([z.literal("1"), z.literal("2"), z.literal("3")]).describe("対象区分 (1:部門、2:商品、3:グループコード)"),
  targetId: z.string().describe("対象ID (部門ID、商品ID、グループコードのいずれか)"),
  division: z.union([z.literal("1"), z.literal("2"), z.literal("3")]).describe("割引区分 (1:割引、2:値引、3:価格指定)"),
  value: z.string().describe("値 (割引率、値引額、または価格)"),
  insDateTime: z.union([z.string(), z.undefined()]).optional().describe("登録日時"),
  updDateTime: z.union([z.string(), z.undefined()]).optional().describe("更新日時"),
});

export type BargainProductCreate = z.infer<typeof BargainProductCreate>;
export const BargainProductCreate = z.object({
  targetDivision: z.union([z.literal("1"), z.literal("2"), z.literal("3")]).describe("対象区分 (1:部門、2:商品、3:グループコード)"),
  targetId: z.string().describe("対象ID (部門ID、商品ID、グループコードのいずれか)"),
  division: z.union([z.literal("1"), z.literal("2"), z.literal("3")]).describe("割引区分 (1:割引、2:値引、3:価格指定)"),
  value: z.string().describe("値 (割引率、値引額、または価格)"),
});

export type BargainProductUpdate = z.infer<typeof BargainProductUpdate>;
export const BargainProductUpdate = z.object({
  targetDivision: z.union([z.literal("1"), z.literal("2"), z.literal("3")]).optional().describe("対象区分 (1:部門、2:商品、3:グループコード)"),
  targetId: z.string().optional().describe("対象ID (部門ID、商品ID、グループコードのいずれか)"),
  division: z.union([z.literal("1"), z.literal("2"), z.literal("3")]).optional().describe("割引区分 (1:割引、2:値引、3:価格指定)"),
  value: z.string().optional().describe("値 (割引率、値引額、または価格)"),
});

export type ProductOptionGroup = z.infer<typeof ProductOptionGroup>;
export const ProductOptionGroup = z.object({
  productOptionGroupId: z.string().describe("オプショングループID"),
  productOptionGroupName: z.string().describe("オプショングループ名"),
  conditionId: z.union([z.literal("0"), z.literal("1"), z.literal("2")]).describe("条件ID (0:条件なし、1:全体、2:部門毎)"),
  max: z.union([z.string(), z.undefined()]).optional().describe("適用条件の上限"),
  min: z.union([z.string(), z.undefined()]).optional().describe("適用条件の下限"),
  syncDivision: z.union([z.string(), z.undefined()]).optional().describe("同期区分"),
  insDateTime: z.union([z.string(), z.undefined()]).optional().describe("登録日時"),
  updDateTime: z.union([z.string(), z.undefined()]).optional().describe("更新日時"),
});

export type ProductOptionGroupCreate = z.infer<typeof ProductOptionGroupCreate>;
export const ProductOptionGroupCreate = z.object({
  productOptionGroupName: z.string().describe("オプショングループ名"),
  conditionId: z.union([z.literal("0"), z.literal("1"), z.literal("2")]).describe("条件ID (0:条件なし、1:全体、2:部門毎)"),
  max: z.union([z.string(), z.undefined()]).optional().describe("適用条件の上限"),
  min: z.union([z.string(), z.undefined()]).optional().describe("適用条件の下限"),
  products: z.array(
    z.object({
      productId: z.string().describe("商品ID"),
    }),
  ),
});

export type ProductOptionGroupUpdate = z.infer<typeof ProductOptionGroupUpdate>;
export const ProductOptionGroupUpdate = z.object({
  productOptionGroupName: z.string().optional().describe("オプショングループ名"),
  conditionId: z.union([z.literal("0"), z.literal("1"), z.literal("2")]).optional().describe("条件ID (0:条件なし、1:全体、2:部門毎)"),
  max: z.string().optional().describe("適用条件の上限"),
  min: z.string().optional().describe("適用条件の下限"),
  products: z
    .array(
      z.object({
        productId: z.string().describe("商品ID"),
      }),
    )
    .optional(),
});

export type Bundle = z.infer<typeof Bundle>;
export const Bundle = z.object({
  productBundleGroupId: z.string().describe("商品バンドルグループID"),
  productBundleGroupName: z.string().describe("商品バンドルグループ名"),
  type: z.union([z.literal("1"), z.literal("2"), z.literal("3"), z.literal("4")]).describe("種類 (1:バンドル売り+販売金額指定、2:バンドル売り+値引金額指定、3:バンドル売り+割引率指定、4:セット売り+販売金額指定)"),
  taxDivision: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.undefined()]).optional().describe("税区分 (0:税込、1:税抜、2:非課税)"),
  reduceTaxId: z.union([z.string(), z.undefined()]).optional().describe(`軽減税率ID
標準:null（または未設定）
軽減:10000001（特定商品の軽減税率適用）
選択[標準]:10000002（状態による適用[適用しない]）
選択[軽減]:10000003（状態による適用[適用する]）
選択[選択]:10000004（状態による適用[都度選択する]）
`),
  quantity: z.union([z.string(), z.undefined()]).optional().describe("数量"),
  value: z.string().describe("種類=1,4の時は販売金額、種類=2の時は値引金額、種類=3の時は割引率"),
  reduceTaxValue: z.union([z.string(), z.undefined()]).optional().describe("軽減税率適用時の値"),
  priority: z.union([z.string(), z.undefined()]).optional().describe("優先順位"),
  termFrom: z.string().describe("適用開始日 [YYYY-MM-DD]"),
  termTo: z.string().describe("適用終了日 [YYYY-MM-DD]"),
  pointNotApplicable: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional().describe("ポイント対象区分 (0:ポイント対象、1:ポイント対象外)"),
  taxFreeDivision: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.undefined()]).optional().describe("免税区分 (0:対象外、1:一般品、2:消耗品)"),
  calcDiscount: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional().describe("値引割引計算対象区分 (0:対象外、1:対象)"),
  insDateTime: z.union([z.string(), z.undefined()]).optional().describe("登録日時"),
  updDateTime: z.union([z.string(), z.undefined()]).optional().describe("更新日時"),
});

export type BundleCreate = z.infer<typeof BundleCreate>;
export const BundleCreate = z.object({
  productBundleGroupName: z.string().describe("商品バンドルグループ名"),
  type: z.union([z.literal("1"), z.literal("2"), z.literal("3"), z.literal("4")]).describe("種類 (1:バンドル売り+販売金額指定、2:バンドル売り+値引金額指定、3:バンドル売り+割引率指定、4:セット売り+販売金額指定)"),
  taxDivision: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.undefined()]).optional().describe("税区分 (0:税込、1:税抜、2:非課税)"),
  reduceTaxId: z.union([z.string(), z.undefined()]).optional().describe(`軽減税率ID
標準:null（または未設定）
軽減:10000001（特定商品の軽減税率適用）
選択[標準]:10000002（状態による適用[適用しない]）
選択[軽減]:10000003（状態による適用[適用する]）
選択[選択]:10000004（状態による適用[都度選択する]）
`),
  quantity: z.union([z.string(), z.undefined()]).optional().describe("数量"),
  value: z.string().describe("種類=1,4の時は販売金額、種類=2の時は値引金額、種類=3の時は割引率"),
  reduceTaxValue: z.union([z.string(), z.undefined()]).optional().describe("軽減税率適用時の値"),
  priority: z.union([z.string(), z.undefined()]).optional().describe("優先順位"),
  termFrom: z.string().describe("適用開始日 [YYYY-MM-DD]"),
  termTo: z.string().describe("適用終了日 [YYYY-MM-DD]"),
  pointNotApplicable: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional().describe("ポイント対象区分 (0:ポイント対象、1:ポイント対象外)"),
  taxFreeDivision: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.undefined()]).optional().describe("免税区分 (0:対象外、1:一般品、2:消耗品)"),
  calcDiscount: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional().describe("値引割引計算対象区分 (0:対象外、1:対象)"),
  products: z.array(
    z.object({
      categoryId: z.string().describe("部門ID"),
      productId: z.string().describe("商品ID"),
      productGroupCode: z.string(),
    }),
  ),
});

export type BundleUpdate = z.infer<typeof BundleUpdate>;
export const BundleUpdate = z.object({
  productBundleGroupName: z.string().optional().describe("商品バンドルグループ名"),
  type: z.union([z.literal("1"), z.literal("2"), z.literal("3"), z.literal("4")]).optional().describe("種類 (1:バンドル売り+販売金額指定、2:バンドル売り+値引金額指定、3:バンドル売り+割引率指定、4:セット売り+販売金額指定)"),
  taxDivision: z.union([z.literal("0"), z.literal("1"), z.literal("2")]).optional().describe("税区分 (0:税込、1:税抜、2:非課税)"),
  reduceTaxId: z.string().optional().describe(`軽減税率ID
標準:null（または未設定）
軽減:10000001（特定商品の軽減税率適用）
選択[標準]:10000002（状態による適用[適用しない]）
選択[軽減]:10000003（状態による適用[適用する]）
選択[選択]:10000004（状態による適用[都度選択する]）
`),
  quantity: z.string().optional().describe("数量"),
  value: z.string().optional().describe("種類=1,4の時は販売金額、種類=2の時は値引金額、種類=3の時は割引率"),
  reduceTaxValue: z.string().optional().describe("軽減税率適用時の値"),
  priority: z.string().optional().describe("優先順位"),
  termFrom: z.string().optional().describe("適用開始日 [YYYY-MM-DD]"),
  termTo: z.string().optional().describe("適用終了日 [YYYY-MM-DD]"),
  pointNotApplicable: z.union([z.literal("0"), z.literal("1")]).optional().describe("ポイント対象区分 (0:ポイント対象、1:ポイント対象外)"),
  taxFreeDivision: z.union([z.literal("0"), z.literal("1"), z.literal("2")]).optional().describe("免税区分 (0:対象外、1:一般品、2:消耗品)"),
  calcDiscount: z.union([z.literal("0"), z.literal("1")]).optional().describe("値引割引計算対象区分 (0:対象外、1:対象)"),
  products: z
    .array(
      z.object({
        categoryId: z.string().optional().describe("部門ID"),
        productId: z.string().optional().describe("商品ID"),
        productGroupCode: z.string().optional(),
      }),
    )
    .optional(),
});

export type BundleProduct = z.infer<typeof BundleProduct>;
export const BundleProduct = z.object({
  bundleProductId: z.string().describe("バンドル販売商品ID"),
  productBundleGroupId: z.string().describe("商品バンドルグループID"),
  categoryId: z.union([z.string(), z.undefined()]).optional().describe("部門ID"),
  productId: z.union([z.string(), z.undefined()]).optional().describe("商品ID"),
  productGroupCode: z.union([z.string(), z.undefined()]).optional().describe("商品グループコード"),
  insDateTime: z.union([z.string(), z.undefined()]).optional().describe("登録日時"),
  updDateTime: z.union([z.string(), z.undefined()]).optional().describe("更新日時"),
});

export type Store = z.infer<typeof Store>;
export const Store = z.object({
  storeId: z.string().describe("店舗ID"),
  storeName: z.string().describe("店舗名"),
  storeAbbr: z.union([z.string(), z.undefined()]).optional().describe("店舗名略称"),
  storeCode: z.union([z.string(), z.undefined()]).optional().describe("店舗コード"),
  storeDivision: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional().describe("店舗区分 (0:通常店舗、1:倉庫)"),
  postalCode: z.union([z.string(), z.undefined()]).optional().describe("郵便番号"),
  address: z.union([z.string(), z.undefined()]).optional().describe("住所"),
  phoneNumber: z.union([z.string(), z.undefined()]).optional().describe("電話番号"),
  faxNumber: z.union([z.string(), z.undefined()]).optional().describe("FAX番号"),
  mailAddress: z.union([z.string(), z.undefined()]).optional().describe("メールアドレス"),
  openingTime: z.union([z.string(), z.undefined()]).optional().describe("営業開始時間"),
  closingTime: z.union([z.string(), z.undefined()]).optional().describe("営業終了時間"),
  regularHoliday: z.union([z.string(), z.undefined()]).optional().describe("定休日"),
  url: z.union([z.string(), z.undefined()]).optional().describe("URL"),
  insDateTime: z.union([z.string(), z.undefined()]).optional().describe("登録日時"),
  updDateTime: z.union([z.string(), z.undefined()]).optional().describe("更新日時"),
}).describe("店舗情報");

export type StoreCreate = z.infer<typeof StoreCreate>;
export const StoreCreate = z.object({
  storeName: z.string().describe("店舗名"),
  storeAbbr: z.union([z.string(), z.undefined()]).optional().describe("店舗名略称"),
  storeCode: z.union([z.string(), z.undefined()]).optional().describe("店舗コード"),
  storeDivision: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional().describe("店舗区分 (0:通常店舗、1:倉庫)"),
  postalCode: z.union([z.string(), z.undefined()]).optional().describe("郵便番号"),
  address: z.union([z.string(), z.undefined()]).optional().describe("住所"),
  phoneNumber: z.union([z.string(), z.undefined()]).optional().describe("電話番号"),
  faxNumber: z.union([z.string(), z.undefined()]).optional().describe("FAX番号"),
  mailAddress: z.union([z.string(), z.undefined()]).optional().describe("メールアドレス"),
  openingTime: z.union([z.string(), z.undefined()]).optional().describe("営業開始時間"),
  closingTime: z.union([z.string(), z.undefined()]).optional().describe("営業終了時間"),
  regularHoliday: z.union([z.string(), z.undefined()]).optional().describe("定休日"),
  url: z.union([z.string(), z.undefined()]).optional().describe("URL"),
}).describe("店舗情報の登録用データ");

export type StoreUpdate = z.infer<typeof StoreUpdate>;
export const StoreUpdate = z.object({
  storeName: z.string().optional().describe("店舗名"),
  storeAbbr: z.string().optional().describe("店舗名略称"),
  storeCode: z.string().optional().describe("店舗コード"),
  storeDivision: z.union([z.literal("0"), z.literal("1")]).optional().describe("店舗区分 (0:通常店舗、1:倉庫)"),
  postalCode: z.string().optional().describe("郵便番号"),
  address: z.string().optional().describe("住所"),
  phoneNumber: z.string().optional().describe("電話番号"),
  faxNumber: z.string().optional().describe("FAX番号"),
  mailAddress: z.string().optional().describe("メールアドレス"),
  openingTime: z.string().optional().describe("営業開始時間"),
  closingTime: z.string().optional().describe("営業終了時間"),
  regularHoliday: z.string().optional().describe("定休日"),
  url: z.string().optional().describe("URL"),
}).describe("店舗情報の更新用データ");

export type StoreGroup = z.infer<typeof StoreGroup>;
export const StoreGroup = z.object({
  storeGroupId: z.string().describe("店舗分類ID"),
  storeGroupName: z.string().describe("店舗分類名"),
  insDateTime: z.union([z.string(), z.undefined()]).optional().describe("登録日時"),
  updDateTime: z.union([z.string(), z.undefined()]).optional().describe("更新日時"),
}).describe("店舗グループ情報");

export type StoreGroupCreate = z.infer<typeof StoreGroupCreate>;
export const StoreGroupCreate = z.object({
  storeGroupName: z.string().describe("店舗分類名"),
}).describe("店舗グループ情報の登録用データ");

export type StoreGroupUpdate = z.infer<typeof StoreGroupUpdate>;
export const StoreGroupUpdate = z.object({
  storeGroupName: z.string().optional().describe("店舗分類名"),
}).describe("店舗グループ情報の更新用データ");

export type StoreGroupItem = z.infer<typeof StoreGroupItem>;
export const StoreGroupItem = z.object({
  storeGroupItemId: z.string().describe("店舗分類項目ID"),
  storeGroupId: z.string().describe("店舗分類ID"),
  storeId: z.string().describe("店舗ID"),
  insDateTime: z.union([z.string(), z.undefined()]).optional().describe("登録日時"),
  updDateTime: z.union([z.string(), z.undefined()]).optional().describe("更新日時"),
});

export type StoreGroupItemCreate = z.infer<typeof StoreGroupItemCreate>;
export const StoreGroupItemCreate = z.object({
  storeGroupId: z.string().describe("店舗分類ID"),
  storeId: z.string().describe("店舗ID"),
});

export type StoreGroupItemUpdate = z.infer<typeof StoreGroupItemUpdate>;
export const StoreGroupItemUpdate = z.object({
  storeGroupId: z.string().optional().describe("店舗分類ID"),
  storeId: z.string().optional().describe("店舗ID"),
});

export type Staff = z.infer<typeof Staff>;
export const Staff = z.object({
  staffId: z.string().optional().describe("スタッフID"),
  staffCode: z.string().optional().describe("スタッフコード"),
  firstName: z.string().optional().describe("名前"),
  lastName: z.string().optional().describe("苗字"),
  firstNameKana: z.string().optional().describe("名前カナ"),
  lastNameKana: z.string().optional().describe("苗字カナ"),
  tel: z.string().optional().describe("電話番号"),
  mobilePhone: z.string().optional().describe("携帯電話番号"),
  mail: z.string().optional().describe("メールアドレス"),
  zipCode: z.string().optional().describe("郵便番号"),
  address: z.string().optional().describe("住所"),
  password: z.string().optional().describe("パスワード（取得時は返却されません）"),
  staffAuthorization: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.literal("3")]).optional().describe("権限(0:なし, 1:店舗管理者, 2:店舗スタッフ, 3:システム管理者)"),
  salePassword: z.string().optional().describe("販売パスワード（取得時は返却されません）"),
  startAtHourOfDay: z.string().optional().describe("稼働開始時間（HH:mm）"),
  endAtHourOfDay: z.string().optional().describe("稼働終了時間（HH:mm）"),
  storeIds: z.array(z.string()).optional().describe("所属店舗IDリスト"),
  roleIds: z.array(z.string()).optional().describe("役割IDリスト"),
  status: z.union([z.literal("1"), z.literal("2")]).optional().describe("ステータス(1:有効, 2:無効)"),
  insDateTime: z.string().optional().describe("登録日時"),
  updDateTime: z.string().optional().describe("更新日時"),
}).describe("スタッフ情報");

export type Role = z.infer<typeof Role>;
export const Role = z.object({
  roleId: z.string().optional().describe("役割ID"),
  roleName: z.string().optional().describe("役割名"),
  permissions: z
    .array(
      z.object({
        permissionId: z.string().optional().describe("権限ID"),
        permissionName: z.string().optional(),
        value: z.union([z.literal(0), z.literal(1)]).optional(),
      }),
    )
    .optional(),
  note: z.string().optional().describe("備考"),
  insDateTime: z.string().optional().describe("登録日時"),
  updDateTime: z.string().optional().describe("更新日時"),
});

export type RoleCreate = z.infer<typeof RoleCreate>;
export const RoleCreate = z.object({
  roleName: z.string().describe("役割名"),
  permissions: z.array(
    z.object({
      permissionId: z.string().describe("権限ID"),
      value: z.union([z.literal(0), z.literal(1)]),
    }),
  ),
  note: z.union([z.string(), z.undefined()]).optional().describe("備考"),
});

export type RoleUpdate = z.infer<typeof RoleUpdate>;
export const RoleUpdate = z.object({
  roleName: z.string().optional().describe("役割名"),
  permissions: z
    .array(
      z.object({
        permissionId: z.string().describe("権限ID"),
        value: z.union([z.literal(0), z.literal(1)]),
      }),
    )
    .optional(),
  note: z.string().optional().describe("備考"),
});

export type MonthlyBudget = z.infer<typeof MonthlyBudget>;
export const MonthlyBudget = z.object({
  budgetId: z.string().optional().describe("予算ID"),
  storeId: z.string().optional().describe("店舗ID"),
  storeName: z.string().optional().describe("店舗名"),
  yearMonth: z.string().optional().describe("年月（YYYY-MM形式）"),
  salesBudget: z.number().optional().describe("売上予算"),
  salesTaxBudget: z.number().optional().describe("売上税予算"),
  customerCountBudget: z.number().optional().describe("客数予算"),
  averageCustomerPriceBudget: z.number().optional().describe("客単価予算"),
  grossProfitBudget: z.number().optional().describe("粗利益予算"),
  grossProfitRatioBudget: z.number().optional().describe("粗利益率予算"),
  creditPointBudget: z.number().optional().describe("ポイント付与予算"),
  discountBudget: z.number().optional().describe("値引予算"),
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
  insDateTime: z.string().optional().describe("登録日時"),
  updDateTime: z.string().optional().describe("更新日時"),
});

export type DailyBudget = z.infer<typeof DailyBudget>;
export const DailyBudget = z.object({
  budgetId: z.string().optional().describe("予算ID"),
  storeId: z.string().optional().describe("店舗ID"),
  storeName: z.string().optional().describe("店舗名"),
  date: z.string().optional().describe("日付"),
  salesBudget: z.number().optional().describe("売上予算"),
  salesTaxBudget: z.number().optional().describe("売上税予算"),
  customerCountBudget: z.number().optional().describe("客数予算"),
  averageCustomerPriceBudget: z.number().optional().describe("客単価予算"),
  grossProfitBudget: z.number().optional().describe("粗利益予算"),
  grossProfitRatioBudget: z.number().optional().describe("粗利益率予算"),
  creditPointBudget: z.number().optional().describe("ポイント付与予算"),
  discountBudget: z.number().optional().describe("値引予算"),
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
  insDateTime: z.string().optional().describe("登録日時"),
  updDateTime: z.string().optional().describe("更新日時"),
});

export type DailyBudgetCreate = z.infer<typeof DailyBudgetCreate>;
export const DailyBudgetCreate = z.object({
  storeId: z.string().describe("店舗ID"),
  date: z.string().describe("日付"),
  salesBudget: z.union([z.number(), z.undefined()]).optional().describe("売上予算"),
  salesTaxBudget: z.union([z.number(), z.undefined()]).optional().describe("売上税予算"),
  customerCountBudget: z.union([z.number(), z.undefined()]).optional().describe("客数予算"),
  averageCustomerPriceBudget: z.union([z.number(), z.undefined()]).optional().describe("客単価予算"),
  grossProfitBudget: z.union([z.number(), z.undefined()]).optional().describe("粗利益予算"),
  grossProfitRatioBudget: z.union([z.number(), z.undefined()]).optional().describe("粗利益率予算"),
  creditPointBudget: z.union([z.number(), z.undefined()]).optional().describe("ポイント付与予算"),
  discountBudget: z.union([z.number(), z.undefined()]).optional().describe("値引予算"),
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
  salesBudget: z.number().optional().describe("売上予算"),
  salesTaxBudget: z.number().optional().describe("売上税予算"),
  customerCountBudget: z.number().optional().describe("客数予算"),
  averageCustomerPriceBudget: z.number().optional().describe("客単価予算"),
  grossProfitBudget: z.number().optional().describe("粗利益予算"),
  grossProfitRatioBudget: z.number().optional().describe("粗利益率予算"),
  creditPointBudget: z.number().optional().describe("ポイント付与予算"),
  discountBudget: z.number().optional().describe("値引予算"),
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
  budgetId: z.string().optional().describe("予算ID"),
  storeId: z.string().optional().describe("店舗ID"),
  storeName: z.string().optional().describe("店舗名"),
  staffId: z.string().optional().describe("スタッフID"),
  staffName: z.string().optional().describe("スタッフ名"),
  yearMonth: z.string().optional().describe("年月（YYYY-MM形式）"),
  salesBudget: z.number().optional().describe("売上予算"),
  customerCountBudget: z.number().optional().describe("客数予算"),
  averageCustomerPriceBudget: z.number().optional().describe("客単価予算"),
  insDateTime: z.string().optional().describe("登録日時"),
  updDateTime: z.string().optional().describe("更新日時"),
});

export type StaffBudgetCreate = z.infer<typeof StaffBudgetCreate>;
export const StaffBudgetCreate = z.object({
  storeId: z.string().describe("店舗ID"),
  staffId: z.string().describe("スタッフID"),
  yearMonth: z.string().describe("年月（YYYY-MM形式）"),
  salesBudget: z.union([z.number(), z.undefined()]).optional().describe("売上予算"),
  customerCountBudget: z.union([z.number(), z.undefined()]).optional().describe("客数予算"),
  averageCustomerPriceBudget: z.union([z.number(), z.undefined()]).optional().describe("客単価予算"),
});

export type StaffBudgetUpdate = z.infer<typeof StaffBudgetUpdate>;
export const StaffBudgetUpdate = z.object({
  salesBudget: z.number().optional().describe("売上予算"),
  customerCountBudget: z.number().optional().describe("客数予算"),
  averageCustomerPriceBudget: z.number().optional().describe("客単価予算"),
});

export type Supplier = z.infer<typeof Supplier>;
export const Supplier = z.object({
  supplierId: z.string().optional().describe("仕入先ID"),
  supplierCode: z.string().optional().describe("仕入先コード"),
  supplierName: z.string().optional().describe("仕入先名"),
  supplierAbbr: z.string().optional().describe("仕入先略称"),
  supplierDivisionId: z.string().optional().describe("仕入先区分ID"),
  supplierDivisionName: z.string().optional().describe("仕入先区分名"),
  zipCode: z.string().optional().describe("郵便番号"),
  address: z.string().optional().describe("住所"),
  phoneNumber: z.string().optional().describe("電話番号"),
  faxNumber: z.string().optional().describe("FAX番号"),
  mailAddress: z.string().optional().describe("メールアドレス"),
  contactPersonName: z.string().optional().describe("担当者名"),
  note: z.string().optional().describe("備考"),
  status: z.union([z.literal("0"), z.literal("1")]).optional().describe("ステータス(0:無効, 1:有効)"),
  insDateTime: z.string().optional().describe("登録日時"),
  updDateTime: z.string().optional().describe("更新日時"),
});

export type SupplierCreate = z.infer<typeof SupplierCreate>;
export const SupplierCreate = z.object({
  supplierCode: z.string().describe("仕入先コード"),
  supplierName: z.string().describe("仕入先名"),
  supplierAbbr: z.union([z.string(), z.undefined()]).optional().describe("仕入先略称"),
  supplierDivisionId: z.union([z.string(), z.undefined()]).optional().describe("仕入先区分ID"),
  zipCode: z.union([z.string(), z.undefined()]).optional().describe("郵便番号"),
  address: z.union([z.string(), z.undefined()]).optional().describe("住所"),
  phoneNumber: z.union([z.string(), z.undefined()]).optional().describe("電話番号"),
  faxNumber: z.union([z.string(), z.undefined()]).optional().describe("FAX番号"),
  mailAddress: z.union([z.string(), z.undefined()]).optional().describe("メールアドレス"),
  contactPersonName: z.union([z.string(), z.undefined()]).optional().describe("担当者名"),
  note: z.union([z.string(), z.undefined()]).optional().describe("備考"),
  status: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional().describe("ステータス(0:無効, 1:有効)"),
});

export type SupplierUpdate = z.infer<typeof SupplierUpdate>;
export const SupplierUpdate = z.object({
  supplierCode: z.string().optional().describe("仕入先コード"),
  supplierName: z.string().optional().describe("仕入先名"),
  supplierAbbr: z.string().optional().describe("仕入先略称"),
  supplierDivisionId: z.string().optional().describe("仕入先区分ID"),
  zipCode: z.string().optional().describe("郵便番号"),
  address: z.string().optional().describe("住所"),
  phoneNumber: z.string().optional().describe("電話番号"),
  faxNumber: z.string().optional().describe("FAX番号"),
  mailAddress: z.string().optional().describe("メールアドレス"),
  contactPersonName: z.string().optional().describe("担当者名"),
  note: z.string().optional().describe("備考"),
  status: z.union([z.literal("0"), z.literal("1")]).optional().describe("ステータス(0:無効, 1:有効)"),
});

export type SupplierProduct = z.infer<typeof SupplierProduct>;
export const SupplierProduct = z.object({
  supplierProductId: z.string().optional().describe("仕入先商品ID"),
  supplierId: z.string().optional().describe("仕入先ID"),
  supplierName: z.string().optional().describe("仕入先名"),
  productId: z.string().optional().describe("商品ID"),
  productCode: z.string().optional().describe("商品コード"),
  productName: z.string().optional().describe("商品名"),
  supplierProductCode: z.string().optional().describe("仕入先商品コード"),
  supplierProductName: z.string().optional().describe("仕入先商品名"),
  costPrice: z.number().optional().describe("原価"),
  orderPoint: z.number().optional().describe("発注点"),
  orderLot: z.number().optional().describe("発注ロット"),
  leadTime: z.number().optional().describe("リードタイム（日数）"),
  status: z.union([z.literal("0"), z.literal("1")]).optional().describe("ステータス(0:無効, 1:有効)"),
  insDateTime: z.string().optional().describe("登録日時"),
  updDateTime: z.string().optional().describe("更新日時"),
});

export type SupplierProductCreate = z.infer<typeof SupplierProductCreate>;
export const SupplierProductCreate = z.object({
  productId: z.string().describe("商品ID"),
  supplierProductCode: z.union([z.string(), z.undefined()]).optional().describe("仕入先商品コード"),
  supplierProductName: z.union([z.string(), z.undefined()]).optional().describe("仕入先商品名"),
  costPrice: z.union([z.number(), z.undefined()]).optional().describe("原価"),
  orderPoint: z.union([z.number(), z.undefined()]).optional().describe("発注点"),
  orderLot: z.union([z.number(), z.undefined()]).optional().describe("発注ロット"),
  leadTime: z.union([z.number(), z.undefined()]).optional().describe("リードタイム（日数）"),
  status: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional().describe("ステータス(0:無効, 1:有効)"),
});

export type SupplierDivision = z.infer<typeof SupplierDivision>;
export const SupplierDivision = z.object({
  supplierDivisionId: z.string().optional().describe("仕入先区分ID"),
  supplierDivisionName: z.string().optional().describe("仕入先区分名"),
  insDateTime: z.string().optional().describe("登録日時"),
  updDateTime: z.string().optional().describe("更新日時"),
});

export type SupplierDivisionCreate = z.infer<typeof SupplierDivisionCreate>;
export const SupplierDivisionCreate = z.object({
  supplierDivisionName: z.string().describe("仕入先区分名"),
});

export type SupplierDivisionUpdate = z.infer<typeof SupplierDivisionUpdate>;
export const SupplierDivisionUpdate = z.object({
  supplierDivisionName: z.string().optional().describe("仕入先区分名"),
});

export type Terminal = z.infer<typeof Terminal>;
export const Terminal = z.object({
  terminalId: z.string().optional().describe("レジ端末ID"),
  terminalCode: z.string().optional().describe("レジ端末コード"),
  terminalName: z.string().optional().describe("レジ端末名"),
  storeId: z.string().optional().describe("店舗ID"),
  storeName: z.string().optional().describe("店舗名"),
  terminalType: z.union([z.literal("1"), z.literal("2"), z.literal("3")]).optional().describe("レジ端末種別(1:PC, 2:iPad, 3:ハンディ)"),
  printerType: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.literal("3")]).optional().describe("プリンタ種別(0:なし, 1:ロール紙, 2:A4, 3:サーマル)"),
  printerName: z.string().optional().describe("プリンタ名"),
  printerIPAddress: z.string().optional().describe("プリンタIPアドレス"),
  printerPort: z.string().optional().describe("プリンタポート"),
  drawerType: z.union([z.literal("0"), z.literal("1")]).optional().describe("ドロア種別(0:なし, 1:あり)"),
  drawerName: z.string().optional().describe("ドロア名"),
  drawerIPAddress: z.string().optional().describe("ドロアIPアドレス"),
  drawerPort: z.string().optional().describe("ドロアポート"),
  cardReaderType: z.union([z.literal("0"), z.literal("1"), z.literal("2")]).optional().describe("カードリーダー種別(0:なし, 1:磁気, 2:IC)"),
  cardReaderName: z.string().optional().describe("カードリーダー名"),
  cardReaderIPAddress: z.string().optional().describe("カードリーダーIPアドレス"),
  cardReaderPort: z.string().optional().describe("カードリーダーポート"),
  scannerType: z.union([z.literal("0"), z.literal("1")]).optional().describe("スキャナー種別(0:なし, 1:あり)"),
  scannerName: z.string().optional().describe("スキャナー名"),
  scannerIPAddress: z.string().optional().describe("スキャナーIPアドレス"),
  scannerPort: z.string().optional().describe("スキャナーポート"),
  displayType: z.union([z.literal("0"), z.literal("1")]).optional().describe("客面ディスプレイ種別(0:なし, 1:あり)"),
  displayName: z.string().optional().describe("客面ディスプレイ名"),
  displayIPAddress: z.string().optional().describe("客面ディスプレイIPアドレス"),
  displayPort: z.string().optional().describe("客面ディスプレイポート"),
  status: z.union([z.literal("0"), z.literal("1")]).optional().describe("ステータス(0:無効, 1:有効)"),
  insDateTime: z.string().optional().describe("登録日時"),
  updDateTime: z.string().optional().describe("更新日時"),
});

export type TerminalCreate = z.infer<typeof TerminalCreate>;
export const TerminalCreate = z.object({
  terminalCode: z.string().describe("レジ端末コード"),
  terminalName: z.string().describe("レジ端末名"),
  storeId: z.string().describe("店舗ID"),
  terminalType: z.union([z.literal("1"), z.literal("2"), z.literal("3"), z.undefined()]).optional().describe("レジ端末種別(1:PC, 2:iPad, 3:ハンディ)"),
  printerType: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.literal("3"), z.undefined()]).optional().describe("プリンタ種別(0:なし, 1:ロール紙, 2:A4, 3:サーマル)"),
  printerName: z.union([z.string(), z.undefined()]).optional().describe("プリンタ名"),
  printerIPAddress: z.union([z.string(), z.undefined()]).optional().describe("プリンタIPアドレス"),
  printerPort: z.union([z.string(), z.undefined()]).optional().describe("プリンタポート"),
  drawerType: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional().describe("ドロア種別(0:なし, 1:あり)"),
  drawerName: z.union([z.string(), z.undefined()]).optional().describe("ドロア名"),
  drawerIPAddress: z.union([z.string(), z.undefined()]).optional().describe("ドロアIPアドレス"),
  drawerPort: z.union([z.string(), z.undefined()]).optional().describe("ドロアポート"),
  cardReaderType: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.undefined()]).optional().describe("カードリーダー種別(0:なし, 1:磁気, 2:IC)"),
  cardReaderName: z.union([z.string(), z.undefined()]).optional().describe("カードリーダー名"),
  cardReaderIPAddress: z.union([z.string(), z.undefined()]).optional().describe("カードリーダーIPアドレス"),
  cardReaderPort: z.union([z.string(), z.undefined()]).optional().describe("カードリーダーポート"),
  scannerType: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional().describe("スキャナー種別(0:なし, 1:あり)"),
  scannerName: z.union([z.string(), z.undefined()]).optional().describe("スキャナー名"),
  scannerIPAddress: z.union([z.string(), z.undefined()]).optional().describe("スキャナーIPアドレス"),
  scannerPort: z.union([z.string(), z.undefined()]).optional().describe("スキャナーポート"),
  displayType: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional().describe("客面ディスプレイ種別(0:なし, 1:あり)"),
  displayName: z.union([z.string(), z.undefined()]).optional().describe("客面ディスプレイ名"),
  displayIPAddress: z.union([z.string(), z.undefined()]).optional().describe("客面ディスプレイIPアドレス"),
  displayPort: z.union([z.string(), z.undefined()]).optional().describe("客面ディスプレイポート"),
  status: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional().describe("ステータス(0:無効, 1:有効)"),
});

export type TerminalUpdate = z.infer<typeof TerminalUpdate>;
export const TerminalUpdate = z.object({
  terminalCode: z.string().optional().describe("レジ端末コード"),
  terminalName: z.string().optional().describe("レジ端末名"),
  storeId: z.string().optional().describe("店舗ID"),
  terminalType: z.union([z.literal("1"), z.literal("2"), z.literal("3")]).optional().describe("レジ端末種別(1:PC, 2:iPad, 3:ハンディ)"),
  printerType: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.literal("3")]).optional().describe("プリンタ種別(0:なし, 1:ロール紙, 2:A4, 3:サーマル)"),
  printerName: z.string().optional().describe("プリンタ名"),
  printerIPAddress: z.string().optional().describe("プリンタIPアドレス"),
  printerPort: z.string().optional().describe("プリンタポート"),
  drawerType: z.union([z.literal("0"), z.literal("1")]).optional().describe("ドロア種別(0:なし, 1:あり)"),
  drawerName: z.string().optional().describe("ドロア名"),
  drawerIPAddress: z.string().optional().describe("ドロアIPアドレス"),
  drawerPort: z.string().optional().describe("ドロアポート"),
  cardReaderType: z.union([z.literal("0"), z.literal("1"), z.literal("2")]).optional().describe("カードリーダー種別(0:なし, 1:磁気, 2:IC)"),
  cardReaderName: z.string().optional().describe("カードリーダー名"),
  cardReaderIPAddress: z.string().optional().describe("カードリーダーIPアドレス"),
  cardReaderPort: z.string().optional().describe("カードリーダーポート"),
  scannerType: z.union([z.literal("0"), z.literal("1")]).optional().describe("スキャナー種別(0:なし, 1:あり)"),
  scannerName: z.string().optional().describe("スキャナー名"),
  scannerIPAddress: z.string().optional().describe("スキャナーIPアドレス"),
  scannerPort: z.string().optional().describe("スキャナーポート"),
  displayType: z.union([z.literal("0"), z.literal("1")]).optional().describe("客面ディスプレイ種別(0:なし, 1:あり)"),
  displayName: z.string().optional().describe("客面ディスプレイ名"),
  displayIPAddress: z.string().optional().describe("客面ディスプレイIPアドレス"),
  displayPort: z.string().optional().describe("客面ディスプレイポート"),
  status: z.union([z.literal("0"), z.literal("1")]).optional().describe("ステータス(0:無効, 1:有効)"),
});

export type Settlement = z.infer<typeof Settlement>;
export const Settlement = z.object({
  settlementId: z.string().optional().describe("精算ID"),
  settlementNo: z.string().optional().describe("精算番号"),
  storeId: z.string().optional().describe("店舗ID"),
  storeName: z.string().optional().describe("店舗名"),
  terminalId: z.string().optional().describe("端末ID"),
  terminalName: z.string().optional().describe("端末名"),
  staffId: z.string().optional().describe("スタッフID"),
  staffName: z.string().optional().describe("スタッフ名"),
  settlementDateTime: z.string().optional().describe("精算日時"),
  openingDateTime: z.string().optional().describe("レジ開始日時"),
  closingDateTime: z.string().optional().describe("レジ締め日時"),
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
        paymentMethodId: z.string().optional().describe("支払方法ID"),
        paymentMethodName: z.string().optional().describe("支払方法名（部分一致）"),
        amount: z.number().optional(),
        count: z.number().optional(),
      }),
    )
    .optional(),
  insDateTime: z.string().optional().describe("登録日時"),
  updDateTime: z.string().optional().describe("更新日時"),
});

export type SettlementCreate = z.infer<typeof SettlementCreate>;
export const SettlementCreate = z.object({
  storeId: z.string().describe("店舗ID"),
  terminalId: z.string().describe("端末ID"),
  staffId: z.string().describe("スタッフID"),
  settlementDateTime: z.union([z.string(), z.undefined()]).optional().describe("精算日時"),
  openingDateTime: z.string().describe("レジ開始日時"),
  closingDateTime: z.string().describe("レジ締め日時"),
  summary: z.object({
    salesTotal: z.number(),
    returnTotal: z.number(),
    discountTotal: z.number(),
    transactionCount: z.number(),
    customerCount: z.number(),
  }),
  payments: z.array(
    z.object({
      paymentMethodId: z.string().describe("支払方法ID"),
      amount: z.number(),
      count: z.number(),
    }),
  ),
});

export type DailySettlement = z.infer<typeof DailySettlement>;
export const DailySettlement = z.object({
  dailySettlementId: z.string().optional().describe("日次締めID"),
  storeId: z.string().optional().describe("店舗ID"),
  storeName: z.string().optional().describe("店舗名"),
  businessDate: z.string().optional().describe("営業日"),
  closingDate: z.string().optional().describe("締め日"),
  closingDateTime: z.string().optional().describe("締め日時"),
  staffId: z.string().optional().describe("スタッフID"),
  staffName: z.string().optional().describe("スタッフ名"),
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
        paymentMethodId: z.string().optional().describe("支払方法ID"),
        paymentMethodName: z.string().optional().describe("支払方法名（部分一致）"),
        amount: z.number().optional(),
        count: z.number().optional(),
      }),
    )
    .optional(),
  status: z.union([z.literal("0"), z.literal("1")]).optional().describe("ステータス(0:未確定, 1:確定)"),
  insDateTime: z.string().optional().describe("登録日時"),
  updDateTime: z.string().optional().describe("更新日時"),
});

export type DailySettlementCreate = z.infer<typeof DailySettlementCreate>;
export const DailySettlementCreate = z.object({
  storeId: z.string().describe("店舗ID"),
  businessDate: z.string().describe("営業日"),
  closingDate: z.string().describe("締め日"),
  closingDateTime: z.union([z.string(), z.undefined()]).optional().describe("締め日時"),
  staffId: z.string().describe("スタッフID"),
  summary: z.object({
    salesTotal: z.number(),
    returnTotal: z.number(),
    discountTotal: z.number(),
    transactionCount: z.number(),
    customerCount: z.number(),
  }),
  payments: z.array(
    z.object({
      paymentMethodId: z.string().describe("支払方法ID"),
      amount: z.number(),
      count: z.number(),
    }),
  ),
  status: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional().describe("ステータス(0:未確定, 1:確定)"),
});

export type PaymentMethod = z.infer<typeof PaymentMethod>;
export const PaymentMethod = z.object({
  paymentMethodId: z.string().optional().describe("支払方法ID"),
  paymentMethodCode: z.string().optional().describe("支払方法コード"),
  paymentMethodName: z.string().optional().describe("支払方法名"),
  paymentMethodDivisionId: z.string().optional().describe("支払方法区分ID"),
  paymentMethodDivisionName: z.string().optional().describe("支払方法区分名"),
  amountInputType: z.union([z.literal("0"), z.literal("1"), z.literal("2")]).optional().describe("金額入力タイプ(0:不要, 1:任意, 2:必須)"),
  changeType: z.union([z.literal("0"), z.literal("1"), z.literal("2")]).optional().describe("お釣り対応タイプ(0:不可, 1:可, 2:自動計算)"),
  sortNo: z.number().optional().describe("表示順"),
  status: z.union([z.literal("0"), z.literal("1")]).optional().describe("ステータス(0:無効, 1:有効)"),
  insDateTime: z.string().optional().describe("登録日時"),
  updDateTime: z.string().optional().describe("更新日時"),
});

export type PaymentMethodCreate = z.infer<typeof PaymentMethodCreate>;
export const PaymentMethodCreate = z.object({
  paymentMethodCode: z.string().describe("支払方法コード"),
  paymentMethodName: z.string().describe("支払方法名"),
  paymentMethodDivisionId: z.string().describe("支払方法区分ID"),
  amountInputType: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.undefined()]).optional().describe("金額入力タイプ(0:不要, 1:任意, 2:必須)"),
  changeType: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.undefined()]).optional().describe("お釣り対応タイプ(0:不可, 1:可, 2:自動計算)"),
  sortNo: z.union([z.number(), z.undefined()]).optional().describe("表示順"),
  status: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional().describe("ステータス(0:無効, 1:有効)"),
});

export type PaymentMethodUpdate = z.infer<typeof PaymentMethodUpdate>;
export const PaymentMethodUpdate = z.object({
  paymentMethodCode: z.string().optional().describe("支払方法コード"),
  paymentMethodName: z.string().optional().describe("支払方法名"),
  paymentMethodDivisionId: z.string().optional().describe("支払方法区分ID"),
  amountInputType: z.union([z.literal("0"), z.literal("1"), z.literal("2")]).optional().describe("金額入力タイプ(0:不要, 1:任意, 2:必須)"),
  changeType: z.union([z.literal("0"), z.literal("1"), z.literal("2")]).optional().describe("お釣り対応タイプ(0:不可, 1:可, 2:自動計算)"),
  sortNo: z.number().optional().describe("表示順"),
  status: z.union([z.literal("0"), z.literal("1")]).optional().describe("ステータス(0:無効, 1:有効)"),
});

export type StorePaymentMethod = z.infer<typeof StorePaymentMethod>;
export const StorePaymentMethod = z.object({
  storePaymentMethodId: z.string().optional().describe("店舗支払方法ID"),
  storeId: z.string().optional().describe("店舗ID"),
  storeName: z.string().optional().describe("店舗名"),
  paymentMethodId: z.string().optional().describe("支払方法ID"),
  paymentMethodName: z.string().optional().describe("支払方法名"),
  status: z.union([z.literal("0"), z.literal("1")]).optional().describe("ステータス(0:無効, 1:有効)"),
  insDateTime: z.string().optional().describe("登録日時"),
  updDateTime: z.string().optional().describe("更新日時"),
});

export type PaymentMethodDivision = z.infer<typeof PaymentMethodDivision>;
export const PaymentMethodDivision = z.object({
  paymentMethodDivisionId: z.string().optional().describe("支払方法区分ID"),
  paymentMethodDivisionName: z.string().optional().describe("支払方法区分名"),
  insDateTime: z.string().optional().describe("登録日時"),
  updDateTime: z.string().optional().describe("更新日時"),
});

export type PaymentMethodDivisionCreate = z.infer<typeof PaymentMethodDivisionCreate>;
export const PaymentMethodDivisionCreate = z.object({
  paymentMethodDivisionName: z.string().describe("支払方法区分名"),
});

export type PaymentMethodDivisionUpdate = z.infer<typeof PaymentMethodDivisionUpdate>;
export const PaymentMethodDivisionUpdate = z.object({
  paymentMethodDivisionName: z.string().optional().describe("支払方法区分名"),
});

export type AppPaymentMethod = z.infer<typeof AppPaymentMethod>;
export const AppPaymentMethod = z.object({
  appPaymentMethodId: z.string().optional().describe("アプリ連携支払方法ID"),
  appId: z.string().optional().describe("アプリID"),
  appName: z.string().optional().describe("アプリ名"),
  paymentMethodId: z.string().optional().describe("支払方法ID"),
  paymentMethodName: z.string().optional().describe("支払方法名"),
  appPaymentCode: z.string().optional().describe("アプリ連携用支払コード"),
  status: z.union([z.literal("0"), z.literal("1")]).optional().describe("ステータス(0:無効, 1:有効)"),
  insDateTime: z.string().optional().describe("登録日時"),
  updDateTime: z.string().optional().describe("更新日時"),
});

export type AppPaymentMethodCreate = z.infer<typeof AppPaymentMethodCreate>;
export const AppPaymentMethodCreate = z.object({
  paymentMethodId: z.string().describe("支払方法ID"),
  appPaymentCode: z.string().describe("アプリ連携用支払コード"),
  status: z.union([z.literal("0"), z.literal("1"), z.undefined()]).optional().describe("ステータス(0:無効, 1:有効)"),
});

export type Coupon = z.infer<typeof Coupon>;
export const Coupon = z.object({
  id: z.number().describe("クーポンID"),
  couponName: z.string().describe("クーポン名"),
  couponCode: z.union([z.string(), z.undefined()]).optional().describe("クーポンコード"),
  couponType: z.number().describe("クーポン種別（1:値引き額、2:割引率、3:ポイント加算）"),
  couponValue: z.number().describe("クーポン値（値引き額、割引率、加算ポイント）"),
  maxDiscount: z.union([z.number(), z.undefined()]).optional().describe("最大値引き額"),
  minAmount: z.union([z.number(), z.undefined()]).optional().describe("適用最低金額"),
  startDate: z.string().describe("開始日"),
  endDate: z.string().describe("終了日"),
  bonusDay: z.union([z.string(), z.undefined()]).optional().describe("ボーナスデー（1:月曜日、2:火曜日、...、7:日曜日）"),
  bonusMonth: z.union([z.number(), z.undefined()]).optional().describe("ボーナス月（1:1月、2:2月、...、12:12月）"),
  uniqueUse: z.union([z.boolean(), z.undefined()]).optional().describe("ユニーク使用（true:可、false:不可）"),
  validDays: z.union([z.number(), z.undefined()]).optional().describe("有効日数"),
  validCount: z.union([z.number(), z.undefined()]).optional().describe("有効回数"),
  limitCount: z.union([z.number(), z.undefined()]).optional().describe("利用制限回数"),
  isPublic: z.union([z.boolean(), z.undefined()]).optional().describe("公開フラグ（true:公開、false:非公開）"),
  description: z.union([z.string(), z.undefined()]).optional().describe("説明文"),
  image: z.union([z.string(), z.undefined()]).optional().describe("画像URL"),
  storeTarget: z.union([z.string(), z.undefined()]).optional().describe("対象店舗（1:全店舗、2:個別指定）"),
  stores: z
    .union([
      z.array(
        z.object({
          id: z.number().optional().describe("クーポンID"),
          storeName: z.string().optional(),
        }),
      ),
      z.undefined(),
    ])
    .optional(),
  productTarget: z.union([z.string(), z.undefined()]).optional().describe("対象商品（1:全商品、2:個別指定）"),
  isExcludeProductTarget: z.union([z.boolean(), z.undefined()]).optional().describe("商品対象除外フラグ（true:除外、false:含む）"),
  isApplyBargain: z.union([z.boolean(), z.undefined()]).optional().describe("バーゲン併用可否（true:併用可、false:併用不可）"),
  isApplyOtherCoupon: z.union([z.boolean(), z.undefined()]).optional().describe("他クーポン併用可否（true:併用可、false:併用不可）"),
  createDate: z.union([z.string(), z.undefined()]).optional().describe("作成日時"),
  updateDate: z.union([z.string(), z.undefined()]).optional().describe("更新日時"),
});

export type CouponCreate = z.infer<typeof CouponCreate>;
export const CouponCreate = z.object({
  couponName: z.string().describe("クーポン名"),
  couponCode: z.union([z.string(), z.undefined()]).optional().describe("クーポンコード"),
  couponType: z.number().describe("クーポン種別（1:値引き額、2:割引率、3:ポイント加算）"),
  couponValue: z.number().describe("クーポン値（値引き額、割引率、加算ポイント）"),
  maxDiscount: z.union([z.number(), z.undefined()]).optional().describe("最大値引き額"),
  minAmount: z.union([z.number(), z.undefined()]).optional().describe("適用最低金額"),
  startDate: z.string().describe("開始日"),
  endDate: z.string().describe("終了日"),
  bonusDay: z.union([z.string(), z.undefined()]).optional().describe("ボーナスデー（1:月曜日、2:火曜日、...、7:日曜日）"),
  bonusMonth: z.union([z.number(), z.undefined()]).optional().describe("ボーナス月（1:1月、2:2月、...、12:12月）"),
  uniqueUse: z.union([z.boolean(), z.undefined()]).optional().describe("ユニーク使用（true:可、false:不可）"),
  validDays: z.union([z.number(), z.undefined()]).optional().describe("有効日数"),
  validCount: z.union([z.number(), z.undefined()]).optional().describe("有効回数"),
  limitCount: z.union([z.number(), z.undefined()]).optional().describe("利用制限回数"),
  isPublic: z.union([z.boolean(), z.undefined()]).optional().describe("公開フラグ（true:公開、false:非公開）"),
  description: z.union([z.string(), z.undefined()]).optional().describe("説明文"),
  image: z.union([z.string(), z.undefined()]).optional().describe("画像URL"),
  storeTarget: z.union([z.string(), z.undefined()]).optional().describe("対象店舗（1:全店舗、2:個別指定）"),
  storeIds: z.union([z.array(z.number()), z.undefined()]).optional().describe("適用店舗IDリスト"),
  productTarget: z.union([z.string(), z.undefined()]).optional().describe("対象商品（1:全商品、2:個別指定）"),
  isExcludeProductTarget: z.union([z.boolean(), z.undefined()]).optional().describe("商品対象除外フラグ（true:除外、false:含む）"),
  isApplyBargain: z.union([z.boolean(), z.undefined()]).optional().describe("バーゲン併用可否（true:併用可、false:併用不可）"),
  isApplyOtherCoupon: z.union([z.boolean(), z.undefined()]).optional().describe("他クーポン併用可否（true:併用可、false:併用不可）"),
});

export type CouponUpdate = z.infer<typeof CouponUpdate>;
export const CouponUpdate = z.object({
  couponName: z.string().optional().describe("クーポン名"),
  couponCode: z.string().optional().describe("クーポンコード"),
  couponType: z.number().optional().describe("クーポン種別（1:値引き額、2:割引率、3:ポイント加算）"),
  couponValue: z.number().optional().describe("クーポン値（値引き額、割引率、加算ポイント）"),
  maxDiscount: z.number().optional().describe("最大値引き額"),
  minAmount: z.number().optional().describe("適用最低金額"),
  startDate: z.string().optional().describe("開始日"),
  endDate: z.string().optional().describe("終了日"),
  bonusDay: z.string().optional().describe("ボーナスデー（1:月曜日、2:火曜日、...、7:日曜日）"),
  bonusMonth: z.number().optional().describe("ボーナス月（1:1月、2:2月、...、12:12月）"),
  uniqueUse: z.boolean().optional().describe("ユニーク使用（true:可、false:不可）"),
  validDays: z.number().optional().describe("有効日数"),
  validCount: z.number().optional().describe("有効回数"),
  limitCount: z.number().optional().describe("利用制限回数"),
  isPublic: z.boolean().optional().describe("公開フラグ（true:公開、false:非公開）"),
  description: z.string().optional().describe("説明文"),
  image: z.string().optional().describe("画像URL"),
  storeTarget: z.string().optional().describe("対象店舗（1:全店舗、2:個別指定）"),
  storeIds: z.array(z.number()).optional().describe("適用店舗IDリスト"),
  productTarget: z.string().optional().describe("対象商品（1:全商品、2:個別指定）"),
  isExcludeProductTarget: z.boolean().optional().describe("商品対象除外フラグ（true:除外、false:含む）"),
  isApplyBargain: z.boolean().optional().describe("バーゲン併用可否（true:併用可、false:併用不可）"),
  isApplyOtherCoupon: z.boolean().optional().describe("他クーポン併用可否（true:併用可、false:併用不可）"),
});

export type CouponProduct = z.infer<typeof CouponProduct>;
export const CouponProduct = z.object({
  id: z.number().describe("クーポン適用商品ID"),
  couponId: z.number().describe("クーポンID"),
  productId: z.number().describe("商品ID"),
  productCode: z.union([z.string(), z.undefined()]).optional().describe("商品コード"),
  productName: z.union([z.string(), z.undefined()]).optional().describe("商品名"),
  categoryId: z.union([z.number(), z.undefined()]).optional().describe("部門ID"),
  categoryName: z.union([z.string(), z.undefined()]).optional().describe("部門名"),
  discountType: z.number().describe("値引き種別（1:値引き額、2:割引率、3:ポイント加算）"),
  discountValue: z.number().describe("値引き値（値引き額、割引率、加算ポイント）"),
  createDate: z.union([z.string(), z.undefined()]).optional().describe("作成日時"),
  updateDate: z.union([z.string(), z.undefined()]).optional().describe("更新日時"),
});

export type CouponProductCreate = z.infer<typeof CouponProductCreate>;
export const CouponProductCreate = z.object({
  productId: z.number().describe("商品ID"),
  discountType: z.number().describe("値引き種別（1:値引き額、2:割引率、3:ポイント加算）"),
  discountValue: z.number().describe("値引き値（値引き額、割引率、加算ポイント）"),
});

export type CouponProductUpdate = z.infer<typeof CouponProductUpdate>;
export const CouponProductUpdate = z.object({
  productId: z.number().optional().describe("商品ID"),
  discountType: z.number().optional().describe("値引き種別（1:値引き額、2:割引率、3:ポイント加算）"),
  discountValue: z.number().optional().describe("値引き値（値引き額、割引率、加算ポイント）"),
});

export type Loss = z.infer<typeof Loss>;
export const Loss = z.object({
  lossId: z.string().optional().describe("ロスID"),
  storeId: z.string().optional().describe("店舗ID"),
  lossDivisionId: z.string().optional().describe("ロス区分ID"),
  lossDate: z.string().optional().describe("ロス日"),
  memo: z.string().optional().describe("メモ"),
  insDateTime: z.string().optional().describe("登録日時"),
  updDateTime: z.string().optional().describe("更新日時"),
});

export type LossCreate = z.infer<typeof LossCreate>;
export const LossCreate = z.object({
  storeId: z.string().describe("店舗ID"),
  lossDivisionId: z.string().describe("ロス区分ID"),
  lossDate: z.string().describe("ロス日"),
  memo: z.union([z.string(), z.undefined()]).optional().describe("メモ"),
  details: z.array(
    z.object({
      productId: z.string().describe("商品ID"),
      quantity: z.string(),
      unitCost: z.union([z.string(), z.undefined()]).optional(),
      memo: z.union([z.string(), z.undefined()]).optional().describe("メモ"),
    }),
  ),
});

export type LossUpdate = z.infer<typeof LossUpdate>;
export const LossUpdate = z.object({
  storeId: z.string().optional().describe("店舗ID"),
  lossDivisionId: z.string().optional().describe("ロス区分ID"),
  lossDate: z.string().optional().describe("ロス日"),
  memo: z.string().optional().describe("メモ"),
});

export type LossDetail = z.infer<typeof LossDetail>;
export const LossDetail = z.object({
  lossId: z.string().optional().describe("ロスID"),
  lossDetailId: z.string().optional().describe("ロス明細ID"),
  productId: z.string().optional().describe("商品ID"),
  productName: z.string().optional().describe("商品名"),
  quantity: z.string().optional().describe("数量"),
  unitCost: z.string().optional().describe("単価"),
  memo: z.string().optional().describe("メモ"),
  insDateTime: z.string().optional().describe("登録日時"),
  updDateTime: z.string().optional().describe("更新日時"),
});

export type LossDivision = z.infer<typeof LossDivision>;
export const LossDivision = z.object({
  lossDivisionId: z.string().optional().describe("ロス区分ID"),
  lossDivisionName: z.string().optional().describe("ロス区分名"),
  insDateTime: z.string().optional().describe("登録日時"),
  updDateTime: z.string().optional().describe("更新日時"),
});

export type LossDivisionCreate = z.infer<typeof LossDivisionCreate>;
export const LossDivisionCreate = z.object({
  lossDivisionName: z.string().describe("ロス区分名"),
});

export type LossDivisionUpdate = z.infer<typeof LossDivisionUpdate>;
export const LossDivisionUpdate = z.object({
  lossDivisionName: z.string().optional().describe("ロス区分名"),
});

export type Order = z.infer<typeof Order>;
export const Order = z.object({
  orderId: z.string().optional().describe("発注ID"),
  storeId: z.string().optional().describe("店舗ID"),
  supplierId: z.string().optional().describe("仕入先ID"),
  estimatedArrivalDate: z.string().optional().describe("入荷予定日"),
  orderDate: z.string().optional().describe("発注日"),
  memo: z.string().optional().describe("メモ"),
  status: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.literal("3")]).optional().describe("ステータス (0:未処理, 1:処理済み, 2:キャンセル, 3:完了)"),
  insDateTime: z.string().optional().describe("登録日時"),
  updDateTime: z.string().optional().describe("更新日時"),
});

export type OrderCreate = z.infer<typeof OrderCreate>;
export const OrderCreate = z.object({
  storeId: z.string().describe("店舗ID"),
  supplierId: z.string().describe("仕入先ID"),
  estimatedArrivalDate: z.union([z.string(), z.undefined()]).optional().describe("入荷予定日"),
  orderDate: z.string().describe("発注日"),
  memo: z.union([z.string(), z.undefined()]).optional().describe("メモ"),
  status: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.literal("3"), z.undefined()]).optional().describe("ステータス (0:未処理, 1:処理済み, 2:キャンセル, 3:完了)"),
  details: z
    .union([
      z.array(
        z.object({
          productId: z.string().optional().describe("商品ID"),
          quantity: z.string().optional(),
          memo: z.string().optional().describe("メモ"),
        }),
      ),
      z.undefined(),
    ])
    .optional(),
});

export type OrderUpdate = z.infer<typeof OrderUpdate>;
export const OrderUpdate = z.object({
  storeId: z.string().optional().describe("店舗ID"),
  supplierId: z.string().optional().describe("仕入先ID"),
  estimatedArrivalDate: z.string().optional().describe("入荷予定日"),
  orderDate: z.string().optional().describe("発注日"),
  memo: z.string().optional().describe("メモ"),
  status: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.literal("3")]).optional().describe("ステータス (0:未処理, 1:処理済み, 2:キャンセル, 3:完了)"),
});

export type OrderProduct = z.infer<typeof OrderProduct>;
export const OrderProduct = z.object({
  productId: z.string().optional().describe("商品ID"),
  productCode: z.string().optional().describe("商品コード"),
  productName: z.string().optional().describe("商品名"),
  categoryId: z.string().optional().describe("部門ID"),
  categoryName: z.string().optional().describe("部門名"),
  inventoryQuantity: z.string().optional().describe("在庫数"),
  remainsInventories: z.string().optional().describe("発注点在庫残"),
  orderPoint: z.string().optional().describe("発注点"),
});

export type OrderStore = z.infer<typeof OrderStore>;
export const OrderStore = z.object({
  storeId: z.string().optional().describe("店舗ID"),
  storeName: z.string().optional().describe("店舗名"),
  storeCode: z.string().optional().describe("店舗コード"),
});

export type Arrival = z.infer<typeof Arrival>;
export const Arrival = z.object({
  arrivalId: z.string().optional().describe("入荷ID"),
  orderId: z.string().optional().describe("発注ID"),
  storeId: z.string().optional().describe("店舗ID"),
  supplierId: z.string().optional().describe("仕入先ID"),
  arrivalDate: z.string().optional().describe("入荷日"),
  memo: z.string().optional().describe("メモ"),
  status: z.union([z.literal("0"), z.literal("1"), z.literal("2")]).optional().describe("ステータス(0:未確定, 1:確定, 2:キャンセル)"),
  insDateTime: z.string().optional().describe("登録日時"),
  updDateTime: z.string().optional().describe("更新日時"),
});

export type ArrivalCreate = z.infer<typeof ArrivalCreate>;
export const ArrivalCreate = z.object({
  orderId: z.union([z.string(), z.undefined()]).optional().describe("発注ID"),
  storeId: z.string().describe("店舗ID"),
  supplierId: z.union([z.string(), z.undefined()]).optional().describe("仕入先ID"),
  arrivalDate: z.string().describe("入荷日"),
  memo: z.union([z.string(), z.undefined()]).optional().describe("メモ"),
  status: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.undefined()]).optional().describe("ステータス(0:未確定, 1:確定, 2:キャンセル)"),
});

export type ArrivalUpdate = z.infer<typeof ArrivalUpdate>;
export const ArrivalUpdate = z.object({
  orderId: z.string().optional().describe("発注ID"),
  storeId: z.string().optional().describe("店舗ID"),
  supplierId: z.string().optional().describe("仕入先ID"),
  arrivalDate: z.string().optional().describe("入荷日"),
  memo: z.string().optional().describe("メモ"),
  status: z.union([z.literal("0"), z.literal("1"), z.literal("2")]).optional().describe("ステータス(0:未確定, 1:確定, 2:キャンセル)"),
});

export type ArrivalDetail = z.infer<typeof ArrivalDetail>;
export const ArrivalDetail = z.object({
  arrivalId: z.string().optional().describe("入荷ID"),
  arrivalDetailId: z.string().optional().describe("入荷明細ID"),
  productId: z.string().optional().describe("商品ID"),
  orderDetailId: z.string().optional().describe("発注明細ID"),
  quantity: z.string().optional().describe("数量"),
  cost: z.string().optional().describe("原価"),
  memo: z.string().optional().describe("メモ"),
  insDateTime: z.string().optional().describe("登録日時"),
  updDateTime: z.string().optional().describe("更新日時"),
});

export type Shipment = z.infer<typeof Shipment>;
export const Shipment = z.object({
  shipmentId: z.string().optional().describe("出荷ID"),
  storeId: z.string().optional().describe("出荷元店舗ID"),
  shipmentDate: z.string().optional().describe("出荷日"),
  destinationStoreId: z.string().optional().describe("出荷先店舗ID"),
  memo: z.string().optional().describe("メモ"),
  status: z.union([z.literal("0"), z.literal("1"), z.literal("2")]).optional().describe("ステータス(0:未確定, 1:確定, 2:キャンセル)"),
  insDateTime: z.string().optional().describe("登録日時"),
  updDateTime: z.string().optional().describe("更新日時"),
});

export type ShipmentCreate = z.infer<typeof ShipmentCreate>;
export const ShipmentCreate = z.object({
  storeId: z.string().describe("出荷元店舗ID"),
  shipmentDate: z.string().describe("出荷日"),
  destinationStoreId: z.string().describe("出荷先店舗ID"),
  memo: z.union([z.string(), z.undefined()]).optional().describe("メモ"),
  status: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.undefined()]).optional().describe("ステータス(0:未確定, 1:確定, 2:キャンセル)"),
});

export type ShipmentUpdate = z.infer<typeof ShipmentUpdate>;
export const ShipmentUpdate = z.object({
  storeId: z.string().optional().describe("出荷元店舗ID"),
  shipmentDate: z.string().optional().describe("出荷日"),
  destinationStoreId: z.string().optional().describe("出荷先店舗ID"),
  memo: z.string().optional().describe("メモ"),
  status: z.union([z.literal("0"), z.literal("1"), z.literal("2")]).optional().describe("ステータス(0:未確定, 1:確定, 2:キャンセル)"),
});

export type ShipmentDetail = z.infer<typeof ShipmentDetail>;
export const ShipmentDetail = z.object({
  shipmentId: z.string().optional().describe("出荷ID"),
  shipmentDetailId: z.string().optional().describe("出荷明細ID"),
  productId: z.string().optional().describe("商品ID"),
  quantity: z.string().optional().describe("数量"),
  memo: z.string().optional().describe("メモ"),
  insDateTime: z.string().optional().describe("登録日時"),
  updDateTime: z.string().optional().describe("更新日時"),
});

export type IncomingStock = z.infer<typeof IncomingStock>;
export const IncomingStock = z.object({
  id: z.number().describe("入庫ID"),
  division: z.number().describe("入庫区分（1:仕入、2:店舗間移動、3:返品）"),
  divisionName: z.union([z.string(), z.undefined()]).optional().describe("入庫区分名"),
  status: z.number().describe("入庫ステータス（1:計画中、2:確定済）"),
  statusName: z.union([z.string(), z.undefined()]).optional().describe("入庫ステータス名"),
  storeId: z.number().describe("店舗ID"),
  storeName: z.union([z.string(), z.undefined()]).optional().describe("店舗名"),
  supplierStoreId: z.union([z.number(), z.undefined()]).optional().describe("出庫元店舗ID"),
  supplierStoreName: z.union([z.string(), z.undefined()]).optional().describe("出庫元店舗名"),
  supplierId: z.union([z.number(), z.undefined()]).optional().describe("仕入先ID"),
  supplierName: z.union([z.string(), z.undefined()]).optional().describe("仕入先名"),
  arrivalId: z.union([z.number(), z.undefined()]).optional().describe("入荷ID"),
  arrivalDate: z.union([z.string(), z.undefined()]).optional().describe("入荷日"),
  orderId: z.union([z.number(), z.undefined()]).optional().describe("発注ID"),
  targetDate: z.string().describe("入庫日"),
  estimatedDate: z.union([z.string(), z.undefined()]).optional().describe("入庫予定日"),
  staffId: z.union([z.number(), z.undefined()]).optional().describe("担当スタッフID"),
  staffName: z.union([z.string(), z.undefined()]).optional().describe("担当スタッフ名"),
  memo: z.union([z.string(), z.undefined()]).optional().describe("メモ"),
  totalAmount: z.union([z.number(), z.undefined()]).optional().describe("合計金額"),
  productCount: z.union([z.number(), z.undefined()]).optional().describe("商品件数"),
  createDate: z.union([z.string(), z.undefined()]).optional().describe("作成日時"),
  updateDate: z.union([z.string(), z.undefined()]).optional().describe("更新日時"),
});

export type IncomingStockUpdate = z.infer<typeof IncomingStockUpdate>;
export const IncomingStockUpdate = z.object({
  division: z.number().optional().describe("入庫区分（1:仕入、2:店舗間移動、3:返品）"),
  status: z.number().optional().describe("入庫ステータス（1:計画中、2:確定済）"),
  storeId: z.number().optional().describe("店舗ID"),
  supplierStoreId: z.number().optional().describe("出庫元店舗ID"),
  supplierId: z.number().optional().describe("仕入先ID"),
  arrivalId: z.number().optional().describe("入荷ID"),
  arrivalDate: z.string().optional().describe("入荷日"),
  orderId: z.number().optional().describe("発注ID"),
  targetDate: z.string().optional().describe("入庫日"),
  estimatedDate: z.string().optional().describe("入庫予定日"),
  staffId: z.number().optional().describe("担当スタッフID"),
  memo: z.string().optional().describe("メモ"),
});

export type IncomingStockDetail = z.infer<typeof IncomingStockDetail>;
export const IncomingStockDetail = z.object({
  id: z.number().describe("入庫詳細ID"),
  incomingStockId: z.number().describe("入庫ID"),
  productId: z.number().describe("商品ID"),
  productCode: z.union([z.string(), z.undefined()]).optional().describe("商品コード"),
  productName: z.union([z.string(), z.undefined()]).optional().describe("商品名"),
  barcode: z.union([z.string(), z.undefined()]).optional().describe("バーコード"),
  categoryId: z.union([z.number(), z.undefined()]).optional().describe("部門ID"),
  categoryName: z.union([z.string(), z.undefined()]).optional().describe("部門名"),
  quantity: z.number().describe("数量"),
  costPrice: z.union([z.number(), z.undefined()]).optional().describe("仕入単価"),
  price: z.union([z.number(), z.undefined()]).optional().describe("販売単価"),
  memo: z.union([z.string(), z.undefined()]).optional().describe("メモ"),
  createDate: z.union([z.string(), z.undefined()]).optional().describe("作成日時"),
  updateDate: z.union([z.string(), z.undefined()]).optional().describe("更新日時"),
});

export type OutgoingStock = z.infer<typeof OutgoingStock>;
export const OutgoingStock = z.object({
  id: z.number().describe("出庫ID"),
  division: z.number().describe("出庫区分（1:店舗間移動、2:返品、3:その他）"),
  divisionName: z.union([z.string(), z.undefined()]).optional().describe("出庫区分名"),
  status: z.number().describe("出庫ステータス（1:計画中、2:確定済）"),
  statusName: z.union([z.string(), z.undefined()]).optional().describe("出庫ステータス名"),
  storeId: z.number().describe("店舗ID"),
  storeName: z.union([z.string(), z.undefined()]).optional().describe("店舗名"),
  destinationStoreId: z.union([z.number(), z.undefined()]).optional().describe("入庫先店舗ID"),
  destinationStoreName: z.union([z.string(), z.undefined()]).optional().describe("入庫先店舗名"),
  supplierId: z.union([z.number(), z.undefined()]).optional().describe("仕入先ID（返品時）"),
  supplierName: z.union([z.string(), z.undefined()]).optional().describe("仕入先名（返品時）"),
  shipmentId: z.union([z.number(), z.undefined()]).optional().describe("出荷ID"),
  shipmentDate: z.union([z.string(), z.undefined()]).optional().describe("出荷日"),
  targetDate: z.string().describe("出庫日"),
  estimatedDate: z.union([z.string(), z.undefined()]).optional().describe("出庫予定日"),
  staffId: z.union([z.number(), z.undefined()]).optional().describe("担当スタッフID"),
  staffName: z.union([z.string(), z.undefined()]).optional().describe("担当スタッフ名"),
  memo: z.union([z.string(), z.undefined()]).optional().describe("メモ"),
  totalAmount: z.union([z.number(), z.undefined()]).optional().describe("合計金額"),
  productCount: z.union([z.number(), z.undefined()]).optional().describe("商品件数"),
  createDate: z.union([z.string(), z.undefined()]).optional().describe("作成日時"),
  updateDate: z.union([z.string(), z.undefined()]).optional().describe("更新日時"),
});

export type OutgoingStockCreate = z.infer<typeof OutgoingStockCreate>;
export const OutgoingStockCreate = z.object({
  division: z.number().describe("出庫区分（1:店舗間移動、2:返品、3:その他）"),
  status: z.number().describe("出庫ステータス（1:計画中、2:確定済）"),
  storeId: z.number().describe("店舗ID"),
  destinationStoreId: z.union([z.number(), z.undefined()]).optional().describe("入庫先店舗ID"),
  supplierId: z.union([z.number(), z.undefined()]).optional().describe("仕入先ID（返品時）"),
  shipmentId: z.union([z.number(), z.undefined()]).optional().describe("出荷ID"),
  shipmentDate: z.union([z.string(), z.undefined()]).optional().describe("出荷日"),
  targetDate: z.string().describe("出庫日"),
  estimatedDate: z.union([z.string(), z.undefined()]).optional().describe("出庫予定日"),
  staffId: z.union([z.number(), z.undefined()]).optional().describe("担当スタッフID"),
  memo: z.union([z.string(), z.undefined()]).optional().describe("メモ"),
  details: z.array(
    z.object({
      productId: z.number().describe("商品ID"),
      quantity: z.number(),
      costPrice: z.union([z.number(), z.undefined()]).optional(),
      memo: z.union([z.string(), z.undefined()]).optional().describe("メモ"),
    }),
  ),
});

export type OutgoingStockUpdate = z.infer<typeof OutgoingStockUpdate>;
export const OutgoingStockUpdate = z.object({
  division: z.number().optional().describe("出庫区分（1:店舗間移動、2:返品、3:その他）"),
  status: z.number().optional().describe("出庫ステータス（1:計画中、2:確定済）"),
  storeId: z.number().optional().describe("店舗ID"),
  destinationStoreId: z.number().optional().describe("入庫先店舗ID"),
  supplierId: z.number().optional().describe("仕入先ID（返品時）"),
  shipmentId: z.number().optional().describe("出荷ID"),
  shipmentDate: z.string().optional().describe("出荷日"),
  targetDate: z.string().optional().describe("出庫日"),
  estimatedDate: z.string().optional().describe("出庫予定日"),
  staffId: z.number().optional().describe("担当スタッフID"),
  memo: z.string().optional().describe("メモ"),
});

export type OutgoingStockDetail = z.infer<typeof OutgoingStockDetail>;
export const OutgoingStockDetail = z.object({
  id: z.number().describe("出庫詳細ID"),
  outgoingStockId: z.number().describe("出庫ID"),
  productId: z.number().describe("商品ID"),
  productCode: z.union([z.string(), z.undefined()]).optional().describe("商品コード"),
  productName: z.union([z.string(), z.undefined()]).optional().describe("商品名"),
  barcode: z.union([z.string(), z.undefined()]).optional().describe("バーコード"),
  categoryId: z.union([z.number(), z.undefined()]).optional().describe("部門ID"),
  categoryName: z.union([z.string(), z.undefined()]).optional().describe("部門名"),
  quantity: z.number().describe("数量"),
  costPrice: z.union([z.number(), z.undefined()]).optional().describe("仕入単価"),
  price: z.union([z.number(), z.undefined()]).optional().describe("販売単価"),
  memo: z.union([z.string(), z.undefined()]).optional().describe("メモ"),
  createDate: z.union([z.string(), z.undefined()]).optional().describe("作成日時"),
  updateDate: z.union([z.string(), z.undefined()]).optional().describe("更新日時"),
});

export type CorrectionRequestOutgoingStock = z.infer<typeof CorrectionRequestOutgoingStock>;
export const CorrectionRequestOutgoingStock = z.object({
  id: z.number().describe("出庫修正申請ID"),
  outgoingStockId: z.number().describe("出庫ID"),
  storeId: z.number().describe("店舗ID"),
  storeName: z.union([z.string(), z.undefined()]).optional().describe("店舗名"),
  status: z.number().describe("申請ステータス（1:申請中、2:承認済、3:却下）"),
  statusName: z.union([z.string(), z.undefined()]).optional().describe("申請ステータス名"),
  requestDate: z.string().describe("申請日"),
  requestReason: z.union([z.string(), z.undefined()]).optional().describe("申請理由"),
  requestStaffId: z.union([z.number(), z.undefined()]).optional().describe("申請スタッフID"),
  requestStaffName: z.union([z.string(), z.undefined()]).optional().describe("申請スタッフ名"),
  approvalDate: z.union([z.string(), z.undefined()]).optional().describe("承認/却下日"),
  approvalReason: z.union([z.string(), z.undefined()]).optional().describe("承認/却下理由"),
  approvalStaffId: z.union([z.number(), z.undefined()]).optional().describe("承認/却下スタッフID"),
  approvalStaffName: z.union([z.string(), z.undefined()]).optional().describe("承認/却下スタッフ名"),
  createDate: z.union([z.string(), z.undefined()]).optional().describe("作成日時"),
  updateDate: z.union([z.string(), z.undefined()]).optional().describe("更新日時"),
});

export type Stocktaking = z.infer<typeof Stocktaking>;
export const Stocktaking = z.object({
  id: z.number().describe("棚卸ID"),
  stocktakingName: z.string().describe("棚卸名"),
  storeId: z.number().describe("店舗ID"),
  storeName: z.union([z.string(), z.undefined()]).optional().describe("店舗名"),
  stocktakingStatus: z.number().describe("棚卸ステータス（1:集計中、2:完了）"),
  startDate: z.string().describe("開始日時"),
  endDate: z.union([z.string(), z.undefined()]).optional().describe("終了日時"),
  stockAmount: z.union([z.number(), z.undefined()]).optional().describe("合計在庫金額"),
  staffId: z.union([z.number(), z.undefined()]).optional().describe("担当スタッフID"),
  staffName: z.union([z.string(), z.undefined()]).optional().describe("担当スタッフ名"),
  memo: z.union([z.string(), z.undefined()]).optional().describe("メモ"),
  isExcludeOutOfStock: z.union([z.boolean(), z.undefined()]).optional().describe("在庫なし商品除外フラグ（true:除外する、false:除外しない）"),
  categoryTarget: z.union([z.number(), z.undefined()]).optional().describe("部門対象（1:全部門、2:指定部門）"),
  createDate: z.union([z.string(), z.undefined()]).optional().describe("作成日時"),
  updateDate: z.union([z.string(), z.undefined()]).optional().describe("更新日時"),
});

export type StocktakingCategory = z.infer<typeof StocktakingCategory>;
export const StocktakingCategory = z.object({
  id: z.number().describe("棚卸部門ID"),
  stocktakingId: z.number().describe("棚卸ID"),
  storeId: z.number().describe("店舗ID"),
  categoryId: z.number().describe("部門ID"),
  categoryCode: z.union([z.string(), z.undefined()]).optional().describe("部門コード"),
  categoryName: z.union([z.string(), z.undefined()]).optional().describe("部門名"),
  isComplete: z.boolean().describe("棚卸実施済みフラグ（true:実施済み、false:未実施）"),
  productCount: z.union([z.number(), z.undefined()]).optional().describe("商品件数"),
  countedProductCount: z.union([z.number(), z.undefined()]).optional().describe("カウント済み商品件数"),
  countedRatio: z.union([z.number(), z.undefined()]).optional().describe("カウント済み割合"),
  createDate: z.union([z.string(), z.undefined()]).optional().describe("作成日時"),
  updateDate: z.union([z.string(), z.undefined()]).optional().describe("更新日時"),
});

export type StocktakingProduct = z.infer<typeof StocktakingProduct>;
export const StocktakingProduct = z.object({
  id: z.number().describe("棚卸商品ID"),
  stocktakingId: z.number().describe("棚卸ID"),
  storeId: z.number().describe("店舗ID"),
  productId: z.number().describe("商品ID"),
  productCode: z.union([z.string(), z.undefined()]).optional().describe("商品コード"),
  productName: z.union([z.string(), z.undefined()]).optional().describe("商品名"),
  barcode: z.union([z.string(), z.undefined()]).optional().describe("バーコード"),
  categoryId: z.union([z.number(), z.undefined()]).optional().describe("部門ID"),
  categoryName: z.union([z.string(), z.undefined()]).optional().describe("部門名"),
  price: z.union([z.number(), z.undefined()]).optional().describe("標準価格（税抜）"),
  cost: z.union([z.number(), z.undefined()]).optional().describe("原価"),
  isTaxIncluded: z.union([z.boolean(), z.undefined()]).optional().describe("税込みフラグ（true:税込み、false:税抜き）"),
  taxRate: z.union([z.number(), z.undefined()]).optional().describe("税率"),
  inventoryQuantity: z.number().describe("システム在庫数"),
  countedQuantity: z.union([z.number(), z.undefined()]).optional().describe("実在庫数"),
  differenceQuantity: z.union([z.number(), z.undefined()]).optional().describe("差異数"),
  isCounted: z.boolean().describe("商品カウント済みフラグ（true:カウント済み、false:未カウント）"),
  createDate: z.union([z.string(), z.undefined()]).optional().describe("作成日時"),
  updateDate: z.union([z.string(), z.undefined()]).optional().describe("更新日時"),
});

export type StocktakingStock = z.infer<typeof StocktakingStock>;
export const StocktakingStock = z.object({
  id: z.number().describe("棚卸在庫ID"),
  stocktakingId: z.number().describe("棚卸ID"),
  storeId: z.number().describe("店舗ID"),
  productId: z.number().describe("商品ID"),
  productCode: z.union([z.string(), z.undefined()]).optional().describe("商品コード"),
  productName: z.union([z.string(), z.undefined()]).optional().describe("商品名"),
  inventoryQuantity: z.number().describe("システム在庫数"),
  countedQuantity: z.number().describe("実在庫数"),
  differenceQuantity: z.number().describe("差異数"),
  price: z.union([z.number(), z.undefined()]).optional().describe("標準価格（税抜）"),
  inventoryAmount: z.union([z.number(), z.undefined()]).optional().describe("システム在庫金額"),
  countedAmount: z.union([z.number(), z.undefined()]).optional().describe("実在庫金額"),
  differenceAmount: z.union([z.number(), z.undefined()]).optional().describe("差異金額"),
  createDate: z.union([z.string(), z.undefined()]).optional().describe("作成日時"),
  updateDate: z.union([z.string(), z.undefined()]).optional().describe("更新日時"),
});

export type TaxRate = z.infer<typeof TaxRate>;
export const TaxRate = z.object({
  id: z.number().describe("税率ID"),
  name: z.string().describe("税率名"),
  rate: z.number().describe("税率（例：0.08で8%）"),
  effectiveFrom: z.string().describe("適用開始日"),
  displayOrder: z.union([z.number(), z.undefined()]).optional().describe("表示順"),
  description: z.union([z.string(), z.undefined()]).optional().describe("説明"),
  isDefault: z.union([z.boolean(), z.undefined()]).optional().describe("デフォルト設定（true:デフォルト、false:デフォルトでない）"),
  createDate: z.union([z.string(), z.undefined()]).optional().describe("作成日時"),
  updateDate: z.union([z.string(), z.undefined()]).optional().describe("更新日時"),
});

export type ReduceTaxRate = z.infer<typeof ReduceTaxRate>;
export const ReduceTaxRate = z.object({
  id: z.number().describe("軽減税率ID"),
  name: z.string().describe("軽減税率名"),
  rate: z.number().describe("税率（例：0.08で8%）"),
  effectiveFrom: z.string().describe("適用開始日"),
  displayOrder: z.union([z.number(), z.undefined()]).optional().describe("表示順"),
  description: z.union([z.string(), z.undefined()]).optional().describe("説明"),
  createDate: z.union([z.string(), z.undefined()]).optional().describe("作成日時"),
  updateDate: z.union([z.string(), z.undefined()]).optional().describe("更新日時"),
});

export type ReceiptRemark = z.infer<typeof ReceiptRemark>;
export const ReceiptRemark = z.object({
  id: z.number().describe("レシート備考ID"),
  text: z.string().describe("備考文"),
  displayOrder: z.union([z.number(), z.undefined()]).optional().describe("表示順"),
  isDefault: z.union([z.boolean(), z.undefined()]).optional().describe("デフォルト設定（true:デフォルト、false:デフォルトでない）"),
  createDate: z.union([z.string(), z.undefined()]).optional().describe("作成日時"),
  updateDate: z.union([z.string(), z.undefined()]).optional().describe("更新日時"),
});

export type ReceiptRemarkCreate = z.infer<typeof ReceiptRemarkCreate>;
export const ReceiptRemarkCreate = z.object({
  text: z.string().describe("備考文"),
  displayOrder: z.union([z.number(), z.undefined()]).optional().describe("表示順"),
  isDefault: z.union([z.boolean(), z.undefined()]).optional().describe("デフォルト設定（true:デフォルト、false:デフォルトでない）"),
});

export type DiscountDivision = z.infer<typeof DiscountDivision>;
export const DiscountDivision = z.object({
  id: z.number().describe("値引き区分ID"),
  divisionName: z.string().describe("値引き区分名"),
  code: z.union([z.string(), z.undefined()]).optional().describe("値引き区分コード"),
  displayOrder: z.union([z.number(), z.undefined()]).optional().describe("表示順"),
  createDate: z.union([z.string(), z.undefined()]).optional().describe("作成日時"),
  updateDate: z.union([z.string(), z.undefined()]).optional().describe("更新日時"),
});

export type CatCctCardCompany = z.infer<typeof CatCctCardCompany>;
export const CatCctCardCompany = z.object({
  id: z.number().describe("カード会社ID"),
  cardCompanyName: z.string().describe("カード会社名"),
  cardCompanyCode: z.string().describe("カード会社コード"),
  inputMode: z.number().describe("入力モード（1:カード情報必須、2:カード情報任意、3:カード情報なし）"),
  displayOrder: z.union([z.number(), z.undefined()]).optional().describe("表示順"),
  createDate: z.union([z.string(), z.undefined()]).optional().describe("作成日時"),
  updateDate: z.union([z.string(), z.undefined()]).optional().describe("更新日時"),
});

export type CustomerType = z.infer<typeof CustomerType>;
export const CustomerType = z.object({
  id: z.number().describe("顧客タイプID"),
  code: z.string().describe("顧客タイプコード"),
  name: z.string().describe("顧客タイプ名"),
  isDefault: z.union([z.boolean(), z.undefined()]).optional().describe("デフォルト設定（true:デフォルト、false:デフォルトでない）"),
  displayOrder: z.union([z.number(), z.undefined()]).optional().describe("表示順"),
  createDate: z.union([z.string(), z.undefined()]).optional().describe("作成日時"),
  updateDate: z.union([z.string(), z.undefined()]).optional().describe("更新日時"),
});

export type CustomerTypeCreate = z.infer<typeof CustomerTypeCreate>;
export const CustomerTypeCreate = z.object({
  code: z.string().describe("顧客タイプコード"),
  name: z.string().describe("顧客タイプ名"),
  isDefault: z.union([z.boolean(), z.undefined()]).optional().describe("デフォルト設定（true:デフォルト、false:デフォルトでない）"),
  displayOrder: z.union([z.number(), z.undefined()]).optional().describe("表示順"),
});

export type CustomerTypeUpdate = z.infer<typeof CustomerTypeUpdate>;
export const CustomerTypeUpdate = z.object({
  code: z.string().optional().describe("顧客タイプコード"),
  name: z.string().optional().describe("顧客タイプ名"),
  isDefault: z.boolean().optional().describe("デフォルト設定（true:デフォルト、false:デフォルトでない）"),
  displayOrder: z.number().optional().describe("表示順"),
});

export type CustomerTypeSection = z.infer<typeof CustomerTypeSection>;
export const CustomerTypeSection = z.object({
  id: z.number().describe("顧客タイプセクションID"),
  customerTypeId: z.number().describe("顧客タイプID"),
  name: z.string().describe("セクション名"),
  value: z.union([z.string(), z.undefined()]).optional().describe("セクション値"),
  fieldType: z.number().describe("フィールドタイプ（1:テキスト、2:数値、3:日付、4:選択肢、5:テキストエリア）"),
  isRequired: z.union([z.boolean(), z.undefined()]).optional().describe("必須フラグ（true:必須、false:任意）"),
  choices: z.union([z.string(), z.undefined()]).optional().describe("選択肢（カンマ区切り）"),
  displayOrder: z.union([z.number(), z.undefined()]).optional().describe("表示順"),
  createDate: z.union([z.string(), z.undefined()]).optional().describe("作成日時"),
  updateDate: z.union([z.string(), z.undefined()]).optional().describe("更新日時"),
});

export type CustomerTypeSectionUpdate = z.infer<typeof CustomerTypeSectionUpdate>;
export const CustomerTypeSectionUpdate = z.object({
  id: z.number().describe("顧客タイプセクションID"),
  name: z.union([z.string(), z.undefined()]).optional().describe("セクション名"),
  fieldType: z.union([z.number(), z.undefined()]).optional().describe("フィールドタイプ（1:テキスト、2:数値、3:日付、4:選択肢、5:テキストエリア）"),
  isRequired: z.union([z.boolean(), z.undefined()]).optional().describe("必須フラグ（true:必須、false:任意）"),
  choices: z.union([z.string(), z.undefined()]).optional().describe("選択肢（カンマ区切り）"),
  displayOrder: z.union([z.number(), z.undefined()]).optional().describe("表示順"),
});

export type get_Categories = typeof get_Categories;
export const get_Categories = {
  method: z.literal("GET"),
  path: z.literal("/categories"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      fields: z.array(z.string()).optional().describe("検索パラメータ（カンマ区切りで指定可）"),
      sort: z.string().optional().describe("並び順（カンマ区切りで指定可）"),
      limit: z.number().optional().describe("上限数"),
      page: z.number().optional().describe("ページ"),
      category_code: z.string().optional(),
      level: z.union([z.literal("1"), z.literal("2"), z.literal("3")]).optional().describe("階層レベル"),
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
      fields: z.array(z.string()).optional().describe("検索パラメータ（カンマ区切りで指定可）"),
    }),
    path: z.object({
      contract_id: z.string(),
      id: z.string().describe("顧客タイプセクションID"),
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
      id: z.string().describe("顧客タイプセクションID"),
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
      id: z.string().describe("顧客タイプセクションID"),
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
      fields: z.array(z.string()).optional().describe("検索パラメータ（カンマ区切りで指定可）"),
      sort: z.string().optional().describe("並び順（カンマ区切りで指定可）"),
      limit: z.number().optional().describe("上限数"),
      page: z.number().optional().describe("ページ"),
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
      id: z.string().describe("顧客タイプセクションID"),
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
      id: z.string().describe("顧客タイプセクションID"),
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
      limit: z.number().optional().describe("上限数"),
      page: z.number().optional().describe("ページ"),
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
      order: z.union([z.literal("asc"), z.literal("desc")]).optional().describe("ソート順序"),
      productId: z.number().optional().describe("商品ID"),
      productCode: z.string().optional().describe("商品コード"),
      janCode: z.string().optional().describe("JANコード"),
      productName: z.string().optional().describe("商品名"),
      categoryId: z.number().optional().describe("部門ID"),
      categoryCode: z.string().optional().describe("部門コード"),
      supplierId: z.number().optional().describe("仕入先ID"),
      supplierCode: z.string().optional().describe("仕入先コード"),
      storeId: z.number().optional().describe("店舗ID"),
      status: z.union([z.literal(0), z.literal(1)]).optional().describe("ステータス"),
      productType: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(9)]).optional().describe("商品タイプ"),
      fields: z.array(z.string()).optional().describe("検索パラメータ（カンマ区切りで指定可）"),
    }),
  }),
  response: z.object({
    items: z.array(Product).optional(),
    total: z.number().optional(),
    limit: z.number().optional().describe("上限数"),
    page: z.number().optional().describe("ページ"),
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
      fields: z.array(z.string()).optional().describe("検索パラメータ（カンマ区切りで指定可）"),
    }),
    path: z.object({
      id: z.number().describe("顧客タイプセクションID"),
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
      id: z.number().describe("顧客タイプセクションID"),
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
      id: z.number().describe("顧客タイプセクションID"),
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
      storeId: z.number().optional().describe("店舗ID"),
      priceDivision: z.number().optional().describe("価格区分"),
      startDate: z.string().optional().describe("適用開始日"),
      fields: z.array(z.string()).optional().describe("検索パラメータ（カンマ区切りで指定可）"),
    }),
    path: z.object({
      id: z.number().describe("顧客タイプセクションID"),
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
      id: z.number().describe("顧客タイプセクションID"),
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
      id: z.number().describe("顧客タイプセクションID"),
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
      storeId: z.number().optional().describe("店舗ID"),
      priceDivision: z.number().optional().describe("価格区分"),
      limit: z.number().optional().describe("上限数"),
      page: z.number().optional().describe("ページ"),
      fields: z.array(z.string()).optional().describe("検索パラメータ（カンマ区切りで指定可）"),
    }),
    path: z.object({
      id: z.number().describe("顧客タイプセクションID"),
    }),
  }),
  response: z.object({
    items: z.array(ProductPriceChange).optional(),
    total: z.number().optional(),
    limit: z.number().optional().describe("上限数"),
    page: z.number().optional().describe("ページ"),
  }),
};

export type get_GetProductReserveItems = typeof get_GetProductReserveItems;
export const get_GetProductReserveItems = {
  method: z.literal("GET"),
  path: z.literal("/products/{id}/reserve_items"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      fields: z.array(z.string()).optional().describe("検索パラメータ（カンマ区切りで指定可）"),
    }),
    path: z.object({
      id: z.number().describe("顧客タイプセクションID"),
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
      id: z.number().describe("顧客タイプセクションID"),
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
      id: z.number().describe("顧客タイプセクションID"),
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
      limit: z.number().optional().describe("上限数"),
      page: z.number().optional().describe("ページ"),
      attributeNo: z.number().optional().describe("属性番号"),
      attributeName: z.string().optional().describe("属性名称"),
      fields: z.array(z.string()).optional().describe("検索パラメータ（カンマ区切りで指定可）"),
    }),
  }),
  response: z.object({
    items: z.array(ProductAttribute).optional(),
    total: z.number().optional(),
    limit: z.number().optional().describe("上限数"),
    page: z.number().optional().describe("ページ"),
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
      limit: z.number().optional().describe("上限数"),
      page: z.number().optional().describe("ページ"),
      attributeNo: z.number().optional().describe("属性番号"),
      attributeItemCode: z.string().optional().describe("属性項目コード"),
      attributeItemName: z.string().optional().describe("属性項目名称"),
      fields: z.array(z.string()).optional().describe("検索パラメータ（カンマ区切りで指定可）"),
    }),
  }),
  response: z.object({
    items: z.array(ProductAttributeItem).optional(),
    total: z.number().optional(),
    limit: z.number().optional().describe("上限数"),
    page: z.number().optional().describe("ページ"),
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
      storeId: z.number().optional().describe("店舗ID"),
      fields: z.array(z.string()).optional().describe("検索パラメータ（カンマ区切りで指定可）"),
    }),
    path: z.object({
      id: z.number().describe("顧客タイプセクションID"),
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
      id: z.number().describe("顧客タイプセクションID"),
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
      id: z.number().describe("顧客タイプセクションID"),
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
      reservationProductId: z.number().optional().describe("引当商品ID"),
      fields: z.array(z.string()).optional().describe("検索パラメータ（カンマ区切りで指定可）"),
    }),
    path: z.object({
      id: z.number().describe("顧客タイプセクションID"),
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
      id: z.number().describe("顧客タイプセクションID"),
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
      id: z.number().describe("顧客タイプセクションID"),
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
      limit: z.number().optional().describe("上限数"),
      page: z.number().optional().describe("ページ"),
      no: z.number().optional().describe("予約項目ラベル番号"),
      name: z.string().optional().describe("セクション名"),
      fields: z.array(z.string()).optional().describe("検索パラメータ（カンマ区切りで指定可）"),
    }),
  }),
  response: z.object({
    items: z.array(ProductReserveItemLabel).optional(),
    total: z.number().optional(),
    limit: z.number().optional().describe("上限数"),
    page: z.number().optional().describe("ページ"),
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
      limit: z.number().optional().describe("上限数"),
      page: z.number().optional().describe("ページ"),
      productId: z.number().optional().describe("商品ID"),
      fields: z.array(z.string()).optional().describe("検索パラメータ（カンマ区切りで指定可）"),
    }),
  }),
  response: z.object({
    items: z.array(ProductImage).optional(),
    total: z.number().optional(),
    limit: z.number().optional().describe("上限数"),
    page: z.number().optional().describe("ページ"),
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
      id: z.number().describe("顧客タイプセクションID"),
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
      id: z.number().describe("顧客タイプセクションID"),
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
      id: z.number().describe("顧客タイプセクションID"),
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
      id: z.number().describe("顧客タイプセクションID"),
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
      id: z.number().describe("顧客タイプセクションID"),
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
      id: z.number().describe("顧客タイプセクションID"),
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
      fields: z.array(z.string()).optional().describe("検索パラメータ（カンマ区切りで指定可）"),
    }),
    path: z.object({
      product_id: z.number(),
      no: z.number().describe("予約項目ラベル番号"),
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
      no: z.number().describe("予約項目ラベル番号"),
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
      no: z.number().describe("予約項目ラベル番号"),
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
      fields: z.array(z.string()).optional().describe("検索パラメータ（カンマ区切りで指定可）"),
    }),
    path: z.object({
      no: z.number().describe("予約項目ラベル番号"),
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
      no: z.number().describe("予約項目ラベル番号"),
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
      no: z.number().describe("予約項目ラベル番号"),
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
      fields: z.array(z.string()).optional().describe("検索パラメータ（カンマ区切りで指定可）"),
    }),
    path: z.object({
      code: z.string().describe("顧客タイプコード"),
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
      code: z.string().describe("顧客タイプコード"),
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
      code: z.string().describe("顧客タイプコード"),
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
      fields: z.array(z.string()).optional().describe("検索パラメータ（カンマ区切りで指定可）"),
    }),
    path: z.object({
      id: z.number().describe("顧客タイプセクションID"),
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
      id: z.number().describe("顧客タイプセクションID"),
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
      id: z.number().describe("顧客タイプセクションID"),
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
      fields: z.array(z.string()).optional().describe("検索パラメータ（カンマ区切りで指定可）"),
    }),
    path: z.object({
      no: z.number().describe("予約項目ラベル番号"),
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
      no: z.number().describe("予約項目ラベル番号"),
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
      no: z.number().describe("予約項目ラベル番号"),
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
      storeId: z.number().optional().describe("店舗ID"),
      customerId: z.number().optional().describe("会員ID"),
      customerCode: z.string().optional().describe("会員コード"),
      "transactionHead.transactionDateTime": z.string().optional(),
      "transactionHead.transactionDateTimeFrom": z.string().optional(),
      "transactionHead.transactionDateTimeTo": z.string().optional(),
      "transactionHead.transactionHeadId": z.number().optional(),
      terminal: z.number().optional().describe("端末ID"),
      paymentMethod: z.number().optional().describe("決済方法ID"),
      limit: z.number().optional().describe("上限数"),
      page: z.number().optional().describe("ページ"),
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
    id: z.number().optional().describe("顧客タイプセクションID"),
  }),
};

export type get_TransactionsId = typeof get_TransactionsId;
export const get_TransactionsId = {
  method: z.literal("GET"),
  path: z.literal("/transactions/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.number().describe("顧客タイプセクションID"),
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
      id: z.number().describe("顧客タイプセクションID"),
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
      id: z.number().describe("顧客タイプセクションID"),
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
      id: z.number().describe("顧客タイプセクションID"),
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
      storeId: z.number().optional().describe("店舗ID"),
      status: z.union([z.literal(1), z.literal(2)]).optional().describe("ステータス"),
      "layaway.layawayDateTimeFrom": z.string().optional(),
      "layaway.layawayDateTimeTo": z.string().optional(),
      limit: z.number().optional().describe("上限数"),
      page: z.number().optional().describe("ページ"),
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
    id: z.number().optional().describe("顧客タイプセクションID"),
  }),
};

export type get_LayawaysId = typeof get_LayawaysId;
export const get_LayawaysId = {
  method: z.literal("GET"),
  path: z.literal("/layaways/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.number().describe("顧客タイプセクションID"),
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
      id: z.number().describe("顧客タイプセクションID"),
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
      storeId: z.number().optional().describe("店舗ID"),
      status: z.union([z.literal(1), z.literal(2)]).optional().describe("ステータス"),
      "preSale.preSaleDateTimeFrom": z.string().optional(),
      "preSale.preSaleDateTimeTo": z.string().optional(),
      limit: z.number().optional().describe("上限数"),
      page: z.number().optional().describe("ページ"),
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
    id: z.number().optional().describe("顧客タイプセクションID"),
  }),
};

export type get_Pre_salesId = typeof get_Pre_salesId;
export const get_Pre_salesId = {
  method: z.literal("GET"),
  path: z.literal("/pre_sales/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.number().describe("顧客タイプセクションID"),
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
      id: z.number().describe("顧客タイプセクションID"),
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
      id: z.number().describe("顧客タイプセクションID"),
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
      storeId: z.number().optional().describe("店舗ID"),
      statusType: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]).optional().describe(`ステータスタイプ
* 1: 未使用
* 2: 使用済
* 3: 期限切れ
* 4: 取消`),
      "ticketTransaction.ticketDateTimeFrom": z.string().optional(),
      "ticketTransaction.ticketDateTimeTo": z.string().optional(),
      "ticketTransaction.ticketCode": z.string().optional(),
      limit: z.number().optional().describe("上限数"),
      page: z.number().optional().describe("ページ"),
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
      id: z.number().describe("顧客タイプセクションID"),
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
      id: z.number().describe("顧客タイプセクションID"),
    }),
    body: z.object({
      statusType: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]).describe(`ステータスタイプ
* 1: 未使用
* 2: 使用済
* 3: 期限切れ
* 4: 取消`),
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
      fields: z.array(z.string()).optional().describe("検索パラメータ（カンマ区切りで指定可）"),
      sort: z.string().optional().describe("並び順（カンマ区切りで指定可）"),
      limit: z.number().optional().describe("上限数"),
      page: z.number().optional().describe("ページ"),
      customer_id: z.string().optional(),
      customer_code: z.string().optional(),
      customer_no: z.string().optional(),
      rank: z.string().optional().describe("会員ランク"),
      staff_rank: z.string().optional(),
      first_name: z.string().optional(),
      last_name: z.string().optional(),
      first_name_kana: z.string().optional(),
      last_name_kana: z.string().optional(),
      sex: z.union([z.literal("0"), z.literal("1"), z.literal("2")]).optional().describe("性別(0:不明, 1:男性, 2:女性)"),
      barcode: z.string().optional().describe("バーコード"),
      "birth_date-from": z.string().optional(),
      "birth_date-to": z.string().optional(),
      zip_code: z.string().optional(),
      address: z.string().optional().describe("住所（部分一致）"),
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
      note: z.string().optional().describe("備考（部分一致）"),
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
      id: z.string().describe("顧客タイプセクションID"),
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
      id: z.string().describe("顧客タイプセクションID"),
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
      id: z.string().describe("顧客タイプセクションID"),
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
      id: z.string().describe("顧客タイプセクションID"),
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
      id: z.string().describe("顧客タイプセクションID"),
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
      id: z.string().describe("顧客タイプセクションID"),
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
      fields: z.array(z.string()).optional().describe("検索パラメータ（カンマ区切りで指定可）"),
      sort: z.string().optional().describe("並び順（カンマ区切りで指定可）"),
      limit: z.number().optional().describe("上限数"),
      page: z.number().optional().describe("ページ"),
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
      id: z.string().describe("顧客タイプセクションID"),
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
      id: z.string().describe("顧客タイプセクションID"),
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
      id: z.string().describe("顧客タイプセクションID"),
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
      fields: z.array(z.string()).optional().describe("検索パラメータ（カンマ区切りで指定可）"),
      sort: z.string().optional().describe("並び順（カンマ区切りで指定可）"),
      limit: z.number().optional().describe("上限数"),
      page: z.number().optional().describe("ページ"),
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
      id: z.string().describe("顧客タイプセクションID"),
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
      id: z.string().describe("顧客タイプセクションID"),
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
      id: z.string().describe("顧客タイプセクションID"),
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
      barcode: z.string().optional().describe("バーコード"),
      limit: z.number().optional().describe("上限数"),
      page: z.number().optional().describe("ページ"),
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
      division: z.number().optional().describe("入庫区分（1:仕入、2:店舗間移動、3:返品）"),
      target_date_from: z.string().optional(),
      target_date_to: z.string().optional(),
      limit: z.number().optional().describe("上限数"),
      page: z.number().optional().describe("ページ"),
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
      fields: z.array(z.string()).optional().describe("検索パラメータ（カンマ区切りで指定可）"),
      sort: z.string().optional().describe("並び順（カンマ区切りで指定可）"),
      limit: z.number().optional().describe("上限数"),
      page: z.number().optional().describe("ページ"),
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
      id: z.string().describe("顧客タイプセクションID"),
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
      id: z.string().describe("顧客タイプセクションID"),
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
      fields: z.array(z.string()).optional().describe("検索パラメータ（カンマ区切りで指定可）"),
      sort: z.string().optional().describe("並び順（カンマ区切りで指定可）"),
      limit: z.number().optional().describe("上限数"),
      page: z.number().optional().describe("ページ"),
      store_id: z.string().optional(),
    }),
    path: z.object({
      contract_id: z.string(),
      id: z.string().describe("顧客タイプセクションID"),
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
      id: z.string().describe("顧客タイプセクションID"),
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
      id: z.string().describe("顧客タイプセクションID"),
      bargainStoreId: z.string().describe("セール店舗ID"),
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
      id: z.string().describe("顧客タイプセクションID"),
      bargainStoreId: z.string().describe("セール店舗ID"),
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
      fields: z.array(z.string()).optional().describe("検索パラメータ（カンマ区切りで指定可）"),
      sort: z.string().optional().describe("並び順（カンマ区切りで指定可）"),
      limit: z.number().optional().describe("上限数"),
      page: z.number().optional().describe("ページ"),
      target_division: z.union([z.literal("1"), z.literal("2"), z.literal("3")]).optional(),
      target_id: z.string().optional(),
    }),
    path: z.object({
      contract_id: z.string(),
      id: z.string().describe("顧客タイプセクションID"),
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
      id: z.string().describe("顧客タイプセクションID"),
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
      id: z.string().describe("顧客タイプセクションID"),
      bargainProductId: z.string().describe("セール商品ID"),
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
      id: z.string().describe("顧客タイプセクションID"),
      bargainProductId: z.string().describe("セール商品ID"),
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
      fields: z.array(z.string()).optional().describe("検索パラメータ（カンマ区切りで指定可）"),
      sort: z.string().optional().describe("並び順（カンマ区切りで指定可）"),
      limit: z.number().optional().describe("上限数"),
      page: z.number().optional().describe("ページ"),
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
      fields: z.array(z.string()).optional().describe("検索パラメータ（カンマ区切りで指定可）"),
      with_products: z.union([z.literal("all"), z.literal("none")]).optional(),
    }),
    path: z.object({
      contract_id: z.string(),
      id: z.string().describe("顧客タイプセクションID"),
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
      id: z.string().describe("顧客タイプセクションID"),
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
      id: z.string().describe("顧客タイプセクションID"),
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
      id: z.string().describe("顧客タイプセクションID"),
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
      fields: z.array(z.string()).optional().describe("検索パラメータ（カンマ区切りで指定可）"),
      sort: z.string().optional().describe("並び順（カンマ区切りで指定可）"),
      limit: z.number().optional().describe("上限数"),
      page: z.number().optional().describe("ページ"),
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
      fields: z.array(z.string()).optional().describe("検索パラメータ（カンマ区切りで指定可）"),
    }),
    path: z.object({
      contract_id: z.string(),
      id: z.string().describe("顧客タイプセクションID"),
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
      id: z.string().describe("顧客タイプセクションID"),
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
      id: z.string().describe("顧客タイプセクションID"),
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
      id: z.string().describe("顧客タイプセクションID"),
      bundleProductId: z.string().describe("バンドル販売商品ID"),
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
      fields: z.array(z.string()).optional().describe("検索パラメータ（カンマ区切りで指定可）"),
      sort: z.string().optional().describe("並び順（カンマ区切りで指定可）"),
      limit: z.number().optional().describe("上限数"),
      page: z.number().optional().describe("ページ"),
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
      fields: z.array(z.string()).optional().describe("検索パラメータ（カンマ区切りで指定可）"),
    }),
    path: z.object({
      contract_id: z.string(),
      id: z.string().describe("顧客タイプセクションID"),
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
      id: z.string().describe("顧客タイプセクションID"),
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
      id: z.string().describe("顧客タイプセクションID"),
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
      fields: z.array(z.string()).optional().describe("検索パラメータ（カンマ区切りで指定可）"),
      limit: z.number().optional().describe("上限数"),
      page: z.number().optional().describe("ページ"),
    }),
    path: z.object({
      contract_id: z.string(),
      store_id: z.string(),
    }),
  }),
  response: z.array(
    z.object({
      storeId: z.string().describe("店舗ID"),
      productId: z.string().describe("商品ID"),
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
      productId: z.string().describe("商品ID"),
      orderPoint: z.string(),
    }),
  }),
  response: z.object({
    storeId: z.string().describe("店舗ID"),
    productId: z.string().describe("商品ID"),
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
      productId: z.number().optional().describe("商品ID"),
      priceDivision: z.union([z.literal(1), z.literal(2)]).optional().describe("価格区分"),
      startDate: z.string().optional().describe("適用開始日"),
      limit: z.number().optional().describe("上限数"),
      page: z.number().optional().describe("ページ"),
      fields: z.array(z.string()).optional().describe("検索パラメータ（カンマ区切りで指定可）"),
    }),
    path: z.object({
      store_id: z.number(),
    }),
  }),
  response: z.object({
    items: z.array(ProductPrice).optional(),
    total: z.number().optional(),
    limit: z.number().optional().describe("上限数"),
    page: z.number().optional().describe("ページ"),
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
      fields: z.array(z.string()).optional().describe("検索パラメータ（カンマ区切りで指定可）"),
      sort: z.string().optional().describe("並び順（カンマ区切りで指定可）"),
      limit: z.number().optional().describe("上限数"),
      page: z.number().optional().describe("ページ"),
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
      id: z.string().describe("顧客タイプセクションID"),
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
      id: z.string().describe("顧客タイプセクションID"),
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
      fields: z.array(z.string()).optional().describe("検索パラメータ（カンマ区切りで指定可）"),
      sort: z.string().optional().describe("並び順（カンマ区切りで指定可）"),
      limit: z.number().optional().describe("上限数"),
      page: z.number().optional().describe("ページ"),
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
      id: z.string().describe("顧客タイプセクションID"),
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
      id: z.string().describe("顧客タイプセクションID"),
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
      fields: z.array(z.string()).optional().describe("検索パラメータ（カンマ区切りで指定可）"),
      sort: z.string().optional().describe("並び順（カンマ区切りで指定可）"),
      limit: z.number().optional().describe("上限数"),
      page: z.number().optional().describe("ページ"),
      staff_id: z.string().optional(),
      staff_code: z.string().optional(),
      first_name: z.string().optional(),
      last_name: z.string().optional(),
      first_name_kana: z.string().optional(),
      last_name_kana: z.string().optional(),
      tel: z.string().optional().describe("電話番号（部分一致）"),
      mobile_phone: z.string().optional(),
      mail: z.string().optional().describe("メールアドレス（部分一致）"),
      staff_authorization: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.literal("3")]).optional(),
      store_id: z.string().optional(),
      role_id: z.string().optional(),
      status: z.union([z.literal("1"), z.literal("2")]).optional().describe("ステータス"),
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
      staffCode: z.string().describe("スタッフコード"),
      firstName: z.union([z.string(), z.undefined()]).optional().describe("名前（部分一致）"),
      lastName: z.union([z.string(), z.undefined()]).optional().describe("苗字（部分一致）"),
      firstNameKana: z.union([z.string(), z.undefined()]).optional().describe("名前カナ（部分一致）"),
      lastNameKana: z.union([z.string(), z.undefined()]).optional().describe("苗字カナ（部分一致）"),
      tel: z.union([z.string(), z.undefined()]).optional().describe("電話番号（部分一致）"),
      mobilePhone: z.union([z.string(), z.undefined()]).optional().describe("携帯電話番号（部分一致）"),
      mail: z.union([z.string(), z.undefined()]).optional().describe("メールアドレス（部分一致）"),
      zipCode: z.union([z.string(), z.undefined()]).optional().describe("郵便番号（部分一致）"),
      address: z.union([z.string(), z.undefined()]).optional().describe("住所（部分一致）"),
      password: z.string(),
      staffAuthorization: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.literal("3")]).describe("権限(0:なし, 1:店舗管理者, 2:店舗スタッフ, 3:システム管理者)"),
      salePassword: z.union([z.string(), z.undefined()]).optional(),
      startAtHourOfDay: z.union([z.string(), z.undefined()]).optional(),
      endAtHourOfDay: z.union([z.string(), z.undefined()]).optional(),
      storeIds: z.union([z.array(z.string()), z.undefined()]).optional(),
      roleIds: z.union([z.array(z.string()), z.undefined()]).optional(),
      status: z.union([z.literal("1"), z.literal("2"), z.undefined()]).optional().describe("ステータス"),
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
      id: z.string().describe("顧客タイプセクションID"),
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
      id: z.string().describe("顧客タイプセクションID"),
    }),
    body: z.object({
      staffCode: z.string().optional().describe("スタッフコード"),
      firstName: z.string().optional().describe("名前（部分一致）"),
      lastName: z.string().optional().describe("苗字（部分一致）"),
      firstNameKana: z.string().optional().describe("名前カナ（部分一致）"),
      lastNameKana: z.string().optional().describe("苗字カナ（部分一致）"),
      tel: z.string().optional().describe("電話番号（部分一致）"),
      mobilePhone: z.string().optional().describe("携帯電話番号（部分一致）"),
      mail: z.string().optional().describe("メールアドレス（部分一致）"),
      zipCode: z.string().optional().describe("郵便番号（部分一致）"),
      address: z.string().optional().describe("住所（部分一致）"),
      password: z.string().optional(),
      staffAuthorization: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.literal("3")]).optional().describe("権限(0:なし, 1:店舗管理者, 2:店舗スタッフ, 3:システム管理者)"),
      salePassword: z.string().optional(),
      startAtHourOfDay: z.string().optional(),
      endAtHourOfDay: z.string().optional(),
      storeIds: z.array(z.string()).optional(),
      roleIds: z.array(z.string()).optional(),
      status: z.union([z.literal("1"), z.literal("2")]).optional().describe("ステータス"),
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
      id: z.string().describe("顧客タイプセクションID"),
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
      fields: z.array(z.string()).optional().describe("検索パラメータ（カンマ区切りで指定可）"),
      sort: z.string().optional().describe("並び順（カンマ区切りで指定可）"),
      limit: z.number().optional().describe("上限数"),
      page: z.number().optional().describe("ページ"),
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
      id: z.string().describe("顧客タイプセクションID"),
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
      id: z.string().describe("顧客タイプセクションID"),
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
      id: z.string().describe("顧客タイプセクションID"),
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
      fields: z.array(z.string()).optional().describe("検索パラメータ（カンマ区切りで指定可）"),
      sort: z.string().optional().describe("並び順（カンマ区切りで指定可）"),
      limit: z.number().optional().describe("上限数"),
      page: z.number().optional().describe("ページ"),
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
      fields: z.array(z.string()).optional().describe("検索パラメータ（カンマ区切りで指定可）"),
      sort: z.string().optional().describe("並び順（カンマ区切りで指定可）"),
      limit: z.number().optional().describe("上限数"),
      page: z.number().optional().describe("ページ"),
      budget_id: z.string().optional(),
      store_id: z.string().optional(),
      "ins_date_time-from": z.string().optional(),
      "ins_date_time-to": z.string().optional(),
      "upd_date_time-from": z.string().optional(),
      "upd_date_time-to": z.string().optional(),
    }),
    path: z.object({
      date: z.string().describe("日付（YYYY-MM-DD形式）"),
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
      date: z.string().describe("日付（YYYY-MM-DD形式）"),
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
      date: z.string().describe("日付（YYYY-MM-DD形式）"),
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
      date: z.string().describe("日付（YYYY-MM-DD形式）"),
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
      fields: z.array(z.string()).optional().describe("検索パラメータ（カンマ区切りで指定可）"),
      sort: z.string().optional().describe("並び順（カンマ区切りで指定可）"),
      limit: z.number().optional().describe("上限数"),
      page: z.number().optional().describe("ページ"),
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
      fields: z.array(z.string()).optional().describe("検索パラメータ（カンマ区切りで指定可）"),
      sort: z.string().optional().describe("並び順（カンマ区切りで指定可）"),
      limit: z.number().optional().describe("上限数"),
      page: z.number().optional().describe("ページ"),
      supplier_id: z.string().optional(),
      supplier_code: z.string().optional(),
      supplier_name: z.string().optional(),
      supplier_abbr: z.string().optional(),
      supplier_division_id: z.string().optional(),
      phone_number: z.string().optional(),
      status: z.union([z.literal("0"), z.literal("1")]).optional().describe("ステータス"),
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
      id: z.string().describe("顧客タイプセクションID"),
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
      id: z.string().describe("顧客タイプセクションID"),
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
      id: z.string().describe("顧客タイプセクションID"),
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
      fields: z.array(z.string()).optional().describe("検索パラメータ（カンマ区切りで指定可）"),
      sort: z.string().optional().describe("並び順（カンマ区切りで指定可）"),
      limit: z.number().optional().describe("上限数"),
      page: z.number().optional().describe("ページ"),
      supplier_product_id: z.string().optional(),
      product_id: z.string().optional(),
      product_code: z.string().optional(),
      product_name: z.string().optional(),
      supplier_product_code: z.string().optional(),
      supplier_product_name: z.string().optional(),
      status: z.union([z.literal("0"), z.literal("1")]).optional().describe("ステータス"),
      "ins_date_time-from": z.string().optional(),
      "ins_date_time-to": z.string().optional(),
      "upd_date_time-from": z.string().optional(),
      "upd_date_time-to": z.string().optional(),
    }),
    path: z.object({
      id: z.string().describe("顧客タイプセクションID"),
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
      id: z.string().describe("顧客タイプセクションID"),
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
      fields: z.array(z.string()).optional().describe("検索パラメータ（カンマ区切りで指定可）"),
      sort: z.string().optional().describe("並び順（カンマ区切りで指定可）"),
      limit: z.number().optional().describe("上限数"),
      page: z.number().optional().describe("ページ"),
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
      id: z.string().describe("顧客タイプセクションID"),
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
      id: z.string().describe("顧客タイプセクションID"),
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
      id: z.string().describe("顧客タイプセクションID"),
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
      fields: z.array(z.string()).optional().describe("検索パラメータ（カンマ区切りで指定可）"),
      sort: z.string().optional().describe("並び順（カンマ区切りで指定可）"),
      limit: z.number().optional().describe("上限数"),
      page: z.number().optional().describe("ページ"),
      terminal_id: z.string().optional(),
      terminal_code: z.string().optional(),
      terminal_name: z.string().optional(),
      store_id: z.string().optional(),
      terminal_type: z.union([z.literal("1"), z.literal("2"), z.literal("3")]).optional(),
      status: z.union([z.literal("0"), z.literal("1")]).optional().describe("ステータス"),
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
      id: z.string().describe("顧客タイプセクションID"),
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
      id: z.string().describe("顧客タイプセクションID"),
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
      id: z.string().describe("顧客タイプセクションID"),
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
      fields: z.array(z.string()).optional().describe("検索パラメータ（カンマ区切りで指定可）"),
      sort: z.string().optional().describe("並び順（カンマ区切りで指定可）"),
      limit: z.number().optional().describe("上限数"),
      page: z.number().optional().describe("ページ"),
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
      fields: z.array(z.string()).optional().describe("検索パラメータ（カンマ区切りで指定可）"),
      sort: z.string().optional().describe("並び順（カンマ区切りで指定可）"),
      limit: z.number().optional().describe("上限数"),
      page: z.number().optional().describe("ページ"),
      daily_settlement_id: z.string().optional(),
      store_id: z.string().optional(),
      "business_date-from": z.string().optional(),
      "business_date-to": z.string().optional(),
      "closing_date-from": z.string().optional(),
      "closing_date-to": z.string().optional(),
      "closing_date_time-from": z.string().optional(),
      "closing_date_time-to": z.string().optional(),
      staff_id: z.string().optional(),
      status: z.union([z.literal("0"), z.literal("1")]).optional().describe("ステータス"),
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
      fields: z.array(z.string()).optional().describe("検索パラメータ（カンマ区切りで指定可）"),
      sort: z.string().optional().describe("並び順（カンマ区切りで指定可）"),
      limit: z.number().optional().describe("上限数"),
      page: z.number().optional().describe("ページ"),
      payment_method_id: z.string().optional(),
      payment_method_code: z.string().optional(),
      payment_method_name: z.string().optional(),
      payment_method_division_id: z.string().optional(),
      amount_input_type: z.union([z.literal("0"), z.literal("1"), z.literal("2")]).optional(),
      change_type: z.union([z.literal("0"), z.literal("1"), z.literal("2")]).optional(),
      status: z.union([z.literal("0"), z.literal("1")]).optional().describe("ステータス"),
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
      id: z.string().describe("顧客タイプセクションID"),
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
      id: z.string().describe("顧客タイプセクションID"),
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
      id: z.string().describe("顧客タイプセクションID"),
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
      fields: z.array(z.string()).optional().describe("検索パラメータ（カンマ区切りで指定可）"),
      sort: z.string().optional().describe("並び順（カンマ区切りで指定可）"),
      limit: z.number().optional().describe("上限数"),
      page: z.number().optional().describe("ページ"),
      store_payment_method_id: z.string().optional(),
      payment_method_id: z.string().optional(),
      status: z.union([z.literal("0"), z.literal("1")]).optional().describe("ステータス"),
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
      fields: z.array(z.string()).optional().describe("検索パラメータ（カンマ区切りで指定可）"),
      sort: z.string().optional().describe("並び順（カンマ区切りで指定可）"),
      limit: z.number().optional().describe("上限数"),
      page: z.number().optional().describe("ページ"),
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
      id: z.string().describe("顧客タイプセクションID"),
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
      id: z.string().describe("顧客タイプセクションID"),
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
      id: z.string().describe("顧客タイプセクションID"),
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
      fields: z.array(z.string()).optional().describe("検索パラメータ（カンマ区切りで指定可）"),
      sort: z.string().optional().describe("並び順（カンマ区切りで指定可）"),
      limit: z.number().optional().describe("上限数"),
      page: z.number().optional().describe("ページ"),
      app_payment_method_id: z.string().optional(),
      payment_method_id: z.string().optional(),
      app_payment_code: z.string().optional(),
      status: z.union([z.literal("0"), z.literal("1")]).optional().describe("ステータス"),
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
      id: z.string().describe("顧客タイプセクションID"),
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
      id: z.string().describe("顧客タイプセクションID"),
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
      limit: z.number().optional().describe("上限数"),
      page: z.number().optional().describe("ページ"),
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
    id: z.number().optional().describe("顧客タイプセクションID"),
  }),
};

export type get_GetCoupon = typeof get_GetCoupon;
export const get_GetCoupon = {
  method: z.literal("GET"),
  path: z.literal("/coupons/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.number().describe("顧客タイプセクションID"),
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
      id: z.number().describe("顧客タイプセクションID"),
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
      id: z.number().describe("顧客タイプセクションID"),
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
      limit: z.number().optional().describe("上限数"),
      page: z.number().optional().describe("ページ"),
    }),
    path: z.object({
      id: z.number().describe("顧客タイプセクションID"),
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
      id: z.number().describe("顧客タイプセクションID"),
    }),
    body: CouponProductCreate,
  }),
  response: z.object({
    id: z.number().optional().describe("顧客タイプセクションID"),
  }),
};

export type get_GetCouponProduct = typeof get_GetCouponProduct;
export const get_GetCouponProduct = {
  method: z.literal("GET"),
  path: z.literal("/coupons/{id}/products/{couponProductId}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.number().describe("顧客タイプセクションID"),
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
      id: z.number().describe("顧客タイプセクションID"),
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
      id: z.number().describe("顧客タイプセクションID"),
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
      fields: z.array(z.string()).optional().describe("検索パラメータ（カンマ区切りで指定可）"),
      sort: z.string().optional().describe("並び順（カンマ区切りで指定可）"),
      limit: z.number().optional().describe("上限数"),
      page: z.number().optional().describe("ページ"),
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
      fields: z.array(z.string()).optional().describe("検索パラメータ（カンマ区切りで指定可）"),
    }),
    path: z.object({
      id: z.string().describe("顧客タイプセクションID"),
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
      id: z.string().describe("顧客タイプセクションID"),
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
      id: z.string().describe("顧客タイプセクションID"),
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
      fields: z.array(z.string()).optional().describe("検索パラメータ（カンマ区切りで指定可）"),
      sort: z.string().optional().describe("並び順（カンマ区切りで指定可）"),
      limit: z.number().optional().describe("上限数"),
      page: z.number().optional().describe("ページ"),
    }),
    path: z.object({
      id: z.string().describe("顧客タイプセクションID"),
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
      fields: z.array(z.string()).optional().describe("検索パラメータ（カンマ区切りで指定可）"),
      sort: z.string().optional().describe("並び順（カンマ区切りで指定可）"),
      limit: z.number().optional().describe("上限数"),
      page: z.number().optional().describe("ページ"),
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
      fields: z.array(z.string()).optional().describe("検索パラメータ（カンマ区切りで指定可）"),
    }),
    path: z.object({
      id: z.string().describe("顧客タイプセクションID"),
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
      id: z.string().describe("顧客タイプセクションID"),
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
      id: z.string().describe("顧客タイプセクションID"),
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
      fields: z.array(z.string()).optional().describe("検索パラメータ（カンマ区切りで指定可）"),
      sort: z.string().optional().describe("並び順（カンマ区切りで指定可）"),
      limit: z.number().optional().describe("上限数"),
      page: z.number().optional().describe("ページ"),
      order_id: z.string().optional(),
      store_id: z.string().optional(),
      supplier_id: z.string().optional(),
      "estimated_arrival_date-from": z.string().optional(),
      "estimated_arrival_date-to": z.string().optional(),
      "order_date-from": z.string().optional(),
      "order_date-to": z.string().optional(),
      status: z.union([z.literal("0"), z.literal("1"), z.literal("2"), z.literal("3")]).optional().describe("ステータス"),
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
      fields: z.array(z.string()).optional().describe("検索パラメータ（カンマ区切りで指定可）"),
    }),
    path: z.object({
      id: z.string().describe("顧客タイプセクションID"),
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
      id: z.string().describe("顧客タイプセクションID"),
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
      id: z.string().describe("顧客タイプセクションID"),
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
      fields: z.array(z.string()).optional().describe("検索パラメータ（カンマ区切りで指定可）"),
      sort: z.string().optional().describe("並び順（カンマ区切りで指定可）"),
      limit: z.number().optional().describe("上限数"),
      page: z.number().optional().describe("ページ"),
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
      fields: z.array(z.string()).optional().describe("検索パラメータ（カンマ区切りで指定可）"),
      sort: z.string().optional().describe("並び順（カンマ区切りで指定可）"),
      limit: z.number().optional().describe("上限数"),
      page: z.number().optional().describe("ページ"),
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
      fields: z.array(z.string()).optional().describe("検索パラメータ（カンマ区切りで指定可）"),
      sort: z.string().optional().describe("並び順（カンマ区切りで指定可）"),
      limit: z.number().optional().describe("上限数"),
      page: z.number().optional().describe("ページ"),
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
      fields: z.array(z.string()).optional().describe("検索パラメータ（カンマ区切りで指定可）"),
    }),
    path: z.object({
      id: z.string().describe("顧客タイプセクションID"),
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
      id: z.string().describe("顧客タイプセクションID"),
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
      fields: z.array(z.string()).optional().describe("検索パラメータ（カンマ区切りで指定可）"),
      sort: z.string().optional().describe("並び順（カンマ区切りで指定可）"),
      limit: z.number().optional().describe("上限数"),
      page: z.number().optional().describe("ページ"),
    }),
    path: z.object({
      id: z.string().describe("顧客タイプセクションID"),
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
      fields: z.array(z.string()).optional().describe("検索パラメータ（カンマ区切りで指定可）"),
      sort: z.string().optional().describe("並び順（カンマ区切りで指定可）"),
      limit: z.number().optional().describe("上限数"),
      page: z.number().optional().describe("ページ"),
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
      fields: z.array(z.string()).optional().describe("検索パラメータ（カンマ区切りで指定可）"),
    }),
    path: z.object({
      id: z.string().describe("顧客タイプセクションID"),
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
      id: z.string().describe("顧客タイプセクションID"),
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
      id: z.string().describe("顧客タイプセクションID"),
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
      fields: z.array(z.string()).optional().describe("検索パラメータ（カンマ区切りで指定可）"),
      sort: z.string().optional().describe("並び順（カンマ区切りで指定可）"),
      limit: z.number().optional().describe("上限数"),
      page: z.number().optional().describe("ページ"),
    }),
    path: z.object({
      id: z.string().describe("顧客タイプセクションID"),
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
      division: z.number().optional().describe("入庫区分（1:仕入、2:店舗間移動、3:返品）"),
      status: z.number().optional().describe("ステータス"),
      target_date_from: z.string().optional(),
      target_date_to: z.string().optional(),
      limit: z.number().optional().describe("上限数"),
      page: z.number().optional().describe("ページ"),
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
      division: z.number().describe("入庫区分（1:仕入、2:店舗間移動、3:返品）"),
      status: z.number().describe("ステータス"),
      storeId: z.number().describe("店舗ID"),
      supplierStoreId: z.union([z.number(), z.undefined()]).optional(),
      supplierId: z.union([z.number(), z.undefined()]).optional().describe("仕入先ID"),
      arrivalId: z.union([z.number(), z.undefined()]).optional().describe("入荷ID"),
      arrivalDate: z.union([z.string(), z.undefined()]).optional(),
      orderId: z.union([z.number(), z.undefined()]).optional().describe("発注ID"),
      targetDate: z.string(),
      estimatedDate: z.union([z.string(), z.undefined()]).optional(),
      staffId: z.union([z.number(), z.undefined()]).optional().describe("スタッフID"),
      memo: z.union([z.string(), z.undefined()]).optional(),
      details: z.array(
        z.object({
          productId: z.number().describe("商品ID"),
          quantity: z.number(),
          costPrice: z.union([z.number(), z.undefined()]).optional(),
          memo: z.union([z.string(), z.undefined()]).optional(),
        }),
      ),
    }),
  }),
  response: z.object({
    id: z.number().optional().describe("顧客タイプセクションID"),
  }),
};

export type get_GetIncomingStock = typeof get_GetIncomingStock;
export const get_GetIncomingStock = {
  method: z.literal("GET"),
  path: z.literal("/incoming_stocks/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.number().describe("顧客タイプセクションID"),
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
      id: z.number().describe("顧客タイプセクションID"),
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
      id: z.number().describe("顧客タイプセクションID"),
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
      limit: z.number().optional().describe("上限数"),
      page: z.number().optional().describe("ページ"),
    }),
    path: z.object({
      id: z.number().describe("顧客タイプセクションID"),
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
      id: z.number().describe("顧客タイプセクションID"),
    }),
    body: z.object({
      details: z.array(
        z.object({
          id: z.number().describe("顧客タイプセクションID"),
          productId: z.number().describe("商品ID"),
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
      division: z.number().optional().describe("入庫区分（1:仕入、2:店舗間移動、3:返品）"),
      status: z.number().optional().describe("ステータス"),
      target_date_from: z.string().optional(),
      target_date_to: z.string().optional(),
      limit: z.number().optional().describe("上限数"),
      page: z.number().optional().describe("ページ"),
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
    id: z.number().optional().describe("顧客タイプセクションID"),
  }),
};

export type get_GetOutgoingStock = typeof get_GetOutgoingStock;
export const get_GetOutgoingStock = {
  method: z.literal("GET"),
  path: z.literal("/outgoing_stocks/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.number().describe("顧客タイプセクションID"),
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
      id: z.number().describe("顧客タイプセクションID"),
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
      id: z.number().describe("顧客タイプセクションID"),
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
      limit: z.number().optional().describe("上限数"),
      page: z.number().optional().describe("ページ"),
    }),
    path: z.object({
      id: z.number().describe("顧客タイプセクションID"),
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
      id: z.number().describe("顧客タイプセクションID"),
    }),
    body: z.object({
      details: z.array(
        z.object({
          id: z.number().describe("顧客タイプセクションID"),
          productId: z.number().describe("商品ID"),
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
      status: z.number().optional().describe("ステータス"),
      target_date_from: z.string().optional(),
      target_date_to: z.string().optional(),
      limit: z.number().optional().describe("上限数"),
      page: z.number().optional().describe("ページ"),
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
      outgoingStockId: z.number().describe("出庫ID"),
      storeId: z.number().describe("店舗ID"),
      requestDate: z.string(),
      requestReason: z.string(),
      requestStaffId: z.union([z.number(), z.undefined()]).optional(),
    }),
  }),
  response: z.object({
    id: z.number().optional().describe("顧客タイプセクションID"),
  }),
};

export type get_GetCorrectionOutgoingStock = typeof get_GetCorrectionOutgoingStock;
export const get_GetCorrectionOutgoingStock = {
  method: z.literal("GET"),
  path: z.literal("/correction_requests/outgoing_stocks/{id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      id: z.number().describe("顧客タイプセクションID"),
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
      id: z.number().describe("顧客タイプセクションID"),
    }),
    body: z.object({
      status: z.number().describe("ステータス"),
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
      id: z.number().describe("顧客タイプセクションID"),
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
      limit: z.number().optional().describe("上限数"),
      page: z.number().optional().describe("ページ"),
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
      stocktakingName: z.string().describe("棚卸名"),
      storeId: z.number().describe("店舗ID"),
      stocktakingStatus: z.number().describe("棚卸ステータス（1:集計中、2:完了）"),
      startDate: z.string().describe("適用開始日"),
      endDate: z.union([z.string(), z.undefined()]).optional(),
      stockAmount: z.union([z.number(), z.undefined()]).optional(),
      staffId: z.union([z.number(), z.undefined()]).optional().describe("スタッフID"),
      memo: z.union([z.string(), z.undefined()]).optional(),
      isExcludeOutOfStock: z.union([z.boolean(), z.undefined()]).optional(),
      categoryTarget: z.union([z.number(), z.undefined()]).optional(),
      categoryIds: z.union([z.array(z.number()), z.undefined()]).optional(),
    }),
  }),
  response: z.object({
    id: z.number().optional().describe("顧客タイプセクションID"),
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
      limit: z.number().optional().describe("上限数"),
      page: z.number().optional().describe("ページ"),
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
      stocktakingId: z.number().describe("棚卸ID"),
      storeId: z.number().describe("店舗ID"),
      categoryId: z.number().describe("部門ID"),
      isComplete: z.boolean().describe("棚卸実施済みフラグ（0:未実施、1:実施済み）"),
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
      barcode: z.string().optional().describe("バーコード"),
      is_counted: z.number().optional(),
      limit: z.number().optional().describe("上限数"),
      page: z.number().optional().describe("ページ"),
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
      stocktakingId: z.number().describe("棚卸ID"),
      storeId: z.number().describe("店舗ID"),
      productId: z.number().describe("商品ID"),
      countedQuantity: z.number(),
      isCounted: z.boolean().describe("商品カウント済みフラグ（0:未カウント、1:カウント済み）"),
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
      limit: z.number().optional().describe("上限数"),
      page: z.number().optional().describe("ページ"),
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
      stocktakingId: z.number().describe("棚卸ID"),
      storeId: z.number().describe("店舗ID"),
      productId: z.number().describe("商品ID"),
      inventoryQuantity: z.number(),
      countedQuantity: z.number(),
    }),
  }),
  response: z.object({
    id: z.number().optional().describe("顧客タイプセクションID"),
  }),
};

export type patch_UpdateStocktakingStock = typeof patch_UpdateStocktakingStock;
export const patch_UpdateStocktakingStock = {
  method: z.literal("PATCH"),
  path: z.literal("/stocktakings/stocks"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    body: z.object({
      stocktakingId: z.number().describe("棚卸ID"),
      storeId: z.number().describe("店舗ID"),
      productId: z.number().describe("商品ID"),
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
    id: z.number().optional().describe("顧客タイプセクションID"),
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
      code: z.string().optional().describe("顧客タイプコード"),
      name: z.string().optional().describe("セクション名"),
      limit: z.number().optional().describe("上限数"),
      page: z.number().optional().describe("ページ"),
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
    id: z.number().optional().describe("顧客タイプセクションID"),
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
      name: z.string().optional().describe("セクション名"),
      limit: z.number().optional().describe("上限数"),
      page: z.number().optional().describe("ページ"),
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
