import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Auth , createUserWithEmailAndPassword} from '@angular/fire/auth';
import { Firestore, setDoc, doc, addDoc, collection } from '@angular/fire/firestore';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registrationForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  private firestore = inject(Firestore);
  constructor(private afAuth: Auth, private router : Router) {}

  async register() {
    if (this.registrationForm.valid) {
      const { name, email, password } = this.registrationForm.value;
      if(email && password){
        
      try {
        const userCredential = createUserWithEmailAndPassword(this.afAuth, email, password);
        // Create a new user with email (and password
        const userId = (await userCredential).user?.uid;

        if(userId){
        setDoc(doc(this.firestore, 'users',userId.toString()), {
          email: email,
          name: name,
          password: password,
          userId : userId
        })
        .then(()=>{
          console.log("user registered successfully");
          this.router.navigate(['/login']);
        },error=>{
          console.log("some error occured" + error );
          this.router.navigate(['/register']);
        } );
      }
      } catch (error) {
        console.error('Error during registration:', error);
      }
      }
    }
  }
}   


