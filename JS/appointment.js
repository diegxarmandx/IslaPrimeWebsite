document.addEventListener('DOMContentLoaded', function () {
  const formInfo = {
    inputName: '',
    inputEmail: '',
    inputPhone: '',
    inputDate: '',
    inputTime: '',
    inputAppointment: '',
    inputMessage: ''
  };

  const inputName = document.querySelector('#name');
  const inputEmail = document.querySelector('#email');
  const inputPhone = document.querySelector('#phone');
  const inputDate = document.querySelector('#date');
  const inputTime = document.querySelector('#time');
  const inputAppointment = document.querySelector('#appointmentType');
  const inputMessage = document.querySelector('#message');
  const formulario = document.querySelector('#AppointmentForm');
  const btnSubmit = document.querySelector('#submit');
  const spinner = document.querySelector('#spinner');

  const appointmentScriptURL =
    'https://script.google.com/macros/s/AKfycbznqtkqAm0XsEoJ_dzB6i3PsUgAB6t4bZxZnfakzTVNKt_N_VpGhNOfOzyEr2Zs_TbEVQ/exec';

  inputName.addEventListener('input', validar);
  inputEmail.addEventListener('input', validar);
  inputPhone.addEventListener('blur', validar);
  inputDate.addEventListener('input', validar);
  inputTime.addEventListener('input', validar);
  inputAppointment.addEventListener('input', validar);
  inputMessage.addEventListener('input', validar);
  formulario.addEventListener('submit', enviarFormulario);

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

    if (e.target.id === 'phone' && !validarPhone(e.target.value)) {
      mostrarAlerta('Sorry, we currently operate in Puerto Rico area codes only.', e.target.parentElement);
      formInfo[e.target.name] = '';
      comprobarFormulario();
      return;
    }

    if (e.target.id === 'date' && !validarDate(e.target.value)) {
      mostrarAlerta('Please choose today or a future date.', e.target.parentElement);
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
    formInfo.inputPhone = '';
    formInfo.inputDate = '';
    formInfo.inputTime = '';
    formInfo.inputAppointment = '';
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

  function enviarFormulario(e) {
    e.preventDefault();
    spinner.classList.remove('hidden');

    fetch(appointmentScriptURL, {
      method: 'POST',
      body: new FormData(formulario)
    })
      .then(() => {
        spinner.classList.add('hidden');
        showFormMessage('Appointment request submitted successfully.', 'is-success');
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

function validarEmail(email) {
  const regex = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
  return regex.test(email);
}

function validarPhone(phone) {
  const phoneNum = phone.replace(/[^\d]/g, '');
  if (phoneNum.length !== 10) {
    return false;
  }

  const areaCode = phoneNum.substring(0, 3);
  return areaCode === '787' || areaCode === '939';
}

function validarDate(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selectedDate = new Date(date);
  selectedDate.setHours(0, 0, 0, 0);

  return selectedDate >= today;
}
