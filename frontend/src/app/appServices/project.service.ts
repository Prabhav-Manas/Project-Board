import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Create Project
  create(
    projectName: string,
    clientType: string,
    client: string,
    projectStatus: string
  ) {
    const body = {
      projectName: projectName,
      clientType: clientType,
      client: client,
      projectStatus: projectStatus,
    };

    return this.http.post<any>(
      `${this.baseUrl}/projects/create-project`,
      body,
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  // Fetch Projects
  getAllProjects(page: number, limit: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/projects/all-projects?page=${page}&limit=${limit}`
    );
  }

  // Fetch a Single Project
  getSingleProject(id: string) {
    return this.http.get<any>(`${this.baseUrl}/projects/project/${id}`);
  }

  // Edit Project
  updateProject(id: string, projectData: any) {
    return this.http.patch<any>(
      `${this.baseUrl}/projects/edit-project/${id}`,
      projectData
    );
  }

  // Delete Project
  deleteProject(id: string) {
    return this.http.delete<any>(
      `${this.baseUrl}/projects/delete-project/${id}`
    );
  }

  // Search Project
  searchProject(projectName: string): Observable<any> {
    if (!projectName.trim()) {
      console.log('Empty search term provided!');
      return of({ projects: [], total: 0 });
    }
    const params = new HttpParams().set('q', projectName); // HttpParams ensures correct parameter encoding
    return this.http.get<any>(`${this.baseUrl}/projects/search`, { params });
  }
}
