import { createItemCard } from "./itemCard";

const ID = "com.tutorial.initiative-tracker";

export async function renderList(items: any[]) {
    const list = document.querySelector("#itemList") as HTMLDivElement;
    list.innerHTML = "";

    const tracked = items
        .filter((i) => i.metadata[`${ID}/metadata`])
        .sort(
        (a, b) =>
            b.metadata[`${ID}/metadata`].initiative -
            a.metadata[`${ID}/metadata`].initiative
        );

    for (let item of tracked) {
        const card = await createItemCard(item);
        list.appendChild(card);
    }
}