import OBR from "@owlbear-rodeo/sdk";

const ID = "com.tutorial.initiative-tracker";

export function createCounterBox(
  itemId: string,
  key: "counter1" | "counter2",
  label: string,
  current: number,
  max: number
) {
  const container = document.createElement("div");

  container.innerHTML = `
    <div class="counterback">
      <strong>${label}</strong><br/>
      <button class="minus">-</button>
      <input class="current" type="number" value="${current}" />
      /
      <input class="max" type="number" value="${max}" />
      <button class="plus">+</button>
    </div>
    `;

  const minus = container.querySelector(".minus") as HTMLButtonElement;
  const plus = container.querySelector(".plus") as HTMLButtonElement;
  const currentInput = container.querySelector(".current") as HTMLInputElement;
  const maxInput = container.querySelector(".max") as HTMLInputElement;

  function update(newCurrent: number, newMax: number) {
    OBR.scene.items.updateItems([itemId], (items) => {
      const data = items[0].metadata[`${ID}/metadata`];
      data.counters[key].current = newCurrent;
      data.counters[key].max = newMax;
    });
  }

  minus.onclick = () => {
    let val = Number(currentInput.value);
    if (val > 0) {
      val--;
      currentInput.value = String(val);
      update(val, Number(maxInput.value));
    }
  };

  plus.onclick = () => {
    let val = Number(currentInput.value);
    const maxVal = Number(maxInput.value);
    if (val < maxVal) {
      val++;
      currentInput.value = String(val);
      update(val, maxVal);
    }
  };

  currentInput.onchange = () =>
    update(Number(currentInput.value), Number(maxInput.value));

  maxInput.onchange = () =>
    update(Number(currentInput.value), Number(maxInput.value));

  return container;
}