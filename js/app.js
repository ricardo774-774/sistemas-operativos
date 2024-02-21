// **************** Selectors ****************+

// Obtener el elemento del contador
var contadorElemento = document.getElementById('contador');

// Obtener los elementos p por su clase
const nameSpan = document.querySelector('.process-execution.name span');
const n1Span = document.querySelector('.process-execution.n1 span');
const n2Span = document.querySelector('.process-execution.n2 span');
const optSpan = document.querySelector('.process-execution.opt span');
const tmSpan = document.querySelector('.process-execution.tm span');
const ttSpan = document.querySelector('.process-execution.tt span');

// Processes 
let queuedProcessDiv = document.getElementById('processes');
let totalProcessesSpan = queuedProcessDiv.getElementsByClassName('total')[0];
let remainingProcessesSapn = queuedProcessDiv.getElementsByClassName('remaining')[0];
let currentProcessesSpan = queuedProcessDiv.getElementsByClassName('ejecution')[0];

// Lotes
let queuedLotesDiv = document.getElementById('lotes');
let totalLotesSpan = queuedLotesDiv.getElementsByClassName('total')[0];
let remainingLotesSpan = queuedLotesDiv.getElementsByClassName('remaining')[0];
let currentLoteSpan = queuedLotesDiv.getElementsByClassName('ejecution')[0];

// Form cantidad
let quantityForm = document.getElementById('quantity');
let quantityFormButton = document.getElementById('button-quantity');

// Form datos
let dataForm = document.getElementById('data');
let dataFormButton = document.getElementById('button-data');
let loteSpan = document.getElementById('lote');

// Spans de Resolución 
let currentProcessSpan = document.getElementById('process');
let divResolucion = document.getElementById('resolucion');

// Spans de Lote en ejecucion
const contenedor = document.getElementById('contenido-1');
const spans = contenedor.querySelectorAll('span');
const primerSpanProceso1 = spans[0];
const segundoSpanProceso1 = spans[1];
const tercerSpanProceso1 = spans[2];
const primerSpanProceso2 = spans[3];
const segundoSpanProceso2 = spans[4];
const tercerSpanProceso2 = spans[5];
const primerSpanProceso3 = spans[6];
const segundoSpanProceso3 = spans[7];
const tercerSpanProceso3 = spans[8];
const primerSpanProceso4 = spans[9];
const segundoSpanProceso4 = spans[10];
const tercerSpanProceso4 = spans[11];

let loteNumber = 0;     // Movernos entre los lotes
let proccesNumber = 0;  // Movernos entre los procesos
let totalNumberLotes;   // Numero total de lotes
let totalProcesses;     // Total de procesos
let totalProcessesHelper;     // Total de procesos
let totalLotes = [];    // Contenedor de lotes
let lote = [];          // Lote
let restantes;          // Procesos que no llenaron un lote
let currentProcess = 0;
let currentLote = 0;

// Inicializar contadores contador
let generalCounter = 0;
let processCounter = 0;

// **************** Events ****************

// Actualizar cada segundo
document.addEventListener('DOMContentLoaded', function () {
    setInterval(incrementarContador, 1000);
});

// Submit form Cantidad
quantityForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Consigue total de procesos
    totalProcesses = e.target.quantity.value;
    totalProcessesHelper = totalProcesses;

    // Show process 
    totalProcessesSpan.textContent = totalProcesses;

    // Block submiter
    quantityFormButton.setAttribute("disabled", "true");

    // Inicia lote 1
    dataFormButton.removeAttribute("disabled");

    // Consigue cantidad de lotes
    if (totalProcesses % 4 === 0) {
        totalNumberLotes = totalProcesses / 4;
    } else {
        restantes = totalProcesses % 4;
        totalNumberLotes = Math.ceil(totalProcesses / 4);
    }

    // Mostramos lotes totales
    totalLotesSpan.textContent = totalNumberLotes;

    // Mostramos lote 1 en datos
    loteSpan.textContent = loteNumber + 1;

    // Mostramos lotes restantes
    remainingLotesSpan.textContent = totalNumberLotes;

    // Mostramos procesos restantes
    remainingProcessesSapn.textContent = totalProcesses;

    // Mostramos lote actual
    currentLoteSpan.textContent = 1;
});

// Submit form Datos
dataForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Read data
    readFormData(e);

    // Clean form
    dataForm.reset();
});


// **************** Funtions ****************

// Guardamos los datos el lotes y contenedor de lotes 
const readFormData = (data) => {

    validatorId(data);

    // Mostramos datos 

    // Aisgnamos datos del proceso al lote x
    lote[proccesNumber] = {
        name: data.target.name.value,
        number1: data.target.number1.value,
        operation: data.target.operation.value,
        number2: data.target.number2.value,
        seconds: data.target.seconds.value,
        identificator: data.target.identificator.value,
    }
    // Nos movemos dentro del lote x
    proccesNumber = proccesNumber + 1;

    // Quitamos un proceso
    totalProcesses = totalProcesses - 1;

    // Aisgnamos datos del proceso al lote 
    if (proccesNumber > 3) {
        // Reiciamos proceso para volver a movernos dentro de otro lote
        proccesNumber = 0;
        // Añadimos lote al contenedor de lotes
        totalLotes[loteNumber] = lote;
        // Nos movemos al siguiente lote
        loteNumber = loteNumber + 1;
        // Cambiamos numero de lote
        loteSpan.textContent = loteNumber + 1;
        // Creamos un nuevo lote
        lote = [];
    }

    // Si no hay más procesos y todavía hay un lote pendiente, añádelo a totalLotes
    if (totalProcesses === 0 && proccesNumber > 0) {
        totalLotes[loteNumber] = lote;
    }

    if (totalProcesses === 0) {
        // Bloqueamos boton para enviar datos;
        dataFormButton.setAttribute("disabled", "true");

        // document.getElementById('title-1').style.display = 'block';
        // document.getElementById('contenido-1').style.display = 'block';
        document.getElementById('title-2').style.display = 'block';
        document.getElementById('contenido-2').style.display = 'block';

        // Empezamos a ejecutar procesos;
        resolveProcess();

        // Mostramos lotes en ejecucion
        lotesInExecution(totalLotes[0]);
    }

}

// Valida el id
const validatorId = (data) => {
    // Validar id unico por lote
    if (lote.length) {
        lote.forEach((element) => {
            if (data.target.identificator.value === element.identificator) {
                const error = document.createElement('P');
                error.textContent = `Id ${element.identificator} ya fue utilizado`;
                error.classList.add('error-validation');
                loteSpan.appendChild(error);
                setTimeout(() => {
                    error.remove();
                }, 3000);
                throw new Error('Id repetido');
            }
        })
    }

    // Validar id unico por contenedor de lotes
    if (totalLotes.length) {
        totalLotes.forEach((loteElement) => {
            loteElement.forEach((procesoElement) => {
                if (data.target.identificator.value === procesoElement.identificator) {
                    const error = document.createElement('p');
                    error.textContent = `El ID ${procesoElement.identificator} ya fue utilizado en otro lote`;
                    error.classList.add('error-validation');
                    loteSpan.appendChild(error);
                    setTimeout(() => {
                        error.remove();
                    }, 3000);
                    throw new Error('ID repetido en totalLotes');
                }
            });
        });
    }
}

// Mostramos resultados
const resolveProcess = async () => {
    for (const lote of totalLotes) {

        for (let i = 0; i < lote.length; i++) {
            let result;
            // Proceso actual
            currentProcess = currentProcess + 1

            // Proceso actual 
            currentProcessesSpan.textContent = currentProcess;

            // Mostramos proceso actual
            updateCurrentInExecution(lote[i].name, lote[i].number1, lote[i].number2, lote[i].operation, lote[i].seconds);

            switch (lote[i].operation) {
                case 'suma':
                    result = Number(lote[i].number1) + Number(lote[i].number2);
                    break;

                case 'resta':
                    result = Number(lote[i].number1) - Number(lote[i].number2);
                    break;

                case 'multiplicacion':
                    result = Number(lote[i].number1) * Number(lote[i].number2);
                    break;

                case 'divicion':
                    result = Number(lote[i].number1) / Number(lote[i].number2);
                    break;

                case 'residuo':
                    result = Number(lote[i].number1) % Number(lote[i].number2);
                    break;

                case 'potencia':
                    result = Math.pow(Number(lote[i].number1), Number(lote[i].number2));
                    break;
            }

            await new Promise(resolve => {
                setTimeout(() => {
                    // Lote
                    const newLoteH4 = document.createElement('h4');
                    newLoteH4.classList.add('col-sm-12', 'col-lg-12');
                    newLoteH4.textContent = `Lote ${currentLote + 1}`;

                    // Proceso
                    const newProcessH4 = document.createElement('h4');
                    newProcessH4.classList.add('col-sm-12', 'col-lg-12');
                    newProcessH4.textContent = 'Proceso ' + currentProcess;

                    // Id
                    const newDivId = document.createElement('div');
                    newDivId.classList.add('col-sm-12', 'col-lg-12');
                    newDivId.textContent = "Id: " + lote[i].identificator;

                    // Name
                    const newDivName = document.createElement('div');
                    newDivName.classList.add('col-sm-12', 'col-lg-12');
                    newDivName.textContent = "Name: " + lote[i].name;

                    // Num1
                    const newDivNum1 = document.createElement('div');
                    newDivNum1.classList.add('col-sm-12', 'col-lg-12');
                    newDivNum1.textContent = "Numero 1: " + lote[i].number1;

                    // Num2
                    const newDivNum2 = document.createElement('div');
                    newDivNum2.classList.add('col-sm-12', 'col-lg-12');
                    newDivNum2.textContent = "Numero 2: " + lote[i].number2;

                    // Operation
                    const newOperation = document.createElement('div');
                    newOperation.classList.add('col-sm-12', 'col-lg-12');
                    newOperation.textContent = "Operacion: " + lote[i].operation;

                    // Seconds
                    const newSeconds = document.createElement('div');
                    newSeconds.classList.add('col-sm-12', 'col-lg-12');
                    newSeconds.textContent = "Tiempo de espera: " + lote[i].seconds;

                    // Result 
                    const newResult = document.createElement('div');
                    newResult.classList.add('col-sm-12', 'col-lg-12');
                    newResult.textContent = "Resultado: " + result;

                    // Container
                    const newProcessDiv = document.createElement('div');
                    newProcessDiv.classList.add('form-group', 'row', 'resultados');
                    newProcessDiv.appendChild(newLoteH4);
                    newProcessDiv.appendChild(newProcessH4);
                    newProcessDiv.appendChild(newDivId);
                    newProcessDiv.appendChild(newDivNum1);
                    newProcessDiv.appendChild(newDivNum2);
                    newProcessDiv.appendChild(newOperation);
                    newProcessDiv.appendChild(newSeconds);
                    newProcessDiv.appendChild(newResult);

                    // Divisor visual
                    const hr = document.createElement('hr');

                    divResolucion.insertAdjacentElement('afterend', newProcessDiv);
                    divResolucion.insertAdjacentElement('afterend', hr);

                    processCounter = 0;
                    resolve();
                }, Number(lote[i].seconds) * 1000);
            });

            // Procesos restantes - 1
            remainingProcessesSapn.textContent = Number(remainingProcessesSapn.textContent) - 1;

            // Cambiamos de Procesos Actual

            // Nuevo lote?
            if (i === 3) {
                // Restamos del contador de lotes
                remainingLotesSpan.textContent = Number(remainingLotesSpan.textContent) - 1;

                // Añadimos sumamos un lote al lote actual
                currentLote = currentLote + 1;

                // Mostramos lote actual +1
                currentLoteSpan.textContent = currentLote + 1;

                // Cambiamos datos de los lotes en execution
                lotesInExecution(totalLotes[currentLote]);
            }

            if (Number(remainingProcessesSapn.textContent) == 0) {
                remainingLotesSpan.textContent = 0;
                clearInterval(intervalId);
            }
        }
    }

}

const updateCurrentInExecution = (
    nameSpan_,
    n1Span_,
    n2Span_,
    optSpan_,
    tmSpan_,
) => {
    clearInterval(intervalId);

    nameSpan.textContent = nameSpan_;
    n1Span.textContent = n1Span_;
    n2Span.textContent = n2Span_;
    optSpan.textContent = optSpan_;
    tmSpan.textContent = tmSpan_;

    // Comenzar el nuevo intervalo
    intervalId = setInterval(incrementarContadorP, 1000);
}

const incrementarContador = () => {
    generalCounter = generalCounter + 1;
    contadorElemento.textContent = generalCounter;
}

let intervalId; // Variable para almacenar el ID del intervalo

const incrementarContadorP = () => {
    processCounter = processCounter + 1;
    ttSpan.textContent = processCounter;
}

const lotesInExecution = (lote) => {
    if (typeof(lote) === 'undefined') {
        return;
    }
        primerSpanProceso1.textContent = lote[0]?.identificator || '';
        segundoSpanProceso1.textContent = lote[0]?.seconds || '';
        tercerSpanProceso1.textContent = lote[0]?.operation || '';

        primerSpanProceso2.textContent = lote[1]?.identificator || '';
        segundoSpanProceso2.textContent = lote[1]?.seconds;
        tercerSpanProceso2.textContent = lote[1]?.operation;

        primerSpanProceso3.textContent = lote[2]?.identificator || '';
        segundoSpanProceso3.textContent = lote[2]?.seconds || '';
        tercerSpanProceso3.textContent = lote[2]?.operation || '';

        primerSpanProceso4.textContent = lote[3]?.identificator || '';
        segundoSpanProceso4.textContent = lote[3]?.seconds || '';
        tercerSpanProceso4.textContent = lote[3]?.operation || '';
}