import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MenuComponent } from './shared/menu/menu.component';
import {MatSidenav, MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { UserService } from './services/user.service';
import { LoginUser } from './models/loginUser.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenuComponent, RouterLink,
    MatSidenavModule, MatToolbarModule, MatButtonModule, MatIconModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'wedding-app';
  loggedInUser: LoginUser | null = null;

  constructor(private userService: UserService, private router: Router){}

  ngOnInit():void{
    this.userService.currentUser$.subscribe(user=> {
      this.loggedInUser = user;
    });
  }

  onToggleSidenav(sidenav: MatSidenav){
    sidenav.toggle();
  }

  logout(){
    this.userService.clearUser();
    this.router.navigate(['/home']);
  }
}
