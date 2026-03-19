import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { form, FormField } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { SignUpBody } from '../user.model';

@Component({
  imports: [FormField, MatFormFieldModule, MatInputModule, MatButtonModule, RouterLink],
  templateUrl: './signup.component.html',
})
export class SignUpComponent {
  private authService = inject(AuthService)
  private router = inject(Router)

  signUpModel = signal<SignUpBody>({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
  });

  signUpForm = form(this.signUpModel);

  async onSubmit(event: Event) {
    event.preventDefault();
    const formData = this.signUpModel();

    this.authService.signup(formData).subscribe({
      next: () => {
        this.router.navigate(['/signin']);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
