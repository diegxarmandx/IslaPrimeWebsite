document.addEventListener('DOMContentLoaded', function () {
  const formInfo = {
    inputName: '',
    inputEmail: '',
    inputSubject: '',
    inputMessage: ''
  };

  const inputName = document.querySelector('#name');
  const inputEmail = document.querySelector('#email');
  const inputSubject = document.querySelector('#subject');
  const inputMessage = document.querySelector('#message');
  const formulario = document.querySelector('#formulario');
  const btnSubmit = document.querySelector('#submit');
  const spinner = document.querySelector('#spinner');

  const scriptURL =
    'https://script.google.com/macros/s/AKfycbwycKXxFgkIbVNvQaRnnX-fX5Ts3P6gTOiXzwhd-LUtKk5XPPzQLOUXBqBZlaVZpDr-/exec';

  inputName.addEventListener('input', validar);
  inputEmail.addEventListener('input', validar);
  inputSubject.addEventListener('input', validar);
  inputMessage.addEventListener('input', validar);
  formulario.addEventListener('submit', enviarEmail);

  function validar(e) {
    if (e.target.value.trim() === '') {
      mostrarAlerta(`Please enter ${e.target.id}`, e.target.parentElement);
      formInfo[e.target.name] = '';
      comprobarFormulario();
      return;
    }

    if (e.target.id === 'email' && !validarEmail(e.target.value)) {
      mostrarAlerta('Please enter a valid email address.', e.target.parentElement);
      formInfo[e.target.name] = '';
      comprobarFormulario();
      return;
    }

    limpiarAlerta(e.target.parentElement);
    formInfo[e.target.name] = e.target.value.trim();
    comprobarFormulario();
  }

  function mostrarAlerta(mensaje, referencia) {
    limpiarAlerta(referencia);
    const alerta = document.createElement('p');
    alerta.textContent = mensaje;
    alerta.classList.add('form-feedback', 'is-error', 'test');
    referencia.appendChild(alerta);
  }

  function validarEmail(email) {
    const regex = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
    return regex.test(email);
  }

  function limpiarAlerta(referencia) {
    const alerta = referencia.querySelector('.test');
    if (alerta) {
      alerta.remove();
    }
  }

  function comprobarFormulario() {
    if (Object.values(formInfo).includes('')) {
      btnSubmit.classList.add('opacity-50');
      btnSubmit.disabled = true;
    } else {
      btnSubmit.classList.remove('opacity-50');
      btnSubmit.disabled = false;
    }
  }

  function resetFormInfo() {
    formInfo.inputName = '';
    formInfo.inputEmail = '';
    formInfo.inputSubject = '';
    formInfo.inputMessage = '';
  }

  function showFormMessage(text, type) {
    const existing = formulario.querySelector('.form-feedback.is-success, .form-feedback.is-error, .form-feedback.is-info');
    if (existing) {
      existing.remove();
    }

    const msg = document.createElement('p');
    msg.textContent = text;
    msg.classList.add('form-feedback', type);
    formulario.appendChild(msg);

    setTimeout(() => {
      msg.remove();
    }, 6000);
  }

  function enviarEmail(e) {
    e.preventDefault();
    spinner.classList.remove('hidden');

    fetch(scriptURL, {
      method: 'POST',
      body: new FormData(formulario)
    })
      .then(() => {
        spinner.classList.add('hidden');
        showFormMessage('Form submitted successfully! We will contact you soon.', 'is-success');
        formulario.reset();
        resetFormInfo();
        btnSubmit.classList.add('opacity-50');
        btnSubmit.disabled = true;
      })
      .catch(() => {
        spinner.classList.add('hidden');
        showFormMessage('There was a problem sending the form. Please try again.', 'is-error');
      });
  }
});
