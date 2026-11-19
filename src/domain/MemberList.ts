import type { Member } from "./Member.ts";

export class MemberList {
  #items: Member[] = [];

  add(item: Member): void {
    const exists = this.#items.some(
      (member) => member.documentId === item.documentId,
    );
    if (exists) {
      throw new Error("Ya existe un socio con ese documento.");
    }
    this.#items.push(item);
  }

  // Parte A.3: cambia la cuota del socio con ese documento.
  // find devuelve el socio o undefined si no hay ninguno con ese documento;
  // en ese caso se lanza Error. La nueva cuota pasa por el setter de
  // monthlyFee, así que si es inválida (0, negativa, NaN) también lanza Error.
  updateFee(documentId: string, fee: number): void {
    const member = this.#items.find((item) => item.documentId === documentId);
    if (member === undefined) {
      throw new Error("No existe un socio con ese documento.");
    }
    member.monthlyFee = fee;
  }

  getItems(): readonly Member[] {
    return [...this.#items];
  }

  totalFees(): number {
    return this.#items.reduce((total, member) => total + member.monthlyFee, 0);
  }

  // Parte A.2: suma de las cuotas con el descuento de cada socio aplicado.
  // A cada cuota se le resta su porcentaje: cuota - (descuento * cuota / 100).
  // Ej: 1000 con 10% -> 1000 - 100 = 900; 500 sin descuento -> 500.
  // Total: 1400. reduce arranca en 0 y va acumulando.
  totalDiscounted(): number {
    return this.#items.reduce(
      (total, member) =>
        total + member.monthlyFee - (member.discount * member.monthlyFee) / 100,
      0,
    );
  }
}
