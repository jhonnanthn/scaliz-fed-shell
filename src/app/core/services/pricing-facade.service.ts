import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
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

  getMonitoringRows(): Observable<PriceMonitoringRow[]> {
    if (environment.useMock) {
      return this.mock.getMonitoringRows();
    }
    return this.getMonitoringRowsFromApi();
  }

  /** Monta o request batch da SP-API para uma lista de ASINs e mapeia a resposta. */
  private getMonitoringRowsFromApi(): Observable<PriceMonitoringRow[]> {
    const asins = ['B00ZIAODGE']; // TODO: substituir pela lista real de SKUs/ASINs do catálogo

    const requests: CompetitiveSummaryRequestItem[] = asins.map((asin) => ({
      asin,
      marketplaceId: environment.marketplaceId,
      includedData: ['featuredBuyingOptions', 'referencePrices', 'lowestPricedOffers', 'similarItems'],
      lowestPricedOffersInputs: [
        { itemCondition: 'New', offerType: 'Consumer' },
        { itemCondition: 'Used', offerType: 'Consumer' }
      ],
      uri: '/products/pricing/2022-05-01/items/competitiveSummary',
      method: 'GET'
    }));

    const batchRequest: CompetitiveSummaryBatchRequest = { requests };

    return this.api.getCompetitiveSummary(batchRequest).pipe(
      map((response) =>
        response.responses.map((result): PriceMonitoringRow => {
          const buyBox = result.lowestPricedOffers?.[0]?.lowestPrice?.listingPrice.amount ?? 0;
          const myOffer = result.featuredBuyingOptions?.[0]?.segmentedFeaturedOffers?.[0];
          const myPrice = myOffer?.price.listingPrice.amount ?? 0;
          const priceDifference = Number((myPrice - buyBox).toFixed(2));

          return {
            asin: result.asin,
            brand: 'Não encontrado',
            product: result.asin,
            stock: 0,
            daysWithoutSale: 0,
            myPrice,
            activeMargin: 0,
            marginToWin: 0,
            amazonPrice: buyBox,
            priceDifference,
            recommendedAction: priceDifference > 0 ? 'Baixar Preço' : 'Manter Preço',
            status: priceDifference > 0 ? 'PERDENDO' : 'GANHANDO',
            winner: myOffer?.sellerId ?? 'Amazon.com.br'
          };
        })
      )
    );
  }
}
