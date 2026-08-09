import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CatalogItemsResponse,
  CompetitiveSummaryBatchRequest,
  CompetitiveSummaryBatchResponse
} from '../models/pricing.model';

/**
 * Cliente HTTP para o backend proxy que fala com a Amazon Selling Partner API.
 *
 * IMPORTANTE: a SP-API exige assinatura AWS SigV4 e um access token LWA
 * (Login With Amazon) renovado via refresh_token. Essas credenciais são
 * segredos e NUNCA devem ficar no browser. Por isso o Angular chama um
 * backend (Node/NestJS, .NET, etc.) que:
 *   1. Renova/gera o x-amz-access-token
 *   2. Assina a requisição com SigV4
 *   3. Repassa a chamada para a Amazon e devolve o JSON para o front
 *
 * Endpoints esperados no backend:
 *   POST {apiUrl}/pricing/competitive-summary
 *   GET  {apiUrl}/catalog/items
 */
@Injectable({ providedIn: 'root' })
export class PricingApiService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  /**
   * Espelha: POST /batches/products/pricing/2022-05-01/items/competitiveSummary
   */
  getCompetitiveSummary(
    request: CompetitiveSummaryBatchRequest
  ): Observable<CompetitiveSummaryBatchResponse> {
    return this.http.post<CompetitiveSummaryBatchResponse>(
      `${this.baseUrl}/pricing/competitive-summary`,
      request
    );
  }

  /**
   * Espelha: GET /catalog/2022-04-01/items
   */
  searchCatalogItems(params: {
    keywords?: string;
    identifiers?: string[];
    identifiersType?: 'ASIN' | 'EAN' | 'GTIN' | 'ISBN' | 'JAN' | 'MINSAN' | 'SKU' | 'UPC';
    marketplaceIds?: string[];
    includedData?: string[];
  }): Observable<CatalogItemsResponse> {
    const marketplaceIds = params.marketplaceIds ?? [environment.marketplaceId];
    const includedData = params.includedData ?? [
      'classifications',
      'dimensions',
      'identifiers',
      'images',
      'productTypes',
      'relationships',
      'salesRanks',
      'summaries',
      'vendorDetails'
    ];

    let query = `marketplaceIds=${marketplaceIds.join(',')}&includedData=${includedData.join(',')}`;
    if (params.keywords) {
      query += `&keywords=${encodeURIComponent(params.keywords)}`;
    }
    if (params.identifiers?.length) {
      query += `&identifiers=${params.identifiers.join(',')}`;
      query += `&identifiersType=${params.identifiersType ?? 'ASIN'}`;
    }

    return this.http.get<CatalogItemsResponse>(`${this.baseUrl}/catalog/items?${query}`);
  }
}
