export const healthTypes = [
  { value: "greutate", label: "Greutate", unit: "kg" },
  { value: "puls", label: "Puls", unit: "bpm" },
  { value: "tensiune", label: "Tensiune", unit: "mmHg" },
  { value: "glicemie", label: "Glicemie", unit: "mg/dL" },
  { value: "temperatura", label: "Temperatură", unit: "°C" },
  { value: "pasi", label: "Pași", unit: "pași" },
  { value: "somn", label: "Somn", unit: "ore" },
];

export function getUnitForType(type: string) {
  return healthTypes.find((item) => item.value === type)?.unit ?? "";
}

export function getLabelForType(type: string) {
  return healthTypes.find((item) => item.value === type)?.label ?? type;
}
