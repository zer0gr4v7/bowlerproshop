/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum ProductType {
  ACCESSORY = 'accessory',
  SHOES = 'shoes',
  BAGS = 'bags',
  BALLS = 'balls',
}

export enum EvidenceType {
  MANUFACTURER_SPECS = 'manufacturer_specs',
  RETAILER_SPECS = 'retailer_specs',
  OWNER_EXPERIENCE = 'owner_experience',
  EXPERT_REVIEW = 'expert_review',
  USER_REVIEW_SUMMARY = 'user_review_summary',
  UNVERIFIED_PLACEHOLDER = 'unverified_placeholder',
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductType;
  price_estimate: string;
  image_url_placeholder: string;
  affiliate_url: string;
  retailer: string;
  pros: string[];
  cons: string[];
  best_for: string;
  not_for: string;
  evidence_type: EvidenceType;
  status: 'verified' | 'unverified_placeholder';
  specs?: Record<string, any>;
}

export interface GuideCard {
  id: string;
  title: string;
  category: string;
  summary: string;
  last_updated: string;
  difficulty: 'Easy' | 'Intermediate' | 'Expert';
  monetization: string;
  slug: string;
}
