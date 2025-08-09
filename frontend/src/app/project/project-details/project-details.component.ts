import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from 'src/app/appServices/project.service';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css'],
})
export class ProjectDetailsComponent implements OnInit {
  selectedProject: any = null;
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private _projectService: ProjectService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get the project ID from the query params in the URL
    this.route.queryParams.subscribe((params) => {
      const projectId = params['viewProject'];
      if (projectId) {
        this.fetchProjectDetails(projectId);
      } else {
        console.log('No project ID found in the URL!');
      }
    });
  }

  fetchProjectDetails(projectId: string) {
    this.loading = true;
    this._projectService.getSingleProject(projectId).subscribe(
      (res: any) => {
        this.loading = false;
        this.selectedProject = res.project;
        console.log('Fetched Project Details ✅:=>', this.selectedProject);
      },
      (err: any) => {
        console.log('Error fetching project details 💥:=>', err);
      }
    );
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

  goBack() {
    this.router.navigate(['/app-dashboard'], { queryParams: {} });
  }
}
