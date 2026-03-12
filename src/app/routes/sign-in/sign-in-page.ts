import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButton } from '@angular/material/button';

interface SignUpModel {
  email: string;
  password: string;
}

@Component({
  imports: [FormField, MatFormFieldModule, MatInputModule, MatButton],
  templateUrl: './sign-in-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInPage {
  signUpModel = signal<SignUpModel>({
    email: '',
    password: '',
  });

  signUpForm = form(this.signUpModel);

  async onSubmit(event: Event) {
    event.preventDefault();
    const formData = this.signUpModel();

    // TODO: Do something with the data
  }
}
