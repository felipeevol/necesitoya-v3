import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SiteLanguageService } from '../shared/site-language.service';
import { Translation } from '../shared/site-translations';

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
type CommandGroup = 'keyPair' | 'instanceIp';
type CommandPlatform = 'windows' | 'bash';

@Component({
  selector: 'app-iac',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './iac.component.html',
  styleUrl: './iac.component.css',
})
export class IacComponent {
  private readonly language = inject(SiteLanguageService);
  private readonly route = inject(ActivatedRoute);

  readonly files = iacFiles;
  readonly filters: ReadonlyArray<IacFilter> = ['all', 'autoscaling', 'loadbalancer'];
  readonly keyPairCommands = {
    windows: `$KeyId = aws ec2 describe-key-pairs \`
  --key-names minha-key-for-launch-template \`
  --query "KeyPairs[0].KeyPairId" \`
  --output text

aws ssm get-parameter \`
  --name "/ec2/keypair/$KeyId" \`
  --with-decryption \`
  --query "Parameter.Value" \`
  --output text | Set-Content -NoNewline -Encoding ascii minha-key-for-launch-template.ppk`,
    bash: `export MSYS_NO_PATHCONV=1

KEY_ID=$(aws ec2 describe-key-pairs \\
  --key-names minha-key-for-launch-template \\
  --query "KeyPairs[0].KeyPairId" \\
  --output text)

aws ssm get-parameter \\
  --name "/ec2/keypair/$KEY_ID" \\
  --with-decryption \\
  --query "Parameter.Value" \\
  --output text > minha-key-for-launch-template.pem`,
  } as const;
  readonly instanceIpCommands = {
    windows: `aws ec2 describe-instances \`
  --filters \`
  "Name=tag:Name,Values=MyAutoScalingGroup" \`
  "Name=instance-state-name,Values=running" \`
  --query "Reservations[].Instances[].{InstanceId:InstanceId,PublicIP:PublicIpAddress}" \`
  --output table`,
    bash: `aws ec2 describe-instances \\
  --filters \\
    "Name=tag:Name,Values=MyAutoScalingGroup" \\
    "Name=instance-state-name,Values=running" \\
  --query "Reservations[].Instances[].{InstanceId:InstanceId,PublicIP:PublicIpAddress}" \\
  --output table`,
  } as const;

  activeFilters = new Set<IacFilter>(['all']);
  selectedFileName: IacFileName = 'LoadBalancerAutoScaling1.yaml';
  activeCommandPlatform: Record<CommandGroup, CommandPlatform> = {
    keyPair: 'windows',
    instanceIp: 'windows',
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
      this.activeFilters = new Set<IacFilter>(['all']);
    } else {
      const nextFilters = new Set(this.activeFilters);
      nextFilters.delete('all');

      if (nextFilters.has(filter)) {
        nextFilters.delete(filter);
      } else {
        nextFilters.add(filter);
      }

      this.activeFilters = nextFilters.size > 0 ? nextFilters : new Set<IacFilter>(['all']);
    }

    if (!this.visibleFiles.some((file) => file.fileName === this.selectedFileName)) {
      this.selectedFileName = this.visibleFiles[0].fileName;
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

  isCommandPlatformActive(group: CommandGroup, platform: CommandPlatform): boolean {
    return this.activeCommandPlatform[group] === platform;
  }

  getCommand(group: CommandGroup): string {
    const platform = this.activeCommandPlatform[group];
    return group === 'keyPair' ? this.keyPairCommands[platform] : this.instanceIpCommands[platform];
  }

  async copyCommand(group: CommandGroup): Promise<void> {
    const command = this.getCommand(group);

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
