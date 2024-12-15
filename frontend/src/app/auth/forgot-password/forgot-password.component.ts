import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/appServices/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent implements OnInit {
  forgotPassForm: any = FormGroup;

  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private _authService: AuthService,
    private _toastrService: ToastrService
  ) {
    this.forgotPassForm = this.fb.group({
      email: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.forgotPassForm.valid) {
      console.log(this.forgotPassForm.value);

      const email = this.forgotPassForm.value.email;

      this.loading = true;
      this._authService.forgotPassword(email).subscribe(
        (res: any) => {
          this.loading = false;
          this._toastrService.success(res.message);
        },
        (err: any) => {
          this._toastrService.success(err.message);
        }
      );
    }
    this.forgotPassForm.reset();
  }
}
