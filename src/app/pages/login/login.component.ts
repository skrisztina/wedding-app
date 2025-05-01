import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { DataServiceService } from '../../services/data.service.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  showPassword: boolean = false;
  errorMessage: string = '';
  userSub!: Subscription;

  constructor(private router: Router, private dataService: DataServiceService, private userService: UserService,
    private fb: FormBuilder, private route: ActivatedRoute, private authService: AuthService, private snackBar: MatSnackBar){
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    })
  }

  ngOnInit(): void {
      this.userSub = this.authService.isLoggedIn().subscribe(user => {
        if(user){
          this.router.navigate(['/home']);
        }
      });
  }

  onSubmit(){
    if(this.loginForm.valid){
      const {email, password} = this.loginForm.value;

      if(this.dataService.loginUser(email, password) === false){
        console.error("Hibás felhasználónév vagy jelszó");
        return;
      }

      const user = this.dataService.getUserByEmail(email);
      if(user === undefined){
        console.error("Nem található a felhasználó. Lehet azóta törölték.");
        return;
      }
      this.userService.setUser({id: user.id, email: user.email});
      
      this.authService.signIn(email, password)
      .then(()=> {
        this.authService.updateLogInStatus(true);
        this.snackBar.open('Sikeres bejelentkezés!', 'Bezár', {
          duration: 3000,
          verticalPosition: 'top'
        });
        this.router.navigate(['/home']);
      })
      .catch(error => {
        console.error('Login error:', error);

        switch(error.code){
          case 'auth/user-not-found':
            this.errorMessage = 'Ezzel az email címmel nincs regisztrált felhasználó.';
            break;
          case 'auth/wrong-password':
            this.errorMessage = 'Hibás jelszó.';
            break;
          case 'auth/invalid-credential':
            this.errorMessage = 'Hibás felhasználónév vagy jelszó.';
            break;
          default:
            this.errorMessage = "Sikeretlen bejelentkezés.";
        }
      });
    }
  }

  ngOnDestroy(): void {
      if(this.userSub){
        this.userSub.unsubscribe();
      }
  }

  onToRegister(){
    this.router.navigate(['/register']);
  }

  togglePasswordVisibility(){
    this.showPassword = !this.showPassword;
  }
}
