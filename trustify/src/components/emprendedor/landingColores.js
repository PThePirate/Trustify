export const COLORES_INICIALES = { colorFondo: "#1d2b37", colorTitulo: "#f8f6ef", colorTexto: "#c5d3d5", colorAcento: "#8bbfce" };
export const PALETAS_LANDING = [
  { nombre: "Océano", colores: COLORES_INICIALES },
  { nombre: "Luz", colores: { colorFondo: "#f7f8f4", colorTitulo: "#223747", colorTexto: "#506574", colorAcento: "#347f89" } },
  { nombre: "Bosque", colores: { colorFondo: "#172b26", colorTitulo: "#f5f1df", colorTexto: "#c5d6c6", colorAcento: "#add194" } },
  { nombre: "Coral", colores: { colorFondo: "#2d2430", colorTitulo: "#fff4eb", colorTexto: "#e5d1cf", colorAcento: "#f4a681" } },
];

const esHex = (valor) => /^#[0-9a-fA-F]{6}$/.test(valor || "");
export function leerColoresLanding(bloques) {
  const tema = bloques?.find((bloque) => bloque.tipo === "tema");
  if (!tema) return null;
  return Object.fromEntries(Object.entries(COLORES_INICIALES).map(([clave, defecto]) => [clave, esHex(tema[clave]) ? tema[clave] : defecto]));
}
export function estiloColoresLanding(colores) {
  return colores ? {
    "--landing-fondo": colores.colorFondo,
    "--landing-titulo": colores.colorTitulo,
    "--landing-texto": colores.colorTexto,
    "--landing-acento": colores.colorAcento,
  } : undefined;
}
