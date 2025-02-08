$(document).ready(function () {
  // Manejador del evento submit del formulario
  $("#authForm").on("submit", function (event) {
    event.preventDefault(); // Evita que el formulario se envíe de forma tradicional

    // Obtener los valores del formulario
    const apiKey = $("#key").val();
    const password = $("#password").val();

    // Validar que los campos no estén vacíos
    if (!apiKey || !password) {
      Swal.fire({
        icon: "error",
        title: "Campos incompletos",
        text: "Por favor, completa todos los campos.",
      });
      return;
    }

    // Hacer la solicitud a la API PHP
    $.ajax({
      url: "api.php", // Ruta al archivo PHP
      method: "POST", // Método POST para mayor seguridad
      dataType: "json",
      data: {
        api_key: apiKey,
        password: password,
      },
      success: function (response) {
        // Redirigir a la nueva página con los datos si la autenticación es correcta
        Swal.fire({
          icon: "success",
          title: "Autenticado",
          text: "Redirigiendo al panel...",
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          // Guardar los datos en localStorage (opcional)
          localStorage.setItem("apiData", JSON.stringify(response));
          // Redirigir al dashboard
          window.location.href = "dashboard.html";
        });
      },
      error: function (err) {
        // Mostrar errores con SweetAlert
        Swal.fire({
          icon: "error",
          title: `Error ${err.status || "Desconocido"}`,
          text: err.responseJSON ? err.responseJSON.Error : "Error desconocido.",
        });
      },
    });
  });
});