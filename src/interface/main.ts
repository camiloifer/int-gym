import { Member, PLAN_LABELS } from "../domain/Member.ts";
import type { MemberData, Plan } from "../domain/Member.ts";
import { MemberList } from "../domain/MemberList.ts";
import mockMembers from "../data/members.json";

const memberList = new MemberList();

const inpName = document.getElementById("inp-name") as HTMLInputElement | null;
const inpDocument = document.getElementById(
  "inp-document",
) as HTMLInputElement | null;
const selPlan = document.getElementById("sel-plan") as HTMLSelectElement | null;
const inpFee = document.getElementById("inp-fee") as HTMLInputElement | null;
// Parte B.4: campo nuevo "Descuento (%)" del formulario "Nuevo socio".
const inpDiscount = document.getElementById(
  "inp-discount",
) as HTMLInputElement | null;
const btnAdd = document.getElementById("btn-add") as HTMLButtonElement | null;
const errorContainer = document.getElementById(
  "error-container",
) as HTMLDivElement | null;
const errorMsg = document.getElementById(
  "error-msg",
) as HTMLParagraphElement | null;
const membersList = document.getElementById(
  "members-list",
) as HTMLDivElement | null;
const membersEmptyMsg = document.getElementById(
  "members-empty-msg",
) as HTMLParagraphElement | null;
const membersCount = document.getElementById(
  "members-count",
) as HTMLSpanElement | null;
const inpTotalMembers = document.getElementById(
  "inp-total-members",
) as HTMLInputElement | null;
const inpTotalFees = document.getElementById(
  "inp-total-fees",
) as HTMLInputElement | null;
// Parte B.4: total nuevo "Total con descuento" del panel "Inicio".
const inpTotalDiscount = document.getElementById(
  "inp-total-discount",
) as HTMLInputElement | null;

// Vacía el formulario después de agregar un socio (ahora incluye el descuento).
function clearInputs(): void {
  if (inpName && inpDocument && inpFee && inpDiscount) {
    inpName.value = "";
    inpDocument.value = "";
    inpFee.value = "";
    inpDiscount.value = "";
  }
}

function showError(message: string): void {
  if (errorContainer && errorMsg) {
    errorMsg.textContent = message;
    errorContainer.classList.remove("d-none");
  }
}

function hideError(): void {
  errorContainer?.classList.add("d-none");
}

function createText(text: string): HTMLParagraphElement {
  const paragraph = document.createElement("p");
  paragraph.className = "card-text mb-1";
  paragraph.textContent = text;
  return paragraph;
}

function createFeeEditor(member: Member): HTMLDivElement {
  const group = document.createElement("div");
  group.className = "input-group input-group-sm";
  const input = document.createElement("input");
  input.className = "form-control";
  input.type = "number";
  input.value = String(member.monthlyFee);
  input.setAttribute("aria-label", `Nueva cuota de ${member.name}`);
  const button = document.createElement("button");
  button.type = "button";
  button.className = "btn btn-outline-secondary";
  button.textContent = "Guardar cuota";
  // Parte B.6: al hacer click en "Guardar cuota" se cambia la cuota del socio
  // con el valor del input y se redibujan el listado y los totales.
  // Si la cuota es inválida, updateFee lanza Error y en el catch se agrega
  // la clase de Bootstrap "is-invalid", que pone el campo en rojo.
  // No hace falta sacar "is-invalid" al guardar bien: updateList() vuelve a
  // crear todas las cards, así que el input nuevo ya viene sin esa clase.
  button.addEventListener("click", () => {
    try {
      memberList.updateFee(member.documentId, Number(input.value));
      updateList();
      updateTotals();
    } catch {
      input.classList.add("is-invalid");
    }
  });
  group.append(input, button);
  return group;
}

function createCard(member: Member): HTMLDivElement {
  const column = document.createElement("div");
  column.className = "col";
  const card = document.createElement("div");
  card.className = "card h-100";
  const body = document.createElement("div");
  body.className = "card-body";
  const title = document.createElement("h5");
  title.className = "card-title";
  title.textContent = member.name;
  // Parte B.5: el plan se muestra como badge de Bootstrap al lado del nombre
  // (ya no como una línea de texto de la card). ms-2 = margen a la izquierda.
  const badge = document.createElement("span");
  badge.className = "badge text-bg-primary ms-2";
  badge.textContent = PLAN_LABELS[member.plan];
  title.append(badge);
  const lines = [
    `Documento: ${member.documentId}`,
    `Cuota mensual: $${member.monthlyFee}`,
  ];
  // El descuento solo aparece en la card si es mayor que 0.
  if (member.discount > 0) {
    lines.push(`Descuento: ${member.discount}%`);
  }
  body.append(title, ...lines.map(createText));
  const footer = document.createElement("div");
  footer.className = "card-footer bg-transparent";
  footer.append(createFeeEditor(member));
  card.append(body, footer);
  column.append(card);
  return column;
}

function updateList(): void {
  if (membersList && membersEmptyMsg && membersCount) {
    const members = memberList.getItems();
    membersCount.textContent = String(members.length);
    membersEmptyMsg.classList.toggle("d-none", members.length > 0);
    membersList.replaceChildren(...members.map(createCard));
  }
}

// Actualiza los totales del panel "Inicio", incluido el nuevo
// "Total con descuento" (memberList.totalDiscounted()).
function updateTotals(): void {
  if (inpTotalMembers && inpTotalFees && inpTotalDiscount) {
    inpTotalMembers.value = String(memberList.getItems().length);
    inpTotalFees.value = String(memberList.totalFees());
    inpTotalDiscount.value = String(memberList.totalDiscounted());
  }
}

// Carga los socios de ejemplo de members.json. Algunos tienen "discount" y
// otros no, por eso el tipo agrega "discount?" (opcional) y se usa
// "?? 0": si no viene en el JSON, el descuento queda en 0.
function loadMockData(): void {
  for (const data of mockMembers as (MemberData & { discount?: number })[]) {
    const member = new Member(data);
    member.discount = data.discount ?? 0;
    memberList.add(member);
  }
}

loadMockData();
updateList();
updateTotals();

if (btnAdd && inpName && inpDocument && selPlan && inpFee && inpDiscount) {
  btnAdd.addEventListener("click", () => {
    try {
      const member = new Member({
        name: inpName.value,
        documentId: inpDocument.value,
        plan: selPlan.value as Plan,
        monthlyFee: Number(inpFee.value),
      });
      // Si el campo de descuento queda vacío, el descuento es 0 (lo pide la
      // letra). Si no, se convierte a número y el setter lo valida (0 a 100).
      member.discount =
        inpDiscount.value === "" ? 0 : Number(inpDiscount.value);
      memberList.add(member);
      hideError();
      clearInputs();
      updateList();
      updateTotals();
    } catch (error) {
      showError(error instanceof Error ? error.message : String(error));
    }
  });
}
