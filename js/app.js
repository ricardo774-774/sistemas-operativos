// **************** Variables **************** //

// Global Counter
let globalCounter = 0;
let globalInterval;

// Execution Counter
let executionCounter = 0;
let executionIntervalId = 0;
let executionTimeOut;

// Ready counter
let readyCounter = 0;
let readyIntervalId = 0; 

// Waiting counter
let waitingCounter = 0;

// Components of process
let id;
let stage;
let estimatedTime;
let operation;
let num1;
let num2;
let result;

let arrivalTime; // Hora en la que el proceso entra al sistema.
let completionTime; // Hora en la que el proceso terminó.
let returnTime; // Tiempo total desde que el proceso llega hasta que termina.
let responseTime; // Tiempo transcurrido desde que llega hasta que es atendido por primera vez.
let waitTime; // Tiempo que el proceso ha estado esperando para usar el procesador.
let serviceTime; // EstimatedTime. (Si el proceso terminó su ejecución normal es el TME)

// Types of stages
let stageI = [
    "nuevo",
    "listo",
    "ejecucion",
    "bloqueado",
    "terminado"
];

// Types of operations
let operationI = [
    "suma",
    "resta",
    "multiplicacion",
    "division",
    "residuo",
    "potencia",
];

// Process
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

// Total of processes
let countNewProcesses = 0;

// List of processes
let listAllProcesses = [];

// **************** Elements **************** //

// Form
let quantityForm = document.getElementById('quantity'); 
let buttonForm = document.getElementById('button-quantity');

// Counter of new processes
let newProcessSpan = document.querySelector('#title-1 span');

// Ready Processes Span
let divListo = document.querySelectorAll('.listos span:nth-child(1)');

// Processes in Execution Span
let divExecution = document.querySelectorAll('.ejecucion span:nth-child(1)');

// Blocked Processes Span
let divBloqueados = document.querySelectorAll('.bloqueados span:nth-child(1)');

// Finished Processes Container
let contenedor = document.getElementById("terminado");

// **************** Events **************** //

// DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
    globalInterval = setInterval(incrementarContador, 1000);
});

// Submit form 
quantityForm.addEventListener('submit', function (e) {
    // Prevent default
    e.preventDefault();

    // Get total number of processes
    const formData = new FormData(e.target);
    countNewProcesses = formData.get('quantity');

    // Update counter of new processes
    newProcessSpan.textContent = countNewProcesses;

    // Add data to each process
    addDataToProcesses(countNewProcesses); 

    // Deactivate form button
    buttonForm.disabled = true;
});

// Get the counter element
var contadorElemento = document.getElementById('contador');

// **************** Functions **************** //

// Save data of processes and container of processes
const addDataToProcesses = (countNewProcesses) => {

    for (let i = 0; i < countNewProcesses; i++) {

        // Get numbers
        let {number1, number2} = getNumbers();

        // Get operation
        let operation = getOperation();

        // Get estimated time
        let estimated = getEstimatedTime();

        // Get current time 
        let time = getCurrentTime();

        process = {
            id: i + 1,
            num1: number1,
            num2: number2,
            operation,
            // estimatedTime: estimated,
            estimatedTime: 5,
            arrivalTime: time,
            stage: 'nuevo'
        };

        listAllProcesses[i] = process;
    }

    controllProcessMemory(listAllProcesses);
    
}

// First initialization
const controllProcessMemory = (listAllProcesses = []) => {
    showInExecution(listAllProcesses[0]);
    showListos(listAllProcesses[1]);

    // Update counter
    updateNewProcessCount();
    updateNewProcessCount();
}

// Resolve the operation
const resolveOperation = (process) => {

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

        case 'division':
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

// Get time waited for user process
const timeForUseProcess = (process) => {

    const horaEnSegundos = (hora) => {
        // Divide the time into hours, minutes, and seconds
        let parts = hora.split(':');
    
        // Convert hours, minutes, and seconds to seconds
        let hoursInSeconds = parseInt(parts[0]) * 3600; // 1 hour = 3600 seconds
        let minutesInSeconds = parseInt(parts[1]) * 60; // 1 minute = 60 seconds
        let seconds = parseInt(parts[2]);
    
        // Calculate total seconds
        let totalSeconds = hoursInSeconds + minutesInSeconds + seconds;
    
        return totalSeconds;
    }

    let secondsTime1 = horaEnSegundos(process.arrivalTime);
    let secondsTime2 = horaEnSegundos(getCurrentTime());

    let difference = Math.abs(secondsTime1 - secondsTime2);
    
    return difference;
}

// Get time from start to finish
const timeOfInitToFinish = (process) => {

    const horaEnSegundos = (hora) => {
        // Divide the time into hours, minutes, and seconds
        let parts = hora.split(':');
    
        // Convert hours, minutes, and seconds to seconds
        let hoursInSeconds = parseInt(parts[0]) * 3600; // 1 hour = 3600 seconds
        let minutesInSeconds = parseInt(parts[1]) * 60; // 1 minute = 60 seconds
        let seconds = parseInt(parts[2]);
    
        // Calculate total seconds
        let totalSeconds = hoursInSeconds + minutesInSeconds + seconds;
    
        return totalSeconds;
    }

    let secondsTime1 = horaEnSegundos(process.arrivalTime);
    let secondsTime2 = horaEnSegundos(getCurrentTime());

    let difference = Math.abs(secondsTime1 - secondsTime2);
    
    return difference;
}

const showFinished = (process) => {
    
    // New stage of process
    process.stage = 'terminado';
    
    // Calculate time data of finished
    process.completionTime = getCurrentTime();

    // Calculate time from start to finish of process
    process.returnTime = timeOfInitToFinish(process);

    // If not blocked, add normal service time
    if (!process.serviceTime) {
        process.serviceTime = process.estimatedTime;
    } else {
        // Add time in block
        process.serviceTime = process.estimatedTime + process.estimatedTime;
    }

    // Order of process
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
        returnTime: process.returnTime
    }
    
    // Show to user
    for (let property in process) {
        if (process.hasOwnProperty(property)) {
            let div = document.createElement("div");
            div.classList.add('col-sm-3', 'col-lg-12', 'text-center');
            div.textContent = `${property}: ${process[property]}`;
            contenedor.appendChild(div);
        }
    }
    let hr = document.createElement("hr");
    hr.classList.add('altura-2rem');
    contenedor.appendChild(hr);
}

const showFinishedWithErr = (process) => {

    clearInterval(readyIntervalId);
    clearInterval(executionIntervalId);
    clearTimeout(executionTimeOut);

    showInExecution(listAllProcesses[Number(divExecution[0].textContent)]);
    showListos(listAllProcesses[Number(divExecution[0].textContent)]);

    // New stage of process
    process.stage = 'terminado';
    
    // Calculate time data of finished
    process.completionTime = getCurrentTime();

    // Calculate time from start to finish of process
    process.returnTime = timeOfInitToFinish(process);

    // If not blocked, add normal service time
    if (!process.serviceTime) {
        process.serviceTime = process.estimatedTime;
    } else {
        // Add time in block
        process.serviceTime = process.estimatedTime + process.estimatedTime;
    }

    // Order of process
    process = {
        id: process.id,
        num1: process.num1,
        num2: process.num2,
        operation: process.operation,
        result: 'ERROR',
        arrivalTime: process.arrivalTime,
        completionTime: process.completionTime,
        estimatedTime: process.estimatedTime,
        serviceTime: process.serviceTime,
        waitTime: process.waitTime,
        returnTime: process.returnTime
    }
    
    // Show to user
    for (let property in process) {
        if (process.hasOwnProperty(property)) {
            let div = document.createElement("div");
            div.classList.add('col-sm-3', 'col-lg-12', 'text-center');
            div.textContent = `${property}: ${process[property]}`;
            contenedor.appendChild(div);
        }
    }
    let hr = document.createElement("hr");
    hr.classList.add('altura-2rem');
    contenedor.appendChild(hr);
}

const createNewProcess = () => {
    // Generar números aleatorios para el proceso
    const number1 = Math.floor(Math.random() * 10) + 1;
    const number2 = Math.floor(Math.random() * 10) + 1;

    // Obtener una operación aleatoria
    const operationIndex = Math.floor(Math.random() * operationI.length);
    const operation = operationI[operationIndex];

    // Obtener tiempo estimado aleatorio
    const estimatedTime = Math.floor(Math.random() * (18 - 7 + 1)) + 7;

    // Obtener hora actual
    const currentTime = getCurrentTime();

    // Crear el objeto del proceso
    const newProcess = {
        id: listAllProcesses.length + 1, // Incrementar el ID
        num1: number1,
        num2: number2,
        operation: operation,
        estimatedTime: estimatedTime,
        arrivalTime: currentTime,
        stage: 'nuevo'
    };

    // Añadir el proceso a la lista de procesos
    listAllProcesses.push(newProcess);

    updateNewProcessCountUpper();
};


const showListos = (process) => {

    process.stage = 'listo';

    divListo[0].textContent = process?.id || '';
    divListo[1].textContent = process?.estimatedTime || '';

    let counter;
    counter = Number(divExecution[5].textContent);

    readyIntervalId = setInterval(() => {
        counter = counter - 1;
        divListo[2].textContent = counter;

        if (counter == 0) {
            clearInterval(readyIntervalId);

            // Show list of new processes
            updateNewProcessCount();

            divListo[0].textContent = "";
            divListo[1].textContent = "";
            divListo[2].textContent = "";

            process.stage = 'ejecucion';

            // Call new process in execution
            let { isReady, processReady } = getNextProcessReady();
            if (isReady == true) {
                showListos(processReady);
            }
        }

    }, 1000 );

}

const showInExecution = (process) => {

    // Change stage
    process.stage = 'ejecucion';

    // Counter = 0
    executionCounter = 0;

    // Start interval
    executionIntervalId = setInterval(() => {
        counterExecution();
    }, 1000);


    // Show data
    divExecution[0].textContent = process?.id || '';
    divExecution[1].textContent = process?.operation || '';
    divExecution[2].textContent = process?.num1 || '';
    divExecution[3].textContent = process?.num2 || '';
    divExecution[5].textContent = process?.estimatedTime || '';

    // Resolve math operation 
    resolveOperation(process);

    // Time assigned for process use
    process.waitTime = timeForUseProcess(process);


    // When finish time
    executionTimeOut =  setTimeout( () => {

        // Pass to finished process
        showFinished(process);

        // Stop execution counter
        clearInterval(executionIntervalId);

        // Clear data showed
        divExecution[0].textContent = '';
        divExecution[1].textContent = '';
        divExecution[2].textContent = '';
        divExecution[3].textContent = '';
        divExecution[4].textContent = '';
        divExecution[5].textContent = '';

        // Call new process in execution
        let { isExe, processExe } = getNextProcessInExe();
        if (isExe == true) {
            showInExecution(processExe);
        }


    }, process.estimatedTime * 1000 );

}

const getNextProcessReady = () => {
    let data = listAllProcesses
        .filter(process => process.stage === 'nuevo')
        .map(process => ({ isReady: true, processReady: process }));

    return (data[0])
        ? data[0]
        : { isExe: false, processReady: {} }
}

const getNextProcessInExe = () => {
    let data = listAllProcesses
        .filter(process => process.stage === 'listo')
        .map(process => ({ isExe: true, processExe: process }));
    
    return (data[0])
        ? data[0]
        : { isExe: false, processExe: {} }
}

const seeAllProcesses = () => {
    // Obtener el modal
    const modal = document.getElementById("modal");

    // Obtener el contenedor de procesos dentro del modal
    const processContainer = document.getElementById("process-container");

    // Limpiar contenido previo del contenedor de procesos
    processContainer.innerHTML = '';

    // Algo bloqueado?
    let idBloqueado;
    if (divBloqueados[0].textContent !== '') {
        idBloqueado = Number(divBloqueados[0].textContent);
    }

    // Iterar sobre todos los procesos en listAllProcesses
    listAllProcesses.forEach((process, index) => {

        // Crear un elemento div para mostrar los detalles del proceso
        const processDiv = document.createElement("div");
        processDiv.classList.add("process-details");

        if (process.id == idBloqueado) {
            processDiv.innerHTML = `
            <h4>Proceso ${index + 1}</h4>
            <p>ID: ${process.id}</p>
            <p>Operación: ${process.operation}</p>
            <p>Número 1: ${process.num1}</p>
            <p>Número 2: ${process.num2}</p>
            <p>Tiempo estimado: ${process.estimatedTime}</p>
            <p>Tiempo de llegada: ${process.arrivalTime}</p>
            <p>Estado: Bloqueado</p>
        `;
        } else {
            // Agregar los detalles del proceso al div
        processDiv.innerHTML = `
            <h4>Proceso ${index + 1}</h4>
            <p>ID: ${process.id}</p>
            <p>Operación: ${process.operation}</p>
            <p>Número 1: ${process.num1}</p>
            <p>Número 2: ${process.num2}</p>
            <p>Tiempo estimado: ${process.estimatedTime}</p>
            <p>Tiempo de llegada: ${process.arrivalTime}</p>
            <p>Estado: ${process.stage}</p>
        `;
        }

        // Agregar el div del proceso al contenedor
        processContainer.appendChild(processDiv);
    });

    // Mostrar el modal
    modal.style.display = "block";
};

document.addEventListener('DOMContentLoaded', function() {
    const closeButton = document.querySelector('.close');
    const modal = document.getElementById("modal");

    closeButton.addEventListener('click', function() {
        modal.style.display = "none";
    });

    // Cerrar el modal cuando se hace clic fuera del contenido del modal
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
});

// Keydown functions
const manejarTecla = (event) =>  {
    switch(event.key) {
        case 'i':
        case 'I': {
            if (divBloqueados[0].textContent === '') {
                moveProcessToBlocked();   
            }
        }
            break;
        case 'e':
        case 'E':
            showFinishedWithErr(listAllProcesses[divExecution[0].textContent-1]);
            break;
        case 'p':
        case 'P':
            pauseProgram();
            break;
        case 'c':
        case 'C':
            continueProgram();
            break;
        case 'n':
        case 'N':
            createNewProcess();
            break;
        case 'b':
        case 'B':
            seeAllProcesses();
            break;
    }
}

const moveProcessToBlocked = () => {
    let counter = 10;
    divBloqueados[0].textContent = divExecution[0].textContent;
    divBloqueados[1].textContent = counter;

    clearInterval(readyIntervalId);
    clearInterval(executionIntervalId);
    clearTimeout(executionTimeOut);

    showInExecution(listAllProcesses[Number(divBloqueados[0].textContent)]);
    showListos(listAllProcesses[Number(divBloqueados[0].textContent) + 1]);

    updateNewProcessCountUpper();

    listAllProcesses[divBloqueados[0].textContent - 1].serviceTime = 1;
    listAllProcesses[divBloqueados[0].textContent - 1].stage = 'nuevo';
    listAllProcesses.push(listAllProcesses[divBloqueados[0].textContent - 1]);
    listAllProcesses.splice(divBloqueados[0].textContent - 1,1);

    let interval = setInterval(() => {

        counterWaiting();

        counter = counter - 1;
        divBloqueados[1].textContent = counter;

        if (counter == 0) {
            divBloqueados[0].textContent = '';
            divBloqueados[1].textContent = '';
            clearInterval(interval);
        }

    }, 1000 );
}


const pauseProgram = () => {
    // Intervalo de contador 
    clearInterval(globalInterval);

    // Intervalos de procesos
    clearInterval(readyIntervalId);
    clearInterval(executionIntervalId);
    clearTimeout(executionTimeOut);
}

const continueProgram = () => {
    // Reactivar el intervalo global
    globalInterval = setInterval(incrementarContador, 1000);

    // Reactivar el intervalo de procesos en listos
    if (divListo[2].textContent !== "") {
        readyIntervalId = setInterval(() => {
            let counter = Number(divListo[2].textContent);
            counter = counter - 1;
            divListo[2].textContent = counter;

            if (counter == 0) {
                clearInterval(readyIntervalId);

                // Mostrar lista de nuevos procesos
                updateNewProcessCount();

                divListo[0].textContent = "";
                divListo[1].textContent = "";
                divListo[2].textContent = "";

                // Obtener y mostrar nuevo proceso en ejecución
                let { isReady, processReady } = getNextProcessReady();
                if (isReady == true) {
                    showListos(processReady);
                }
            }
        }, 1000);
    }

    // Reactivar el intervalo de ejecución de procesos
    if (divExecution[4].textContent !== "") {
        executionIntervalId = setInterval(() => {
            counterExecution();
        }, 1000);
    }

    // Reactivar el tiempo de espera para los procesos bloqueados
    if (divBloqueados[1].textContent !== "") {
        let counter = Number(divBloqueados[1].textContent);
        let interval = setInterval(() => {
            counter = counter - 1;
            divBloqueados[1].textContent = counter;

            if (counter == 0) {
                divBloqueados[0].textContent = '';
                divBloqueados[1].textContent = '';
                clearInterval(interval);
            }
        }, 1000);
    }

    // Reactivar el tiempo de ejecución de los procesos
    if (divExecution[5].textContent !== "") {
        let estimatedTime = Number(divExecution[5].textContent);
        estimatedTime = estimatedTime - 1;
        executionTimeOut = setTimeout(() => {
            // Obtener proceso en ejecución
            let currentProcessId = divExecution[0].textContent;
            let currentProcess = listAllProcesses[currentProcessId - 1];

            // Pasar el proceso a terminado
            showFinished(currentProcess);

            // Detener contador de ejecución
            clearInterval(executionIntervalId);

            // Limpiar datos mostrados
            divExecution[0].textContent = '';
            divExecution[1].textContent = '';
            divExecution[2].textContent = '';
            divExecution[3].textContent = '';
            divExecution[4].textContent = '';
            divExecution[5].textContent = '';

            // Obtener y mostrar nuevo proceso en ejecución
            let { isExe, processExe } = getNextProcessInExe();
            if (isExe == true) {
                showInExecution(processExe);
            }
        }, estimatedTime * 1000);
    }
}

////////// Update new process span

// Update counter of new processes
const updateNewProcessCount = () => {
    countNewProcesses = countNewProcesses - 1;

    if (countNewProcesses >= 0) {
        newProcessSpan.textContent = countNewProcesses   
    }
}

const updateNewProcessCountUpper = () => {
    countNewProcesses = countNewProcesses + 1;
    newProcessSpan.textContent = countNewProcesses   
}

////////// Get time

// Get current time (e.g., 10:30:20)
const getCurrentTime = () => {
    // Get current time
    let date = new Date();

    // Get hours, minutes, and seconds
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    // Convert hours to 12-hour format
    hours = hours % 12 || 12; // If it's 0, then it's 12

    // Add leading zero to minutes and seconds if they are less than 10
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    // Construct time string
    let currentTime = hours + ':' + minutes + ':' + seconds;

    return currentTime;
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

const counterWaiting = () => {
    waitingCounter = waitingCounter + 1;
    divBloqueados[1].textContent = waitingCounter;
}

// Update global counter
const incrementarContador = () => {
    globalCounter = globalCounter + 1;
    contadorElemento.textContent = globalCounter;
}

////////// Random data

// Get random number between 1 and 10
const getNumbers = () => {
    let number1 = Math.floor(Math.random() * 10) + 1;
    let number2 = Math.floor(Math.random() * 10) + 1;
    return { number1, number2 };
}

// Get random number between 7 and 18
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

// Listen for keyboard events
document.addEventListener('keydown', manejarTecla);
