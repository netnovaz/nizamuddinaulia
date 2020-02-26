import { Component, OnInit } from '@angular/core';
import { StaticpagesService} from './../api/staticpages.service';

import { LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loading: any;
  data: string;
  error: string;
  currentId: any;
  pageTitle: string;

  constructor(private http: HttpClient, public loadingController: LoadingController, private activatedRoute: ActivatedRoute) {
    this.data = '';
    this.error = '';
  }

  ngOnInit() {
    this.currentId = this.activatedRoute.snapshot.paramMap.get('currentid');
    this.pageTitle = this.activatedRoute.snapshot.paramMap.get('pageTitle');

    
  }
  async ionViewWillEnter() {
    // Present a loading controller until the data is loaded
    await this.presentLoading();
    // Load the data
    this.prepareDataRequest()
        .pipe(
            finalize(async () => {
              // Hide the loading spinner on success or error
              await this.loading.dismiss();
            })
        )
        .subscribe(
            data => {
              // Set the data to display in the template
              this.data = JSON.parse(JSON.stringify(data));
            },
            err => {
              // Set the error information to display in the template
              this.error = `An error occurred, the data could not be retrieved: Status: ${err.status}, Message: ${err.statusText}`;
            }
        );
  }

  async presentLoading() {
    // Prepare a loading controller
    this.loading = await this.loadingController.create({
      message: 'Loading...'
    });
    // Present the loading controller
    await this.loading.present();
  }

  private prepareDataRequest(): Observable<object> {
    // Define the data URL
    const dataUrl = 'http://razajarrar.com/nizamuddin/articles.php';
    // Prepare the request
    return this.http.get(dataUrl);
  }

}
