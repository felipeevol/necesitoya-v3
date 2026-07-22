import { CommonModule } from '@angular/common';
import { Component, ViewChild, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Amplify } from 'aws-amplify';
import { RecaptchaComponent, RecaptchaModule } from 'ng-recaptcha';
import outputs from '../../../amplify_outputs.json';
import { SiteLanguageService } from '../shared/site-language.service';
import { Translation } from '../shared/site-translations';

Amplify.configure(outputs);

type ErrorMessageKey = keyof Translation['contact']['errors'];

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  imports: [CommonModule, FormsModule, RecaptchaModule],
})
export class HomeComponent {
  private readonly language = inject(SiteLanguageService);

  showSuccessMessage = false;
  errorMessageKey: ErrorMessageKey | null = null;
  isSubmitting = false;
  recaptchaToken: string | null = null;

  @ViewChild(RecaptchaComponent) recaptchaComponent?: RecaptchaComponent;

  get currentTranslations(): Translation {
    return this.language.currentTranslations();
  }

  get errorMessage(): string {
    return this.errorMessageKey
      ? this.currentTranslations.contact.errors[this.errorMessageKey]
      : '';
  }

  async onSubmit(form: NgForm): Promise<void> {
    if (this.isSubmitting) {
      return;
    }

    this.showSuccessMessage = false;
    this.errorMessageKey = null;

    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    if (!this.recaptchaToken) {
      this.errorMessageKey = 'recaptchaRequired';
      return;
    }

    this.isSubmitting = true;

    const formData = new FormData();
    formData.append('email', form.value.email ?? '');
    formData.append('subject', form.value.subject ?? '');
    formData.append('message', form.value.message ?? '');
    formData.append('_captcha', 'false');
    formData.append('g-recaptcha-response', this.recaptchaToken);

    try {
      const response = await fetch('https://formsubmit.co/ajax/felipe@profesionaljava.es', {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      this.showSuccessMessage = true;
      form.resetForm();
      this.resetRecaptcha();

      setTimeout(() => {
        this.showSuccessMessage = false;
      }, 3000);
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      this.errorMessageKey = 'submitFailed';
      this.resetRecaptcha();
    } finally {
      this.isSubmitting = false;
    }
  }

  onRecaptchaResolved(token: string | null): void {
    this.recaptchaToken = token;

    if (token) {
      this.errorMessageKey = null;
    }
  }

  private resetRecaptcha(): void {
    this.recaptchaToken = null;
    this.recaptchaComponent?.reset();
  }
}
