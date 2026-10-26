import { CARD_TAG, NapMonitorCard } from "./card";

declare const __CARD_VERSION__: string;

if (!customElements.get(CARD_TAG)) customElements.define(CARD_TAG, NapMonitorCard);

(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: CARD_TAG,
  name: "Nap Monitor",
  description: "Nursery monitor: one tile per child, several sleep locations, cry awareness and night mode",
  preview: false,
});

console.info(
  `%c NAP-MONITOR-CARD %c ${__CARD_VERSION__} `,
  "color: #181b22; background: #8fd3a7; font-weight: 700",
  "color: #8fd3a7; background: #181b22",
);
