$(document).ready(function () {
  console.log("Documento listo");

  // Verificar si hay una sesión activa
  if (window.location.pathname.includes("dashboard.html")) {
    console.log("Verificando sesión...");
    const token = sessionStorage.getItem("sessionToken");
    if (!token) {
      console.warn("No hay sesión activa, redirigiendo...");
      window.location.href = "index.html";
      return;
    }
    console.log("Sesión activa. Cargando datos...");
    cargarDatosDashboard();
  }

  // Manejador del evento submit del formulario
  $("#authForm").on("submit", function (event) {
    event.preventDefault(); // Evita el envío tradicional del formulario
    console.log("Formulario enviado");

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
    console.log("Enviando datos a la API...");

    // Hacer la solicitud a la API PHP
    $.ajax({
      url: "api.php",
      method: "POST",
      dataType: "json",
      data: {
        api_key: apiKey,
        password: password,
      },
      success: function (response) {
        console.log("Autenticación exitosa:", response);
        sessionStorage.setItem("sessionToken", response.token); // Almacenar solo el token

        Swal.fire({
          icon: "success",
          title: "Autenticado",
          text: "Redirigiendo al panel...",
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          window.location.href = "dashboard.html";
        });
      },
      error: function (err) {
        console.error("Error en autenticación:", err);
        Swal.fire({
          icon: "error",
          title: `Error ${err.status || "Desconocido"}`,
          text: err.responseJSON ? err.responseJSON.Error : "Error desconocido.",
        });
      },
    });
  });

  // Función para cargar datos en el dashboard
  function cargarDatosDashboard() {
    console.log("Solicitando datos al servidor...");
    $.ajax({
      url: "api.php",
      method: "GET",
      dataType: "json",
      success: function (data) {
        console.log("Datos recibidos:", data);
        const contenido = data.personas
        .map(
          (persona) => `
          <div class="col mb-4">
            <div class="card custom-card shadow-sm">
              <div class="card-header" style="background-image: linear-gradient(135deg, #6a11cb, #2575fc);">
                <img src="${persona.imagen}" alt="${persona.nombre}" class="rounded-circle">
              </div>
              <div class="card-body text-center">
                <h5 class="card-title">${persona.nombre}</h5>
                <p class="card-text"><strong>Edad:</strong> ${persona.edad}</p>
                <p class="card-text"><strong>Ciudad:</strong> ${persona.ciudad}</p>
                <p class="card-text"><strong>Correo:</strong> ${persona.correo}</p>
                <p class="card-text"><strong>Profesión:</strong> ${persona.profesion}</p>
                <p class="card-text"><strong>Intereses:</strong></p>
                <ul class="interests-list">
                  ${persona.intereses.map((interes) => `<li>${interes}</li>`).join("")}
                </ul>
              </div>
            </div>
          </div>
        `
        )
        .join("");

      // Insertar las cards en el contenedor
      $("#persons-card-container").html(contenido);

      },
      error: function (err) {
        console.error("Error al obtener datos:", err);
        Swal.fire({
          icon: "error",
          title: "Error al cargar datos",
          text: err.responseJSON ? err.responseJSON.Error : "No se pudieron obtener los datos.",
        });
      },
    });
  }
});
