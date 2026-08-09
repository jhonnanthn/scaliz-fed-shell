import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { PriceMonitoringRow } from '../models/pricing.model';

/**
 * Dados mockados para desenvolvimento do painel, no mesmo formato
 * exibido na planilha "Painel Monitoramento".
 */
@Injectable({ providedIn: 'root' })
export class MockPricingService {
  private readonly rows: PriceMonitoringRow[] = [
    this.row('B00Z1SZUPV', "D'Olive & Co", 'Azeite de Oliva Extra Virgem, Cheiro, 500ml', 177, 1, 77.90, 15.11, 12.78, 75.64, 2.26, 'Baixar Preço', 'PERDENDO', 'MAXX NA SUA CASA'),
    this.row('B004H6JNPR', 'Absolut', 'Vodka Absolut - 1 Litro', 655, 1, 83.90, 1.33, 1.33, 83.90, 0, 'Manter Preço', 'GANHANDO', 'Amazon.com.br'),
    this.row('B0D1CSFCQ1', 'Kian', 'Aquecedor elétrico Kian AQ-100 1800W 2 níveis branco', 198, 2, 69.90, 11.54, 7.25, 66.40, 3.50, 'Manter Preço', 'GANHANDO', 'MAXX NA SUA CASA'),
    this.row('B0H46NTMCT', 'Kian', 'Sanduicheira Grill 127V 750W Preto - Amadeu', 177, 1, 83.90, 1.33, 1.33, 83.90, 0, 'Manter Preço', 'GANHANDO', 'MAXX NA SUA CASA'),
    this.row('B0H48KS7CL', 'Kian', 'Aquecedor Elétrico AQ-100 1800W 220V Preto de 2 níveis brancos', 160, 1, 83.90, 1.33, 1.33, 83.90, 0, 'Manter Preço', 'GANHANDO', 'MAXX NA SUA CASA'),
    this.row('B004Z4I8MQ', 'Vixenet', 'Cerveja Carta Nevada Ceva Carta Nevado 750ml', 166, 4, 74.90, 0.72, 0.00, 63.94, 10.96, 'Baixar Preço', 'PERDENDO', 'Amazon.com.br'),
    this.row('B004EEDIRS', 'Freixenet', 'Cava Freixenet Cordon Negro Brut 750ml', 97, 1, 78.99, 0.00, 0.00, 78.99, 0, 'Manter Preço', 'GANHANDO', 'Amazon.com.br'),
    this.row('B0H109727F', 'Philco', 'Sanduicheira e Grill Philco 2 em 1 Inox 800W 127V Pgi', 208, 4, 147.26, 21.51, -2.79, 109.91, 37.35, 'Baixar Preço', 'PERDENDO', 'MAXX NA SUA CASA'),
    this.row('B0DB4XVNZ5', 'Tinto', 'Kit Compre 5 e Leve 6 Cordero com Pele de Lobo Malbec', 84, 1, 287.26, 20.03, 16.19, 273.50, 14.26, 'Manter Preço', 'GANHANDO', 'MAXX NA SUA CASA'),
    this.row('B0DDTRY07A', 'Espúmio', 'Vinho Pé Tinto Espúmio 750ml', 590, 1, 45.90, 15.83, -10.87, 34.10, 11.80, 'Baixar Preço', 'PERDENDO', 'Web Mercadorio WM'),
    this.row('B07DDMQHW', 'Vertical', 'Agrado Fero de Passar, Vapore, Branco, 127V', 124, 2, 59.98, 5.44, 5.73, 60.00, -0.20, 'Manter Preço', 'GANHANDO', 'MAXX NA SUA CASA'),
    this.row('B0D3J5LRXL', 'Tinto', 'Sanduicheira Grill Kian Vermelha 127V', 84, 1, 69.90, 15.09, 6.67, 63.08, 6.82, 'Manter Preço', 'GANHANDO', 'MAXX NA SUA CASA'),
    this.row('B0H46S6QS', 'Kian', 'Aquecedor Elétrico AQ-100 1800W 127V Preto de 2 níveis', 90, 1, 83.90, 1.33, 1.33, 83.90, 0, 'Manter Preço', 'GANHANDO', 'MAXX NA SUA CASA'),
    this.row('B0FC63K6ZG', 'FlashDrop', 'ADSX Impressora 3D Multicolorida CoreXY 600mm/s', 95, 1, 4399.00, 85.86, 84.58, 670.00, 3729.00, 'Baixar Preço', 'PERDENDO', 'Shop Faves'),
    this.row('B017C7Q2FP4', 'A ITALY PROFESSI', 'GA.MA ITALY Prancha Wide Keration Pro II Bivolt', 70, 3, 206.00, 20.01, 8.49, 177.90, 28.10, 'Baixar Preço', 'PERDENDO', 'Amazon'),
    this.row('B0H370J121', 'Kian', 'Panela Elétrica Fair Kian AF-105p 3,5l 1200w Preto', 78, 2, 189.90, 14.65, 10.52, 180.40, 9.50, 'Manter Preço', 'GANHANDO', 'MAXX NA SUA CASA'),
    this.row('B0D96TGHNK', 'Não encontrado', 'Kian - Fero de Passar a Vapor 127V 1300W', 58, 1, 61.99, 11.13, 6.82, 58.89, 3.10, 'Manter Preço', 'GANHANDO', 'MAXX NA SUA CASA'),
    this.row('B0F4RML5CL', 'Não encontrado', 'Kian - Panela de Pressão Elétrica 127V 5 Litros Inox Pxf', 75, 5, 334.63, 0, 0, 329.00, 5.63, 'Baixar Preço', 'PERDENDO', 'MERCADO URSO'),
    this.row('B0DKVPC6CD', 'Kian', 'Kian - Mixer 3x1 Turbo Inox 127V 1000W', 84, 2, 160.99, 18.25, 8.53, 142.50, 18.50, 'Manter Preço', 'GANHANDO', 'MAXX NA SUA CASA'),
    this.row('B0F47254P', 'A ITALY PROFESSI', 'GA.MA ITALY Secador de Cabelo Gama Nine Lumina 2', 42, 2, 259.00, 20.08, 12.19, 226.83, 32.17, 'Baixar Preço', 'PERDENDO', 'MAXX NA SUA CASA'),
    this.row('B0C2ONWRG9', 'Não encontrado', 'Vinho Tinto Chileno Perez Cruz Gran Reserva Cabernet', 84, 1, 69.90, 0, 0, 69.90, 0, 'Manter Preço', 'GANHANDO', 'MAXX NA SUA CASA'),
    this.row('B0B84H3MN', 'Oster', 'Fritadeira Ultra Digital 2 em 1 Inox 4,8L com Par', 51, 2, 419.90, 22.44, 14.82, 378.95, 40.95, 'Baixar Preço', 'PERDENDO', 'WINE TIME BRASIL'),
    this.row('B0BX27254H', 'Agretti', 'Agretti Panela elétrica Mangiare APEQ011-01 preta qu', 30, 3, 149.90, 25.14, 25.18, 149.90, 0, 'Manter Preço', 'GANHANDO', 'Magazine MGP'),
    this.row('B0D546H38R', 'Santa Loreto', 'Vinho Fino Chileno Santa Loreto Varietal Cabern', 294, 1, 27.90, 13.32, 13.32, 27.90, 0, 'Manter Preço', 'GANHANDO', 'MAXX NA SUA CASA')
  ];

  getMonitoringRows(): Observable<PriceMonitoringRow[]> {
    return of(this.rows).pipe(delay(300));
  }

  private row(
    asin: string,
    brand: string,
    product: string,
    stock: number,
    daysWithoutSale: number,
    myPrice: number,
    activeMargin: number,
    marginToWin: number,
    amazonPrice: number,
    priceDifference: number,
    recommendedAction: PriceMonitoringRow['recommendedAction'],
    status: PriceMonitoringRow['status'],
    winner: string
  ): PriceMonitoringRow {
    return {
      asin,
      brand,
      product,
      stock,
      daysWithoutSale,
      myPrice,
      activeMargin,
      marginToWin,
      amazonPrice,
      priceDifference,
      recommendedAction,
      status,
      winner
    };
  }
}
