import { Component, inject } from '@angular/core';
import { SiteLanguageService } from '../shared/site-language.service';
import { Translation } from '../shared/site-translations';

@Component({
  selector: 'app-resources',
  standalone: true,
  templateUrl: './resources.component.html',
  styleUrl: './resources.component.css',
})
export class ResourcesComponent {
  private readonly language = inject(SiteLanguageService);

  get currentTranslations(): Translation {
    return this.language.currentTranslations();
  }
}
