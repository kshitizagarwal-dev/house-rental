import { Component, inject } from '@angular/core';
import { addDoc, collection, doc, docData, Firestore, setDoc } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ref, Storage, uploadBytesResumable } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-craetepost',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './craetepost.component.html',
  styleUrl: './craetepost.component.css'
})
export class CraetepostComponent {
    propertyForm: FormGroup;
    private firestore : Firestore = inject(Firestore);
    imageFiles: File[] = [];
    imageUrls: string[] = [];
    uploadingImage : boolean = false;

  
    constructor(private fb: FormBuilder) {
      this.propertyForm = this.fb.group({
        apartmentName: ['', Validators.required],
        apartmentType: ['', Validators.required],
        sharedProperty: ['', Validators.required],
        location: ['', Validators.required],
        squareFeet: ['', [Validators.required, Validators.min(0)]],
        leaseType: ['', Validators.required],
        expectedRent: ['', [Validators.required, Validators.min(0)]],
        negotiable: [false],
        priceMode: ['', Validators.required],
        utilitiesIncluded: [false],
        furnished: ['', Validators.required],
        amenities: this.fb.group({
          gym: [false],
          swimmingPool: [false],
          carPark: [false],
          visitorsParking: [false],
          powerBackup: [false],
          garbageDisposal: [false],
          privateLawn: [false],
          waterHeater: [false],
          plantSecurity: [false],
          laundryService: [false],
          elevator: [false],
          clubHouse: [false],
        }),
        description: this.fb.group({
          title: ['', [Validators.required, Validators.maxLength(100)]],
          text: ['', [Validators.required, Validators.maxLength(500)]]
        }),
        postID: ''
      });
    }
  
    generateRandomPostId(): number {
      return Math.floor(100000 + Math.random() * 900000); // Random 6-digit ID
    }
  
    // uploadImage(event: any) {
    //   const files = event.target.files;
    //   if (files) {
    //     this.uploadingImage = true;
    //     Array.from(files).forEach((file: any) => {
    //       const reader = new FileReader();
    //       reader.onload = (e: any) => {
    //         this.imageUrls.push(e.target.result); // Store base64 string
    //       };
    //       reader.readAsDataURL(file); // Convert image to base64 format
    //     });
    //     this.uploadingImage = false;
    //   }
    // }

    uploadImage(event: Event): void {
      const fileInput = event.target as HTMLInputElement;
  
      if (fileInput.files) {
        this.uploadingImage = true;
        const files = Array.from(fileInput.files);
  
        files.forEach((file) => {
          this.imageFiles.push(file);
  
          const reader = new FileReader();
          reader.onload = () => {
            if (reader.result) {
              this.imageUrls.push(reader.result as string);
            }
          };
          reader.readAsDataURL(file);
        });
  
        setTimeout(() => {
          this.uploadingImage = false;
        }, 1000);
      }}

  // saveImagesLocally(): void {
  //   this.imageFiles.forEach((file) => {
  //     saveAs(file, file.name);
  //   });
  // }
  
    submitForm() {
      if (this.propertyForm.valid) {
        const postID = this.generateRandomPostId();
        setDoc(doc(this.firestore, 'properties', postID.toString()), {
          ...this.propertyForm.value,
          postID : postID
        })
        .then((docRef)=>{
          console.log("Data save properly",);
          this.propertyForm.reset();
        }, error=>{
          alert("Some issue occured. Plz try again later");
        })
      } else {
        alert('Please fill all required fields correctly.');
      }
    }
  }
  

