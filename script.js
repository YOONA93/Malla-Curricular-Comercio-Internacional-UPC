// ======== DATOS DE LA MALLA ========
// Cada semestre con sus materias y requisitos (IDs)
const malla = {
  1: [
    { id: "FACE101", nombre: "Introducción Ciencia y Tecnología", deps: [] },
    { id: "CI118", nombre: "Fundamentos Comercio Internacional", deps: [] },
    { id: "PG012", nombre: "Expresión Oral y Escrita", deps: [] },
    { id: "UPC01", nombre: "Cátedra Upecista", deps: [] },
    { id: "CI141", nombre: "Elementary", deps: [] },
    { id: "EC101", nombre: "Fundamentos Economía", deps: [] },
    { id: "MT301C", nombre: "Matemáticas Fundamentales", deps: [] }
  ],
  2: [
    { id: "MT201C", nombre: "Cálculo Diferencial e Integral", deps: ["MT301C"] },
    { id: "FACE201", nombre: "Teoría del Conocimiento", deps: ["FACE101"] },
    { id: "CEDIA2", nombre: "Competencias Inglés A2", deps: [] },
    { id: "DR551", nombre: "Derecho Constitucional", deps: [] },
    { id: "CP101", nombre: "Fundamentos Contables", deps: [] },
    { id: "AE101", nombre: "Fundamentos Administración", deps: [] },
    { id: "CI207", nombre: "Pre-Intermediate", deps: ["CI141"] }
  ],
  // Agrega aquí los semestres 3 a 10 igual que en tu lista...
};

// ======== CARGAR ESTADO GUARDADO ========
let estado = JSON.parse(localStorage.getItem("mallaEstado")) || {};

// ======== CREAR LA MALLA EN HTML ========
const contenedor = document.getElementById("malla-container");

function crearMalla() {
  contenedor.innerHTML = "";
  for (let semestre in malla) {
    const divSemestre = document.createElement("div");
    divSemestre.classList.add("semestre");
    const titulo = document.createElement("h3");
    titulo.textContent = `Período ${semestre}`;
    divSemestre.appendChild(titulo);

    malla[semestre].forEach(materia => {
      const divMateria = document.createElement("div");
      divMateria.classList.add("materia");
      divMateria.textContent = materia.nombre;
      divMateria.dataset.id = materia.id;

      // Verificar si está completada
      if (estado[materia.id]) {
        divMateria.classList.add("completada");
      } else if (!requisitosCumplidos(materia)) {
        divMateria.classList.add("bloqueada");
      }

      // Evento click
      divMateria.addEventListener("click", () => {
        if (!requisitosCumplidos(materia)) {
          mostrarMensaje(`Debes aprobar: ${materia.deps.join(", ")}`);
          return;
        }
        if (estado[materia.id]) {
          delete estado[materia.id];
        } else {
          estado[materia.id] = true;
        }
        guardarEstado();
        crearMalla();
      });

      divSemestre.appendChild(divMateria);
    });

    contenedor.appendChild(divSemestre);
  }
}

// ======== FUNCIONES AUXILIARES ========
function requisitosCumplidos(materia) {
  return materia.deps.every(dep => estado[dep]);
}

function guardarEstado() {
  localStorage.setItem("mallaEstado", JSON.stringify(estado));
}

function mostrarMensaje(texto) {
  const mensaje = document.getElementById("mensaje");
  mensaje.textContent = texto;
  mensaje.style.display = "block";
  setTimeout(() => {
    mensaje.style.display = "none";
  }, 3000);
}

// Inicializar
crearMalla();
