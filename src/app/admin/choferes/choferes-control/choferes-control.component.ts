import { Component, OnInit } from '@angular/core';
import { DbFirestoreService } from 'src/app/servicios/database/db-firestore.service';

@Component({
  selector: 'app-choferes-control',
  template: `  
  <router-outlet></router-outlet>
    `,
  styles: ['']
})
export class ChoferesControlComponent implements OnInit {

  componente:string = 'choferes'
  data:any;  

  constructor(private dbFirebase: DbFirestoreService,) {}

  ngOnInit(): void {
    //this.getAll();  
   
  }

  getAll(){
    this.dbFirebase.getAll(this.componente).subscribe(data => {
      this.data = data;
      localStorage.setItem(`${this.componente}`, JSON.stringify(data))
      console.log(this.data);
    })
  }
  

}
