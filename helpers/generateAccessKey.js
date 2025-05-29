const generateAccessKey = (sequential, location, business) => {
  if (!business || !location) {
    throw new Error("Business or Location not found");
  }

  // Generate 8 random digits (1-9)
  const randomDigits = Array.from(
    { length: 8 },
    () => Math.floor(Math.random() * 9) + 1
  ).join("");

  // Format date as ddMMyyyy
  const today = new Date();
  const issueDate = `${String(today.getDate()).padStart(2, "0")}${String(
    today.getMonth() + 1
  ).padStart(2, "0")}${today.getFullYear()}`;

  // Extract data
  const taxId = business.taxId;
  const environmentType = business.environmentType.value || "1"; // assuming 'value' stores 1 or 2
  const establishmentCode = location.code;
  const emissionPoint = location.emissionPoint;
  const documentTypeCode = "01"; // usually "01" for invoice

  // Build the access key (without check digit)
  const rawKey =
    issueDate +
    documentTypeCode +
    taxId +
    environmentType +
    establishmentCode +
    emissionPoint +
    sequential +
    randomDigits +
    "1";

  // Compute check digit (modulo 11 algorithm)
  let sum = 0;
  let factor = 2;
  for (let i = rawKey.length - 1; i >= 0; i--) {
    sum += parseInt(rawKey[i]) * factor;
    factor = factor === 7 ? 2 : factor + 1;
  }

  let checkDigit = 11 - (sum % 11);
  if (checkDigit === 11) checkDigit = 0;
  if (checkDigit === 10) checkDigit = 1;

  const accessKey = rawKey + checkDigit;
  return accessKey;
};

module.exports = {
  generateAccessKey,
};