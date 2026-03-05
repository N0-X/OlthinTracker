import OBR from "@owlbear-rodeo/sdk";
import { EXTENSION_ID, METADATA_KEY, ItemMetadata } from "./types";

export function setupContextMenu() {
    OBR.contextMenu.create({
        id: `${EXTENSION_ID}/context-menu`,
        icons: [
        {
            icon: "/add.svg",
            label: "Add to Initiative",
            filter: {
            every: [
                { key: "layer", value: "CHARACTER" },
                { key: ["metadata", METADATA_KEY], value: undefined },
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
            (item) => item.metadata[METADATA_KEY] === undefined
        );

        if (add) {
            OBR.scene.items.updateItems(context.items, (items) => {
            for (let item of items) {
                const existing = item.metadata[METADATA_KEY] as ItemMetadata | undefined;
                if (existing) {
                    continue;
                }

                const metadata: ItemMetadata = {
                    initiative: 0,
                    ownerId: "GM",
                    ownerName: "GM",
                    resources: {
                        AP: { current: 5, max: 10, autoReset: true },
                        PA: { current: 3, max: 6, autoReset: true },
                    },
                    actions: [],
                };

                item.metadata[METADATA_KEY] = metadata;
            }
            });
        } else {
            OBR.scene.items.updateItems(context.items, (items) => {
            for (let item of items) {
                delete item.metadata[METADATA_KEY];
            }
            });
        }
        },
    });
}