import { CommonModule } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SiteLanguageService } from '../shared/site-language.service';
import { Locale, Translation } from '../shared/site-translations';
import { AutoScalingDetailComponent } from './auto-scaling-detail/auto-scaling-detail.component';
import { CommandGroup, CommandPlatform, getIacCommand } from './iac-command.model';
import { LoadBalancerAutoScalingDetailComponent } from './load-balancer-auto-scaling-detail/load-balancer-auto-scaling-detail.component';

const iacGoogleAnalyticsId = 'G-KS1XTY9N6Z';

const iacFiles = [
  {
    fileName: 'AutoScaling1.yaml',
    categories: ['autoscaling'],
    translationKey: 'autoScaling',
  },
  {
    fileName: 'LoadBalancerAutoScaling1.yaml',
    categories: ['autoscaling', 'loadbalancer'],
    translationKey: 'loadBalancerAutoScaling',
  },
] as const;

type IacFile = (typeof iacFiles)[number];
type IacFileName = IacFile['fileName'];
type IacFilter = 'all' | 'autoscaling' | 'loadbalancer';
type SubscribePopupContent = {
  message: string;
  label: string;
  closeLabel: string;
  url: string;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const subscribePopupContent: Record<Locale, SubscribePopupContent> = {
  en: {
    message: 'Subscribe to receive an email when IaC Examples is updated',
    label: 'Subscribe',
    closeLabel: 'Close subscription popup',
    url: 'https://be4394eb.sibforms.com/serve/MUIFAGTxnEUVCiOzQCObZO4EQka--NlTZxKllixpa9G3qjGUL99rKUCY3WcJXiFuzwQQ7w06I3ULqWQJ_nXg1ehJQR89MRUfz308lS51jd3ENFRsFiWjWpRZSv3NmlA0CnWlT8rZK8m_A4RQQjjurfGDjhT3e7Dfqqg2PrFN03nkz5uZs1ibYLN55lvhFmg-4JHnpowC0yR5gPRcHQ==',
  },
  es: {
    message: 'Suscríbete para recibir un email cuando se actualice IaC Examples',
    label: 'Suscríbete',
    closeLabel: 'Cerrar popup de suscripción',
    url: 'https://be4394eb.sibforms.com/serve/MUIFAM0Nw_PHJOq72d5O8NTbA6PMlo9GZL30QtM8qYXei7o0v_v4wfCUFfD53hW07y-fEDDJFf-YyD1Rljgz4pCbnHjmzaWWya01BKUNFVvV9CEeZvsB8X97N2mdwFxN0wFp9lokUxGw_ThGryEbx63DChmTpwrv5-opx9R63Hh7OHAORHw4AwyR4vKKYZeWqAij7gJe9zxrwsPCvA==',
  },
  pt: {
    message: 'Inscreva-se para receber email quando o IaC Examples for atualizado',
    label: 'Inscreva-se',
    closeLabel: 'Fechar popup de inscrição',
    url: 'https://be4394eb.sibforms.com/serve/MUIFAI0T2W-wx7MBXFvKN3MDWQMmI3IVIhe7BmyHJTFAprVwdja4wOZJfqF7_yHn8D-lA3iDLCDABqvgHhIZPm71FDpQGkwHtihYf9CeJwFk5kpozDk2FXvm06kzLifg3YE-Nz8f7Lduexkeo1i24WYjAdTyXwi73nv9WR-m67T8O3P4-sP269BRT3D5yTiIsRAKvqSrAc7YV2aADQ==',
  },
};

@Component({
  selector: 'app-iac',
  standalone: true,
  imports: [CommonModule, AutoScalingDetailComponent, LoadBalancerAutoScalingDetailComponent],
  templateUrl: './iac.component.html',
  styleUrl: './iac.component.css',
})
export class IacComponent {
  private readonly language = inject(SiteLanguageService);
  private readonly route = inject(ActivatedRoute);

  readonly files = iacFiles;
  readonly filters: ReadonlyArray<IacFilter> = ['all', 'autoscaling', 'loadbalancer'];

  activeFilters = new Set<IacFilter>(['all', 'autoscaling', 'loadbalancer']);
  selectedFileName: IacFileName = 'AutoScaling1.yaml';
  subscribePopupVisible = true;
  activeCommandPlatform: Record<CommandGroup, CommandPlatform> = {
    keyPair: 'windows',
    instanceIp: 'windows',
    loadBalancerAccess: 'windows',
    keyPairIp: 'bash',
    stopInstance: 'windows',
  };
  copiedCommand: CommandGroup | null = null;

  constructor() {
    const requestedFile = this.route.snapshot.queryParamMap.get('iacFile');

    if (this.isIacFileName(requestedFile)) {
      this.selectedFileName = requestedFile;
    }

    this.configureIacAnalytics();
  }

  get currentTranslations(): Translation {
    return this.language.currentTranslations();
  }

  get currentPage(): Translation['iacPage'] {
    return this.currentTranslations.iacPage;
  }

  get currentLocale(): Locale {
    return this.language.currentLocale();
  }

  get languageOptions(): SiteLanguageService['languageOptions'] {
    return this.language.languageOptions;
  }

  get subscribePopupContent(): SubscribePopupContent {
    return subscribePopupContent[this.currentLocale];
  }

  get categoryFilters(): ReadonlyArray<IacFilter> {
    return this.filters.filter((filter) => filter !== 'all');
  }

  get visibleFiles(): ReadonlyArray<IacFile> {
    if (this.activeFilters.has('all')) {
      return this.files;
    }

    return this.files.filter((file) =>
      file.categories.some((category) => this.activeFilters.has(category)),
    );
  }

  get selectedFile(): IacFile {
    return this.files.find((file) => file.fileName === this.selectedFileName) ?? this.files[0];
  }

  isFilterActive(filter: IacFilter): boolean {
    return this.activeFilters.has(filter);
  }

  setFilter(filter: IacFilter): void {
    if (filter === 'all') {
      this.activeFilters = this.activeFilters.has('all')
        ? new Set<IacFilter>()
        : new Set<IacFilter>(['all', ...this.categoryFilters]);
    } else {
      const nextFilters = new Set(this.activeFilters);
      nextFilters.delete('all');

      if (nextFilters.has(filter)) {
        nextFilters.delete(filter);
      } else {
        nextFilters.add(filter);
      }

      const allCategoryFiltersActive = this.categoryFilters.every((categoryFilter) =>
        nextFilters.has(categoryFilter),
      );

      if (allCategoryFiltersActive) {
        nextFilters.add('all');
      }

      this.activeFilters = nextFilters;
    }

    const nextVisibleFiles = this.visibleFiles;
    if (
      nextVisibleFiles.length > 0 &&
      !nextVisibleFiles.some((file) => file.fileName === this.selectedFileName)
    ) {
      this.selectedFileName = nextVisibleFiles[0].fileName;
    }
  }

  selectFile(fileName: IacFileName): void {
    this.selectedFileName = fileName;
  }

  setPopupLanguage(locale: Locale): void {
    this.language.setLanguage(locale);
  }

  getLanguageLabel(locale: Locale): string {
    return this.language.getLanguageLabel(locale);
  }

  closeSubscribePopup(): void {
    this.subscribePopupVisible = false;
  }

  closeSubscribePopupOnBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeSubscribePopup();
    }
  }

  setCommandPlatform(group: CommandGroup, platform: CommandPlatform): void {
    this.activeCommandPlatform = {
      ...this.activeCommandPlatform,
      [group]: platform,
    };
  }

  getCommand(group: CommandGroup, platformOverride?: CommandPlatform): string {
    return getIacCommand(group, platformOverride ?? this.activeCommandPlatform[group]);
  }

  async copyCommand(group: CommandGroup, platformOverride?: CommandPlatform): Promise<void> {
    const command = this.getCommand(group, platformOverride);

    try {
      await navigator.clipboard.writeText(command);
      this.copiedCommand = group;

      window.setTimeout(() => {
        if (this.copiedCommand === group) {
          this.copiedCommand = null;
        }
      }, 1800);
    } catch (error) {
      console.error('Could not copy IaC command:', error);
    }
  }

  @HostListener('document:keydown.escape')
  closeSubscribePopupOnEscape(): void {
    this.closeSubscribePopup();
  }

  private isIacFileName(value: string | null): value is IacFileName {
    return this.files.some((file) => file.fileName === value);
  }

  private configureIacAnalytics(): void {
    window.dataLayer = window.dataLayer ?? [];
    window.gtag =
      window.gtag ??
      ((...args: unknown[]) => {
        window.dataLayer?.push(args);
      });

    window.gtag('config', iacGoogleAnalyticsId);
  }
}
