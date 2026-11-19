import { describe, expect, test, beforeEach } from "vitest";
import { Member } from "../Member.ts";
import type { Plan } from "../Member.ts";

describe("Member", () => {
  let member: Member;

  beforeEach(() => {
    member = new Member({
      name: "Ana Pérez",
      documentId: "12345678",
      plan: "full",
      monthlyFee: 1500,
    });
  });

  test("store name", () => {
    expect(member.name).toBe("Ana Pérez");
  });

  test("store document id", () => {
    expect(member.documentId).toBe("12345678");
  });

  test("store plan", () => {
    expect(member.plan).toBe("full");
  });

  test("store monthly fee", () => {
    expect(member.monthlyFee).toBe(1500);
  });

  test("reject an empty name", () => {
    expect(() => (member.name = "   ")).toThrow();
  });

  test("reject a document id with letters", () => {
    expect(() => (member.documentId = "12a45")).toThrow();
  });

  test("reject a monthly fee of zero", () => {
    expect(() => (member.monthlyFee = 0)).toThrow();
  });

  test("reject an invalid plan", () => {
    expect(() => (member.plan = "gold" as Plan)).toThrow();
  });

  test("reject a monthly fee that is not a number", () => {
    expect(() => (member.monthlyFee = Number.NaN)).toThrow();
  });

  test("show the member as text", () => {
    expect(member.toString()).toBe(
      "Ana Pérez (doc. 12345678) - Plan Completo - $1500",
    );
  });

  // --- Parte A.1: tests del descuento ---

  // Como beforeEach no asigna descuento, tiene que valer 0.
  test("discount is 0 by default", () => {
    expect(member.discount).toBe(0);
  });

  // Casos de error: menor que 0, mayor que 100 y con decimales.
  test("reject a negative discount", () => {
    expect(() => (member.discount = -1)).toThrow();
  });

  test("reject a discount greater than 100", () => {
    expect(() => (member.discount = 101)).toThrow();
  });

  test("reject a decimal discount", () => {
    expect(() => (member.discount = 2.5)).toThrow();
  });

  // Con descuento > 0 el texto agrega "- Descuento: 10%" al final.
  // (El caso sin descuento lo cubre "show the member as text".)
  test("show the discount in the text when it is greater than 0", () => {
    member.discount = 10;
    expect(member.toString()).toBe(
      "Ana Pérez (doc. 12345678) - Plan Completo - $1500 - Descuento: 10%",
    );
  });
});
