import OBR from "@owlbear-rodeo/sdk";
import { createCounterBox } from "./counterBox";
import { getCombatState } from "./combatTracker";

const ID = "com.tutorial.initiative-tracker";

export function createItemCard(item: any) {
    const container = document.createElement("div");
    container.className = "item-card";
    container.dataset.id = item.id;

    const data = item.metadata[`${ID}/metadata`];

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
    name.textContent = item.name;

    // Iniciativa
    const initInput = document.createElement("input");
    initInput.type = "number";
    initInput.className = "initiative";
    initInput.value = data.initiative;

    initInput.onchange = () => {
        OBR.scene.items.updateItems([item.id], (items) => {
            items[0].metadata[`${ID}/metadata`].initiative = Number(initInput.value);
        });
    };

    // Monta linha
    nameRow.append(name, initInput);

    // Monta coluna esquerda
    left.append(img, nameRow);

    // ===== CONTADORES =====
    const counter1 = createCounterBox(
        item.id,
        "counter1",
        "Pa",
        data.counters.counter1.current,
        data.counters.counter1.max
    );

    const counter2 = createCounterBox(
        item.id,
        "counter2",
        "Ap",
        data.counters.counter2.current,
        data.counters.counter2.max
    );

    

    right.append(counter1, counter2);

    // ===== MONTA CARD =====
    container.append(left, right);

    return container;
}