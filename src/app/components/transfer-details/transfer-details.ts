import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

interface Transfer {
  fromAccount: string;
  toAccount: string;
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

  accounts: string[] = ['1234567890', '0987654321', '1122334455'];
  TransferType = '';

  @Input() transfer: Transfer = {
    fromAccount: '1234567890',
    toAccount: '',
    amount: 0,
    date: new Date(),
    status: '',
    transferType: '',
  };

  constructor(private route: ActivatedRoute) {
    this.route.queryParamMap.subscribe((params) => {
      this.TransferType = params.get('transferType') ?? '';
    });
  }

  submitTransfer() {
    console.log(this.transfer);
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
