import { Component, OnInit } from '@angular/core';
import { Chofer } from 'src/app/interfaces/chofer';
import { Cliente } from 'src/app/interfaces/cliente';
import { Operacion } from 'src/app/interfaces/operacion';
import { StorageService } from 'src/app/servicios/storage/storage.service';

@Component({
  selector: 'app-op-historial',
  templateUrl: './op-historial.component.html',
  styleUrls: ['./op-historial.component.scss']
})
export class OpHistorialComponent implements OnInit {
   
  detalleOp!: Operacion;
  opCerradas$!:any;
  componente: string = "operacionesCerradas";
  public show: boolean = false;
  public buttonName: any = 'Consultar Operaciones';
  consultasOp$!:any;
  titulo: string = "consultasOpCerradas";
  btnConsulta:boolean = false;
  date:any = new Date();
  primerDia: any = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 1).toISOString().split('T')[0];
  ultimoDia:any = new Date(this.date.getFullYear(), this.date.getMonth() + 2, 0).toISOString().split('T')[0];
  searchText: string = "";

  constructor(private storageService: StorageService) {    
   }
  
  ngOnInit(): void { 
    //this.opCerradas$ = this.storageService.opCerradas$ 
    this.consultasOp$ = this.storageService.consultasOpCerradas$;   
    this.consultaMes();
  }
  

  seleccionarOp(op:Operacion){
    this.detalleOp = op;
  }

  toggle() {
    this.show = !this.show;
    // Change the name of the button.
    if (this.show) this.buttonName = 'Cerrar';
    else this.buttonName = 'Consultar Operaciones';
  }

  consultaMes(){
    if(!this.btnConsulta){   
      console.log(this.primerDia, this.ultimoDia)         
      this.storageService.getByDateValue("operacionesCerradas", "fecha", this.primerDia, this.ultimoDia, this.titulo);    
    }     
  }

  getMsg(msg: any) {
    this.btnConsulta = true;
  }


}
