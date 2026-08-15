import { Injectable, inject } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PricingApiService } from './pricing-api.service';
import { MockPricingService } from './mock-pricing.service';
import {
  CompetitiveSummaryBatchRequest,
  CompetitiveSummaryRequestItem,
  PriceMonitoringRow
} from '../models/pricing.model';

/**
 * Fachada usada pelos componentes. Decide entre dados mockados
 * (desenvolvimento) e a chamada real ao backend proxy da SP-API,
 * consolidando o resultado no formato PriceMonitoringRow usado na tabela.
 */
@Injectable({ providedIn: 'root' })
export class PricingFacadeService {
  private readonly api = inject(PricingApiService);
  private readonly mock = inject(MockPricingService);

  getMonitoringRows(asins: string[] = []): Observable<PriceMonitoringRow[]> {
    if (environment.useMock && asins.length === 0) {
      return this.mock.getMonitoringRows();
    }

    if (environment.useMock) {
      return this.mock.getMonitoringRows();
    }

    const normalized = this.normalizeAsins(asins);
    if (!normalized.length) {
      return of([]);
    }

    return this.getMonitoringRowsFromApi(normalized);
  }

  /** Monta o request batch da SP-API para uma lista de ASINs e mapeia a resposta. */
  private getMonitoringRowsFromApi(asins: string[]): Observable<PriceMonitoringRow[]> {
    return this.api.getCompetitiveSummaryByAsins(asins).pipe(
      map((response) =>
        response.items.map((item): PriceMonitoringRow => {
          const listingPrice = item.listingPrice?.amount ?? 0;
          const buyBoxPrice = item.buyBox?.price?.amount ?? item.lowestPrice?.price?.amount ?? 0;
          const myPrice = listingPrice || buyBoxPrice;
          const amazonPrice = buyBoxPrice || listingPrice || 0;
          const priceDifference = Number((myPrice - amazonPrice).toFixed(2));
          const status: PriceMonitoringRow['status'] =
            myPrice > 0 && priceDifference > 0 ? 'PERDENDO' : 'GANHANDO';
          const recommendedAction: PriceMonitoringRow['recommendedAction'] =
            myPrice > 0 && priceDifference > 0 ? 'Baixar Preço' : 'Manter Preço';

          return {
            asin: item.asin ?? 'Não Informado',
            brand: item.brand ?? 'Não Informado',
            product: item.title ?? 'Não Informado',
            imageUrl: item.imageUrl ?? '',
            stock: 0,
            daysWithoutSale: 0,
            myPrice,
            activeMargin: 0,
            marginToWin: 0,
            amazonPrice,
            priceDifference,
            recommendedAction,
            status,
            winner: item.buyBox?.sellerId ?? item.lowestPrice?.sellerId ?? 'Não Informado'
          };
        })
      )
    );
  }

  private normalizeAsins(asins: string[]): string[] {
    return [...new Set(asins.map((asin) => asin.trim().toUpperCase()).filter(Boolean))];
  }
}
