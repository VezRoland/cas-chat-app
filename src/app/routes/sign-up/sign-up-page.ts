import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButton } from '@angular/material/button';

interface SignUpModel {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

@Component({
  imports: [FormField, MatFormFieldModule, MatInputModule, MatButton],
  templateUrl: './sign-up-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpPage {
  signUpModel = signal<SignUpModel>({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
  });

  signUpForm = form(this.signUpModel);

  async onSubmit(event: Event) {
    event.preventDefault()
    const formData = this.signUpModel();
    
    // TODO: Do something with the data
  }
}
