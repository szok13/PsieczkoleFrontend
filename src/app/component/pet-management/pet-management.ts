import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../service/auth/auth-service';
import { environment } from '../../../environments/environment';

interface Pet {
  id: number;
  petName: string;
  breed?: string;
  color: string;
  species: string;
  size: 'Small' | 'Medium' | 'Large' | '';
  additionalInfo?: string;
  ownerId?: string;
}

@Component({
  selector: 'app-pet-management',
  imports: [CommonModule, FormsModule],
  templateUrl: './pet-management.html',
  styleUrl: './pet-management.css',
})

export class PetManagement {
  private readonly API = environment.petManagementApiUrl

  authService = inject(AuthService);

  petData: Pet = {
    id: 0,
    petName: '',
    breed: '',
    color: '',
    species: '',
    size: '',
    additionalInfo: '',
    ownerId: ''
  };

  constructor(private http: HttpClient, private cd: ChangeDetectorRef) { }

  petList: Pet[] = [];

  error: string | null = null;
  isEditing = false;
  editIndex: number | null = null;

  onRegisterPet() {
    this.http.post<Pet>(`${this.API}/api/pet-management/register-pet`, this.petData)
      .subscribe({
        next: (savedPet) => {
          this.petList.push(savedPet);
          this.resetForm()
          this.cd.detectChanges();
        },
        error: (err) => {
          this.error = 'Pet registration failed. Please try again.';
        }
      });
  }

  onUpdatePet() {
    const indexToUpdate = this.editIndex;
    if (this.editIndex !== null) {
      this.http.put<Pet>(`${this.API}/api/pet-management/update-pet`, this.petData)
        .subscribe({
          next: () => {        
            this.isEditing = false;
            this.petList[indexToUpdate!] = { ...this.petData };
            this.resetForm();
            this.cd.detectChanges();
          },
          error: (err) => {
            this.error = 'Pet data update failed. Please try again.';
          }
        });
    }
  }

  cancelEdit() {
    this.resetForm();
    this.isEditing = false;
  }

  onEdit(pet: Pet) {
    this.isEditing = true;
    this.editIndex = this.petList.indexOf(pet);
    this.petData = { ...pet };
  }

  onRemove(pet: Pet) {
    const index = this.petList.indexOf(pet);
    if (index > -1) {
      this.http.delete<void>(`${this.API}/api/pet-management/delete-pet/${pet.id}`)
        .subscribe({
          next: () => {
            this.petList.splice(index, 1);
            this.cd.detectChanges();
          },
          error: (err) => {
            this.error = 'Pet delete failed. Please try again.';
          }
        });
    }
  }

  resetForm() {
    this.petData = {
      id: 0,
      petName: '',
      breed: '',
      color: '',
      species: '',
      size: '',
      additionalInfo: '',
      ownerId: ''
    };
    this.setOwnerId()
    this.error = null;
  }

  loadPetList(ownerId: string) {
    if (!ownerId) return;

    this.http.get<Pet[]>(`${this.API}/api/pet-management/load-pets`, {
      params: { ownerId }
    })
      .subscribe({
        next: (data) => {
          this.petList = data
          this.error = '';
          this.cd.detectChanges();
        },
        error: (err) => {
          this.error = 'Pet list loading failed. Please please refresh page.';
          this.cd.detectChanges();
          console.error(err);
        }
      });
  }

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.petData.ownerId = user.username;
        this.loadPetList(user.username);
      }
    });
  }

  setOwnerId() {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.petData.ownerId = user.username;
      }
    });
  }
}
