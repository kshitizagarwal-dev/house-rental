import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CraetepostComponent } from '../craetepost/craetepost.component';


@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [CommonModule,CraetepostComponent],
  templateUrl: './preview.component.html',
  styleUrl: './preview.component.css'
})
export class PreviewComponent {
  @Input() previewData: any;
  // @Input() imageUrls: string[] = [];

  @Output() submitPreview = new EventEmitter<void>();
  
  onSubmit() {
    this.submitPreview.emit();

     // Emit the submit event when clicked
  }
}
