import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    if (this.loginForm.valid) {
      // Extract values from the form group for login
      const username = this.loginForm.value.username;
      const password = this.loginForm.value.password;

      this.authService.login(username, password);

    } else {
      console.error('Formulario no válido:', this.loginForm.errors); // Optional: Log form errors for debugging
      this.loginForm.reset();
    }
  }
}
