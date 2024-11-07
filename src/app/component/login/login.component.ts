import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';

import {ReactiveFormsModule, FormBuilder, FormGroup, Validators} from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword: boolean = false;
  errorMessage: string = '';
  returnUrl = '/dashboard';



  constructor(private fb: FormBuilder, private auth: Auth, private router : Router, private route : ActivatedRoute) {
    // Initialize the form with validators
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }


  // Toggle password visibility
  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  // Login method
  login() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
       signInWithEmailAndPassword(this.auth, email, password)
        .then((userID) => {
          console.log("user id is ", userID.providerId);
          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/dashboard';
          this.router.navigate([returnUrl]);
          
          // return userID.providerId
          // Redirect or handle successful login
        })
        .catch(error => {
          this.errorMessage = error.message;
          this.router.navigate(['/login']); 
        });
    } else {
      this.errorMessage = 'Please enter valid login details.';
    }
  }

  // Getter for easy access to form fields
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
