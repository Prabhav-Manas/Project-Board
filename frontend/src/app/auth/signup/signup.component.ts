import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/appServices/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  regForm: any = FormGroup;
  hide: string = 'password';
  imagePreview: string = '';
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private _authService: AuthService,
    private router: Router,
    private _toastrService: ToastrService
  ) {
    this.regForm = this.fb.group({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      image: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {}

  onImagePicked(event: Event) {
    const fileInput = event.target as HTMLInputElement;

    // Check if files exist before accessing the first file
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      this.regForm.patchValue({ image: file });
      this.regForm.get('image').updateValueAndValidity();
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      console.error('No file selected');
    }
  }

  onSubmit() {
    if (this.regForm.valid) {
      console.log(this.regForm.value);

      const email = this.regForm.value.email;
      const password = this.regForm.value.password;
      const image = this.regForm.value.image;

      this.loading = true;
      this._authService.signup(email, password, image).subscribe(
        (res: any) => {
          this.loading = false;

          this.router.navigate(['/auth/signin']);
          this._toastrService.success(res.message);
        },
        (err: any) => {
          this.loading = false;
          this._toastrService.error(err.message);
        }
      );
    }
    this.regForm.reset();
  }
}
