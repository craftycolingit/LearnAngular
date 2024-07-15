import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Ticket } from '../../../types';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService } from 'primeng/api';
import { TruncateNamePipe } from '../../pipes/truncate-name.pipe';

@Component({
  selector: 'app-ticket',
  standalone: true,
  imports: [FormsModule, ButtonModule, ConfirmPopupModule, ToastModule, TruncateNamePipe],
  providers: [ConfirmationService],
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.scss'
})
export class TicketComponent {
  constructor(private confirmationService: ConfirmationService) {}

  @ViewChild('deleteButton') deleteButton: any;

  @Input() ticket!: Ticket;
  @Output() edit: EventEmitter<Ticket> = new EventEmitter<Ticket>();
  @Output() delete: EventEmitter<Ticket> = new EventEmitter<Ticket>();

  editTicket() {
    this.edit.emit(this.ticket);
  }

  confirmDelete() {
    this.confirmationService.confirm({
      target: this.deleteButton.nativeElement,
      message: 'Are you sure that you want to delete this ticket?',
      accept: () => {
        this.deleteTicket();
      },
    });
  }

  deleteTicket() {
    this.delete.emit(this.ticket);
  }
}
