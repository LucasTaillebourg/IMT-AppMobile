const { Plugins, CameraResultType } = capacitorExports;

const { Camera } = Plugins;
const { Storage } = Plugins;

var modalePersist;

async function httpGet(){
    var url = 'https://devfest-nantes-2018-api.cleverapps.io/blog'
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}


customElements.define('modal-page', class extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
      <form [formGroup]="userForm" padding-right>
      <ion-item>
        <ion-label position="floating">Titre</ion-label>
        <ion-input id="titre" type="text" required></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="floating">Description</ion-label>
        <ion-input id="description" required></ion-input>
      </ion-item>
  
      <ion-button 
        color="primary" 
        expand="block" 
        onClick="addEntry()">Confirm</ion-button>
    </form>
    `;
    }
  });

  
async function getCards(){
    var imgurl = 'https://devfest2018.gdgnantes.com'
    var result = await httpGet()


    result = JSON.parse(result)

    console.log(result)

    var html = '';
    result.forEach(element => {
        var res = '<ion-card> <ion-card-header> <ion-card-title>'
            + '<img src=' + imgurl + element.image +'>'+
            + '<p>' + element.title + '</p>' + 
            '</ion-card-title> </ion-card-header> <ion-card-content> '
            + element.brief +
            '</ion-card-content></ion-card>'
        html += res

    });

    
    const keys = await Storage.keys();

    console.log(keys)

    if(keys.keys.length > 0){
        console.log("coucou")
        for (const key of keys.keys) {
            var ret = await Storage.get({ key: key });
            ret = JSON.parse(ret.value)
            const res = '<ion-card> <ion-card-header> <ion-card-title>'
                + '<img src=' + ret.img +'>'+
                + '<p>' + ret.titre + '</p>' + 
                '</ion-card-title> </ion-card-header> <ion-card-content> '
                + ret.description +
                '</ion-card-content></ion-card>'
            html += res
        }
    }

    console.log(html)
    document.getElementById('card-container').innerHTML = html;


}

async function takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri
    });
    // image.webPath will contain a path that can be set as an image src. 
    // You can access the original file using image.path, which can be 
    // passed to the Filesystem API to read the raw data of the image, 
    // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
    var imageUrl = image.webPath;
    // Can be set to the src of an image now
    imageElement.src = imageUrl;
  }

  
function presentModal() {
// create the modal with the `modal-page` component
const modalElement = document.createElement('ion-modal');
modalElement.component = 'modal-page';

// present the modal
document.body.appendChild(modalElement);
modalePersist = modalElement
return modalElement.present();
}

async function openModale() {
    presentModal()
}

async function setObject(titre, desc, img) {
    const keys = await Storage.keys();
    await Storage.set({
      key: keys.keys.length,
      value: JSON.stringify({
        titre: titre,
        description: desc,
        img : img
      })
    });
  }

async function addEntry(){

    console.log('coucouc')
    const img = "https://www.closeupshop.fr/media/oart_0/oart_m/oart_89625/thumbs/907281_2484403.jpg"
    var res = '<ion-card> <ion-card-header> <ion-card-title>'
    // Comma ma camera est grillée, je ne prends pas de photo mais j'en prends une sur internet
    + '<img src= '+ img +'>'+
    + '<p>' + document.getElementById('titre').value + '</p>' + 
    '</ion-card-title> </ion-card-header> <ion-card-content> '
    + document.getElementById('description').value +
    '</ion-card-content></ion-card>'

    document.getElementById('card-container').innerHTML = document.getElementById('card-container').innerHTML + res;

    setObject(document.getElementById('titre').value, document.getElementById('description').value, img)

    modalePersist.dismiss()
}
getCards()