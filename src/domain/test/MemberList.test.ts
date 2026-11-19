import { describe, expect, test, beforeEach } from "vitest";
import { Member } from "../Member.ts";
import { MemberList } from "../MemberList.ts";

describe("MemberList", () => {
  let list: MemberList;
  let member: Member;

  beforeEach(() => {
    list = new MemberList();
    member = new Member({
      name: "Ana Pérez",
      documentId: "12345678",
      plan: "full",
      monthlyFee: 1500,
    });
  });

  test("Create an empty member list", () => {
    expect(list.getItems()).toEqual([]);
  });

  test("add a member", () => {
    list.add(member);
    expect(list.getItems()).toEqual([member]);
  });

  test("reject a duplicated document id", () => {
    list.add(member);
    expect(() => list.add(member)).toThrow();
  });

  test("total fees", () => {
    list.add(member);
    expect(list.totalFees()).toBe(1500);
  });

  // --- Parte A.3: tests de updateFee ---

  // Cambia la cuota de 1500 a 2000 y verifica que el socio quedó con 2000.
  test("update the fee of a member", () => {
    list.add(member);
    list.updateFee("12345678", 2000);
    expect(member.monthlyFee).toBe(2000);
  });

  // La lista está vacía, así que no existe ese documento: tiene que lanzar Error.
  test("reject updating the fee of a non-existent member", () => {
    expect(() => list.updateFee("99999999", 2000)).toThrow();
  });

  // --- Parte A.2: test de totalDiscounted ---

  // Cuota 1500 con 10% de descuento: 1500 - 150 = 1350.
  test("total discounted", () => {
    member.discount = 10;
    list.add(member);
    expect(list.totalDiscounted()).toBe(1350);
  });
});
