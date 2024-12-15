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
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent implements OnInit {
  logInForm: any = FormGroup;
  hide: string = 'password';
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private _authService: AuthService,
    private _toastrService: ToastrService
  ) {
    this.logInForm = this.fb.group({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.logInForm.valid) {
      console.log(this.logInForm.value);

      const email = this.logInForm.value.email;
      const password = this.logInForm.value.password;

      this.loading = true;
      this._authService.signin(email, password).subscribe(
        (res: any) => {
          this._toastrService.success(res.message);
        },
        (err: any) => {
          this._toastrService.error(err.message);
        }
      );
    }
    this.logInForm.reset();
  }
}
