import "../sass/app.scss";
import jQuery from "jquery";
import Clipboard from 'clipboard';
const cheerio = require('cheerio');

document.addEventListener("DOMContentLoaded", function () {

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

        const copybtn = document.getElementById('copiar');
        const clipbrd = new Clipboard(copybtn, {
            text: function (trigger) {
                return data;
            }
        });

        const preview = document.getElementById('preview');
        preview.contentWindow.document.write(data);

        jQuery(document.getElementById('out')).slideDown('slow');
    }

    replace(mime, data) {
        if (mime !== "text/html") {
            this.alerta("Tipo de archivo no coincide");
        }

        const $ = cheerio.load(data);

        $('img').each((index, element) => {
            element.attribs.src = "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20viewBox%3D%270%200%2010%2010%27%20style%3D%27background-color%3A%20%23555%3B%27%2F%3E";
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