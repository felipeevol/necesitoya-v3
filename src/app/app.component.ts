import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TodosComponent } from './todos/todos.component';
import { Amplify } from 'aws-amplify';
import outputs from '../../amplify_outputs.json';

Amplify.configure(outputs);

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterOutlet, TodosComponent, CommonModule],
})
export class AppComponent implements AfterViewInit {
  title = 'amplify-angular-template';
  showSuccessMessage = false;

  ngAfterViewInit() {
    const form = document.querySelector('.contact-form') as HTMLFormElement;
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Recolecta los datos del formulario
        const formData = new FormData(form);
        
        // Envía a FormSubmit sin redirigir
        try {
          await fetch('https://formsubmit.co/ajax/felipe@profesionaljava.es', {
            method: 'POST',
            body: formData
          });
          
          // Muestra el mensaje de éxito
          this.showSuccessMessage = true;
          
          // Limpia los campos
          form.reset();
          
          // Desaparece el mensaje después de 3 segundos
          setTimeout(() => {
            this.showSuccessMessage = false;
          }, 3000);
        } catch (error) {
          console.error('Error al enviar el formulario:', error);
        }
      });
    }
  }
}
