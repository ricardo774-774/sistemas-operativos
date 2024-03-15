// **************** Variables **************** //

// Global Counter
let globalCounter = 0;

// Execution Counter
let executionCounter = 0;
let executionInterval = 0;

// Ready counter
let readyCounter = 0;

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
    setInterval(incrementarContador, 1000);
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

    let returnTime; // Tiempo total desde que el proceso llega hasta que termina.
    let responseTime; // Tiempo transcurrido desde que llega hasta que es atendido por primera vez.
    
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

const showListos = (process) => {

    process.stage = 'listo';

    divListo[0].textContent = process?.id || '';
    divListo[1].textContent = process?.estimatedTime || '';

    let counter;
    counter = Number(divExecution[5].textContent);

    let interval = setInterval(() => {
        counter = counter - 1;
        divListo[2].textContent = counter;

        if (counter == 0) {
            clearInterval(interval);

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
    executionInterval = setInterval(counterExecution, 1000);

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
    setTimeout( () => {

        // Pass to finished process
        showFinished(process);

        // Stop execution counter
        clearInterval(executionInterval);

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

// Keydown functions
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
    // Show data bloqued
    divBloqueados[0].textContent =  divExecution[0].textContent;
    divBloqueados[1].textContent =  10;

    let counter = 10; // Counter
    let position = divBloqueados[0].textContent;

    // Change stage
    listAllProcesses[position - 1].stage = 'nuevo';

    // Add blocked to the end
    listAllProcesses.push(listAllProcesses[position - 1]);

    // Remove blocked process from the list 
    listAllProcesses.splice(position - 1 ,1);

    // Add 1 to counter new process
    updateNewProcessCountUpper();

    clearInterval(executionInterval);

    showInExecution(listAllProcesses[position - 1]);
    showListos(listAllProcesses[position - 2]);

    // listAllProcesses.forEach((process) => {
    //     console.log(process.id, process.stage);
    // });

    let interval = setInterval(() => {
        counter = counter - 1;
        divBloqueados[1].textContent = counter;

        if (counter == 0) {
            // listAllProcesses[position - 1].stage = 'nuevo';
            clearInterval(interval);
        }

    }, 1000 );
}


const pauseProgram = () => {
    
}

const continueProgram = () => {
    
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
