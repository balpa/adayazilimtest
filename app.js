/*@author: Berke Altıparmak
 You may use, distribute and modify this code under the
 terms of the Beerware license, which unfortunately won't be
 written for another century.
 ----------------------------------------------------------------------------
 "THE BEER-WARE LICENSE" (Revision 42):
 <berkealtiparmak@outlook.com> wrote this file.  As long as you retain this notice you
 can do whatever you want with this stuff. If we meet some day, and you think
 this stuff is worth it, you can buy me a beer in return.   Berke Altıparmak
 ----------------------------------------------------------------------------
*/


var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var PORT = 8080

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.get('/', (req, res) => {
    res.send('Nelloğ')
})

app.post('/reservation', (req, res) => {
    var resData = req.body
    var kisiSayisi = resData.RezervasyonYapilacakKisiSayisi
    var isFarkliVagon = resData.KisilerFarkliVagonlaraYerlestirilebilir
    var vagonlar = resData.Tren.Vagonlar
    var tempKisiSayisi = kisiSayisi
    var total = 0
    var cevap = {"RezervasyonYapilabilir":false,"YerlesimAyrinti":[]}

    if(isFarkliVagon == false){
        for(let i = 0; i<vagonlar.length; i++){
            if (vagonlar[i].DoluKoltukAdet + kisiSayisi > vagonlar[i].Kapasite*0.7){
                console.log(`${vagonlar[i].Ad} vagonu dolu`)}
            else{
                cevap.RezervasyonYapilabilir = true
                cevap.YerlesimAyrinti.push({VagonAdi: vagonlar[i].Ad, KisiSayisi: kisiSayisi})
                break}}
    }
    else{
        for (let i = 0; i<vagonlar.length; i++){
            var maxPeopleForEachVagon = vagonlar[i].Kapasite*0.7 - vagonlar[i].DoluKoltukAdet
            maxPeopleForEachVagon > 0 ? total += maxPeopleForEachVagon : total += 0
            if (maxPeopleForEachVagon > 0 && tempKisiSayisi < maxPeopleForEachVagon){
                cevap.RezervasyonYapilabilir = true
                cevap.YerlesimAyrinti.push({VagonAdi: vagonlar[i].Ad, KisiSayisi: Math.round(tempKisiSayisi)})
                break}

            else if (maxPeopleForEachVagon > 0 && tempKisiSayisi > maxPeopleForEachVagon){
                cevap.RezervasyonYapilabilir = true
                cevap.YerlesimAyrinti.push({VagonAdi: vagonlar[i].Ad, KisiSayisi: Math.round(maxPeopleForEachVagon)})
                tempKisiSayisi -= maxPeopleForEachVagon}            
        }
        if (kisiSayisi > total){
            cevap.RezervasyonYapilabilir = false
            cevap.YerlesimAyrinti = []
        }} 
    res.send(cevap)
})
app.listen(PORT, () => {
    console.log('Example app listening on port 8080!')
})
