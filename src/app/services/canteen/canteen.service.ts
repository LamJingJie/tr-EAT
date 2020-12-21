import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class CanteenService {

  constructor(private firestore: AngularFirestore) { }

  //CRUD for canteen datatable

  getAll(){
    return this.firestore.collection('canteen').valueChanges({idField: 'id'});
  }
}
