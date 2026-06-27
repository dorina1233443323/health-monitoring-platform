interface Measurement {
  type: string;
  value: number;
  unit: string;
}

export function getMeasurementAlert(measurement: Measurement) {
  if (measurement.type === "puls" && measurement.value > 100) {
    return "Puls ridicat";
  }

  if (measurement.type === "temperatura" && measurement.value >= 38) {
    return "Temperatură ridicată";
  }

  if (measurement.type === "glicemie" && measurement.value > 140) {
    return "Glicemie ridicată";
  }

  if (measurement.type === "glicemie" && measurement.value < 70) {
    return "Glicemie scăzută";
  }

  if (measurement.type === "tensiune" && measurement.value > 140) {
    return "Tensiune ridicată";
  }

  return null;
}

export function getBmiAlert(bmi: number | null) {
  if (!bmi) return null;
  if (bmi < 18.5) return "IMC sub limita normală";
  if (bmi >= 30) return "IMC ridicat";

  return null;
}
