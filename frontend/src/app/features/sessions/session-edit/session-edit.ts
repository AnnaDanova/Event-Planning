import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { SessionService } from '../../../core/services/session.service';
import { SessionCreateRequest, SessionMaterialResponse } from '../../../core/models/session.model';
import { UserService } from '../../../core/services/user.service';
import { UserResponse } from '../../../core/models/user.model';
import { SpeakerResponse } from '../../../core/models/speaker.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-session-edit',
  imports: [FormsModule, RouterLink],
  templateUrl: './session-edit.html',
  styleUrl: './session-edit.css'
})
export class SessionEdit implements OnInit {
  eventId!: number;
  sessionId!: number;
  speakerSearch = '';
  speakerResults = signal<UserResponse[]>([]);
  currentSpeakers = signal<SpeakerResponse[]>([]);
  selectedMaterial: File | null = null;
  materials = signal<SessionMaterialResponse[]>([]);
  sessionData = signal<SessionCreateRequest>({
    title: '',
    description: '',
    startTime: '',
    endTime: ''
  });
  errorMessage = '';
  loggedUser!: UserResponse | null;
  organizerId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sessionService: SessionService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loggedUser = this.authService.getLoggedUser();
    this.eventId = Number(this.route.snapshot.paramMap.get('eventId'));
    this.sessionId = Number(this.route.snapshot.paramMap.get('sessionId'));
    this.loadSession();
    this.loadSpeakers();
    this.loadMaterials();
  }

  loadSession(): void {
    this.sessionService.getSessionById(this.eventId, this.sessionId).subscribe({
      next: (session) => {
        this.organizerId = session.organizerId;
        this.sessionData.set({
          title: session.title,
          description: session.description,
          startTime: this.formatDateForInput(session.startTime),
          endTime: this.formatDateForInput(session.endTime)
        });
      },
      error: (err) => {
        console.log('LOAD SESSION ERROR:', err);
        this.errorMessage = 'Could not load session.';
      }
    });
  }

  loadSpeakers(): void {
    this.sessionService.getSpeakersBySessionId(this.eventId, this.sessionId).subscribe({
      next: (speakers) => {
        this.currentSpeakers.set(speakers);
      },
      error: (err) => {
        console.log('LOAD SPEAKERS ERROR:', err);
        this.errorMessage = 'Could not load speakers.';
      }
    });
  }
  loadMaterials(): void {
    this.sessionService.getSessionMaterials(this.eventId, this.sessionId).subscribe({
      next: (materials) => {
        this.materials.set(materials);
      },
      error: (err) => {
        console.log('LOAD MATERIALS ERROR:', err);
      }
    });
  }

  searchSpeakers(): void {
    const query = this.speakerSearch.trim();
    if (query.length < 2) {
      this.speakerResults.set([]);
      return;
    }
    this.userService.searchUsers(query).subscribe({
      next: (users) => {
        this.speakerResults.set(users);
      },
      error: (err) => {
        console.log('SEARCH SPEAKERS ERROR:', err);
      }
    });
  }

  addSpeaker(user: UserResponse): void {
    if (!this.loggedUser) {
      this.errorMessage = 'Трябва да сте вписани.';
      return;
    }
    const alreadyAdded = this.currentSpeakers().some(speaker => speaker.id === user.id);
    if (alreadyAdded) {
      this.speakerSearch = '';
      this.speakerResults.set([]);
      return;
    }
    this.sessionService.addSpeakerToSession(this.eventId, this.sessionId, user.id, this.loggedUser.id).subscribe({
      next: () => {
        this.currentSpeakers.update(speakers => [
          ...speakers, {
            id: user.id,
            fullName: `${user.firstName} ${user.lastName}`,
            bio: user.bio,
            profilePhoto: user.profilePhoto
          }
        ]);
        this.speakerSearch = '';
        this.speakerResults.set([]);
      },
      error: (err) => {
        console.log('ADD SPEAKER ERROR:', err);
        this.errorMessage = 'Нямате право да добавяте лектори.';
      }
    });
  }

  removeSpeaker(speakerId: number): void {
    if (!this.loggedUser) {
      this.errorMessage = 'Трябва да сте вписани.';
      return;
    }
    this.sessionService.removeSpeakerFromSession(this.eventId, this.sessionId, speakerId, this.loggedUser.id).subscribe({
      next: () => {
        this.currentSpeakers.update(speakers =>
          speakers.filter(speaker => speaker.id !== speakerId)
        );
      },
      error: (err) => {
        console.log('REMOVE SPEAKER ERROR:', err);
        this.errorMessage = 'Нямате право да премахвате лектори.';
      }
    });
  }

  updateSession(): void {
    if (!this.loggedUser) {
      this.errorMessage = 'Трябва да сте вписани.';
      return;
    }
    this.sessionService.updateSession(this.eventId, this.sessionId, this.loggedUser.id, this.sessionData()).subscribe({
      next: () => {
        this.router.navigate(['/events', this.eventId, 'sessions']);
      },
      error: (err) => {
        console.log('UPDATE SESSION ERROR:', err);
        this.errorMessage = 'Нямате право да редактирате тази сесия.';
      }
    });
  }

  updateField(field: keyof SessionCreateRequest, value: string): void {
    this.sessionData.update(data => ({
      ...data,
      [field]: value
    }));
  }

  private formatDateForInput(dateValue: string): string {
    if (!dateValue) {
      return '';
    }
    return dateValue.slice(0, 16);
  }

  onMaterialSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }
    this.selectedMaterial = input.files[0];
  }

  uploadMaterial(): void {
    if (!this.selectedMaterial) {
      this.errorMessage = 'Моля, изберете файл.';
      return;
    }
    this.sessionService.uploadSessionMaterial(this.eventId, this.sessionId, this.selectedMaterial).subscribe({
      next: (material) => {
        this.materials.update(materials => [...materials, material]);
        this.selectedMaterial = null;
        this.errorMessage = '';
      },
      error: (err) => {
        console.log('UPLOAD MATERIAL ERROR:', err);
        this.errorMessage = 'Файлът не можа да бъде качен.';
      }
    });
  }

  deleteMaterial(materialId: number): void {
    this.sessionService.deleteSessionMaterial(this.eventId, this.sessionId, materialId).subscribe({
      next: () => {
        this.materials.update(materials =>
          materials.filter(material => material.id !== materialId)
        );
      },
      error: (err) => {
        console.log('DELETE MATERIAL ERROR:', err);
        this.errorMessage = 'Материалът не можа да бъде изтрит.';
      }
    });
  }

  isSpeaker(): boolean {
    return !!this.loggedUser && this.currentSpeakers().some(speaker => speaker.id === this.loggedUser!.id);
  }

  isOrganizer(): boolean {
    return !!this.loggedUser && this.organizerId === this.loggedUser.id;
  }
}
