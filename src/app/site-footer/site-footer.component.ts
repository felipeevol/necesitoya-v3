import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteLanguageService } from '../shared/site-language.service';
import { Translation } from '../shared/site-translations';

@Component({
  selector: 'app-site-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './site-footer.component.html',
  styleUrl: './site-footer.component.css',
})
export class SiteFooterComponent {
  private readonly language = inject(SiteLanguageService);

  get currentTranslations(): Translation {
    return this.language.currentTranslations();
  }
}
