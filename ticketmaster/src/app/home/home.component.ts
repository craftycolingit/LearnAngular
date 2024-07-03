import { Component, ViewChild } from '@angular/core';
import { TicketsService } from '../services/tickets/tickets.service';
import { Tickets, Ticket } from '../../types';
import { TicketComponent } from '../components/ticket/ticket.component';
import { CommonModule } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { Paginator } from 'primeng/paginator';
import { EditPopupComponent } from '../components/edit-popup/edit-popup.component';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { BadgeModule } from 'primeng/badge';
import { DialogModule } from 'primeng/dialog';
import { environment } from '../../environments/environment.dev';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    TicketComponent,
    CommonModule,
    PaginatorModule,
    EditPopupComponent,
    ButtonModule,
    TableModule,
    BadgeModule,
    DialogModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly server: string = environment.API_BASE_URL;
  constructor(private ticketsService: TicketsService) {}

  @ViewChild('paginator') paginator: Paginator | undefined;

  tickets: Tickets = { items: [], total: 0, page: 0, perPage: 10, totalPages: 0 };
  selectedTicket: Ticket | null = null;
  displayEditPopup = false;
  displayAddPopup = false;
  totalRecords: number = 0;
  rows: number = 20;
  expandedRows: { [key: string]: boolean } = {};

  toggleRow(ticket: Ticket) {
    const ticketIdStr = String(ticket.ticketId);
    if (this.isRowExpanded(ticket)) {
      delete this.expandedRows[String(ticketIdStr)];
    } else {
      this.expandedRows[ticketIdStr] = true;
    }
  }

  isRowExpanded(ticket: Ticket): boolean {
    return !!this.expandedRows[String(ticket.ticketId)];
  }

  onRowExpand(event: any) {
    this.expandedRows[event.data.ticketId] = true;
  }

  onRowCollapse(event: any) {
    delete this.expandedRows[event.data.ticketId];
  }

  toggleEditPopup(ticket: Ticket) {
    this.selectedTicket = ticket;
    this.displayEditPopup = !this.displayEditPopup;
  }

  toggleDeletePopup(ticket: Ticket) {
    if (!ticket.ticketId) {
      return;
    }

    this.deleteTicket(ticket._id as string);
  }

  toggleAddPopup() {
    this.displayAddPopup = !this.displayAddPopup;
  }

  onDialogHide() {
    this.displayAddPopup = false;
  }

  onConfirmEdit(ticket: Ticket) {
    if (!this.selectedTicket?.ticketId) {
      return;
    }

    this.editTicket(ticket, this.selectedTicket._id as string);
    this.displayEditPopup = false;
  }

  onConfirmAdd(ticket: Ticket) {
    this.addTicket(ticket);
    this.displayEditPopup = false;
  }

  onCancelAdd() {
    this.displayAddPopup = false;
  }

  onPageChange(event: any) {
    this.fetchTickets(event.page, event.rows);
  }

  resetPaginator() {
    this.paginator?.changePage(0);
  }

  fetchTickets(page: number, perPage: number) {
    this.ticketsService
      .getTickets(`${this.server}/api/tickets`, { page, perPage })
      .subscribe({
        next: (data: Tickets) => {
          this.tickets = data;
          this.totalRecords = data.total;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  editTicket(ticket: Ticket, _id: string) {
    if (!_id) {
      return;
    }

    this.ticketsService
      .editTicket(`${this.server}/api/tickets/${_id}`, ticket)
      .subscribe({
        next: (data) => {
          this.fetchTickets(0, this.rows);
          this.resetPaginator();
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  deleteTicket(_id: string) {
    this.ticketsService
      .deleteTicket(`${this.server}/api/tickets/${_id}`)
      .subscribe({
        next: (data) => {
          this.fetchTickets(0, this.rows);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  // Add a new ticket
  addTicket(ticket: Ticket) {

    console.log(ticket, 'addTicket');

    const newTicket = {
      name: ticket.name,
      description: ticket.description,
      severity: ticket.severity,
      status: ticket.status,
    };

    this.ticketsService
      .addTicket(`${this.server}/api/tickets`, newTicket)
      .subscribe({
        next: (data) => {
          this.fetchTickets(0, this.rows);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  ngOnInit() {
    this.fetchTickets(0, this.rows);
  }
}
