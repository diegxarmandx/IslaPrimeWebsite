document.addEventListener('DOMContentLoaded', function(){

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

    inputName.addEventListener('input', validar);
    inputEmail.addEventListener('input', validar);
    inputSubject.addEventListener('input', validar);
    inputMessage.addEventListener('input', validar);
    formulario.addEventListener('submit', enviarEmail);

    function validar(e){
        if(e.target.value.trim() === ''){
            mostrarAlerta(`Please enter ${e.target.id}`, e.target.parentElement)
            formInfo[e.target.name] = '';
            comprobarEmail();
            return;
        }
        if(e.target.id === 'email' && !validarEmail(e.target.value)){
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

    function mostrarAlerta(mensaje, referencia){
        limpiarAlerta(referencia)
        const alerta = document.createElement('P');
        alerta.textContent = mensaje;
        alerta.classList.add('test')
        referencia.appendChild(alerta);
    }

    function validarEmail(email){
        const regex = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
        const resultado = regex.test(email);
        return resultado;
    }

    function limpiarAlerta(referencia){
        const alerta = referencia.querySelector('.test'); // test -> placeholder
        if(alerta){
            alerta.remove();
        }
    }

    function comprobarEmail(){
        if(Object.values(formInfo).includes("")){
            btnSubmit.classList.add('opacity-50');
            btnSubmit.disabled = true;
        } else {
            btnSubmit.classList.remove('opacity-50');
            btnSubmit.disabled = false;
        }
    }

    function enviarEmail(e){
        e.preventDefault()

        spinner.classList.remove('hidden')
        const mensaje = 'Email has been sent successfully!'
        
        setTimeout(() => {
            spinner.classList.add('hidden')
            const enviado = document.createElement('P');
            enviado.textContent = mensaje; 
            formulario.appendChild(enviado)

            setTimeout(() => {
                enviado.textContent = ''
            }, 5000);
        }, 3000);
    }
})