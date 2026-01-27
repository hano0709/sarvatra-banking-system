import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly ACC_NO_KEY = 'user_acc_no';
  private readonly NAME_KEY = 'user_name';
  private readonly IFSC_CODE = 'user_ifsc_no'

  setUserData(accNo: string, name: string, ifsc_no: string): void {
    sessionStorage.setItem(this.ACC_NO_KEY, accNo);
    sessionStorage.setItem(this.NAME_KEY, name);
    sessionStorage.setItem(this.IFSC_CODE, ifsc_no);
  }

  getAccNo(): string | null {
    return sessionStorage.getItem(this.ACC_NO_KEY);
  }

  getName(): string | null {
    return sessionStorage.getItem(this.NAME_KEY);
  }

  getIfscNo(): string | null {
    return sessionStorage.getItem(this.IFSC_CODE);
  }

  clearUserData(): void {
    sessionStorage.removeItem(this.ACC_NO_KEY);
    sessionStorage.removeItem(this.NAME_KEY);
    sessionStorage.removeItem(this.IFSC_CODE);
  }
}
