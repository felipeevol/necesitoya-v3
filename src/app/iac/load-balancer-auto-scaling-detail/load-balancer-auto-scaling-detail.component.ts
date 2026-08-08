import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Translation } from '../../shared/site-translations';
import { CommandGroup, CommandPlatform, getIacCommand } from '../iac-command.model';

@Component({
  selector: 'app-load-balancer-auto-scaling-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './load-balancer-auto-scaling-detail.component.html',
  styleUrl: '../iac-detail-card.component.css',
})
export class LoadBalancerAutoScalingDetailComponent {
  @Input({ required: true }) currentPage!: Translation['iacPage'];
  @Input({ required: true }) activeCommandPlatform!: Record<CommandGroup, CommandPlatform>;
  @Input() copiedCommand: CommandGroup | null = null;

  @Output() commandPlatformChange = new EventEmitter<{
    group: CommandGroup;
    platform: CommandPlatform;
  }>();
  @Output() commandCopy = new EventEmitter<{
    group: CommandGroup;
    platform?: CommandPlatform;
  }>();

  isCommandPlatformActive(group: CommandGroup, platform: CommandPlatform): boolean {
    return this.activeCommandPlatform[group] === platform;
  }

  setCommandPlatform(group: CommandGroup, platform: CommandPlatform): void {
    this.commandPlatformChange.emit({ group, platform });
  }

  getCommand(group: CommandGroup, platformOverride?: CommandPlatform): string {
    return getIacCommand(group, platformOverride ?? this.activeCommandPlatform[group]);
  }

  copyCommand(group: CommandGroup, platform?: CommandPlatform): void {
    this.commandCopy.emit({ group, platform });
  }
}
