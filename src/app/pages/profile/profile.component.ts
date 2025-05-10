import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import { ProfileModFormComponent } from "./profile-mod-form/profile-mod-form.component";
import { ReactiveFormsModule } from '@angular/forms';
import { PhoneFormatPipe } from '../../pipes/phone-format.pipe';
import { AuthService } from '../../services/auth.service';
import { Subscription, map } from 'rxjs'
import { UserService } from '../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'app-profile',
  imports: [CommonModule, MatCardModule, MatButtonModule, ProfileModFormComponent, ReactiveFormsModule, PhoneFormatPipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit, OnDestroy {
  user: User | null = null;
  private authSubscription?: Subscription;
  private userSubscription?: Subscription;
  showEditForm: boolean = false;

  constructor(private userService: UserService, private router: Router, private authService: AuthService, private snackBar: MatSnackBar){}

  ngOnInit(): void {
    this.authSubscription = this.authService.isLoggedIn().subscribe(firebaseUser => {
      if(!firebaseUser){
        this.router.navigate(['/login']);
        return;
      }

      this.userSubscription = this.userService.getUser().subscribe({
        next: user => this.user = user,
        error: err => {
          console.error('Hiba a felhasználó adatainak lekérdezésekor: ', err);
          this.router.navigate(['/login']);
        }
      });
    });
      
  }

  updateUser(updateUser: User){
     this.userService.updateUser(updateUser.name, updateUser.phone).subscribe({
    next: () => {
      // Az adat frissítve lett a Firestore-ban, és a currentUserSubject is frissült
      this.snackBar.open('Sikeres mentés!', 'Bezár', {
        duration: 3000
      });

      // Ha valamiért nem frissül automatikusan a user változó (bár kéne), frissítjük itt is:
      this.user = updateUser;
      this.showEditForm = false; // ha el akarod rejteni az űrlapot utána
    },
    error: (err) => {
      console.error('Hiba a frissítés során:', err);
      this.snackBar.open('Hiba történt a mentés során!', 'Bezár', {
        duration: 3000
      });
    }
  });
  }

  ngOnDestroy(): void {
    this.user = null;
    this.authSubscription?.unsubscribe();
    this.userSubscription?.unsubscribe();
  }

  toggleEditForm(): void {
    this.showEditForm = !this.showEditForm;
  }

}
