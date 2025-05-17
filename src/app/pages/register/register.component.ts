import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../models/user.model';



@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent{
  registerForm: FormGroup;
  showPassword: boolean = false;

  constructor(private router: Router, private fb: FormBuilder, private route: ActivatedRoute,
    private authService: AuthService, private snackBar: MatSnackBar
  ){
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      gender: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      phone: ['', Validators.pattern(/^(\+36|06)\s?(\d{2})\s?(\d{3})\s?(\d{4})$/)]
    })
  }
  

  onSubmit(){
    let signupError: string;
    if(this.registerForm.valid){
      const { name, gender, email, password, confirmPassword, phone } = this.registerForm.value;

      if(password !== confirmPassword){
        alert('A jelszónak és a megerősítésének meg kell egyeznie!');
        return;
      }

      if(name.length < 5){
        alert("A névnek minimum 5 karakternek kell lennie.");
        return;
      }

      if(password.length < 8){
        alert("A jelszónak minimum 8 karakternek kell lennie.");
        return;
      }

        const userData : Partial<User> = {
          name: name,
          gender: gender,
          email: email,
          phone: phone
        };

        console.log('Mentésre kerülő userData:', userData);

        this.authService.singUp(email, password, userData)
        .then(() => {
          this.snackBar.open('Sikeres regisztráció!', 'Bezár', {
          duration: 3000,
          verticalPosition: 'top'
        });
      this.router.navigate(['/login']);
    })
        .catch(error =>{


          switch(error.code){
            case 'auth/email-already-in-use':
            signupError = 'Ez az email cím már regisztrálva van.';
            break;
          case 'auth/invalid-email':
            signupError = 'Invalid email.';
            break;
          case 'auth/weak-password':
            signupError = 'Gyenge jelszó. Min 8 karakter.';
            break;
          default:
            signupError = 'Hiba a regisztráció során. Próbáld meg később.';
          }

          this.snackBar.open('Hiba: ' + signupError, 'Bezár', {
          duration: 3000,
          verticalPosition: 'top'
        });
    });
    } else {
      alert ("Invalid űrlap.")
    }
  }

  togglePasswordVisibility(){
    this.showPassword = !this.showPassword;
  }

}
