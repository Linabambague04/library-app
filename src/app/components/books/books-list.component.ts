import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BooksService } from '../../services/books.service';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-books-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="vintage-container">
    <h1 class="vintage-title">Biblioteca</h1>

    <div class="filters">
      <input class="form-control" [(ngModel)]="title" (ngModelChange)="onFilterChange()" placeholder="Buscar por título">
      <input class="form-control" [(ngModel)]="genre" (ngModelChange)="onFilterChange()" placeholder="Género">
    </div>

    <p *ngIf="loadingAll" class="loading-note">Cargando todos los libros...</p>
    <p *ngIf="!loadingAll" class="count-note">Mostrando {{ books.length }} de {{ allBooks.length }}</p>

    <div *ngIf="books.length; else noResults" class="grid">
      <div class="card" *ngFor="let b of books">
        <ng-container *ngIf="b.image && svc.toStorageUrl(b.image) as img; else coverPlaceholder">
          <img [src]="img" alt="cover"/>
        </ng-container>
        <ng-template #coverPlaceholder>
          <div class="cover-placeholder" aria-label="Sin portada">📚</div>
        </ng-template>
        <div class="content">
          <h3>{{ b.title }}</h3>
          <p class="subtitle" *ngIf="b.subtitle">{{ b.subtitle }}</p>
          <p class="author" *ngIf="b.author?.user">Por {{ b.author?.user?.name }}</p>
          <button type="button" class="btn btn-link" (click)="go(b.id)">Leer</button>
        </div>
      </div>
    </div>
    <ng-template #noResults>
      <p class="no-results">No hay resultados para los filtros aplicados.</p>
    </ng-template>
  </div>
  `,
  styles: [`
  .vintage-container{max-width:1100px;margin:0 auto;padding:24px}
  .vintage-title{font-family:'Poppins','Source Sans 3',sans-serif;color:#3b2f2f;border-bottom:2px solid #b89b72;padding-bottom:8px;margin-bottom:16px}
  .filters{display:flex;gap:8px;margin-bottom:16px}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px}
  .card{background:#fbf7ef;border:1px solid #d8c6a6;border-radius:8px;overflow:hidden;box-shadow:0 2px 6px rgba(0,0,0,.06)}
  .card img{width:100%;height:200px;object-fit:cover}
  .cover-placeholder{width:100%;height:200px;display:flex;align-items:center;justify-content:center;background:#f0e7d6;color:#7a5c3e;font-size:48px}
  .card .content{padding:12px}
  .subtitle{color:#6b5b53}
  .author{font-style:italic;color:#5a4634}
  .btn{background:#b89b72;color:#241c15;border:none;padding:6px 10px;border-radius:4px}
  .btn:disabled{opacity:.6}
  .btn-link{color:#7a5c3e;text-decoration:underline;background:transparent;border:none;padding:0}
  .loading-note{color:#6b5b53;margin-bottom:8px}
  .count-note{color:#6b5b53;margin-bottom:8px}
  .no-results{color:#6b5b53;font-style:italic}
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksListComponent {
  svc = inject(BooksService);
  private router = inject(Router);
  books: Book[] = [];
  allBooks: Book[] = [];
  title = '';
  genre = '';
  private searchTimer: any;
  loadingAll = false;

  ngOnInit(){ this.loadAll(); }

  private loadAll(){
    this.loadingAll = true;
    let page = 1;
    const collected: Book[] = [];
    const fetchPage = () => {
      this.svc.list({ page }).subscribe(res => {
        const data = res.data.data || [];
        collected.push(...data);
        const last = res.data.last_page || 1;
        if (page < last) {
          page++;
          fetchPage();
        } else {
          this.allBooks = collected;
          this.applyFilter();
          this.loadingAll = false;
        }
      });
    };
    fetchPage();
  }

  go(id?: number){
    if (!id) return;
    this.router.navigate(['/books', id]);
  }

  onFilterChange(){
    if (this.searchTimer) clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      this.applyFilter();
    }, 400);
  }

  private applyFilter(){
    const t = (this.title || '').toLowerCase();
    const g = (this.genre || '').toLowerCase();
    this.books = this.allBooks.filter(b => {
      const okTitle = !t || (b.title || '').toLowerCase().includes(t) || (b.subtitle || '').toLowerCase().includes(t);
      const okGenre = !g || (b.genre || '').toLowerCase().includes(g);
      return okTitle && okGenre;
    });
  }
}
