

// Constructores
function Seguro(marca, year, tipo) {
    this.marca = marca;
    this.year = year;
    this.tipo = tipo;
}

// Realiza la cotización con los datos
Seguro.prototype.cotizarSeguro = function () {
    /*
        1 = Americano   1.15
        2 = Asiático    1.05
        3 = Europeo     1.35
    */

    console.log(this.marca); // da un numero 1, 2 o 3

    let cantidad;
    const base = 2000;
    let aux = parseInt(this.marca);
    
    switch (aux) {
        case 1:
            cantidad = base * 1.15;
            break;

        case 2:
            cantidad = base * 1.05;
            break;

        case 3:
            cantidad = base * 1.35;
            break;
    
        default:
            cantidad = base * 1;
            break;
    }

    // Leer el año, la diferencia de años que hay con la fecha actual
    const diferencia = new Date().getFullYear() - this.year;
    
    // Cada año encontra va a ir disminuyendo el precio
    // 3% por cada año alejado de la fecha actual
    cantidad -= ((diferencia * 3) * cantidad) / 100;


    /*
        si el seguro en "basico" se multiplica por 30% más
        si el seguro en "completo" se multiplica por 50% más
    */

    if (this.tipo === 'basico') {
        cantidad *= 1.30;
    } else {
        cantidad *= 1.50;
    }

    return cantidad;
}

function UI() {}

// llena las opciones de los años
UI.prototype.llenarOpciones = () => {
    const max = new Date().getFullYear();
    const min = max - 20; 
    const selectYear = document.querySelector('#year');

    for (let i = max; i > min ; i--) {
        let option = document.createElement('option');

        option.value = i;
        option.textContent = i;
        selectYear.appendChild( option );
    }
}

// Muestra alertas en pantalla
UI.prototype.mostrarMensaje = (mje, tipo) => {
    const div = document.createElement('div');

    if (tipo === 'error') {
        div.classList.add('error');
    } else {
        div.classList.add('correcto');
    }

    div.classList.add('mensaje', 'mt-10');
    div.textContent = mje;

    // Insertar en el html
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.insertBefore(div, document.querySelector('#resultado'));

    setTimeout( () => {
        div.remove();
    }, 3000);
}


UI.prototype.mostrarResultado = (total, seguro) => {

    const {marca, year, tipo} = seguro;

    // Crear el resultado
    const div = document.createElement('div');
    div.classList.add('mt-10');

    let aux = '';

    if (marca === '1') {
        aux = 'Americano';
    } else if(marca === '2') {
        aux = 'Asiatico';
    } else {
        aux = 'Europeo';
    }

    div.innerHTML = `
        <p class="header">Tu Resumen</p>
        <p class="font-bold">Marca: <span class="font-normal"> ${aux} </span> </p>
        <p class="font-bold">Año: <span class="font-normal"> ${year} </span> </p>
        <p class="font-bold">Tipo: <span class="font-normal"> ${tipo} </span> </p>
        <p class="font-bold">Total: <span class="font-normal"> ${total} </span> </p>
    `;

    const  resultadoDiv = document.querySelector('#resultado');

    // Mostrar el spinner
    const spinner = document.querySelector('#cargando');
    spinner.style.display = 'block';

    setTimeout(() => {
        spinner.style.display = 'none';
        resultadoDiv.appendChild(div);
    }, 3000);
}


// instanciar UI
const ui = new UI();


document.addEventListener('DOMContentLoaded', () => {
    ui.llenarOpciones();  // llena el select con los años
});


eventListeners();

function eventListeners() {
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.addEventListener('submit', cotizarSeguro);
}

function cotizarSeguro(e) {
    e.preventDefault();

    // Leer la marca seleccionada
    const marca = document.querySelector('#marca').value;

    // Leer el año seleccionado
    const year = document.querySelector('#year').value;

    // Leer el tipo de cobertura
    const tipo = document.querySelector('input[name="tipo"]:checked').value;

    if (marca === '' || year === '' || tipo === '') {
        ui.mostrarMensaje('Todos los campos son obligatorios', 'error');
        return;
    } else {
        ui.mostrarMensaje('Cotizando...', 'exito');

        // Ocultar las cotizaciones previas
        const  resultados = document.querySelector('#resultado div');

        if (resultados != null) {
            resultados.remove();
        }

        // Instanciar el seguro
        const seguro = new Seguro(marca, year, tipo);
        const total = seguro.cotizarSeguro();

        // Utilizar el prototype que va a cotizar
        ui.mostrarResultado(total, seguro);
    }
}