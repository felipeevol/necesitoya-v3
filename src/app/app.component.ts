import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Amplify } from 'aws-amplify';
import { RecaptchaComponent, RecaptchaModule } from 'ng-recaptcha';
import outputs from '../../amplify_outputs.json';

Amplify.configure(outputs);

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [CommonModule, FormsModule, RecaptchaModule],
})
export class AppComponent {
  title = 'amplify-angular-template';
  showSuccessMessage = false;
  errorMessage = '';
  isSubmitting = false;
  recaptchaToken: string | null = null;

  @ViewChild(RecaptchaComponent) recaptchaComponent?: RecaptchaComponent;

  async onSubmit(form: NgForm): Promise<void> {
    if (this.isSubmitting) {
      return;
    }

    this.showSuccessMessage = false;
    this.errorMessage = '';

    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    if (!this.recaptchaToken) {
      this.errorMessage = 'Completa el reCAPTCHA antes de enviar tu mensaje.';
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
      this.errorMessage = 'No pudimos enviar tu mensaje. Inténtalo nuevamente en unos instantes.';
      this.resetRecaptcha();
    } finally {
      this.isSubmitting = false;
    }
  }

  onRecaptchaResolved(token: string | null): void {
    this.recaptchaToken = token;

    if (token) {
      this.errorMessage = '';
    }
  }

  private resetRecaptcha(): void {
    this.recaptchaToken = null;
    this.recaptchaComponent?.reset();
  }
}
