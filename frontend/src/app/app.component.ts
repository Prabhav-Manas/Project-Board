import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './appServices/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'frontend';
  userIsAuthenticated: boolean = false;
  private authListenerSubs!: Subscription;

  constructor(private _authService: AuthService) {}

  ngOnInit(): void {
    this._authService.autoAuthData();

    this.userIsAuthenticated = this._authService.getIsAuth();

    this.authListenerSubs = this._authService
      .getAuthStatusListener()
      .subscribe((isAutheticated) => {
        this.userIsAuthenticated = isAutheticated;
      });
  }

  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }
}
