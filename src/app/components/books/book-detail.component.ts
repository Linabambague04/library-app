import { ChangeDetectionStrategy, Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BooksService } from '../../services/books.service';
import { Book } from '../../models/book.model';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
  <div class="vintage-container" *ngIf="book">
    <a class="btn" routerLink="/books">Volver</a>
    <div class="detail">
      <img *ngIf="book.image" [src]="svc.toStorageUrl(book.image)" alt="cover"/>
      <div>
        <h1 class="vintage-title">{{ book.title }}</h1>
        <p class="subtitle" *ngIf="book.subtitle">{{ book.subtitle }}</p>
        <p class="author">Autor: {{ book.author?.user?.name }}</p>
        <p>Género: {{ book.genre || 'N/D' }}</p>
        <p>Páginas: {{ book.number_pages || 'N/D' }}</p>
        <p>Editorial: {{ book.editorial?.user?.name || 'Independiente' }}</p>
        <p class="synopsis" *ngIf="book.synopsis">{{ book.synopsis }}</p>
        <!-- Acciones por rol -->
        <div class="actions" *ngIf="book.file; else noFile">
          <!-- Lector: lector ve un lector embebido -->
          <button class="btn" *ngIf="isReader" (click)="openReader()">Leer ahora</button>
          <!-- Autor: puede previsualizar -->
          <button class="btn" *ngIf="!isReader" (click)="openReader()">Vista previa</button>
          <a class="btn" [href]="svc.toStorageUrl(book.file)" target="_blank">Descargar PDF</a>
        </div>
        <ng-template #noFile>
          <p><em>Sin archivo disponible para lectura.</em></p>
        </ng-template>

        <!-- Acciones de autor si es dueño del libro -->
        <div class="actions" *ngIf="isOwner">
          <a class="btn" [routerLink]="['/author/books', book.id, 'edit']">Editar</a>
          <button class="btn" (click)="onDelete()">Eliminar</button>
        </div>
      </div>
    </div>

    <!-- Lector embebido para lectores -->
    <div class="reader" *ngIf="showReader && safePdfUrl">
      <div class="loading" *ngIf="isPdfLoading">
        <div class="spinner"></div>
        <span>Cargando PDF...</span>
      </div>
      <object [data]="safePdfUrl" type="application/pdf" width="100%" height="800px">
        <iframe [src]="safePdfUrl" width="100%" height="800px" (load)="onPdfLoaded()"></iframe>
      </object>
      <div class="mt-2">
        <a class="btn" [href]="svc.toStorageUrl(book && book.file ? book.file : null) || '#'" target="_blank">Abrir en pantalla completa</a>
      </div>
    </div>
  </div>
  `,
  styles: [`
  .detail{display:grid;grid-template-columns:260px 1fr;gap:20px}
  .detail img{width:260px;height:360px;object-fit:cover;border:1px solid #d8c6a6}
  .synopsis{margin-top:12px;color:#3b2f2f}
  .actions{display:flex;gap:8px;margin-top:12px}
  .reader{position:relative;margin-top:16px;border:1px solid #d8c6a6;background:#fff}
  .loading{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:rgba(255,255,255,0.8);z-index:2}
  .spinner{width:36px;height:36px;border:3px solid #d8c6a6;border-top-color:#b89b72;border-radius:50%;animation:spin 1s linear infinite;margin-bottom:8px}
  @keyframes spin{to{transform:rotate(360deg)}}
  @media (max-width: 768px){
    .reader object, .reader iframe{height: 70vh;}
  }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookDetailComponent {
  private route = inject(ActivatedRoute);
  svc = inject(BooksService);
  auth = inject(AuthService);
  router = inject(Router);
  sanitizer = inject(DomSanitizer);
  cdr = inject(ChangeDetectorRef);
  book?: Book;
  isReader = false;
  isOwner = false;
  showReader = false;
  safePdfUrl?: SafeResourceUrl;
  isPdfLoading = false;

  ngOnInit(){
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.isReader = this.auth.getRole() === 'reader';
    this.svc.get(id).subscribe(res => {
      this.book = res.data;
      const user = this.auth.getUser();
      const myAuthorId = user?.author?.id ?? null;
      this.isOwner = !!myAuthorId && this.book?.author_id === myAuthorId;
      if (this.isReader && this.book?.file) {
        // Auto abrir el lector para lectores al entrar al detalle
        this.openReader();
      }
      this.cdr.markForCheck();
    });
  }

  onDelete(){
    if (!this.book?.id) return;
    const confirmMsg = '¿Eliminar este libro? Esta acción no se puede deshacer.';
    if (!confirm(confirmMsg)) return;
    this.svc.delete(this.book.id).subscribe({
      next: () => {
        alert('Libro eliminado');
        this.router.navigate(['/books']);
      },
      error: () => alert('No se pudo eliminar el libro')
    });
  }

  openReader(){
    if (!this.book?.file) return;
    const url = this.svc.getFileUrl(this.book.id!);
    if (!url) return;
    // Si es lector, guardar en "Mis libros"
    if (this.isReader && this.book?.id) {
      this.svc.markAsRead(this.book.id).subscribe({
        next: () => {
          // refrescar perfil en cache para que aparezca en /profile
          this.auth.me().subscribe({ next: (u) => this.auth.saveUser(u) });
        },
        error: () => {}
      });
    }
    this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    this.isPdfLoading = true;
    this.showReader = true;
    this.cdr.markForCheck();
  }

  onPdfLoaded(){
    this.isPdfLoading = false;
  }
}
