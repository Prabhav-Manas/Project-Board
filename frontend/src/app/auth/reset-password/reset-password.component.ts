import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/appServices/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  resetPassForm: any = FormGroup;
  hide: string = 'password';
  conHide: string = 'password';
  token: string = '';

  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private _authService: AuthService,
    private router: Router,
    private _toastrService: ToastrService
  ) {
    this.resetPassForm = this.fb.group({
      newPassword: new FormControl('', [Validators.required]),
      conNewPassword: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token') || '';
  }

  onSubmit() {
    if (this.resetPassForm.valid) {
      const newPassword = this.resetPassForm.value.newPassword;
      const conNewPassword = this.resetPassForm.value.conNewPassword;

      if (newPassword === conNewPassword) {
        console.log(this.resetPassForm.value);

        this.loading = true;
        this._authService.resetPassword(this.token, newPassword).subscribe(
          (res: any) => {
            this.loading = false;
            this.router.navigate(['/auth/signin']);
            this._toastrService.success(res.message);
          },
          (err: any) => {
            this._toastrService.error(err.message);
          }
        );
      } else {
        this._toastrService.error('Password does not match!');
      }
    }
    this.resetPassForm.reset();
  }
}
