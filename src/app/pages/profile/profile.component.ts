import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { PhoneFormatPipe } from '../../pipes/phone-format.pipe';
import { AuthService } from '../../services/auth.service';
import { Subscription, map } from 'rxjs'



@Component({
  selector: 'app-profile',
  imports: [CommonModule, MatCardModule, MatButtonModule, ProfileModFormComponent, ReactiveFormsModule, PhoneFormatPipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit, OnDestroy {
  loggedInUser : LoginUser | null = null;
  user : User | undefined;
  private authSubscription?: Subscription;
  private userSubscription?: Subscription;
  showEditForm: boolean = false;

  constructor(private userService: UserService, private dataService: DataServiceService, private router: Router, private authService: AuthService){}

  ngOnInit(): void {
    this.authSubscription = this.authService.currentUser
    .pipe(
      map(firebaseUser => {
        if (!firebaseUser) return null;

        // Firebase User → saját LoginUser példány konvertálás (id-t pótoljuk dummy értékkel, pl. -1)
        return new LoginUser(-1, firebaseUser.email ?? '');
      })
    )
    .subscribe(loginUser => {
      this.loggedInUser = loginUser;

      if (!this.loggedInUser) {
        this.router.navigate(['/login']);
      } else {
        // lekérés a teljes User modell alapján (email alapján például)
        this.user = this.dataService.getUserByEmail(this.loggedInUser.email);
      }
    });
      
  }

  updateUser(updateUser: User){
    this.user = updateUser;
    this.dataService.updateUser(updateUser);
    alert("Sikeres módosítás!");
  }

  ngOnDestroy(): void {
    this.loggedInUser = null;
    this.userService.clearUser();
    this.authSubscription?.unsubscribe();
    this.userSubscription?.unsubscribe();
  }

  toggleEditForm(): void {
    this.showEditForm = !this.showEditForm;
  }

}
