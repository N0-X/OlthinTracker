import OBR from "@owlbear-rodeo/sdk";

const ID = "com.tutorial.initiative-tracker";

export function setupContextMenu() {
    OBR.contextMenu.create({
        id: `${ID}/context-menu`,
        icons: [
        {
            icon: "/add.svg",
            label: "Add to Initiative",
            filter: {
            every: [
                { key: "layer", value: "CHARACTER" },
                { key: ["metadata", `${ID}/metadata`], value: undefined },
            ],
            },
        },
        {
            icon: "/remove.svg",
            label: "Remove from Initiative",
            filter: {
            every: [{ key: "layer", value: "CHARACTER" }],
            },
        },
        ],
        onClick(context) {
        const add = context.items.every(
            (item) => item.metadata[`${ID}/metadata`] === undefined
        );

        if (add) {
            OBR.scene.items.updateItems(context.items, (items) => {
            for (let item of items) {
                item.metadata[`${ID}/metadata`] = {
                initiative: 0,
                counters: {
                    counter1: { current: 5, max: 10 },
                    counter2: { current: 3, max: 6 },
                },
                };
            }
            });
        } else {
            OBR.scene.items.updateItems(context.items, (items) => {
            for (let item of items) {
                delete item.metadata[`${ID}/metadata`];
            }
            });
        }
        },
    });
}