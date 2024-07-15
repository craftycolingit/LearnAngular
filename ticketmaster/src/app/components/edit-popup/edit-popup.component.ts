import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { Ticket } from '../../../types';
import { FormBuilder, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';


@Component({
  selector: 'app-edit-popup',
  standalone: true,
  imports: [
    DialogModule,
    CommonModule,
    FormsModule,
    RatingModule,
    ButtonModule,
    ReactiveFormsModule,
    InputTextareaModule,
    InputTextModule,
    DropdownModule,
  ],
  templateUrl: './edit-popup.component.html',
  styleUrl: './edit-popup.component.scss',
})
export class EditPopupComponent {
  constructor(private formBuilder: FormBuilder) {}

  @Input() ticket: Ticket | null = null;
  @Input() display: boolean = false;
  @Input() header!: string;

  @Output() displayChange = new EventEmitter<boolean>();
  @Output() confirm = new EventEmitter<Ticket>();
  @Output() cancel = new EventEmitter<void>();

  // this would normally come from a database, but for now, we'll hardcode it
  statusOptions: { label: string; value: string }[] = [
    { label: 'Open', value: 'Open' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Resolved', value: 'Resolved' },
    { label: 'Closed', value: 'Closed' },
  ];

  specialCharacterValidator(): ValidatorFn {
    return (control) => {
      const hasSpecialCharacter = /[@#$%^*_+=[\]{};:"\\|<>/?]+/.test(
        control.value
      );
      return hasSpecialCharacter ? { hasSpecialCharacter: true } : null;
    };
  }

  ticketForm = this.formBuilder.group({
    _id: [''],
    ticketId: [0],
    name: ['', [Validators.required, this.specialCharacterValidator()]],
    description: ['', [Validators.required, this.specialCharacterValidator()]],
    severity: [1, Validators.required],
    status: ['Open', Validators.required],
  });

  ngOnInit():void {
    if (this.ticket) {
      this.ticketForm.patchValue({
        _id: this.ticket._id,
        ticketId: this.ticket.ticketId,
        name: this.ticket.name,
        description: this.ticket.description,
        severity: this.ticket.severity,
        status: this.ticket.status
      });
    }
  }

  ngOnChanges() {
    if (this.ticket) {
      this.ticketForm.patchValue(this.ticket);
    }
  }

  onConfirm() {
    const { _id, ticketId, name, description, severity, status } = this.ticketForm.value;

    console.log(_id);

    if (this.ticketForm.valid) {
      this.confirm.emit({
        _id: _id || '',
        ticketId: ticketId || 0,
        name: name || '',
        description: description || '',
        severity: severity || 0,
        status: status || '',
      });
      this.display = false;
      this.displayChange.emit(this.display);
    }
  }

  onCancel() {
    this.display = false;
    this.displayChange.emit(this.display);
  }
}
