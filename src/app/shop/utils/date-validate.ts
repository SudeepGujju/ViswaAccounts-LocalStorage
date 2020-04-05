import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import * as moment from 'moment';

export function DateValidator(): ValidatorFn {

  return (AC: AbstractControl): ValidationErrors | null => {

    if (AC && AC.value && !moment(AC.value, 'DD / MM / YYYY', true).isValid()) {
      return { errorDateValue: true };
    }
    return null;

  };
}
