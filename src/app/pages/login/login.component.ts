import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { User } from '../../models/user.model';
import { DataServiceService } from '../../services/data.service.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { UserService } from '../../services/user.service';
import {MatIconModule} from '@angular/material/icon';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword: boolean = false;

  constructor(private router: Router, private dataService: DataServiceService, private fb: FormBuilder, private route: ActivatedRoute, private userService: UserService){
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    })
  }

  onSubmit(){
    if(this.loginForm.valid){
      const userData = this.loginForm.value;
      
      if(this.dataService.loginUser(userData.email, userData.password) === false){
        alert("Hibás felhasználónév vagy jelszó.");
        return;
      }

      const user = this.dataService.getUserByEmail(userData.email);

      if(user === undefined){
        alert("Nem található a felhasználó. Lehet azóta törölték.");
        return;
      }

      this.userService.setUser({id: user.id, email: user.email});
      alert('Sikeres bejelentkezés!');
      this.router.navigate(['/home']);
    }
  }

  onToRegister(){
    this.router.navigate(['/register']);
  }

  togglePasswordVisibility(){
    this.showPassword = !this.showPassword;
  }
}
