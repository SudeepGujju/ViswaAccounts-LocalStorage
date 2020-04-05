import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  errMsg: string;

  constructor(private fb: FormBuilder, private authSrvc: AuthService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['testuser', Validators.required],
      password: ['123456789', Validators.required]
    });
  }

  get username() {
    return this.loginForm.get('username') as FormControl;
  }

  get password() {
    return this.loginForm.get('password') as FormControl;
  }

  login() {

    this.errMsg = '';

    if (!this.loginForm.valid) {
      return false;
    }

    this.authSrvc.login(this.loginForm.value.username, this.loginForm.value.password).subscribe(
      (resp) => {
        this.router.navigate(['/shop']);
      },
      (error) => {
        this.errMsg = error;
      }
    );
  }

}
