export const EXTENSION_ID = "com.olthin.initiative-tracker";

export const METADATA_KEY = `${EXTENSION_ID}/metadata`;

export type ResourceId = "AP" | "PA";

export interface ResourceData {
  current: number;
  max: number;
  autoReset: boolean;
}

export interface ActionCostDelta {
  resourceId: ResourceId;
  amount: number; // negativo = gasto
}

export interface ActionCostOption {
  id: string;
  label: string;
  deltas: ActionCostDelta[];
}

export interface ActionDefinition {
  id: string;
  label: string;
  costOptions: ActionCostOption[];
}

export interface ItemMetadata {
  initiative: number;
  ownerId: string;
  ownerName?: string;
  resources: Record<ResourceId, ResourceData>;
  actions: ActionDefinition[];
}

