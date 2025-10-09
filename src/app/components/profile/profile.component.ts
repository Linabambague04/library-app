import { ChangeDetectionStrategy, Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="vintage-container" *ngIf="user; else loading">
    <h1 class="vintage-title">Mi Perfil</h1>

    <form class="card p-3 mb-3" (ngSubmit)="save()">
      <h3>Cuenta</h3>
      <div class="grid-2">
        <label>Nombre
          <input class="form-control" name="name" [(ngModel)]="name" required />
        </label>
        <label>Email
          <input class="form-control" type="email" name="email" [(ngModel)]="email" required />
        </label>
        <label>Nueva contraseña
          <input class="form-control" type="password" name="password" [(ngModel)]="password" placeholder="Opcional" />
        </label>
        <label>Confirmar contraseña
          <input class="form-control" type="password" name="password_confirmation" [(ngModel)]="password_confirmation" placeholder="Opcional" />
        </label>
      </div>
      <small class="note">Solo llena contraseña si deseas cambiarla.</small>

      <ng-container *ngIf="role === 'reader'">
        <hr />
        <h3>Lector</h3>
        <div class="grid-3">
          <label>Apodo
            <input class="form-control" name="nickname" [(ngModel)]="nickname" />
          </label>
          <label>Fecha nacimiento
            <input class="form-control" type="date" name="date_birth" [(ngModel)]="date_birth" />
          </label>
          <label>Género favorito
            <input class="form-control" name="favorite_genre" [(ngModel)]="favorite_genre" />
          </label>
        </div>
      </ng-container>

      <div class="actions mt-2">
        <button class="btn" [disabled]="loading">Guardar</button>
        <span *ngIf="success" class="ok">Guardado</span>
        <span *ngIf="error" class="err">Error al guardar</span>
      </div>
    </form>

    <!-- Vista de rol solo-informativa para author/editorial -->
    <section class="card p-3 mb-3" *ngIf="role === 'author' && user.author">
      <h3>Autor</h3>
      <p><strong>Apellido:</strong> {{ user.author.last_name || 'N/D' }}</p>
      <p><strong>Nacionalidad:</strong> {{ user.author.nationality || 'N/D' }}</p>
      <p><strong>Fecha nacimiento:</strong> {{ user.author.date_birth || 'N/D' }}</p>
      <p><strong>Contacto:</strong> {{ user.author.contact || 'N/D' }}</p>
      <p><strong>Biografía:</strong></p>
      <p>{{ user.author.biography || 'N/D' }}</p>
    </section>

    <section class="card p-3 mb-3" *ngIf="role === 'editorial' && user.editorial">
      <h3>Editorial</h3>
      <p><strong>Compañía:</strong> {{ user.editorial.company_name || 'N/D' }}</p>
      <p><strong>Sitio Web:</strong> {{ user.editorial.website || 'N/D' }}</p>
      <p><strong>Teléfono:</strong> {{ user.editorial.phone || 'N/D' }}</p>
      <p><strong>Dirección:</strong> {{ user.editorial.address || 'N/D' }}</p>
      <p><strong>Descripción:</strong></p>
      <p>{{ user.editorial.description || 'N/D' }}</p>
    </section>

    <section class="card p-3 mb-3" *ngIf="role === 'reader' && user.reader">
      <h3>Mis libros</h3>
      <ul>
        <li *ngFor="let b of user.reader.books">{{ b.title || (b.book?.title) }}</li>
      </ul>
    </section>
  </div>
  <ng-template #loading>
    <div class="vintage-container">
      <p>Cargando perfil...</p>
      <div *ngIf="error" class="err-block">
        <p>No se pudo cargar tu perfil. Verifica que el servidor Laravel esté activo en <code>http://127.0.0.1:8000</code> y que hayas iniciado sesión.</p>
        <button class="btn" (click)="reload()">Reintentar</button>
      </div>
    </div>
  </ng-template>
  `,
  styles: [`
    .p-3{padding:1rem}
    .mb-3{margin-bottom:1rem}
    .grid-2{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
    .grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
    .form-control{padding:8px;border:1px solid #d8c6a6;background:#fffaf0}
    .actions{display:flex;gap:12px;align-items:center}
    .ok{color:#2e7d32}
    .err{color:#c62828}
    .note{color:#6b5b53}
    .err-block{margin-top:8px;padding:12px;border:1px solid #c62828;background:#fdecea;color:#c62828}
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  private auth = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  user: any;
  role = '';
  loading = false;
  success = false;
  error = false;

  // cuenta
  name = '';
  email = '';
  password = '';
  password_confirmation = '';
  // lector
  nickname = '';
  date_birth: string | null = null;
  favorite_genre = '';

  ngOnInit(){
    this.auth.me().subscribe({
      next: (u) => {
        this.user = u;
        this.role = u.role;
        this.name = u.name || '';
        this.email = u.email || '';
        if (u.role === 'reader' && u.reader) {
          this.nickname = u.reader.nickname || '';
          this.date_birth = u.reader.date_birth || null;
          this.favorite_genre = u.reader.favorite_genre || '';
        }
        this.auth.saveUser(u);
        this.error = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.error = true;
        this.user = this.auth.getUser();
        if (this.user) {
          this.role = this.user.role;
          this.name = this.user.name || '';
          this.email = this.user.email || '';
          if (this.user.role === 'reader' && this.user.reader) {
            this.nickname = this.user.reader.nickname || '';
            this.date_birth = this.user.reader.date_birth || null;
            this.favorite_genre = this.user.reader.favorite_genre || '';
          }
        } else {
          this.error = true;
        }
        this.cdr.markForCheck();
      }
    });
  }

  save(){
    this.loading = true;
    this.success = false;
    this.error = false;
    const payload: any = {
      name: this.name,
      email: this.email,
    };
    if (this.password) {
      payload.password = this.password;
      payload.password_confirmation = this.password_confirmation;
    }
    if (this.role === 'reader') {
      payload.nickname = this.nickname || undefined;
      payload.date_birth = this.date_birth || undefined;
      payload.favorite_genre = this.favorite_genre || undefined;
    }

    this.auth.updateMe(payload).subscribe({
      next: (u) => {
        this.loading = false;
        this.success = true;
        this.user = u;
        this.auth.saveUser(u);
        this.password = '';
        this.password_confirmation = '';
        setTimeout(() => this.success = false, 2000);
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.error = true;
        setTimeout(() => this.error = false, 3000);
        this.cdr.markForCheck();
      }
    });
  }

  reload(){
    this.error = false;
    this.ngOnInit();
  }
}
