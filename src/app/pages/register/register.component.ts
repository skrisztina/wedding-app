import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { User } from '../../models/user.model';
import { DataServiceService } from '../../services/data.service.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';



@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatButtonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent{
  registerForm: FormGroup;
  users: User[];

  constructor(private router: Router, private dataService: DataServiceService, private fb: FormBuilder, private route: ActivatedRoute){
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      gender: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      phone: ['', Validators.pattern(/^(\+36|06)\s?(\d{2})\s?(\d{3})\s?(\d{4})$/)]
    })
    this.users = this.dataService.getUsers();
  }
  

  onSubmit(){
    if(this.registerForm.valid){
      const userData = this.registerForm.value;
      const lastId = this.users[this.users.length-1].id + 1;

      if(this.dataService.checkIfUserExists(userData.email)){
        alert('Ez az email cím már regisztrálva van.');
        return;
      }

      if(userData.password !== userData.confirmPassword){
        alert('A jelszónak és a megerősítésének meg kell egyeznie!');
        return;
      }

      if(userData.name.length < 5){
        alert("A névnek minimum 5 karakternek kell lennie.");
        return;
      }

      if(userData.password.length < 8){
        alert("A jelszónak minimum 8 karakternek kell lennie.");
        return;
      }

      const newUser = new User( lastId, userData.name, userData.gender, userData.email, userData.password, userData.phone, "");

      this.dataService.addUser(newUser);
      alert("Sikeres regisztráció.");
      this.router.navigate(['/login']);
    } else {
      alert ("Invalid űrlap.")
    }
  }

}
