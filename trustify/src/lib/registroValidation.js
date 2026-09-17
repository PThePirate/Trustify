// Países disponibles para el registro con un número local de 10 dígitos.
export const PAISES = [
  { codigo: "EC", nombre: "Ecuador", prefijo: "+593", bandera: "🇪🇨" },
  { codigo: "CO", nombre: "Colombia", prefijo: "+57", bandera: "🇨🇴" },
  { codigo: "MX", nombre: "México", prefijo: "+52", bandera: "🇲🇽" },
  { codigo: "US", nombre: "Estados Unidos", prefijo: "+1", bandera: "🇺🇸" },
];

export function cedulaValida(cedula) {
  if (!/^[0-9]{10}$/.test(cedula)) return false;
  const provincia = Number(cedula.slice(0, 2));
  if (!((provincia >= 1 && provincia <= 24) || provincia === 30) || Number(cedula[2]) > 5) return false;
  const suma = [...cedula.slice(0, 9)].reduce((total, n, i) => {
    const producto = Number(n) * (i % 2 === 0 ? 2 : 1);
    return total + (producto > 9 ? producto - 9 : producto);
  }, 0);
  return (10 - suma % 10) % 10 === Number(cedula[9]);
}

export function validarRegistro(form) {
  const errores = {};
  if (form.nombreCompleto.trim().length < 3 || form.nombreCompleto.length > 80)
    errores.nombreCompleto = "Escribe tu nombre completo, entre 3 y 80 caracteres.";
  if (form.correo.length > 80 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo))
    errores.correo = "Escribe un correo válido con @, de hasta 80 caracteres.";
  if (!PAISES.some((p) => p.codigo === form.pais)) errores.pais = "Selecciona un país disponible.";
  if (!/^[0-9]{10}$/.test(form.telefono)) errores.telefono = "Escribe exactamente 10 números, sin espacios ni símbolos.";
  if (!/^[0-9]{10}$/.test(form.cedula)) errores.cedula = "Escribe los 10 números de tu cédula.";
  else if (!cedulaValida(form.cedula)) errores.cedula = "Revisa tu cédula: el número ingresado no es válido.";
  if (form.password.trim().length === 0 || form.password.length < 8 || form.password.length > 80)
    errores.password = "Usa entre 8 y 80 caracteres.";
  return errores;
}
