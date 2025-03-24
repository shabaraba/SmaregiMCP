/**
 * スマレジのデータモデルを定義するクラス
 * APIからのレスポンスを整形するために使用します
 */

/**
 * 商品モデル
 */
class Product {
  constructor(data) {
    this.id = data.product_id;
    this.code = data.product_code;
    this.name = data.product_name;
    this.price = data.price;
    this.categoryId = data.product_category_id;
    this.categoryName = data.category_name;
    this.taxDivision = data.tax_division;
    this.stockControlFlag = data.stock_control_flag;
    this.stockQuantity = data.stock_quantity;
    this.description = data.description;
    this.updateAt = data.update_datetime;
    this.createAt = data.insert_datetime;
    // 他のフィールドも追加可能
  }

  /**
   * APIレスポンスから商品オブジェクトの配列を作成する
   * @param {Array} data - APIレスポンス
   * @returns {Array<Product>} 商品オブジェクトの配列
   */
  static fromApiResponse(data) {
    if (!data || !data.items) {
      return [];
    }
    
    return data.items.map(item => new Product(item));
  }
}

/**
 * 売上モデル
 */
class Sale {
  constructor(data) {
    this.id = data.transaction_head_id;
    this.dateTime = data.transaction_datetime;
    this.totalAmount = data.total_amount;
    this.taxAmount = data.tax_amount;
    this.storeId = data.store_id;
    this.storeName = data.store_name;
    this.customerCode = data.customer_code;
    this.customerName = data.customer_name;
    this.staffId = data.staff_id;
    this.staffName = data.staff_name;
    this.details = data.items ? data.items.map(item => new SaleDetail(item)) : [];
    this.updatedAt = data.update_datetime;
    this.createdAt = data.insert_datetime;
    // 他のフィールドも追加可能
  }

  /**
   * APIレスポンスから売上オブジェクトの配列を作成する
   * @param {Array} data - APIレスポンス
   * @returns {Array<Sale>} 売上オブジェクトの配列
   */
  static fromApiResponse(data) {
    if (!data || !data.items) {
      return [];
    }
    
    return data.items.map(item => new Sale(item));
  }
}

/**
 * 売上詳細モデル
 */
class SaleDetail {
  constructor(data) {
    this.id = data.transaction_detail_id;
    this.transactionId = data.transaction_head_id;
    this.lineNo = data.line_no;
    this.productId = data.product_id;
    this.productCode = data.product_code;
    this.productName = data.product_name;
    this.quantity = data.quantity;
    this.unitPrice = data.unit_price;
    this.amount = data.amount;
    this.taxRate = data.tax_rate;
    this.taxAmount = data.tax_amount;
    this.discountAmount = data.discount_amount;
    this.categoryId = data.product_category_id;
    this.categoryName = data.product_category_name;
    // 他のフィールドも追加可能
  }
}

/**
 * 在庫モデル
 */
class Inventory {
  constructor(data) {
    this.productId = data.product_id;
    this.productCode = data.product_code;
    this.productName = data.product_name;
    this.storeId = data.store_id;
    this.storeName = data.store_name;
    this.quantity = data.stock_quantity;
    this.updatedAt = data.update_datetime;
    // 他のフィールドも追加可能
  }

  /**
   * APIレスポンスから在庫オブジェクトの配列を作成する
   * @param {Array} data - APIレスポンス
   * @returns {Array<Inventory>} 在庫オブジェクトの配列
   */
  static fromApiResponse(data) {
    if (!data || !data.items) {
      return [];
    }
    
    return data.items.map(item => new Inventory(item));
  }
}

/**
 * 店舗モデル
 */
class Store {
  constructor(data) {
    this.id = data.store_id;
    this.name = data.store_name;
    this.postalCode = data.postal_code;
    this.address = data.address;
    this.phoneNumber = data.tel;
    this.email = data.email;
    this.updatedAt = data.update_datetime;
    this.createdAt = data.insert_datetime;
    // 他のフィールドも追加可能
  }

  /**
   * APIレスポンスから店舗オブジェクトの配列を作成する
   * @param {Array} data - APIレスポンス
   * @returns {Array<Store>} 店舗オブジェクトの配列
   */
  static fromApiResponse(data) {
    if (!data || !data.items) {
      return [];
    }
    
    return data.items.map(item => new Store(item));
  }
}

/**
 * 従業員モデル
 */
class Staff {
  constructor(data) {
    this.id = data.staff_id;
    this.code = data.staff_code;
    this.name = data.staff_name;
    this.storeId = data.store_id;
    this.storeName = data.store_name;
    this.roleId = data.staff_role_id;
    this.roleName = data.staff_role_name;
    this.updatedAt = data.update_datetime;
    this.createdAt = data.insert_datetime;
    // 他のフィールドも追加可能
  }

  /**
   * APIレスポンスから従業員オブジェクトの配列を作成する
   * @param {Array} data - APIレスポンス
   * @returns {Array<Staff>} 従業員オブジェクトの配列
   */
  static fromApiResponse(data) {
    if (!data || !data.items) {
      return [];
    }
    
    return data.items.map(item => new Staff(item));
  }
}

module.exports = {
  Product,
  Sale,
  SaleDetail,
  Inventory,
  Store,
  Staff,
};
