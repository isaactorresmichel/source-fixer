import "../sass/app.scss";
import jQuery from "jquery";
const cheerio = require('cheerio');

document.addEventListener("DOMContentLoaded", function() {

    const document_handler = new Handler();

});


class Handler {
    constructor() {
        this.form = document.getElementById('procesar');
        this.form.addEventListener('submit', this.process.bind(this));
    }

    process(e) {
        e.preventDefault();
        this.resetAlerta();

        const field = e.target.elements['archivo'];
        /**
         * Lista de archivos en formulario.
         * @type {FileList}
         */
        const files = field.files;

        if (!files.length) {
            this.alerta("No se ha seleccionado ningún archivo.");
        }

        const file_reader = new FileReader();
        file_reader.readAsDataURL(files.item(0));

        file_reader.onloadend = () => {
            const data = file_reader.result.split(',');
            const mime = data[0].match(/:(.*?);/)[1];
            const result = this.replace(mime, atob(data[1]));

            this.log(result);
        }
    }

    log(data) {
        const resultado = document.getElementById('resultado');
        resultado.innerHTML = data.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

        jQuery(resultado).slideDown('slow');
    }

    replace(mime, data) {
        if (mime !== "text/html") {
            this.alerta("Tipo de archivo no coincide");
        }

        const $ = cheerio.load(data);

        $('img').each((index, element) => {
            element.attribs.scr = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg' viewBox%3D'0 0 200 150'%2F%3E";
        })

        return $.html();
    }

    resetAlerta() {
        const alertas = document.getElementById('alertas');
        jQuery(alertas).slideUp('slow');
    }

    alerta(mensaje) {
        const alertas = document.getElementById('alertas');
        jQuery(alertas).slideDown('slow');
        alertas.innerHTML = mensaje;
    }
}