document.addEventListener('DOMContentLoaded', function () {

    /************************ VARIABLES ************************/
    const formInfo = {
        inputName: '',
        inputEmail: '',
        inputSubject: '',
        inputMessage: ''
    }

    const inputName = document.querySelector('#name')
    const inputEmail = document.querySelector('#email');
    const inputSubject = document.querySelector('#subject');
    const inputMessage = document.querySelector('#message');
    const formulario = document.querySelector('#formulario');
    const btnSubmit = document.querySelector('#submit');
    const spinner = document.querySelector('#spinner');

    const scriptURL = 'https://script.google.com/macros/s/AKfycbwycKXxFgkIbVNvQaRnnX-fX5Ts3P6gTOiXzwhd-LUtKk5XPPzQLOUXBqBZlaVZpDr-/exec';
    /************************ EVENT LISTENERS ************************/
    inputName.addEventListener('input', validar);
    inputEmail.addEventListener('input', validar);
    inputSubject.addEventListener('input', validar);
    inputMessage.addEventListener('input', validar);
    formulario.addEventListener('submit', enviarEmail);

    /************************ FUNCIONES ************************/
    function validar(e) {
        if (e.target.value.trim() === '') {
            mostrarAlerta(`Please enter ${e.target.id}`, e.target.parentElement)
            formInfo[e.target.name] = '';
            comprobarEmail();
            return;
        }
        if (e.target.id === 'email' && !validarEmail(e.target.value)) {
            mostrarAlerta('Invalid Email', e.target.parentElement);
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

    function validarEmail(email) {
        const regex = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
        const resultado = regex.test(email);
        return resultado;
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

        fetch(scriptURL, {
            method: 'POST',
            body: new FormData(formulario)
        })
            .then(response => {
                spinner.classList.add('hidden');
                const enviado = document.createElement('P');
                enviado.textContent = 'Form submitted successfully!';
                formulario.appendChild(enviado);
                formulario.reset();
                formInfo.inputName = '';
                formInfo.inputEmail = '';
                formInfo.inputMessage = '';
                formInfo.inputSubject = '';
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
