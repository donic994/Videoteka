var ukupno = 0;
var naziv = "";
var cijena = "";
var valuta = "";
var popust = 0;
var filmovi = new Array();
var greske = document.getElementById("greske");
var predefinirani = false;

class film {
    constructor(id, naziv, cijena) {
        this.id = id;
        this.naziv = naziv;
        this.cijena = cijena;
    }
}

function dodajFilm() {
    naziv = document.getElementById("naziv").value;
    cijena = parseFloat(document.getElementById("cijena").value);
    valuta = document.getElementById("valuta").value;
    document.getElementById("greske").innerHTML = '';
    if (tocanUnos(naziv, cijena) === true) {
        dodajRedak();
    }
}

function tocanUnos(naziv, cijena) {
    odgovor = true;
    if (naziv === "" && predefinirani === false) {
        greske.innerHTML = 'Unesite ime filma';
        odgovor = false;
    }
    if (isNaN(cijena) && predefinirani === false) {
        greske.innerHTML = 'Unesite cijenu filma';
        odgovor = false;
    }
    return odgovor;
}

function dodajRedak() {
    var tablica = document.getElementById("tablica");
    var nRedak = tablica.getElementsByTagName('tr');
    var brojRedaka = nRedak.length;
    var noviFilm = null;

    if (predefinirani === false) {
        noviFilm = new film(brojRedaka, naziv, cijena);
    } else {
        noviFilm = dajDefaultFilm();
        noviFilm.id = brojRedaka;
    }

    if (filmPostoji(noviFilm) === true) {
        greske.innerHTML = 'Film s tim nazivom je već dodan (' + noviFilm.naziv + ')';
    } else {
        var redak = tablica.insertRow(brojRedaka);
        var celijaId = redak.insertCell(0);
        var celijaNaziv = redak.insertCell(1);
        var celijaCijena = redak.insertCell(2);
        var celijaBrisi = redak.insertCell(3);
        filmovi.push(noviFilm);
        celijaId.innerHTML = noviFilm.id;
        celijaNaziv.innerHTML = noviFilm.naziv;
        celijaCijena.innerHTML = parseFloat(noviFilm.cijena);

        var btn = document.createElement("input");
        btn.type = "button";
        btn.value = "Briši";
        btn.setAttribute("id", "brisi");
        celijaBrisi.appendChild(btn);

        btn.addEventListener("click", function () {
            brisiFilm(redak.rowIndex);
        });

        azurirajNarudzbu(brojRedaka, noviFilm.cijena, 1);
    }
}

function azurirajNarudzbu(brojRedaka, cijena, tip) {
    if (tip == 1) {
        ukupno += cijena;
    }
    if (tip == 2) {
        ukupno -= cijena;
    }
    if (brojRedaka > 2) {
        popust = 0.05;
    }
    if (brojRedaka <= 2) {
        popust = 0;
    }

    zaPlatiti = ukupno - (ukupno * popust);
    pretvoriValute();
    predefinirani = false;
}

function dajDefaultFilm() {
    defaultFilmovi = [{id: 1, naziv: 'Kum', cijena: 17.5},
        {id: 2, naziv: 'Iskupljenje u Shawshanku ', cijena: 14.2},
        {id: 3, naziv: 'Schindlerova lista', cijena: 19.2},
        {id: 4, naziv: 'Razjareni bik', cijena: 12.9},
        {id: 5, naziv: 'Casablanca', cijena: 10.2},
        {id: 6, naziv: 'Građanin Kane', cijena: 11.9},
        {id: 7, naziv: 'Zameo ih vjetar', cijena: 23.8},
        {id: 8, naziv: 'Čarobnjak iz Oza', cijena: 10.2},
        {id: 9, naziv: 'Let iznad kukavijčjeg gnijezda', cijena: 13.3},
        {id: 10, naziv: 'Lawrance od Arabije', cijena: 22.8},
        {id: 11, naziv: 'Vrtoglavica', cijena: 12.8}];
    return defaultFilmovi[Math.floor(Math.random() * 11)];
}

function dodajPredefiniraniFilm() {
    predefinirani = true;
    dodajFilm();
}

function filmPostoji(noviFilm) {
    odgovor = false;
    for (var i = 0; i < filmovi.length; i++) {
        if (noviFilm.naziv == filmovi[i].naziv) {
            odgovor = true;
            break;
        }
        if (odgovor === true)
            break;
    }
    return odgovor;
}

function brisiFilm(i) {
    var tablica = document.getElementById("tablica");
    var nRedak = tablica.getElementsByTagName('tr');

    var nCijena = parseInt(tablica.rows[i].cells[2].innerHTML);

    tablica.deleteRow(i);
    filmovi.splice(i, 1);
    var brojRedaka = nRedak.length - 1;
    azurirajNarudzbu(brojRedaka, nCijena, 2);

    for (var i = 1; i < document.getElementById("tablica").rows.length; i++) {
        document.getElementById("tablica").rows[i].cells[0].innerHTML = i;
    }
}

function pretvoriValute() {
    valuta = document.getElementById("valuta").value;
    tecaj = 0.13;

    if (valuta === 'EUR') {
        document.getElementById("ukupno").innerHTML = (ukupno * tecaj).toFixed(2).toString() + " " + valuta;
        document.getElementById("popust").innerHTML = "- " + (ukupno * popust * tecaj).toFixed(2).toString() + " " + valuta;
        document.getElementById("zaPlatiti").innerHTML = (zaPlatiti * tecaj).toFixed(2).toString() + " " + valuta;
    }
    if (valuta === 'HRK') {
        document.getElementById("ukupno").innerHTML = ukupno.toFixed(2).toString() + " " + valuta;
        document.getElementById("popust").innerHTML = "- " + (ukupno * popust).toFixed(2).toString() + " " + valuta;
        document.getElementById("zaPlatiti").innerHTML = zaPlatiti.toFixed(2).toString() + " " + valuta;
    }
}