import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { collection, doc, Firestore, getDoc, getDocs, query, where } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favourites',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favourites.component.html',
  styleUrl: './favourites.component.css'
})
export class FavouritesComponent implements OnInit {
  
  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);
  private userId : any;
  favorites: any[] = []; 
  favoritesDetails: any[] = [];   // Store property details here
  isLoading = true;
  constructor(private router: Router){}

  ngOnInit(): void {
    //check if the user is authenticated
    this.getUserFavourites();
  }

   getUserFavourites():void{
    this.auth.onAuthStateChanged(async user => {
      if (user) {
        console.log('User is logged in:', user.uid);
        this.userId = user.uid;
        if(this.userId){ 

          const userRef = collection(this.firestore, 'users');
          const userQuery = query(
            userRef,
            where('userId', '==', this.userId) // Get properties that match the favorite post IDs
          );
          const userSnapshot = await getDocs(userQuery);
          this.favorites = [];
          userSnapshot.forEach((userDoc) => {
            const userData = userDoc.data();
            this.favorites.push(userData);
          });
          this.favorites = this.favorites[0]['favourites'];
          console.log("zzzzzzzzz",this.favorites);

            // get the property details that match the postid
            const propertyRef = collection(this.firestore, 'properties');
            const popertyQuery = query(
              propertyRef,
              where('postID', 'in', this.favorites )
            );
            const propertySnapshot = await getDocs(popertyQuery);
            this.favoritesDetails =[];
            propertySnapshot.forEach((propertyDoc) => {
              const propertyData = propertyDoc.data();
              this.favoritesDetails.push(propertyData);
            });
            // this.favorites = this.favoritesDetails[0]['favourites'];
            console.log("yyyyyyyyyy",this.favoritesDetails);
            this.isLoading = false;

      }
      
      } else {
        this.router.navigate(['/login']);
        return;
      }
    });
    
  }
  getPropertyImage(postID: string): string {
    return `${postID}.jpg`; // Customize the path as needed
  }

  viewDetailsRedirect(postID : string){
    console.log('property is ', postID);

    this.router.navigate([`property-details/${postID}`]);
  }
}
