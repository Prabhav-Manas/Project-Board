import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material.module';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [DashboardComponent, ProjectDetailsComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    CommonModule,
  ],
})
export class ProjectModule {}
