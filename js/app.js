// Campos del formulario
const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');


// UI
const formulario = document.querySelector('#nueva-cita');
const contenedorCitas = document.querySelector('#citas');

let editando;

// Clases

class Citas {
    constructor() {
        this.citas = [];
    }

    agregarCita(cita) {
        this.citas = [...this.citas, cita];

        console.log(this.citas);
    }

    eliminarCita(id) {
        this.citas = this.citas.filter(cita => cita.id !== id);
    }

    editarCita(citaActualizada) {
        this.citas = this.citas.map(cita => cita.id === citaActualizada.id ? citaActualizada : cita);
    }
};

class UI {

    imprimirAlerta(mensaje, tipo) {

        // Crea el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');

        // Agregar clase en caso de ser tipo error

        if (tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }

        // Mensaje de error

        divMensaje.textContent = mensaje;

        // Agregar al DOM

        document.querySelector('#contenido').insertBefore(divMensaje, document.querySelector('.agregar-cita'));

        // Quitar alerta despues de 3s

        setTimeout(() => {
            divMensaje.remove();
        }, 3000)
    }

    imprimirCitas({ citas }) {

        this.limpiarHTML();

        citas.forEach(cita => {
            const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

            const divCita = document.createElement('div');
            divCita.classList.add('cita', 'p-3');
            divCita.dataset.id = id;


            // Scripting de los elementos de la cita
            const mascotaParrafo = document.createElement('h2');
            mascotaParrafo.classList.add('card-title', 'font-weight-bolder');
            mascotaParrafo.textContent = mascota;

            const propietarioParrafo = document.createElement('p');
            propietarioParrafo.innerHTML = `
            <span class="font-weight-bolder">Propietario: </span> ${propietario} 
            `;

            const telefonoParrafo = document.createElement('p');
            telefonoParrafo.innerHTML = `
            <span class="font-weight-bolder">Telefono: </span> ${telefono} 
            `;

            const fechaParrafo = document.createElement('p');
            fechaParrafo.innerHTML = `
            <span class="font-weight-bolder">Fecha: </span> ${fecha} 
            `;

            const horaParrafo = document.createElement('p');
            horaParrafo.innerHTML = `
            <span class="font-weight-bolder">Hora: </span> ${hora} 
            `;

            const sintomasParrafo = document.createElement('p');
            sintomasParrafo.innerHTML = `
            <span class="font-weight-bolder">Sintomas: </span> ${sintomas} 
            `;

            // Boton eliminar cita
            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
            btnEliminar.innerHTML = 'Eliminar';
            btnEliminar.onclick = () => eliminarCita(id);

            // Boton para editir cita

            const btnEditar = document.createElement('button');
            btnEditar.classList.add('btn', 'btn-info');
            btnEditar.innerHTML = 'Editar';
            btnEditar.onclick = () => cargarEdicion(cita);


            // Agregar los parrafos al divCita
            divCita.appendChild(mascotaParrafo);
            divCita.appendChild(propietarioParrafo);
            divCita.appendChild(telefonoParrafo);
            divCita.appendChild(fechaParrafo);
            divCita.appendChild(horaParrafo);
            divCita.appendChild(sintomasParrafo);
            divCita.appendChild(btnEliminar);
            divCita.appendChild(btnEditar);

            // Agregar las citas al HTML
            contenedorCitas.appendChild(divCita);
        })
    }

    limpiarHTML() {
        while (contenedorCitas.firstChild) {
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }
    }
};


const ui = new UI();
const administrarCitas = new Citas();


// Eventos
eventListeners();
function eventListeners() {

    mascotaInput.addEventListener('input', datosCita);
    propietarioInput.addEventListener('input', datosCita);
    telefonoInput.addEventListener('input', datosCita);
    fechaInput.addEventListener('input', datosCita);
    horaInput.addEventListener('input', datosCita);
    sintomasInput.addEventListener('input', datosCita);

    formulario.addEventListener('submit', nuevaCita);

};


// Objeto con la info de la cita
const citaObj = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: ''
};


// Agrega datos al objeto de cita
function datosCita(e) {

    citaObj[e.target.name] = e.target.value;

};

// Valida y agrega una nueva cita a la clase de citas

function nuevaCita(e) {
    e.preventDefault();

    // Extraer informacion del obj de cita

    const { mascota, propietario, telefono, fecha, hora, sintomas } = citaObj;

    // Validar

    if (mascota === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === '') {

        ui.imprimirAlerta('Todos los campos son obligatorios', 'error');

        return;
    }

    if (editando) {
        ui.imprimirAlerta('Editado correctamente');

        // Pasar el obj de la cita a edicion

        administrarCitas.editarCita({ ...citaObj });

        // Regresar el boton al estado original
        formulario.querySelector('button[type="submit"]').textContent = 'Crear cita';

        // Quintando edicion
        editando = false;

    } else {
        // Generar un ID unico para cada registro / cita
        citaObj.id = Date.now();

        // Creando una nueva cita
        administrarCitas.agregarCita({ ...citaObj });

        // Imprimir mensaje agregado

        ui.imprimirAlerta('Se agrego correctamente');
    }


    // Reinicia el formulario
    formulario.reset();

    // Reinicia el objeto
    reiniciarObj();

    // Mostrar el HTML

    ui.imprimirCitas(administrarCitas);

}

function reiniciarObj() {
    citaObj.mascota = '',
        citaObj.propietario = '',
        citaObj.telefono = '',
        citaObj.fecha = '',
        citaObj.hora = '',
        citaObj.sintomas = ''
}

function eliminarCita(id) {
    // Eliminar la cita
    administrarCitas.eliminarCita(id);

    // Mostrar un mensaje
    ui.imprimirAlerta('La cita se elimino correctamente');

    // Refrescas las citas
    ui.imprimirCitas(administrarCitas);
}

// Carga los datos y pone el "modo edicion"
function cargarEdicion(cita) {
    const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

    // Llenar los inputs

    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    // Llenar objeto

    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;

    // Cambiar el texto del boton

    formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';

    editando = true;
};