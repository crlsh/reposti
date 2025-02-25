import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChoferesRoutingModule } from './choferes-routing.module';
import { ChoferesControlComponent } from './choferes-control/choferes-control.component';
import { ChoferesListadoComponent } from './choferes-listado/choferes-listado.component';
import { ChoferesAltaComponent } from './choferes-alta/choferes-alta.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ChoferesTarifaGralComponent } from './choferes-tarifa-gral/choferes-tarifa-gral.component';
import { ChoferesTarifaEspecialComponent } from './choferes-tarifa-especial/choferes-tarifa-especial.component';
import { ModalVehiculoComponent } from './modal-vehiculo/modal-vehiculo.component';






@NgModule({
  declarations: [
    ChoferesControlComponent,
    ChoferesListadoComponent,
    ChoferesAltaComponent,    
         
    ChoferesTarifaGralComponent,
    ChoferesTarifaEspecialComponent,    
    ModalVehiculoComponent,
    
    
  ],
  imports: [
    CommonModule,
    ChoferesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    Ng2SearchPipeModule,
    NgxDatatableModule, 
    
  ]
})
export class ChoferesModule { }
