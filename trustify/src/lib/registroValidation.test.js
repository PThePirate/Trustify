import test from "node:test";
import assert from "node:assert/strict";
import { validarRegistro, cedulaValida } from "./registroValidation.js";

const base = { nombreCompleto: "Usuario de prueba", correo: "prueba@example.com", telefono: "0991234567", pais: "EC", cedula: "1710034065", password: "Prueba-segura-123" };

test("registro válido y límites de 80 caracteres", () => {
  assert.deepEqual(validarRegistro(base), {});
  assert.deepEqual(validarRegistro({ ...base, nombreCompleto: "a".repeat(80), correo: "a".repeat(68) + "@example.com", password: "a".repeat(80) }), {});
  for (const campo of ["nombreCompleto", "correo", "password"])
    assert.ok(validarRegistro({ ...base, [campo]: "a".repeat(81) })[campo]);
});

test("correo requiere @ y dirección completa", () => {
  for (const correo of ["correo", "a@", "@example.com", "a b@example.com", "a@example@com"])
    assert.ok(validarRegistro({ ...base, correo }).correo);
});

test("teléfono exige diez números sin alterar lo escrito", () => {
  for (const telefono of ["", "099123456", "09912345678", "09912a4567", "+593991234567", "099 1234567"])
    assert.ok(validarRegistro({ ...base, telefono }).telefono);
  for (const pais of ["EC", "CO", "MX", "US"])
    assert.equal(validarRegistro({ ...base, pais }).pais, undefined);
  assert.ok(validarRegistro({ ...base, pais: "XX" }).pais);
});

test("cédula comprueba longitud, provincia y dígito verificador", () => {
  assert.ok(cedulaValida(base.cedula));
  for (const cedula of ["", "123", "1710034064", "0000000000", "17100340655", "171003406a"])
    assert.ok(validarRegistro({ ...base, cedula }).cedula);
});

test("campos vacíos y contraseña corta no permiten enviar", () => {
  assert.equal(Object.keys(validarRegistro(Object.fromEntries(Object.keys(base).map((key) => [key, ""])))).length, 6);
  for (const password of ["1234567", "        "])
    assert.ok(validarRegistro({ ...base, password }).password);
});
