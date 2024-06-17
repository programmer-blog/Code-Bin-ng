import { Injectable } from '@angular/core';
import {  doc, getDoc, getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { AuthService } from './auth.service';
import { Snippet } from '../../models/snippet';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  private db?: any
  constructor(private router: Router, private authService: AuthService) {
    this.db = getFirestore()
   }

   async createSnippet(snippet:Snippet) {

      try {
        const docRef = await addDoc(collection(this.db, "snippets"), {
          ...snippet,
          by: this.authService.getUid()
        });
        console.log("Document written with ID: ", docRef.id);
        this.router.navigate(["/"])
      } catch (e) {
        console.error("Error adding document: ", e);
      }
   }

  async getAllSnippets() {
    let result:any[] = []
    const querySnapshot = await getDocs(collection(this.db, "snippets"));
    querySnapshot.forEach((doc) => {
      result.push({id: doc.id, ...doc.data()})
      //console.log(`${doc.id} => ${doc.data()}`);
    });

    return result;
  }

  async getSnippetById(docId: string){
    const docRef = doc(this.db, "snippets", docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      return docSnap.data()
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!"); 
      return {
        id: "",
        title: "",
        snippet: ""
      }
    }
  }
}
