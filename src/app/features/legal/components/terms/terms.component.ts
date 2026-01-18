import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './terms.component.html',
  styleUrl: './terms.component.scss'
})
export class TermsComponent implements OnInit {
  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
