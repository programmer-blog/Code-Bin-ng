import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth, signOut, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

private uid? : string;

constructor(private router:Router) {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      this.uid = user.uid
      console.log('User logged in as ', user.email);
    } else {
      this.uid = undefined
      console.log("user logged out");
    }
  });
 }

registerUser(email: string, password:string) {
  const auth = getAuth();
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      this.router.navigate(['/login'])

    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage)
      alert("Something went wrong while signup.")
    });
    
  }

  loginUser(email: string, password:string) {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log(user);
        
        this.router.navigate(['/login'])
      })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage)
      alert("Something went wrong while signin.")
    });
  }

  signout() {
    const auth = getAuth();
    signOut(auth).catch((error) => {
      alert("Something went wrong while logout.")

    });
  }

  isAuthenticated() {
    return this.uid ? true : false
  }

  getUid(){
    return this.uid
  }
}
