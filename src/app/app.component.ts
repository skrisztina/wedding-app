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
import { User } from './models/user.model';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenuComponent, RouterLink,
    MatSidenavModule, MatToolbarModule, MatButtonModule, MatIconModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'wedding-app';
  user: User | null = null;
  isLoggedIn = false;
  private authSubscription?: Subscription;
  private userSubscription?: Subscription;

  constructor(private router: Router, private authService: AuthService, private userService: UserService,
    private snackBar: MatSnackBar
  ){}

  ngOnInit():void{
    this.authSubscription = this.authService.isLoggedIn().subscribe(firebaseUser => {
      this.isLoggedIn = !! firebaseUser;
      localStorage.setItem('isLoggedIn', this.isLoggedIn ? 'true' : 'false');

      if(firebaseUser){
        this.userSubscription = this.userService.getUser().subscribe({
          next: user => this.user = user,
          error: err => {
            console.error('Hiba a felhazsnáló betöltésekor: ', err);
            this.user = null;
          }
        });
      } else {
        this.user = null;
      }
    });
  }

  onToggleSidenav(sidenav: MatSidenav){
    sidenav.toggle();
  }

  logout(){
    this.authService.signOut().then(() => {
      this.user = null;
      this.snackBar.open('Sikeres kijelentkezés!', 'Bezár', {
        duration: 3000,
        verticalPosition: 'top'
      });
      this.router.navigate(['/home']);
    });
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
    this.userSubscription?.unsubscribe();
  }
}
