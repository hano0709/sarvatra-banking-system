import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../services/user.service';

interface Transfer {
  fromAccount: string;
  toAccount: string;
  toIfscCode: string;  
  amount: number;
  date: Date;
  status: string;
  transferType: string;
}

@Component({
  selector: 'app-transfer-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transfer-details.html',
  styleUrl: './transfer-details.scss',
})
export class TransferDetails {

  TransferType = '';
  isSubmitting = false;

  @Input() transfer: Transfer = {
    fromAccount: '',
    toAccount: '',
    toIfscCode: '',  
    amount: 0,
    date: new Date(),
    status: '',
    transferType: '',
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private userService: UserService,
  ) {
    // Set fromAccount from stored user data
    const accNo = this.userService.getAccNo();
    if (accNo) {
      this.transfer.fromAccount = accNo;
    }

    this.route.queryParamMap.subscribe((params) => {
      this.TransferType = params.get('transferType') ?? '';
    });
  }

  submitTransfer() {
    if (this.isSubmitting) return;

    const amount = Number(this.transfer.amount);
    const toAccount = this.transfer.toAccount.trim();

    if (!this.TransferType) {
      alert('Please select a transfer type.');
      return;
    }
    if (toAccount.length !== 10) {
      alert('Please enter a valid 10-digit To Account number.');
      return;
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      alert('Please enter a valid amount greater than zero.');
      return;
    }

    // Convert account numbers to numeric values for backend expecting long
    const fromAccountNumber = Number(this.transfer.fromAccount);
    const toAccountNumber = Number(toAccount);
    if (!Number.isFinite(fromAccountNumber) || !Number.isFinite(toAccountNumber)) {
      alert('Account numbers must be numeric.');
      return;
    }

    const payerAcc = this.userService.getAccNo();
    const payerIfsc = this.userService.getIfscNo();

    if (!payerAcc || !payerIfsc) {
      alert('User account or IFSC not found. Please login again.');
      return;
    }

    const validationPayload = {
      payer: {
        acc_no: Number(payerAcc),
        ifsc_no: payerIfsc,
      },
      payee: {
        acc_no: Number(toAccount),
        ifsc_no: this.transfer.toIfscCode,
      },
    };

    console.log('Sending CBS validation payload:', validationPayload);

    this.isSubmitting = true;

// First: CBS VALIDATION CALL
    this.http.post<any>('http://localhost:8080/api/cbs/validate', validationPayload).subscribe({
      next: (validationRes) => {
        console.log('CBS validation response:', validationRes);

        // Check response
        if (validationRes?.transaction === 'valid') {

          // Hidden success → only console log
          console.log('CBS validation passed. Proceeding with transaction...');

          // --------- EXISTING TRANSACTION FLOW (UNCHANGED) ---------

          const payload = {
            fromAccount: fromAccountNumber,
            toAccount: toAccountNumber,
            amount,
            transferType: this.TransferType,
          };

          console.log('Submitting transaction payload:', payload);

          this.http.post('http://localhost:8080/api/transactions', payload).subscribe({
            next: (res) => {
              console.log('Transaction created:', res);
              alert('Transaction successful');
              this.router.navigate(['/home']);
              this.isSubmitting = false;
            },
            error: (err) => {
              console.error('Failed to create transaction:', err?.error ?? err);
              const message =
                err?.error?.message ??
                err?.message ??
                'Transaction failed. Please verify the details and try again.';
              alert(message);
              this.isSubmitting = false;
            },
          });

          // ---------------------------------------------------------

        } else {
          // Validation failed
          const reason = validationRes?.reason ?? 'Validation failed by CBS.';
          alert('Transaction Invalid: ' + reason);
          this.isSubmitting = false;
        }
      },

      error: (err) => {
        console.error('CBS validation error:', err?.error ?? err);
        alert('Unable to validate transaction with CBS. Please try again.');
        this.isSubmitting = false;
      },
    });
  }

  onToAccountChange(value: string) {
    this.transfer.toAccount = value.replace(/\D/g, '').slice(0, 10);
  }

  preventNonDigits(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
    const isDigit = /^[0-9]$/.test(event.key);
    if (!isDigit && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  handleDataPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pasted = event.clipboardData?.getData('text') ?? '';
    const digitsOnly = pasted.replace(/\D/g, '');
    this.transfer.toAccount = (this.transfer.toAccount + digitsOnly).slice(0, 10);
  }

  onAmountChange(value: string) {
    this.transfer.amount = parseFloat(value.replace(/[^0-9.]/g, ''));
  }
}
