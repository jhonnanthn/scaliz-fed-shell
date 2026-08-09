/**
 * Modelos baseados nas respostas da Amazon Selling Partner API:
 * - Product Pricing API v2022-05-01 (competitiveSummary)
 * - Catalog Items API v2022-04-01
 */

export type ItemCondition = 'New' | 'Used' | 'Collectible' | 'Refurbished' | 'Club';
export type OfferType = 'Consumer' | 'Business';

export interface LowestPricedOfferInput {
  itemCondition: ItemCondition;
  offerType: OfferType;
}

export interface Money {
  amount: number;
  currencyCode: string;
}

export interface OfferIdentifier {
  marketplaceId: string;
  asin: string;
  sellerId?: string;
  itemCondition?: ItemCondition;
}

export interface OfferPrice {
  listingPrice: Money;
  shipping?: Money;
  points?: { pointsNumber: number; pointsMonetaryValue: Money };
}

export interface LowestPricedOffer {
  lowestPrice: OfferPrice;
  offerIdentifier?: OfferIdentifier;
  qualifiers?: Record<string, unknown>;
  offerCount?: number;
}

export interface ReferencePrice {
  name: string;
  price: Money;
}

export interface FeaturedBuyingOption {
  buyingOptionType: string;
  segmentedFeaturedOffers?: Array<{
    condition: ItemCondition;
    price: OfferPrice;
    sellerId?: string;
  }>;
}

/** Um item da resposta do batch /competitiveSummary */
export interface CompetitiveSummaryResult {
  asin: string;
  marketplaceId: string;
  status: number;
  httpStatusLine?: string;
  featuredBuyingOptions?: FeaturedBuyingOption[];
  referencePrices?: ReferencePrice[];
  lowestPricedOffers?: LowestPricedOffer[];
  error?: { code: string; message: string };
}

export interface CompetitiveSummaryRequestItem {
  asin: string;
  marketplaceId: string;
  includedData: Array<
    'featuredBuyingOptions' | 'referencePrices' | 'lowestPricedOffers' | 'similarItems'
  >;
  lowestPricedOffersInputs?: LowestPricedOfferInput[];
  uri: string;
  method: 'GET';
}

export interface CompetitiveSummaryBatchRequest {
  requests: CompetitiveSummaryRequestItem[];
}

export interface CompetitiveSummaryBatchResponse {
  responses: CompetitiveSummaryResult[];
}

/** Item resumido retornado pelo Catalog Items API */
export interface CatalogItemSummary {
  marketplaceId: string;
  brandName?: string;
  itemName?: string;
  manufacturer?: string;
}

export interface CatalogItem {
  asin: string;
  summaries?: CatalogItemSummary[];
  images?: Array<{ marketplaceId: string; images: Array<{ link: string; variant?: string }> }>;
}

export interface CatalogItemsResponse {
  numberOfResults: number;
  items: CatalogItem[];
}

/** Status usado na coluna "Status" do painel */
export type PriceStatus = 'GANHANDO' | 'PERDENDO';

/** Ação recomendada exibida na tabela */
export type RecommendedAction = 'Manter Preço' | 'Baixar Preço' | 'Subir Preço';

/**
 * Linha consolidada do painel de monitoramento (mescla Catálogo + Pricing).
 * É o formato usado diretamente pelo componente de tabela.
 */
export interface PriceMonitoringRow {
  asin: string;
  brand: string;
  product: string;
  imageUrl?: string;
  stock: number;
  daysWithoutSale: number;
  myPrice: number;
  activeMargin: number; // percentual (%)
  marginToWin: number; // percentual (%)
  amazonPrice: number; // preço do buy box / menor preço competidor
  priceDifference: number; // myPrice - amazonPrice
  recommendedAction: RecommendedAction;
  status: PriceStatus;
  winner: string; // nome do seller/marketplace que está ganhando o buy box
  offerUrl?: string;
}
