/**
 * Valida los campos de entrada del formulario de inicio de sesión.
 *
 * @returns {Object} Un objeto que indica si los campos son válidos y los mensajes de error correspondientes.
 */
export const validateInputs = () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  let isValid = true;
  let errors = {
    emailError: false,
    emailErrorMessage: '',
    passwordError: false,
    passwordErrorMessage: '',
  };

  // Validar el campo de correo electrónico
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    errors.emailError = true;
    errors.emailErrorMessage = 'Por favor ingresa una dirección de correo válida.';
    isValid = false;
  }

  // Validar el campo de contraseña
  if (!password || password.length < 6) {
    errors.passwordError = true;
    errors.passwordErrorMessage = 'La contraseña debe tener al menos 6 caracteres.';
    isValid = false;
  }

  return { isValid, errors };
};

/**
 * Maneja el envío del formulario de inicio de sesión.
 *
 * @param {Event} event El evento de envío del formulario.
 * @param {Function} setEmailError Función para establecer el estado de error del correo electrónico.
 * @param {Function} setEmailErrorMessage Función para establecer el mensaje de error del correo electrónico.
 * @param {Function} setPasswordError Función para establecer el estado de error de la contraseña.
 * @param {Function} setPasswordErrorMessage Función para establecer el mensaje de error de la contraseña.
 * @param {Function} setLoading Función para establecer el estado de carga.
 */
export const handleSubmit = async (
  event,
  setEmailError,
  setEmailErrorMessage,
  setPasswordError,
  setPasswordErrorMessage,
  setLoading
) => {
  event.preventDefault();
  setLoading(true);  // Indica que la solicitud está en progreso

  // Restablecer los errores antes de validar
  setEmailError(false);
  setEmailErrorMessage("");
  setPasswordError(false);
  setPasswordErrorMessage("");

  const { isValid, errors } = validateInputs();

  if (!isValid) {
    setEmailError(errors.emailError);
    setEmailErrorMessage(errors.emailErrorMessage);
    setPasswordError(errors.passwordError);
    setPasswordErrorMessage(errors.passwordErrorMessage);
    setLoading(false); // Restablece el estado si hay errores de validación
    return;
  }

  const data = new FormData(event.currentTarget);
  const email = data.get('email');
  const password = data.get('password');

  try {
    const response = await fetch('http://localhost:8080/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (response.ok) {
      const { id, full_name } = result.student;  // Capturamos el ID y el nombre completo
     
      localStorage.setItem('userId', id);
      localStorage.setItem('userName', full_name);
      alert('Inicio de sesión exitoso');
      window.location.href = '/home';
    } else {
      alert(result.error || 'Error al iniciar sesión');
    }
  } catch (error) {
    console.error('Error en la solicitud:', error);
    alert('Hubo un problema al conectar con el servidor');
  } finally {
    setLoading(false); // Restablece el estado después de la respuesta (éxito o error)
  }
};
