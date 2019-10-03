async function httpGet(){
    var url = 'https://devfest-nantes-2018-api.cleverapps.io/blog'
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}


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

    console.log(html)
    document.getElementById('card-container').innerHTML = html;


}

getCards()