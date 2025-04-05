import { Component, Input, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list'
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav } from '@angular/material/sidenav';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { LoginUser } from '../../models/loginUser.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  imports: [RouterLink, RouterLinkActive, MatListModule, MatIconModule, CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {

  @Input() sidenav!: MatSidenav;
  loggedInUser: LoginUser | null = null;
  constructor(private userService: UserService){}

  ngOnInit():void{
    this.userService.currentUser$.subscribe(user => {
      this.loggedInUser = user;
    });
  }

  closeMenu(){
    if(this.sidenav){
      this.sidenav.close();
    }
  }

  logout(){
    this.userService.clearUser();
    this.closeMenu();
  }

}
