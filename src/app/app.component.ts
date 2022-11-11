import {Component} from '@angular/core';
import {UsersService} from './services/users.service';
import {FilesService} from "./services/files.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  imgParent = 'https://www.w3schools.com/howto/img_avatar.png';
  showImg = true;
  token = '';
  imgRta = '';

  constructor(private userService: UsersService, private fileService: FilesService) { }

  onLoaded(img: string) {
    console.log('Log padre', img);
  }

  toggleImg() {
    this.showImg = !this.showImg;
  }

  createUser() {
    this.userService.create({
      name: 'Sebas',
      email: 'sebas@mail.com',
      password: '1212'
    })
    .subscribe( rta => {
      console.log(rta);
    });
  }

  downloadPdf() {
    this.fileService.getFile('my.pdf',
      'https://young-sands-07814.herokuapp.com/api/files/dummy.pdf', 'application/pdf')
      .subscribe()
  }

  onUpload(event: Event) {
    const element = event.target as HTMLInputElement;
    const file = element.files?.item(0);
    if (file) {
      this.fileService.uploadFile(file)
        .subscribe(rta => {
          this.imgRta = rta.location;
        });
    }
  }

}

