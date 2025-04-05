import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LoginUser } from '../models/loginUser.model';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private currentUserSubject = new BehaviorSubject< LoginUser | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  setUser(user: LoginUser) {
    this.currentUserSubject.next(user);
  }

  clearUser() {
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): LoginUser | null {
    return this.currentUserSubject.value;
  }
}
