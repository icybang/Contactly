import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Contact } from 'src/models/contact.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'contactly.web';
  contacts: Contact[] = [];

  contactsForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    favorite: new FormControl(false, Validators.required),
  });

  constructor(private http: HttpClient, private toast: ToastrService) {}
  ngOnInit(): void {
    this.getContacts();
  }
  private getContacts(): void {
    this.http
      .get<Contact[]>('https://localhost:7284/api/Contacts')
      .subscribe((result) => {
        if (result) {
          this.contacts = result;
        }
      });
  }

  onFormSubmit() {
    const addContactRequest = {
      name: this.contactsForm.value.name,
      email: this.contactsForm.value.email,
      phone: this.contactsForm.value.phone,
      favorite: this.contactsForm.value.favorite,
    };
    this.http
      .post('https://localhost:7284/api/Contacts', addContactRequest)
      .subscribe({
        next: (value) => {
          console.log(value);
          this.getContacts();
          this.contactsForm.reset();
          this.toast.success('Contact Added');
        },
      });
  }

  onDelete(id: string) {
    this.http.delete(`https://localhost:7284/api/Contacts/${id}`).subscribe({
      next: (value) => {
        this.getContacts();
        this.toast.success('Contact is deleted');
      },
    });
  }
}
