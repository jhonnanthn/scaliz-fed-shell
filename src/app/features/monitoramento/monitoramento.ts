import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PricingFacadeService } from '../../core/services/pricing-facade.service';
import { PriceMonitoringRow, PriceStatus } from '../../core/models/pricing.model';

type StatusFilter = 'TODOS' | PriceStatus;

@Component({
  selector: 'app-monitoramento',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe, DecimalPipe],
  templateUrl: './monitoramento.html',
  styleUrl: './monitoramento.scss'
})
export class Monitoramento {
  private readonly pricingFacade = inject(PricingFacadeService);

  protected readonly rows = signal<PriceMonitoringRow[]>([]);
  protected readonly loading = signal(true);
  protected readonly searchTerm = signal('');
  protected readonly statusFilter = signal<StatusFilter>('TODOS');
  protected readonly asinsInput = signal('B004V54ZVK, B09SMBB1KN');

  protected readonly filteredRows = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const status = this.statusFilter();

    return this.rows().filter((row) => {
      const matchesTerm =
        !term ||
        row.asin.toLowerCase().includes(term) ||
        row.product.toLowerCase().includes(term) ||
        row.brand.toLowerCase().includes(term);
      const matchesStatus = status === 'TODOS' || row.status === status;
      return matchesTerm && matchesStatus;
    });
  });

  protected readonly summary = computed(() => {
    const rows = this.rows();
    const winning = rows.filter((r) => r.status === 'GANHANDO').length;
    const losing = rows.filter((r) => r.status === 'PERDENDO').length;
    const toLower = rows.filter((r) => r.recommendedAction === 'Baixar Preço').length;
    return { total: rows.length, winning, losing, toLower };
  });

  constructor() {
    this.loadRows();
  }

  protected loadRows(): void {
    const asins = this.parseAsins(this.asinsInput());
    this.loading.set(true);
    this.pricingFacade.getMonitoringRows(asins).subscribe({
      next: (rows) => {
        this.rows.set(rows);
        this.loading.set(false);
      },
      error: () => {
        this.rows.set([]);
        this.loading.set(false);
      }
    });
  }

  protected parseAsins(rawValue: string): string[] {
    return rawValue
      .split(/[\n,]+/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  protected displayValue(value: string | number | undefined | null, fallback = 'Não Informado'): string {
    if (value === undefined || value === null || value === '') {
      return fallback;
    }

    if (typeof value === 'number' && Number.isNaN(value)) {
      return fallback;
    }

    return String(value);
  }

  protected marginClass(value: number): string {
    if (value < 0) return 'cell-danger';
    if (value < 5) return 'cell-warning';
    return 'cell-success';
  }

  protected diffClass(value: number): string {
    return value > 0 ? 'cell-danger' : 'cell-success';
  }

  protected statusClass(status: PriceStatus): string {
    return status === 'GANHANDO' ? 'badge-success' : 'badge-danger';
  }

  protected actionClass(action: PriceMonitoringRow['recommendedAction']): string {
    switch (action) {
      case 'Baixar Preço':
        return 'badge-danger';
      case 'Subir Preço':
        return 'badge-warning';
      default:
        return 'badge-neutral';
    }
  }
}
