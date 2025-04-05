import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { DataServiceService } from '../../services/data.service.service';
import { User } from '../../models/user.model';
import { LoginUser } from '../../models/loginUser.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import { ProfileModFormComponent } from "./profile-mod-form/profile-mod-form.component";
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';



@Component({
  selector: 'app-profile',
  imports: [CommonModule, MatCardModule, MatButtonModule, ProfileModFormComponent, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  loggedInUser : LoginUser | null = null;
  user : User | undefined;
  defaultImage = '../../assets/default-user-image.jpg'  //ezt még ki kell javítani

  constructor(private userService: UserService, private dataService: DataServiceService, private router: Router){}

  ngOnInit(): void {
      this.userService.currentUser$.subscribe(user => {
        this.loggedInUser = user;

        if(!this.loggedInUser){
          this.router.navigate(['/login']);
        } else {
          this.user = this.dataService.getUserByEmail(this.loggedInUser.email);
        }
      });
      
  }

  updateUser(updateUser: User){
    this.user = updateUser;
    this.dataService.updateUser(updateUser);
    alert("Sikeres módosítás!");
  }

}
