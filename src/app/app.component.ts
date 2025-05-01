import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MenuComponent } from './shared/menu/menu.component';
import {MatSidenav, MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { LoginUser } from './models/loginUser.model';
import { CommonModule } from '@angular/common';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { Subscription } from 'rxjs';
import { MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenuComponent, RouterLink,
    MatSidenavModule, MatToolbarModule, MatButtonModule, MatIconModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'wedding-app';
  loggedInUser: LoginUser | null = null;
  isLoggedIn = false;
  private authSubscription?: Subscription;

  constructor(private router: Router, private authService: AuthService, private userService: UserService,
    private snackBar: MatSnackBar
  ){}

  ngOnInit():void{
    this.authSubscription = this.authService.currentUser.subscribe(user => {
      this.isLoggedIn = !!user;
      localStorage.setItem('isLoggedIn', this.isLoggedIn ? 'true' : 'false');
      this.userService.currentUser$.subscribe(user => {
        this.loggedInUser = user;
      });
    });
  }

  onToggleSidenav(sidenav: MatSidenav){
    sidenav.toggle();
  }

  logout(){
    this.authService.signOut().then(() => {
      this.loggedInUser = null;
      this.userService.clearUser();
      this.snackBar.open('Sikeres kijelentkezés!', 'Bezár', {
        duration: 3000,
        verticalPosition: 'top'
      });
    });
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }
}
