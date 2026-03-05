import "./style.css";
import OBR from "@owlbear-rodeo/sdk";
import { setupContextMenu } from "./contextMenu";
import { createItemCard, updateCard } from "./itemCard";
import { nextTurn, previousTurn, getCombatState } from "./combatTracker";
import { METADATA_KEY } from "./types";
import type { ItemMetadata } from "./types";

const app = document.querySelector("#app") as HTMLDivElement;

app.innerHTML = `
  <h1>Olthin Tracker</h1>
  <div id="controls">
    <button id="joinInitiative" style="display:none;">Entrar na iniciativa</button>
  </div>
  <div id="itemList"></div>
  <div id="roundTracker">
    <button id="prevTurn"><</button>
    <span id="roundText">Rodada 1</span>
    <button id="nextTurn">></button>
  </div>
`;

const list = document.querySelector("#itemList") as HTMLDivElement;
const roundText = document.querySelector("#roundText") as HTMLSpanElement;
const joinButton = document.querySelector(
  "#joinInitiative"
) as HTMLButtonElement | null;

const renderedCards = new Map<string, HTMLElement>();

function sortTracked(items: any[]) {
  return items
    .filter((i) => i.metadata[METADATA_KEY])
    .sort(
      (a, b) =>
        b.metadata[METADATA_KEY].initiative -
        a.metadata[METADATA_KEY].initiative
    );
}

async function updateHighlight() {
  const state = await getCombatState();

  document.querySelectorAll(".item-card").forEach((c) =>
    c.classList.remove("active-turn")
  );

  if (!state.currentTurnId) return;

  const active = renderedCards.get(state.currentTurnId);
  active?.classList.add("active-turn");
}

async function updateRound() {
  const state = await getCombatState();
  roundText.textContent = `Rodada ${state.round}`;
}

async function syncUI(items: any[]) {
  const tracked = sortTracked(items);
  const existingIds = new Set(renderedCards.keys());

  for (let item of tracked) {
    if (!renderedCards.has(item.id)) {
      const card = createItemCard(item);
      renderedCards.set(item.id, card);
      list.appendChild(card);
    } else {
      updateCard(renderedCards.get(item.id)!, item);
    }
    
    existingIds.delete(item.id);
  }

  // remover os que saíram
  for (let id of existingIds) {
    const card = renderedCards.get(id);
    card?.remove();
    renderedCards.delete(id);
  }

  // reordenar visualmente
  tracked.forEach((item) => {
    const card = renderedCards.get(item.id)!;
    list.appendChild(card);
  });

  updateHighlight();
}

OBR.onReady(async () => {
  setupContextMenu();

  const role = await OBR.player.getRole();

  if (joinButton) {
    if (role === "PLAYER") {
      joinButton.style.display = "inline-block";
      joinButton.addEventListener("click", async () => {
        const selection = await OBR.player.getSelection();
        if (!selection || selection.length === 0) {
          return;
        }

        const playerId = await OBR.player.getId();
        const playerName = await OBR.player.getName();

        await OBR.scene.items.updateItems(selection, (items) => {
          for (const item of items) {
            const existing = item.metadata[METADATA_KEY] as
              | ItemMetadata
              | undefined;

            if (existing) {
              // Jogador assume controle da entrada existente
              existing.ownerId = playerId;
              existing.ownerName = playerName;
              continue;
            }

            const metadata: ItemMetadata = {
              initiative: 0,
              ownerId: playerId,
              ownerName: playerName,
              resources: {
                AP: { current: 5, max: 10, autoReset: true },
                PA: { current: 3, max: 6, autoReset: true },
              },
              actions: [],
            };

            item.metadata[METADATA_KEY] = metadata;
          }
        });
      });
    } else {
      joinButton.style.display = "none";
    }
  }

  document
    .querySelector("#nextTurn")!
    .addEventListener("click", async () => {
      await nextTurn();
    });

  document
    .querySelector("#prevTurn")!
    .addEventListener("click", async () => {
      await previousTurn();
    });

    const items = await OBR.scene.items.getItems();
      await syncUI(items);
      await updateRound();
      await updateHighlight();

  OBR.scene.items.onChange(syncUI);
  OBR.scene.onMetadataChange(() => {
    updateRound();
    updateHighlight();
  
  OBR.action.setHeight(600);
  OBR.action.setWidth(390);
  
  });
});