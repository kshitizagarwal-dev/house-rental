import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import { arrayUnion, collection, doc, Firestore, getDoc, getDocs, query, updateDoc } from '@angular/fire/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-productdetails',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './productdetails.component.html',
  styleUrl: './productdetails.component.css'
})
export class ProductdetailsComponent implements OnInit {
  propertyId: string | undefined;
  property: any = null; // To hold the property details from Firestore
  loading: boolean = true;
  errorMessage: string = '';
  userName : string = '';
  newComment: { username: string; text: string } = { username: '', text: '' };
  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);
  private firestores: Firestore = inject(Firestore);  // Inject Firestore instance

  constructor(private route: ActivatedRoute, private router : Router) {
    console.log('i am here');
  }

  ngOnInit(): void {   
    if (!this.auth.currentUser) {
    this.router.navigate(['/login']); // Redirect to login page if not authenticated
    return;
  }
    // Get propertyId from the route parameters
    this.propertyId = this.route.snapshot.paramMap.get('propertyId')!;
    this.fetchPropertyDetails();
  }

  // Fetch property details from Firestore
  async fetchPropertyDetails() {
    const userId = this.auth.currentUser?.uid;

    if(userId){
      const vas = await getDocs(query(collection(this.firestore, 'users')));
      const userData = vas.docs.map((propertie)=>propertie.data());
 
      for (let i = 0; i < userData.length; i++) {

        if(userData[i]['userId'] == userId){
          this.userName = userData[i]['name'];
          break;
        }
      }
    }
   
    if (this.propertyId){
    try {
   
      const docRef = doc(this.firestore, 'properties', this.propertyId.toString()); 
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        this.property = docSnap.data(); 
        console.log('current data is ', this.property)// Get the data from the snapshot
      } else {
        this.errorMessage = 'Property not found';
      }
    } catch (error) {
      this.errorMessage = 'Error fetching property details';
    } finally {
      this.loading = false; // End loading state
    }
  }
}

async addComment() {
  if (this.newComment.text.trim() && this.propertyId && this.userName) {
    // Add comment to Firestore
    const formattedComment = `${this.userName}: ${this.newComment.text}`;
    // const commentsCollection = collection(this.firestore, 'comments');
    updateDoc(doc(this.firestore, 'properties', this.propertyId?.toString()),{
      comments: arrayUnion(formattedComment)
    });
    this.newComment.text = '';
  }
}
}
