import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AsyncValidatorFn, ValidationErrors, AbstractControl, ValidatorFn } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  registrationForm: FormGroup;
  errMsg: string;

  constructor(private fb: FormBuilder, private authSrvc: AuthService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.registrationForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(15)] ],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(15)] ],
      cpassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(15)] ]
    }, {
      validators: [this.comaprePassword('password', 'cpassword')]
    });
  }

  get username() {
    return this.registrationForm.get('username') as FormControl;
  }

  get password() {
    return this.registrationForm.get('password') as FormControl;
  }

  get cpassword() {
    return this.registrationForm.get('cpassword') as FormControl;
  }

  register() {

    this.errMsg = '';

    if (!this.registrationForm.valid) {
      return false;
    }

    this.authSrvc.register(this.username.value, this.password.value).subscribe(
      (resp) => {
        this.router.navigate(['/shop/login']);
      },
      (error) => {
        if (error == 'User already exists') {
          this.username.setErrors({
            userAlreadyExists: true
          });
        } else {
          this.errMsg = error;
        }
      }
    );

  }

  comaprePassword(password, cpassword): ValidatorFn {

    return (group: FormGroup): ValidationErrors|null => {

      const passwordFld = (group.get(password) as FormControl);
      const cpasswordFld = (group.get(cpassword) as FormControl);

      if (passwordFld.value && cpasswordFld.value && passwordFld.value != cpasswordFld.value) {
        cpasswordFld.setErrors({pswdNotMatch: true});
        return {pswdNotMatch: true};
      }

      return null;
    };
  }
}
