import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut,
  authState, User as firebaseUser, UserCredential,
  createUserWithEmailAndPassword
 } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { collection, Firestore, doc, setDoc } from '@angular/fire/firestore';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  currentUser: Observable<firebaseUser | null>;

  constructor(private auth: Auth, private router: Router, private firestore: Firestore) {
    this.currentUser = authState(this.auth);
   }

   signIn(email: string, password: string): Promise<UserCredential>{
    return signInWithEmailAndPassword(this.auth, email, password);
   }

   signOut(): Promise<void>{
    localStorage.setItem('isLoggedIn', 'false');
    return signOut(this.auth).then(() => {
      this.router.navigateByUrl('/home');
    });
   }

   async singUp(email: string, password: string, userData: Partial<User>): Promise<UserCredential> {
    try{
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);

      await this.createUserData(userCredential.user.uid, {
        ...userData,
        id: userCredential.user.uid,
        email: email,

      });
      return userCredential;
    } catch (error){
      console.error('Hiba a regisztráció során: ', error);
      throw error;
    }
   }

   private async createUserData(userId: string, userData: Partial<User>): Promise<void>{
    const userRef = doc(collection(this.firestore, 'Users'), userId);
    return setDoc(userRef, userData);
   }

   isLoggedIn(): Observable<firebaseUser | null> {
    return this.currentUser;
   }

   updateLogInStatus(isLoggedIn: boolean): void{
    localStorage.setItem('isLoggedIn', isLoggedIn ? 'true' : 'false');
   }
}
