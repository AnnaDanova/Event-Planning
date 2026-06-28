import { HttpErrorResponse } from '@angular/common/http';

export function getErrorMessage(err: HttpErrorResponse): string {
  if (typeof err.error === 'string') {
    return err.error;
  }

  if (err.error?.message) {
    return err.error.message;
  }

  if (err.error?.detail) {
    return err.error.detail;
  }

  if (err.error?.error) {
    return err.error.error;
  }

  if (err.status === 0) {
    return 'Няма връзка със сървъра.';
  }

  return 'Възникна грешка. Моля, опитайте отново.';
}
