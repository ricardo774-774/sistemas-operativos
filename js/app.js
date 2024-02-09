// **************** Selectors ****************

// Moment
let clock = document.getElementById('moment');  

// Processes 
let queuedProcessDiv = document.getElementById('processes'); 
let totalProcessesSpan = queuedProcessDiv.getElementsByClassName('total-processes')[0];
let remainingProcessesSapn = queuedProcessDiv.getElementsByClassName('remaining-processes')[0];

// Lotes
let queuedLotesDiv = document.getElementById('lotes'); 
let totalLotesSpan = queuedLotesDiv.getElementsByClassName('total-processes')[0];
let remainingLotesSpan = queuedLotesDiv.getElementsByClassName('remaining-processes')[0];

// Form cantidad
let quantityForm = document.getElementById('quantity');   
let quantityFormButton = document.getElementById('button-quantity');

// Form datos
let dataForm = document.getElementById('data');
let dataFormButton = document.getElementById('button-data');
let loteSpan = document.getElementById('lote');

// Spans de Resolución 
let idSpan = document.getElementById('id-span');
let nameSpan = document.getElementById('name-span');
let num1Span = document.getElementById('num1-span');
let num2Span = document.getElementById('num2-span');
let oprSpan = document.getElementById('opr-span');
let resSpan = document.getElementById('res-span');
let timSpan = document.getElementById('tim-span');
let currentProcessSpan = document.getElementById('process');

let loteNumber = 0;     // Movernos entre los lotes
let proccesNumber = 0;  // Movernos entre los procesos
let totalNumberLotes;   // Numero total de lotes
let totalProcesses;     // Total de procesos
let totalLotes = [];    // Contenedor de lotes
let lote = [];          // Lote
let restantes;          // Procesos que no llenaron un lote
let currentProcess = 0;

// **************** Events ****************

// Actualizar cada segundo
document.addEventListener('DOMContentLoaded', function () {
    setInterval(updateCounter, 1000);  // Actualizar cada segundo
});

// Submit form Cantidad
quantityForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Consigue total de procesos
    totalProcesses = e.target.quantity.value;

    // Show process 
    showTotalProcess(totalProcesses);

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
    totalLotesSpan.textContent  = totalNumberLotes;

    // Mostramos lote 1 en datos
    loteSpan.textContent = loteNumber + 1;

    // Mostramos lotes restantes
    remainingLotesSpan.textContent = totalNumberLotes;

    // Mostramos procesos restantes
    remainingProcessesSapn.textContent = totalProcesses;
});


// Submit form Datos
dataForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Read data
    readFormData(e);

    // Clean form
    dataForm.reset();
});


// **************** Funtions ****************

const readFormData = (data) => {

    // Validar id unico por lote
    if ( lote.length ) {
        lote.forEach((element) => {
            if (data.target.identificator.value === element.identificator) {
                const error = document.createElement('P');
                error.textContent = `Id ${element.identificator} ya fue utilizado`;
                error.classList.add('error-validation');
                loteSpan.appendChild(error);
                setTimeout(() => {
                    error.remove();
                }, 3000 );
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

    if (totalProcesses === 0 ) {
        // Bloqueamos boton para enviar datos;
        dataFormButton.setAttribute("disabled", "true");

        // Empezamos a ejecutar procesos;
        resolveProcess();
    }
}

const resolveProcess = async () => {
    if(totalLotes.length){
        
        for (const lote of totalLotes) {
            
            for (let i = 0; i < lote.length; i++) {
                console.log(lote.length - 1);
                let result;
        
                // Procesos restantes
                remainingProcessesSapn.textContent = Number(remainingProcessesSapn.textContent) - 1 ;
        
                // Proceso actual
                currentProcess = currentProcess + 1
                currentProcessSpan.textContent = currentProcess;
        
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
                        result =  Math.pow(Number(lote[i].number1), Number(lote[i].number2));
                        break;
                }
        
                await new Promise(resolve => {
                    setTimeout(() => {
                        idSpan.textContent = lote[i].identificator;
                        nameSpan.textContent = lote[i].name;
                        num1Span.textContent = lote[i].number1;
                        num2Span.textContent = lote[i].number2;
                        oprSpan.textContent = lote[i].operation;
                        timSpan.textContent = lote[i].seconds;
                        resSpan.textContent = result;

                        resolve();
                    }, Number(lote[i].seconds) * 1000);
                });

                if (i === 3) {
                    remainingLotesSpan.textContent = Number(remainingLotesSpan.textContent) - 1;
                }

                if (Number(remainingProcessesSapn.textContent) - 1 == 0 ) {
                    remainingLotesSpan.textContent = 0;
                }
            }
        }

    } else {
        // Solo generó un lote
        executeOperations();
    }
}

async function executeOperations() {
    for (let i = 0; i < lote.length; i++) {
        let result;

        // Procesos restantes
        remainingProcessesSapn.textContent = lote.length - i;

        // Proceso actual
        currentProcessSpan.textContent = i + 1;

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
                result =  Math.pow(Number(lote[i].number1), Number(lote[i].number2));
                break;
        }

        await new Promise(resolve => {
            setTimeout(() => {
                idSpan.textContent = lote[i].identificator;
                nameSpan.textContent = lote[i].name;
                num1Span.textContent = lote[i].number1;
                num2Span.textContent = lote[i].number2;
                oprSpan.textContent = lote[i].operation;
                timSpan.textContent = lote[i].seconds;
                resSpan.textContent = result;
                resolve();
            }, Number(lote[i].seconds) * 1000);
        });
    }
    
    // Procesos en 0
    remainingProcessesSapn.textContent = 0;
    // Lotes en 0
    remainingLotesSpan.textContent = 0;
}

// Actualizar Contador Tiempo
const updateCounter = () => {
    var hour = moment().format('LTS');
    clock.textContent = hour;
}


// Muetra total de procesos
const showTotalProcess = (total) => {
    totalProcessesSpan.textContent = total;
}