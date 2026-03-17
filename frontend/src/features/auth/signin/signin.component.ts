import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { SignInBody } from '../user.model';
import { form, FormField } from '@angular/forms/signals';
import { Router } from '@angular/router';

@Component({
  imports: [FormField, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './signin.component.html',
})
export class SignInComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  signInModel = signal<SignInBody>({
    email: '',
    password: '',
  });

  signInForm = form(this.signInModel);

  async onSubmit(event: Event) {
    event.preventDefault();
    const formData = this.signInModel();
    
    this.authService.signin(formData).subscribe({
      next: () => {
        this.router.navigate(['/chat']);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
