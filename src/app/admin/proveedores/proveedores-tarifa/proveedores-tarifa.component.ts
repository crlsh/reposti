import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Cliente } from 'src/app/interfaces/cliente';
import { Proveedor } from 'src/app/interfaces/proveedor';


import { AdicionalKm, AdicionalTarifa, CargasGenerales, TarifaEspecial, TarifaProveedor } from 'src/app/interfaces/tarifa-proveedor';
import { DbFirestoreService } from 'src/app/servicios/database/db-firestore.service';
import { StorageService } from 'src/app/servicios/storage/storage.service';

@Component({
  selector: 'app-proveedores-tarifa',
  templateUrl: './proveedores-tarifa.component.html',
  styleUrls: ['./proveedores-tarifa.component.scss']
})
export class ProveedoresTarifaComponent implements OnInit {

  componente:string = "tarifasProveedor";  
  $proveedores!: any;
  proveedorSeleccionado!: Proveedor[];
  cargasGeneralesForm: any;
  cargasGeneralesEditForm: any; 
  adicionalKmForm: any;
  adicionalKmEditForm: any;
  tarifa!:TarifaProveedor;  
  cargasGenerales!: CargasGenerales;  
  adicionales!: AdicionalTarifa;
  historialTarifas$!: any;
  $ultimaTarifaAplicada!:any;
  $tarifasProveedor:any;
  tarifaEspecialForm:any;
  tarifaEspecialEditForm:any;  
  acompanianteForm:any;
  acompanianteEditForm:any;  
  adicionalKm: AdicionalKm [] = [];
  tarifasEspeciales!: TarifaEspecial | null ;
  tEspecial: boolean = false;
  tarifaEditar!: TarifaProveedor;


  constructor(private fb: FormBuilder, private storageService: StorageService, private dbFirebase: DbFirestoreService){
    this.cargasGeneralesForm = this.fb.group({                    //formulario para la carga general      
        utilitario:[""],
        furgon:[""],
        furgonGrande:[""],
        chasisLiviano:[""],
        chasis:[""],
        balancin:[""],
        semiRemolqueLocal:[""],        
   });
 
    this.tarifaEspecialForm = this.fb.group({                    //formulario para los extras de la carga general
        concepto:[""],
        valor:[""],
    });
  
    this.acompanianteForm = this.fb.group({
      acompaniante: [""],
    })
    
     this.adicionalKmForm = this.fb.group({                  //formulario para los adicionales de la jornada
      distanciaPrimerSector: [""],
      valorPrimerSector:[""],
      distanciaIntervalo:[""],
      valorIntervalo:[""],
   });

   this.cargasGeneralesEditForm = this.fb.group({                    //formulario para la carga general      
    utilitario:[""],
    furgon:[""],
    furgonGrande:[""],
    chasisLiviano:[""],
    chasis:[""],
    balancin:[""],
    semiRemolqueLocal:[""],        
});

this.tarifaEspecialEditForm = this.fb.group({                    //formulario para los extras de la carga general
    concepto:[""],
    valor:[""],
});

this.acompanianteEditForm = this.fb.group({
  acompaniante: [""],
})

 this.adicionalKmEditForm = this.fb.group({                  //formulario para los adicionales de la jornada
  distanciaPrimerSector: [""],
  valorPrimerSector:[""],
  distanciaIntervalo:[""],
  valorIntervalo:[""],
});
   }
   
   ngOnInit(): void {        
     this.historialTarifas$ = this.storageService.historialTarifasProveedores$;   
     this.storageService.proveedores$.subscribe(data => {
      this.$proveedores = data;
    })          
   }

   changeCliente(e: any) {    
    console.log(e.target.value);
    //let razonSocial = e.target.value.split(" ")[0];
    //console.log(apellido);
    this.proveedorSeleccionado = e.target.value;
    this.proveedorSeleccionado = this.$proveedores.filter(function (cliente:any){
      return cliente.razonSocial === e.target.value
    })
   console.log("este es el proveedor seleccionado: ", this.proveedorSeleccionado);
    this.buscarTarifas();
  }
  
  changeTarifaEspecial(e: any) {    
    console.log(e.target.value);
    //let razonSocial = e.target.value.split(" ")[0];
    //console.log(apellido);
    //this.tEspecial = !this.tEspecial;
    if (e.target.value === "si"){
      this.tEspecial = true;
    }else{
      this.tEspecial = false;
    }
    console.log(this.tEspecial);    
  }

  buscarTarifas(){
    //console.log(this.choferSeleccionado[0].idChofer);    
    this.storageService.getByFieldValue(this.componente, "idProveedor", this.proveedorSeleccionado[0].idProveedor);
    this.storageService.historialTarifasProveedores$.subscribe(data =>{
      console.log(data);
      this.$tarifasProveedor = data;
      console.log(this.$tarifasProveedor);
      this.$tarifasProveedor.sort((x:TarifaProveedor, y:TarifaProveedor) => y.idTarifaProveedor - x.idTarifaProveedor);
      console.log(this.$tarifasProveedor);
    })   
  }

  onSubmit() {
    //this.armarTarifa();
    //console.log("tarifa cliente");
    //console.log(this.cargasGeneralesForm.value, this.unidadesConFrioForm.value, this.acompanianteForm.value);
    this.armarTarifa();
    this.addItem(this.tarifa);
  }

  armarTarifa(){        
    this.armarCargasGenerales();
    //this.armarUnidadesConFrio();
    this.armarAdicionales();   
    console.log(this.tEspecial);
    
    if(this.tEspecial){
      this.guardarTarifaEspecial()
    }else{
      this.tarifasEspeciales = null;
    };   

    this.tarifa = {
      id:null,
      idTarifaProveedor:new Date().getTime(),
      idProveedor: this.proveedorSeleccionado[0].idProveedor,
      fecha: new Date().toISOString().split('T')[0],
      cargasGenerales: this.cargasGenerales,
      //unidadesConFrio: this.unidadesConFrio,
      adicionales: this.adicionales,
      tarifaEspecial: this.tarifasEspeciales,
      tEspecial: this.tEspecial,
    };  
    console.log("tarifa: ", this.tarifa);
  } 

  armarCargasGenerales(){
    this.cargasGenerales = this.cargasGeneralesForm.value; 
    console.log("cargas generales: ", this.cargasGenerales);
  }

  armarAdicionales(){
    this.adicionales = {
      acompaniante: this.acompanianteForm.value.acompaniante,
      adicionalKm:{
        primerSector: {
          distancia: this.adicionalKmForm.value.distanciaPrimerSector,
          valor: this.adicionalKmForm.value.valorPrimerSector,
      },
      sectoresSiguientes:{
          intervalo: this.adicionalKmForm.value.distanciaIntervalo,
          valor: this.adicionalKmForm.value.valorIntervalo,
      }
      }
    }
    console.log("adicionales: ", this.adicionales);
  }


   guardarTarifaEspecial(){
    if(this.tarifasEspeciales !== null){
      this.tarifasEspeciales = {
        concepto : this.tarifaEspecialForm.value.concepto,
        valor : this.tarifaEspecialForm.value.valor,
      }      
    }          
     /* this.tEspecial = !this.tEspecial; */
     this.tEspecial = true
     console.log(this.tarifasEspeciales);     
    }

  addItem(item:any): void {   
    this.storageService.addItem(this.componente, item); 
    //this.adicionalKmForm.reset();
    //this.tarifaForm.reset();
    this.cargasGeneralesForm.reset();
    this.tarifaEspecialForm.reset();
    this.acompanianteForm.reset();
    this.adicionalKmForm.reset();
    this.tarifasEspeciales = null;
    //this.adicionalesUnidadesConFrio = [];
    this.adicionalKm = [];
    this.ngOnInit();
  }  

  editarTarifa(tarifa:TarifaProveedor){
    this.tarifaEditar = tarifa;
    this.armarTarifaEditar();
  }

  eliminarTarifa(tarifa:TarifaProveedor){    
    this.storageService.deleteItem(this.componente, tarifa);
  }

  armarTarifaEditar(){
    this.cargasGeneralesEditForm.patchValue({
      utilitario:this.tarifaEditar.cargasGenerales?.utilitario,
      furgon:this.tarifaEditar.cargasGenerales?.furgon,
      furgonGrande:this.tarifaEditar.cargasGenerales?.furgonGrande,
      chasisLiviano:this.tarifaEditar.cargasGenerales?.chasisLiviano,
      chasis:this.tarifaEditar.cargasGenerales?.chasis,
      balancin:this.tarifaEditar.cargasGenerales?.balancin,
      semiRemolqueLocal:this.tarifaEditar.cargasGenerales?.semiRemolqueLocal,        
    });
    this.adicionalKmEditForm.patchValue({
      distanciaPrimerSector: this.tarifaEditar.adicionales.adicionalKm.primerSector.distancia,
      valorPrimerSector:this.tarifaEditar.adicionales.adicionalKm.primerSector.valor,
      distanciaIntervalo:this.tarifaEditar.adicionales.adicionalKm.sectoresSiguientes.intervalo,
      valorIntervalo:this.tarifaEditar.adicionales.adicionalKm.sectoresSiguientes.valor,
    });
    this.tarifaEspecialEditForm.patchValue({
      concepto:this.tarifaEditar.tarifaEspecial?.concepto,
      valor:this.tarifaEditar.tarifaEspecial?.valor,
    });
    this.acompanianteEditForm.patchValue({
      acompaniante: this.tarifaEditar.adicionales.acompaniante,
    });
  }

  onSubmitEdit(){
    this.armarTarifaModificada();
  }

  armarTarifaModificada(){
    this.tarifaEditar.adicionales.acompaniante = this.acompanianteEditForm.value.acompaniante;
    this.tarifaEditar.adicionales.adicionalKm = {
      primerSector: {
        distancia: this.adicionalKmEditForm.value.distanciaPrimerSector,
        valor: this.adicionalKmEditForm.value.valorPrimerSector,
    },
    sectoresSiguientes:{
        intervalo: this.adicionalKmEditForm.value.distanciaIntervalo,
        valor: this.adicionalKmEditForm.value.valorIntervalo,
    }
    }; 
    this.tarifaEditar.cargasGenerales = this.cargasGeneralesEditForm.value;
    let tarEsp:any ={
      concepto: this.tarifaEspecialEditForm.value.concepto,
      valor: this.tarifaEspecialEditForm.value.valor
    }
    this.tarifaEditar.tarifaEspecial = tarEsp;
    console.log(this.tarifaEditar);
    this.updateTarifa();
  }

  updateTarifa(){
    this.storageService.updateItem(this.componente,this.tarifaEditar);
  }

}
