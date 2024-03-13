// **************** Variables **************** //

// Global Counter
let globalCounter = 0;

// Execution Counter
let executionCounter = 0;

// Ready counter
let readyCounter = 0;

// Watting counter
let wattingCounter = 0;

// Components of process
let id;
let stage;
let estimatedTime;
let operation;
let num1;
let num2;
let result;

let arrivalTime; // Hora en la que el proceso entra al sistema.
let completionTime; // Hora en la que el proceso termino.
let returnTime; // Tiempo total desde que el proceso llega hasta que termina.
let responseTime; // Tiempo transcurrido desde que llega hasta que es atendido por primera vez.
let waitTime; // Tiempo que el proceso ha estado esperando para usar el procesador.
let serviceTime; // EstimatedTime. (Si el proceso termino su ejecución normal es el TME)

// Types of stages
let stageI = [
    "nuevo",
    "listo",
    "ejecucion",
    "bloqueado",
    "terminado"
];

// Types of opt
let operationI = [
    "suma",
    "resta",
    "multiplicacion",
    "divicion",
    "residuo",
    "potencia",
];

// Processs
let process = {
    id,
    stage,
    estimatedTime,
    operation,
    num1,
    num2,
    result,
    arrivalTime,
    completionTime,
    returnTime,
    responseTime,
    waitTime,
    serviceTime,
};

// Total of process
let countNewProcesess = 0;

// List of process
let listNewPross = [];

// ****************  Elements **************** //


// Form
let quantityForm = document.getElementById('quantity'); 
let buttonForm = document.getElementById('button-quantity');

// Counter of new process
let newProcessSpan = document.querySelector('#title-1 span');

// Process Listos Span
let divListo = document.querySelectorAll('.listos span:nth-child(1)');

// Process Ejecución Span
let divExecution = document.querySelectorAll('.ejecucion span:nth-child(1)');

// Process Bloqueados Span
let divBloqueados = document.querySelectorAll('.bloqueados span:nth-child(1)');

// Porcess Terminados Span
let contenedor = document.getElementById("terminado");

// **************** Events **************** //




// DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
    setInterval(incrementarContador, 1000);
});


// Submit form 
quantityForm.addEventListener('submit', function (e) {
    // Prevent default
    e.preventDefault();

    // Gettin total of process
    const formData = new FormData(e.target);
    countNewProcesess = formData.get('quantity');

    // Update counter of new process
    newProcessSpan.textContent = countNewProcesess;

    // Add data to any process
    addDataToProcess(countNewProcesess); 

    // Inativate button of form
    buttonForm.disabled = true;
});


// Obtener el elemento del contador
var contadorElemento = document.getElementById('contador');





// **************** Funtions ****************





// Guardamos los datos el lotes y contenedor de lotes 
const addDataToProcess = (countNewProcesess) => {

    for (let i = 0; i < countNewProcesess; i++) {

        // Get numbers
        let {number1, number2} = getNumbers();

        // Get opt
        let operation = getOperation();

        // Get estimated time
        let estimated = getEstimatedTime();

        // Get time 
        let time = getCurrentTime();

        process = {
            id: i + 1,
            num1: number1,
            num2: number2,
            operation,
            estimatedTime: estimated,
            arrivalTime: time,
        };

        listNewPross[i] = process;

    }

    controllProcessMemory(listNewPross);
    
}


const controllProcessMemory = (listNewPross = []) => {

    showInExecution(listNewPross[0]);
    showListos(listNewPross[1]);

}


// Resolve the operation
const revolveOpt = (process) => {

    let {num1, num2, operation} = process;

    switch (operation) {
        case 'suma':
            process.result = Number(num1) + Number(num2);
            break;

        case 'resta':
            process.result = Number(num1) - Number(num2);
            break;

        case 'multiplicacion':
            process.result = Number(num1) * Number(num2);
            break;

        case 'divicion':
            process.result = Number(num1) / Number(num2);
            break;

        case 'residuo':
            process.result = Number(num1) % Number(num2);
            break;

        case 'potencia':
            process.result = Math.pow(Number(num1), Number(num2));
            break;
    }
};



// Get time of wait fot user process
const timeForUseProcess = (process) => {

    const horaEnSegundos = (hora) => {
        // Dividir la hora en horas, minutos y segundos
        let partesHora = hora.split(':');
    
        // Convertir las horas, minutos y segundos a segundos
        let horasEnSegundos = parseInt(partesHora[0]) * 3600; // 1 hora = 3600 segundos
        let minutosEnSegundos = parseInt(partesHora[1]) * 60; // 1 minuto = 60 segundos
        let segundos = parseInt(partesHora[2]);
    
        // Calcular el total de segundos
        let totalSegundos = horasEnSegundos + minutosEnSegundos + segundos;
    
        return totalSegundos;
    }

    let segundosHora1 = horaEnSegundos(process.arrivalTime);
    let segundosHora2 = horaEnSegundos(getCurrentTime());

    let diferencia = Math.abs(segundosHora1 - segundosHora2);
    
    return diferencia;
}

const showFinished = (process) => {

    let arrivalTime; // Hora en la que el proceso entra al sistema.
    let completionTime; // Hora en la que el proceso termino.
    let returnTime; // Tiempo total desde que el proceso llega hasta que termina.
    let responseTime; // Tiempo transcurrido desde que llega hasta que es atendido por primera vez.
    let waitTime; // Tiempo que el proceso ha estado esperando para usar el procesador.
    
    
        // Calculate time data of finished
        process.completionTime = getCurrentTime();
    
    
        // If not bloqued add normal service time
        if (!process.serviceTime) {
            process.serviceTime = process.estimatedTime;
        } else {
            // Add time in block
            process.serviceTime = process.estimatedTime + 10;
        }
    
    
        // Ordenate order of process
        process = {
            id: process.id,
            num1: process.num1,
            num2: process.num2,
            operation: process.operation,
            result: process.result,
            arrivalTime: process.arrivalTime,
            completionTime: process.completionTime,
            estimatedTime: process.estimatedTime,
            serviceTime: process.serviceTime,
            waitTime: process.waitTime,
        }
    
    
        for (let propiedad in process) {
            if (process.hasOwnProperty(propiedad)) {
                let parrafo = document.createElement("div");
                parrafo.classList.add('col-sm-3', 'col-lg-12', 'text-center');
                parrafo.textContent = `${propiedad}: ${process[propiedad]}`;
                contenedor.appendChild(parrafo);
            }
        }
        let saltoDeLinea = document.createElement("hr");
        saltoDeLinea.classList.add('altura-2rem');
        contenedor.appendChild(saltoDeLinea);
}


const showListos = (process) => {

    let counter;

    divListo[0].textContent = process.id;
    divListo[1].textContent = process.estimatedTime;

    counter = Number(divExecution[5].textContent);

    let interval = setInterval(() => {
        counter = counter - 1;
        divListo[2].textContent = counter;

        if (counter == 0) {
            clearInterval(interval);

            divListo[0].textContent = "";
            divListo[1].textContent = "";
            divListo[2].textContent = "";

            // Is process bloqued?
            if (condition) {
                
            }

            // Call new process in execution
            let { isReady, processReady } = getProcessReady(process.id);
            if (isReady == true) {
                showListos(processReady);
            }
        }

    }, 1000 );

}


const showInExecution = (process) => {

    executionCounter = 0;

    let executionInterval = setInterval(counterExecution, 1000);

    divExecution[0].textContent = process.id;
    divExecution[1].textContent = process.operation;
    divExecution[2].textContent = process.num1;
    divExecution[3].textContent = process.num2;
    divExecution[5].textContent = process.estimatedTime;

    revolveOpt(process);

    // Time for use process 
    process.waitTime = timeForUseProcess(process);

    setTimeout( () => {

        // Pass to finished process
        showFinished(process);

        // Reduce list of new process
        updateNewProcessCount();

        // Stop execution counter
        clearInterval(executionInterval);

        // Clean execution
        divExecution[0].textContent = '';
        divExecution[1].textContent = '';
        divExecution[2].textContent = '';
        divExecution[3].textContent = '';
        divExecution[4].textContent = '';
        divExecution[5].textContent = '';

        // Call new process in execution
        let { isReady, processReady } = getProcessReady(process.id);
        if (isReady == true) {
            showInExecution(processReady);
        }


    }, process.estimatedTime * 1000 );

}

const showBloqued = (process) => {

}

const getProcessReady = (i) => {

    if (i < listNewPross.length) {
        return { 
            isReady: true,
            processReady: listNewPross[i]
        };
    } else {
        return { 
            isReady: false,
            processReady: listNewPross[i]
        };
    }
    
}


////////// Keydown funtions


const manejarTecla = (event) =>  {
    switch(event.key) {
        case 'i':
        case 'I':
            moveProcessToBlocked();
            break;
        case 'e':
        case 'E':
            moveProcessToFinished();
            break;
        case 'p':
        case 'P':
            pauseProgram();
            break;
        case 'c':
        case 'C':
            continueProgram();
            break;
    }
}

const moveProcessToBlocked = () => {

    let counter = 10;

    divBloqueados[0].textContent =  divExecution[0].textContent;
    divBloqueados[1].textContent =  10;

    let interval = setInterval(() => {
        counter = counter - 1;
        divBloqueados[1].textContent = counter;

        if (counter == 0) {
            clearInterval(interval);

            divBloqueados[0].textContent = "";
            divBloqueados[1].textContent = "";
            
            // Move to ready
            

        }

    }, 1000 );

    setTimeout(() => {

    }, 10 * 1000 );
}


const pauseProgram = () => {
    
}

const continueProgram = () => {
    
}


////////// Update new process span

// Update counter of new porcess
const updateNewProcessCount = () => {
    countNewProcesess = countNewProcesess - 1;
    newProcessSpan.textContent = countNewProcesess
}



////////// Get time

// Get current time (ej: 10:30:20)
const getCurrentTime = () => {
    // Obtener la hora actual
    let fecha = new Date();

    // Obtener las horas, minutos y segundos
    let horas = fecha.getHours();
    let minutos = fecha.getMinutes();
    let segundos = fecha.getSeconds();

    // Convertir horas al formato de 12 horas
    horas = horas % 12 || 12; // Si es 0, entonces es 12

    // Agregar un cero inicial a los minutos y segundos si son menores a 10
    minutos = minutos < 10 ? '0' + minutos : minutos;
    segundos = segundos < 10 ? '0' + segundos : segundos;

    // Construir la cadena de tiempo
    let horaActual = horas + ':' + minutos + ':' + segundos;

    return horaActual;
}



////////// Counters

const counterExecution = () => {
    executionCounter = executionCounter + 1;
    divExecution[4].textContent = executionCounter;
}

const counterReady = () => {
    readyCounter = readyCounter + 1;
    divListo[2].textContent = readyCounter;
}

const conterWatting = () => {
    wattingCounter = wattingCounter + 1;
    divBloqueados[1].textContent = wattingCounter;
}

// Update global counter
const incrementarContador = () => {
    globalCounter = globalCounter + 1;
    contadorElemento.textContent = globalCounter;
}



////////// Random data

// Get random number behind 1-10
const getNumbers = () => {
    let number1 = Math.floor(Math.random() * 10) + 1;
    let number2 = Math.floor(Math.random() * 10) + 1;
    return { number1, number2 };
}

// Get random number behind 7-18
const getEstimatedTime = () => {
    return Math.floor(Math.random() * (18 - 7 + 1)) + 7;
}

// Get random operation 
const getOperation = () => {
    let randomIndex = Math.floor(Math.random() * operationI.length);
    let randomOperation = operationI[randomIndex];
    return randomOperation;
}



////////// K Keydown listener

// Escuchar eventos de teclado
document.addEventListener('keydown', manejarTecla);