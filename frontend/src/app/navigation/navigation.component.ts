import { Component, OnInit } from '@angular/core';
import { AuthService } from '../appServices/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent implements OnInit {
  constructor(private _authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  onLogout() {
    this._authService.onLogout();
    this.router.navigate(['/']);
  }
}
