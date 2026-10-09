import { CommonModule } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SiteLanguageService } from '../shared/site-language.service';
import { Locale, Translation } from '../shared/site-translations';
import { AutoScalingDetailComponent } from './auto-scaling-detail/auto-scaling-detail.component';
import { CommandGroup, CommandPlatform, getIacCommand } from './iac-command.model';
import { LoadBalancerAutoScalingDetailComponent } from './load-balancer-auto-scaling-detail/load-balancer-auto-scaling-detail.component';

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

const subscribePopupContent: Record<Locale, SubscribePopupContent> = {
  en: {
    message: 'Subscribe to receive an email when IaC Examples is updated',
    label: 'Subscribe',
    closeLabel: 'Close subscription popup',
    url: 'https://be4394eb.sibforms.com/serve/MUIFAGNPUJqArP90vIyKWdUag9Hhg_YScYIo_Bn0CJqS0q4aRUcubq68iJ6FkLz6Iz876T_9-0P2iSiFdxfCunCCPN6xIIKGU1De02-3kdlIwVzLof5NGhSzTUsPMiZyx4MrEimxTT9Wo1ESTntAXUdFp7K7z_RlPsBefq687UmiUOvCzo06s50pWrFomPxaO8807NcRV64ph0gjBQ==',
  },
  es: {
    message: 'Suscríbete para recibir un email cuando se actualice IaC Examples',
    label: 'Suscríbete',
    closeLabel: 'Cerrar popup de suscripción',
    url: 'https://be4394eb.sibforms.com/serve/MUIFAIChFjQ1MQ0k-R3nOfHwG8N1Pl27BSGqpALvaGWuEoMsuZokUjDf0R_8FSrN5g0qyt5cwcWjbbI2mveMWQfcbe668PzFCgRIpKFlaYObPmizJYhxOzuM3cLokRex40uEQFqk0PSiQCVBw0o4vZOaHv_o9aFWW-B1XPHkCbxbjb3AXLj3dZtV5bpsmysWU0WrTRTDIkpS4wQ6-w==',
  },
  pt: {
    message: 'Inscreva-se para receber email quando o IaC Examples for atualizado',
    label: 'Inscreva-se',
    closeLabel: 'Fechar popup de inscrição',
    url: 'https://be4394eb.sibforms.com/serve/MUIFAFB8YYlzyUtYNLvki0ltBIB_vj4L9t6z25IxEt4XSnomLCRaqRCEf19RnouU02wRf2mpmOqi7culWR41GUDXmXOEO1Qh6-8czVznPX7Q4FUoDx6ZMMNMgu1jDlcKyp5AvC2bI0Jpj2pgv-XVZH2XqTZIMqCFDO226NWWcbUJdtRBcHHeuDqoyyYkVtQEDPuTaBaxVmyL7ICswA==',
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
}
