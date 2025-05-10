import { Injectable } from '@angular/core';
import { switchMap, take, tap, map } from 'rxjs/operators';
import { Observable, from, of, throwError, BehaviorSubject } from 'rxjs';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { User as FirebaseUser } from '@angular/fire/auth';
import { DocumentData, DocumentSnapshot } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor( private firestrore: Firestore, private authService: AuthService) { }

  getUser(): Observable<User | null>{
    return this.authService.isLoggedIn().pipe(
      switchMap((firebaseUser: FirebaseUser | null) => {
        if(firebaseUser && firebaseUser.uid){
          const userDocRef = doc(this.firestrore, 'Users', firebaseUser.uid);
          return from(getDoc(userDocRef)).pipe(
            switchMap(snapshot => {
              if(snapshot.exists()){
                const data = snapshot.data();
                const user = new User(
                  data['id'],
                  data['name'],
                  data['gender'],
                  data['email'],
                  data['phone']
                );
                return of(user);
              } else {
                return of(null);
              }
            })
          );
        } else {
          return of(null);
        }
      })
    )
  }

  updateUser(name: string, phone: string): Observable<void>{
    return this.authService.isLoggedIn().pipe(
      take(1),
      switchMap(user => {
        if(!user) throw new Error('Nincs bejelentkezett felhasználó.');

        const userRef = doc(this.firestrore, `Users/${user.uid}`);

       return from(updateDoc(userRef, { name, phone })).pipe(
        switchMap(() => from(getDoc(userRef))),
        tap(docSnap => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            const updatedUser = new User(
              data['id'],
              data['name'],
              data['gender'],
              data['email'],
              data['phone']
            );
            this.currentUserSubject.next(updatedUser);
          }
        }),
        switchMap(() => of(void 0))
      );
      })
    );
  }

 getUserNameById(userId: string): Observable<string> {
  const userRef = doc(this.firestrore, `Users/${userId}`);
  return from(getDoc(userRef)).pipe(
    map((docSnap: DocumentSnapshot<DocumentData>) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        return data?.['name'] || 'Ismeretlen felhasználó';
      } else {
        return 'Ismeretlen felhasználó';
      }
    })
  );
}
}
