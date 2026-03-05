import OBR from "@owlbear-rodeo/sdk";
import { createCounterBox } from "./counterBox";
import { METADATA_KEY } from "./types";
import type { ItemMetadata } from "./types";

export function updateCard(card: HTMLElement, item: any) {
    const nameEl = card.querySelector(".card-name") as HTMLDivElement;
    nameEl.textContent = item.text?.plainText || item.name;
}

export function createItemCard(item: any) {
    const container = document.createElement("div");
    container.className = "item-card";
    container.dataset.id = item.id;

    const data = item.metadata[METADATA_KEY] as ItemMetadata;

    // ===== CRIANDO AS COLUNAS =====

    const left = document.createElement("div");
    left.className = "card-left";

    const right = document.createElement("div");
    right.className = "card-right";

    // ===== FOTO =====
    const img = document.createElement("img");
    img.src = item.image?.url ?? "";
    img.className = "item-image";

    // Linha nome + iniciativa
    const nameRow = document.createElement("div");
    nameRow.className = "name-row";

    // Nome
    const name = document.createElement("div");
    name.className = "card-name";
    name.textContent = item.text?.plainText || item.name;

    // Iniciativa
    const initInput = document.createElement("input");
    initInput.type = "number";
    initInput.className = "initiative";
  initInput.value = String(data.initiative);

    initInput.onchange = () => {
        OBR.scene.items.updateItems([item.id], (items) => {
          const meta = items[0].metadata[METADATA_KEY] as ItemMetadata;
          meta.initiative = Number(initInput.value);
        });
    };

    // Monta linha
    nameRow.append(name, initInput);

    // Monta coluna esquerda
    left.append(img, nameRow);

    // ===== CONTADORES =====
    const counterAP = createCounterBox(
        item.id,
        "AP",
        "Pa",
        data.resources.AP.current,
        data.resources.AP.max
    );

    const counterPA = createCounterBox(
        item.id,
        "PA",
        "Ap",
        data.resources.PA.current,
        data.resources.PA.max
    );

    

    right.append(counterAP, counterPA);

    // ===== MONTA CARD =====
    container.append(left, right);

    return container;
}