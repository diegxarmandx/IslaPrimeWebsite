document.addEventListener('DOMContentLoaded', function () {

    /************************ VARIABLES ************************/
    const formInfo = {
        inputName: '',
        inputEmail: '',
        inputPhone: '',
        inputDate: '',
        inputTime: '',
        inputAppointment: '',
        inputMessage: ''
    }

    const inputName = document.querySelector('#name')
    const inputEmail = document.querySelector('#email');
    const inputPhone = document.querySelector('#phone');
    const inputDate = document.querySelector('#date');
    const inputTime = document.querySelector('#time');
    const inputAppointment = document.querySelector('#appointmentType')
    const inputMessage = document.querySelector('#message');
    const formulario = document.querySelector('#AppointmentForm');
    const btnSubmit = document.querySelector('#submit');
    const spinner = document.querySelector('#spinner');

    const appointmentScriptURL = 'https://script.google.com/macros/s/AKfycbznqtkqAm0XsEoJ_dzB6i3PsUgAB6t4bZxZnfakzTVNKt_N_VpGhNOfOzyEr2Zs_TbEVQ/exec';
    /************************ EVENT LISTENERS ************************/
    inputName.addEventListener('input', validar);
    inputEmail.addEventListener('input', validar);
    inputPhone.addEventListener('blur', validar);
    inputDate.addEventListener('input', validar);
    inputTime.addEventListener('input', validar);
    inputAppointment.addEventListener('input', validar)
    inputMessage.addEventListener('input', validar);
    formulario.addEventListener('submit', enviarEmail);


    /************************ FUNCIONES ************************/
    function validar(e) {
        if (e.target.value.trim() === '') {
            mostrarAlerta(`Please enter ${e.target.id}`, e.target.parentElement)
            formInfo[e.target.name] = ''; // para que no se guarde nada invalido en el obj
            comprobarEmail();
            return;
        }
        if (e.target.id === 'email' && !validarEmail(e.target.value)) {
            mostrarAlerta('Invalid Email', e.target.parentElement);
            formInfo[e.target.name] = '';
            comprobarEmail();
            return;
        }

        if (e.target.id === 'phone' && !validarPhone(e.target.value)) {
            mostrarAlerta('Sorry! We Only Operate in Puerto Rico', e.target.parentElement);
            formInfo[e.target.name] = '';
            comprobarEmail();
            return;
        }

        if (e.target.id === 'date' && !validarDate(e.target.value)) {
            mostrarAlerta('Invalid Date', e.target.parentElement);
            formInfo[e.target.name] = '';
            comprobarEmail();
            return;
        }

        limpiarAlerta(e.target.parentElement);

        formInfo[e.target.name] = e.target.value.trim().toLowerCase();

        comprobarEmail();

        console.log(formInfo)
    }

    function mostrarAlerta(mensaje, referencia) {
        limpiarAlerta(referencia)
        const alerta = document.createElement('P');
        alerta.textContent = mensaje;
        alerta.classList.add('test')
        referencia.appendChild(alerta);
    }


    function limpiarAlerta(referencia) {
        const alerta = referencia.querySelector('.test'); // test -> placeholder
        if (alerta) {
            alerta.remove();
        }
    }

    function comprobarEmail() {
        if (Object.values(formInfo).includes("")) {
            btnSubmit.classList.add('opacity-50');
            btnSubmit.disabled = true;
        } else {
            btnSubmit.classList.remove('opacity-50');
            btnSubmit.disabled = false;
        }
    }

    function enviarEmail(e) {
        e.preventDefault();

        spinner.classList.remove('hidden');

        fetch(appointmentScriptURL, {
            method: 'POST',
            body: new FormData(AppointmentForm)
        })
            .then(response => {
                spinner.classList.add('hidden');
                const enviado = document.createElement('P');
                enviado.textContent = 'Form submitted successfully!';
                formulario.appendChild(enviado);
                formulario.reset();
                formInfo.inputName = '';
                formInfo.inputEmail = '';
                formInfo.inputPhone = '';
                formInfo.inputDate = '';
                formInfo.inputTime = '';
                formInfo.inputAppointment = '';
                formInfo.inputMessage = '';
                btnSubmit.classList.add('opacity-50');
                btnSubmit.disabled = true;
                console.log(formInfo)
                setTimeout(() => {
                    enviado.remove();
                }, 5000);
            })
            .catch(error => {
                spinner.classList.add('hidden');
                console.error('Error!', error.message);
                alert('There was a problem sending the form. Please try again later.');
            });
    }
})


/************************ VALIDACIONES ************************/
function validarEmail(email) {
    const regex = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
    const resultado = regex.test(email);
    return resultado;
}

function validarPhone(phone) {
    const phoneNum = phone.replace(/[^\d]/g, '');
    if (phoneNum.length !== 10) {
        return false;
    }

    const areaCode = phoneNum.substring(0, 3);
    if (areaCode !== '787' && areaCode !== '939') {
        return false;
    }

    return true;
}

function validarDate(date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    return selectedDate >= today;
}

