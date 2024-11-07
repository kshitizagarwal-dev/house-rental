import { Component, inject, ViewChild, viewChild } from '@angular/core';
import { arrayRemove, arrayUnion, collection, doc, Firestore, getDoc, getDocs, query, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatPaginatorModule, MatSelectModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  properties: any[] = [];
  imageUrls: { [key: string]: string } = {};
  pageSize = 5;
  pageIndex = 0;
  selectedSort: string = 'price';
  favoriteProperties: string[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  private firestore : Firestore = inject(Firestore);
  private router: Router = inject(Router);
  private auth: Auth = inject(Auth);

  constructor() {}

  ngOnInit(): void {
    this.fetchProperties();
  }

  async fetchProperties() {
    const vas = await getDocs(query(collection(this.firestore, 'properties')));
    this.properties = vas.docs.map((propertie)=>propertie.data());
    console.log("New value is ",this.properties);
    }   
    
  
    // this.loadImages();

  // loadImages(): void {
  //   this.properties.subscribe(properties => {
  //     properties.forEach(property => {
  //       this.imageUrls[property.id] = `/assets/images/${property.id}.jpg`;
  //     });
  //   });
  // }

  onPageChange(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  async viewDetails(propertyId : string) {
    const user = this.auth.currentUser?.uid;
    
    console.log('current user is ', user);
    console.log('currents ', propertyId);
    if(user){

      this.router.navigate([`/property-details/${propertyId}`]);
    }else{
      this.router.navigate(['/login'],
        {
          queryParams:{returnUrl:  `/property-details/${propertyId}`}
        }
      );
    }
  }


  async toggleFavorite(propertyId: string | undefined) {
    console.log("toggle property id is ", propertyId);
    if (!propertyId) {
      console.error('Property ID is undefined');
      return;
    }
    
    if (!this.auth.currentUser) {
      // Redirect to login if not authenticated
      this.router.navigate(['/login']);
      return;
    }
    const userId = this.auth.currentUser.uid;

    const vals = await getDocs(query(collection(this.firestore, 'users')));
    const userData = vals.docs.map((user)=>user.data());
    for (let i = 0; i < userData.length; i++) {
      if(userData[i]['userId'] == userId){
        console.log("new data is ", userData[i]['favourites']);
        this.favoriteProperties= userData[i]['favourites']
      }
    }
 

    const userDocRef = doc(this.firestore, 'users', userId.toString());
    const isFavorited = this.favoriteProperties.includes(propertyId);
    console.log("if ", isFavorited);
  
      try {
        if(!isFavorited){
        await updateDoc(userDocRef, {
          favourites:
           arrayUnion(propertyId)
          });
        }else{
          //Removing the favourite property
          await updateDoc(userDocRef, {
            favourites:
             arrayRemove(propertyId)
            });
        }
      if (isFavorited) {
        this.favoriteProperties = this.favoriteProperties.filter(id => id !== propertyId);
      } else {
        this.favoriteProperties.push(propertyId);
      }}
     catch (error) {
      console.error('Error updating favorites:', error);
    }
  }

}


