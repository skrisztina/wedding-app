import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { User } from '../../../models/user.model';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { ProfileComponent } from '../profile.component';
import { DataServiceService } from '../../../services/data.service.service';

@Component({
  selector: 'app-profile-mod-form',
  imports: [ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './profile-mod-form.component.html',
  styleUrl: './profile-mod-form.component.scss'
})
export class ProfileModFormComponent implements OnInit, OnChanges{
  @Input() user: User | undefined;
  @Output() userUpdated = new EventEmitter<User>();

  updatedUser : User | undefined;
  userForm :FormGroup;

  constructor(private fb: FormBuilder){
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      phone: ['', Validators.pattern(/^(\+36|06)\s?(\d{2})\s?(\d{3})\s?(\d{4})$/)]
    })
  }

  ngOnInit(): void {
      if(this.user){
        this.userForm.patchValue({
          name: this.user.name,
          phone: this.user.phone
        });
      }
  }

  ngOnChanges(changes: SimpleChanges): void {
      if(changes['user'] && this.user){
        this.userForm.patchValue({
          name: this.user.name,
          phone: this.user.phone
        });
      }
  }

  updateUser(){
    if(this.userForm.valid && this.user){
      const updatedUser: User = {
        ...this.user,
        ...this.userForm.value
      };
  
      this.userUpdated.emit(updatedUser);
    }
  }
}
