import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SiteLanguageService } from '../shared/site-language.service';
import { Translation } from '../shared/site-translations';
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
  activeCommandPlatform: Record<CommandGroup, CommandPlatform> = {
    keyPair: 'windows',
    instanceIp: 'windows',
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

  private isIacFileName(value: string | null): value is IacFileName {
    return this.files.some((file) => file.fileName === value);
  }
}
