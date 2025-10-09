import { ChangeDetectionStrategy, Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BooksService } from '../../services/books.service';
import { EditorialsService, EditorialItem } from '../../services/editorials.service';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-book-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
  <div class="vintage-container" *ngIf="loaded; else loadingTpl">
    <h1 class="vintage-title">Editar Libro</h1>

    <form (ngSubmit)="submit()" #f="ngForm" class="form-grid">
      <label>ISBN<input class="form-control" name="ISBN" [(ngModel)]="ISBN" required /></label>
      <label>Título<input class="form-control" name="title" [(ngModel)]="title" required /></label>
      <label>Subtítulo<input class="form-control" name="subtitle" [(ngModel)]="subtitle" /></label>
      <label>Fecha publicación<input type="date" class="form-control" name="publication_date" [(ngModel)]="publication_date" /></label>
      <label>Número de páginas<input type="number" class="form-control" name="number_pages" [(ngModel)]="number_pages" /></label>
      <label>Género<input class="form-control" name="genre" [(ngModel)]="genre" /></label>
      <label>Idioma<input class="form-control" name="language" [(ngModel)]="language" /></label>
      <label>Editorial
        <select class="form-control" name="editorial_id" [(ngModel)]="editorial_id">
          <option [ngValue]="null">Independiente</option>
          <option *ngFor="let e of editorials" [ngValue]="e.id">{{ e.user?.name || e.company_name }}</option>
        </select>
      </label>
      <label>Portada (nueva)<input type="file" class="form-control" (change)="onFile($event, 'image')" accept="image/*" /></label>
      <label>Archivo (PDF) (nuevo)<input type="file" class="form-control" (change)="onFile($event, 'file')" accept="application/pdf" /></label>
      <label class="full">Sinopsis<textarea class="form-control" name="synopsis" [(ngModel)]="synopsis" rows="5"></textarea></label>

      <div class="actions full">
        <button class="btn" [disabled]="loading">Guardar cambios</button>
        <a class="btn" [routerLink]="['/books', id]">Cancelar</a>
      </div>
    </form>
  </div>
  <ng-template #loadingTpl>
    <div class="vintage-container">
      <p *ngIf="!error">Cargando información del libro...</p>
      <div *ngIf="error" class="err-block">
        <p>No pudimos cargar el libro. Verifica que tienes permisos y que el servidor está activo.</p>
        <a class="btn" [routerLink]="['/books']">Volver</a>
      </div>
    </div>
  </ng-template>
  `,
  styles: [`
  .form-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
  .form-control{padding:8px;border:1px solid #d8c6a6;background:#fffaf0}
  label{display:flex;flex-direction:column;color:#3b2f2f}
  .full{grid-column:1/-1}
  .actions{display:flex;gap:8px}
  .err-block{margin-top:8px;padding:12px;border:1px solid #c62828;background:#fdecea;color:#c62828}
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookEditComponent {
  private route = inject(ActivatedRoute);
  private books = inject(BooksService);
  private editorialsSvc = inject(EditorialsService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  id!: number;
  loaded = false;
  error = false;
  editorials: EditorialItem[] = [];
  loading = false;

  // fields
  ISBN = '';
  title = '';
  subtitle: string | null = null;
  publication_date: string | null = null;
  number_pages: number | null = null;
  genre: string | null = null;
  editorial_id: number | null = null;
  language: string | null = null;
  synopsis: string | null = null;
  imageFile?: File;
  pdfFile?: File;

  ngOnInit(){
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.editorialsSvc.list().subscribe({
      next: (res: any) => {
        this.editorials = (res?.data ?? res) as EditorialItem[];
        this.cdr.markForCheck();
      },
      error: () => {
        // No bloquea la edición; solo deja lista vacía
        this.editorials = [];
        this.cdr.markForCheck();
      }
    });
    this.books.get(this.id).subscribe({
      next: (res) => {
        const b: Book = res.data;
        this.ISBN = b.ISBN;
        this.title = b.title;
        this.subtitle = b.subtitle ?? null;
        this.publication_date = b.publication_date ?? null;
        this.number_pages = b.number_pages ?? null;
        this.genre = b.genre ?? null;
        this.editorial_id = b.editorial_id ?? null;
        this.language = b.language ?? null;
        this.synopsis = b.synopsis ?? null;
        this.loaded = true;
        this.error = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.error = true;
        this.loaded = false;
        this.cdr.markForCheck();
      }
    });
  }

  onFile(ev: Event, kind: 'image'|'file'){
    const input = ev.target as HTMLInputElement;
    if (input.files && input.files.length) {
      if (kind === 'image') this.imageFile = input.files[0];
      if (kind === 'file') this.pdfFile = input.files[0];
    }
  }

  submit(){
    this.loading = true;
    const fd = new FormData();
    fd.append('ISBN', this.ISBN);
    fd.append('title', this.title);
    if (this.subtitle) fd.append('subtitle', this.subtitle);
    if (this.publication_date) fd.append('publication_date', this.publication_date);
    if (this.number_pages !== null && this.number_pages !== undefined) fd.append('number_pages', String(this.number_pages));
    if (this.genre) fd.append('genre', this.genre);
    if (this.editorial_id !== null && this.editorial_id !== undefined) fd.append('editorial_id', String(this.editorial_id));
    if (this.language) fd.append('language', this.language);
    if (this.synopsis) fd.append('synopsis', this.synopsis);
    if (this.imageFile) fd.append('image', this.imageFile);
    if (this.pdfFile) fd.append('file', this.pdfFile);

    this.books.update(this.id, fd).subscribe({
      next: res => {
        this.loading = false;
        this.router.navigate(['/books', this.id]);
      },
      error: () => {
        this.loading = false;
        alert('Error al actualizar libro.');
      }
    });
  }
}
