import { Component, Input, OnDestroy, OnInit} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list'
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav } from '@angular/material/sidenav';
import { UserService } from '../../services/user.service';
import { LoginUser } from '../../models/loginUser.model';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { MatSnackBar} from '@angular/material/snack-bar';
import { User } from '../../models/user.model';


@Component({
  selector: 'app-menu',
  imports: [RouterLink, RouterLinkActive, MatListModule, MatIconModule, CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit, OnDestroy {

  @Input() sidenav!: MatSidenav;
  loggedInUser: User | null = null;
  isLoggedIn = false;
  private authSubscription?: Subscription;
  private userSubscription?: Subscription;

  constructor(private userService: UserService, private authService: AuthService,
    private snackBar: MatSnackBar
  ){}

  ngOnInit():void{
    this.authSubscription = this.authService.isLoggedIn().subscribe(firebaseUser => {
      this.isLoggedIn = !!firebaseUser;
      localStorage.setItem('isLoggedIn', this.isLoggedIn ? 'true' : 'false');

      if(firebaseUser){
        this.userSubscription = this.userService.getUser().subscribe({
          next: user => this.loggedInUser = user,
          error: err => {
            console.error('Hiba a felhasználó betöltésekor:', err);
            this.loggedInUser = null;
          }
        });
      } else {
        this.loggedInUser = null;
      }
      
    });
  }

  closeMenu(){
    if(this.sidenav){
      this.sidenav.close();
    }
  }

  logout(){
    this.authService.signOut().then(() => {
      this.loggedInUser = null;
      this.closeMenu();
      this.snackBar.open('Sikeres kijelentkezés!', 'Bezár', {
        duration: 3000,
        verticalPosition: 'top'
      });
    });
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
    this.userSubscription?.unsubscribe();
  }

}
