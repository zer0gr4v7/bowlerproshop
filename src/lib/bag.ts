/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const BAG_KEY = 'bowlerproshop_bag';

export interface BagItem {
  product_name: string;
  brand: string;
  category: string;
  amazon_search_query: string;
  match_score: number;
  match_reason: string;
  price_tier: string;
}

export const MyBag = {
  add: (product: BagItem) => {
    const bag = MyBag.getAll();
    if (!bag.find(p => p.product_name === product.product_name)) {
      const newBag = [...bag, product];
      localStorage.setItem(BAG_KEY, JSON.stringify(newBag));
      return newBag;
    }
    return bag;
  },
  remove: (productName: string) => {
    const bag = MyBag.getAll().filter(p => p.product_name !== productName);
    localStorage.setItem(BAG_KEY, JSON.stringify(bag));
    return bag;
  },
  getAll: (): BagItem[] => {
    try {
      const data = localStorage.getItem(BAG_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Failed to parse bag from localStorage", e);
      return [];
    }
  },
  clear: () => {
    localStorage.removeItem(BAG_KEY);
  },
};
