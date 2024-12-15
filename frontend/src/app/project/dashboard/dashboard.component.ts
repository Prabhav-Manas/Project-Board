import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { ProjectService } from '../../appServices/project.service';
import { Router } from '@angular/router';
import { Project } from 'src/app/appInterface/project.interface';
import { MatPaginator } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  newProjectForm: any = FormGroup;
  isEditMode: boolean = false;
  selectedProjectID: string = '';
  selectedProject: any = null;
  projectData!: Project;
  allProjects: any[] = [];

  loading: boolean = false;
  searchTerm: string = '';

  totalProjects: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  clientTypeDropDownOptions = [
    { value: 'select', label: 'Select' },
    { value: 'Individual', label: 'Individual' },
    { value: 'Company', label: 'Company' },
  ];

  projectStatusDropDownOptions = [
    { value: 'select', label: 'Select' },
    { value: 'New', label: 'New' }, //Orange
    { value: 'Pending', label: 'Pending' }, //Primary
    { value: 'Completed', label: 'Completed' }, //Green
  ];

  constructor(
    private fb: FormBuilder,
    private _projectServices: ProjectService,
    private router: Router,
    private _toastrService: ToastrService
  ) {
    this.newProjectForm = this.fb.group({
      projectName: new FormControl('', [Validators.required]),
      clientType: new FormControl('select', [Validators.required]),
      client: new FormControl('', [Validators.required]),
      projectStatus: new FormControl('select', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.fetchAllProjects(this.currentPage, this.pageSize);
  }

  capitalizeFirstLetter(value: string): string {
    if (value && value.length > 0) {
      return value.charAt(0).toUpperCase() + value.slice(1); // Capitalize first letter
    }
    return value;
  }

  onSubmit() {
    if (this.newProjectForm.valid) {
      console.log(this.newProjectForm.value);
      this.projectData = this.newProjectForm.value;

      // Manually convert values to lowercase before sending to backend
      this.projectData.clientType = this.projectData.clientType.toLowerCase();
      this.projectData.projectStatus =
        this.projectData.projectStatus.toLowerCase();

      if (this.isEditMode == true) {
        this._projectServices
          .updateProject(this.selectedProjectID, this.projectData)
          .subscribe(
            (res: any) => {
              this.fetchAllProjects(this.currentPage, this.pageSize);
              console.log('Edited Project Data ✅:=>', res);
            },
            (err: any) => {
              console.log('Error in Editing Project Data💥:=>', err);
            }
          );
        this.isEditMode = false;
      } else {
        const projectName = this.newProjectForm.value.projectName;
        const clientType = this.newProjectForm.value.clientType;
        const client = this.newProjectForm.value.client;
        const projectStatus = this.newProjectForm.value.projectStatus;

        this._projectServices
          .create(projectName, clientType, client, projectStatus)
          .subscribe(
            (res: any) => {
              this.fetchAllProjects(this.currentPage, this.pageSize);
              console.log('Create Project ✅:=>', res);
            },
            (err: any) => {
              if (err) {
                console.log('Error Create Project 💥:=>', err.error.message);
              }
            }
          );
      }
      this.isEditMode = false;
    }
    this.newProjectForm.reset();
  }

  fetchAllProjects(page: number, limit: number) {
    this._projectServices.getAllProjects(page, limit).subscribe(
      (res: any) => {
        this.loading = false;
        this._toastrService.success(res.message);
        this.allProjects = res.projects;
        this.totalProjects = res.totalProjects;
        console.log('Fetch All Projects ✅:=>', this.allProjects);
      },
      (err: any) => {
        this.loading = false;
        this._toastrService.error('Please add project!', err.error.message);
        console.log('Error in Fetching all Projects 💥:=>', err);
      }
    );
  }

  onPageChange(event: any) {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loading = true;
    this.fetchAllProjects(this.currentPage, this.pageSize);
  }

  onViewProject(project: any) {
    console.log('View Project ✅:=>', project);

    this.router.navigate(['/project-details'], {
      queryParams: { viewProject: project._id },
    });
    this.loading = true;
  }

  onEditProject(project: any) {
    console.log('Project:=>', project);
    console.log('Project ID:=>', project._id);
    this.isEditMode = true;
    this.selectedProjectID = project._id;

    this.newProjectForm.patchValue({
      projectName: project.projectName,
      clientType: project.clientType,
      client: project.client,
      projectStatus: project.projectStatus,
    });
  }

  onDeleteProject(project: any) {
    this.selectedProjectID = project._id;
    this._projectServices.deleteProject(this.selectedProjectID).subscribe(
      (res: any) => {
        console.log('Deleted Project ✅:=>', res);
        this.fetchAllProjects(this.currentPage, this.pageSize);
      },
      (err: any) => {
        console.log('Error in Deleting Project 💥:=>', err);
      }
    );
  }

  onModalClose() {
    this.isEditMode = false;
    this.newProjectForm.reset();
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'New':
        return 'status-new';
      case 'Pending':
        return 'status-pending';
      case 'Completed':
        return 'status-completed';
      default:
        return '';
    }
  }

  onSearchTermChange() {
    if (this.searchTerm.trim() === '') {
      console.log('Search term is empty. Please enter a valid term.');
      this.fetchAllProjects(this.currentPage, this.pageSize);
      return;
    }
    console.log('Searching for:', this.searchTerm); // Debugging log
    this._projectServices.searchProject(this.searchTerm).subscribe(
      (response: any) => {
        this.allProjects = response.project || []; // Adjust this based on your API response
        this.totalProjects = response.project.total || 0; // Adjust this based on your API response
        console.log('Projects Found ✅:', response.project);
      },
      (error: any) => {
        console.log('Error in Search Project 💥:', error);
      }
    );
  }
}
