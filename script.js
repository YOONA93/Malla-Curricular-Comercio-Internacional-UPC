// ======== DATOS DE LA MALLA ========
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
  3: [
    { id: "CI301", nombre: "Acuerdos Comerciales e Inversión", deps: ["CI207","CI118"] },
    { id: "CP304", nombre: "Contabilidad General y de Costos", deps: ["CP101"] },
    { id: "MT304C", nombre: "Estadística y Probabilidad", deps: ["MT201C"] },
    { id: "CI305", nombre: "Intermediate", deps: ["CI207"] },
    { id: "CI119", nombre: "International Marketing", deps: ["CI207"] },
    { id: "EC126", nombre: "Microeconomía", deps: ["EC101"] }
  ],
  4: [
    { id: "CI401", nombre: "Arancel de Aduanas", deps: ["CI118"] },
    { id: "CI402", nombre: "Empaque y Embalaje", deps: ["CI119"] },
    { id: "EC127", nombre: "Macroeconomía", deps: ["EC101"] },
    { id: "EC108", nombre: "Matemáticas Financieras", deps: [] },
    { id: "CI404", nombre: "Upper Intermediate", deps: ["CI305"] }
  ],
  5: [
    { id: "CI506", nombre: "Advanced", deps: ["CI404"] },
    { id: "CI403", nombre: "Geopolítica", deps: ["EC127","CI207"] },
    { id: "CI501", nombre: "Metodología Investigación", deps: ["FACE201"] },
    { id: "CI502", nombre: "Procesos de Importación I", deps: ["CI401"] },
    { id: "CI503", nombre: "Transporte y Puerto", deps: ["CI402"] }
  ],
  6: [
    { id: "CI602", nombre: "Cadena de Distribución", deps: ["CI503"] },
    { id: "CI302", nombre: "Derecho Comercial e Internacional", deps: ["CI401"] },
    { id: "CI603", nombre: "Formulación y Evaluación Proyectos", deps: ["EC108"] },
    { id: "CI604", nombre: "International Financial Markets", deps: ["CI506","EC127","EC108"] },
    { id: "CI601", nombre: "Procesos de Importación II", deps: ["CI502"] }
  ],
  7: [
    { id: "UPC08", nombre: "Actividad Deportiva", deps: [] },
    { id: "CI703", nombre: "E-Business", deps: ["CI506","CI119"] },
    { id: "HT503", nombre: "Electiva I", deps: ["CI506"] },
    { id: "CI120", nombre: "Moneda y Crédito Internacional", deps: ["CI604"] },
    { id: "CI707", nombre: "Optativa de Profundización", deps: ["EC127","CI506"] },
    { id: "CI702", nombre: "Procesos de Exportación", deps: ["CI502"] }
  ],
  8: [
    { id: "CI808", nombre: "Electiva II", deps: [] },
    { id: "CI809", nombre: "Electiva Comunicativa", deps: ["HT503"] },
    { id: "CI807", nombre: "International Public Relations", deps: ["CI506"] },
    { id: "CI802", nombre: "Plan de Negocios Exportación", deps: ["CI603"] },
    { id: "CI132", nombre: "Precios y Cotización Internacional", deps: ["CI120"] }
  ],
  9: [
    { id: "UPC09", nombre: "Actividad Cultural", deps: [] },
    { id: "CEDIB1", nombre: "Competencias Inglés B1", deps: [] },
    { id: "CI908", nombre: "Electiva II", deps: [] },
    { id: "CI903", nombre: "Finanzas Internacionales", deps: ["CI132"] },
    { id: "CI135", nombre: "Legislación Aduanera", deps: ["CI702"] },
    { id: "CI901", nombre: "Proyecto de Investigación", deps: ["CI501"] },
    { id: "CI902", nombre: "Régimen Cambios Internacionales", deps: ["CI601"] }
  ],
  10: [
    { id: "CIB2", nombre: "Competencias Inglés B2", deps: ["CEDIB1"] },
    { id: "CI105", nombre: "Práctica Empresarial", deps: ["CI506"] }
  ]
};

// ======== ESTADO GUARDADO ========
let estado = JSON.parse(localStorage.getItem("mallaEstado")) || {};

// ======== CREAR MALLA ========
const contenedor = document.getElementById("malla-container");

function crearMalla() {
  contenedor.innerHTML = "";
  for (let semestre in malla) {
    const divSemestre = document.createElement("div");
    divSemestre.classList.add("semestre");
    const titulo = document.createElement("h3");
    titulo.textContent = `Semestre ${semestre}`;
    divSemestre.appendChild(titulo);

    malla[semestre].forEach(materia => {
      const divMateria = document.createElement("div");
      divMateria.classList.add("materia");
      divMateria.textContent = materia.nombre;
      divMateria.dataset.id = materia.id;

      // Estado actual
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

crearMalla();
