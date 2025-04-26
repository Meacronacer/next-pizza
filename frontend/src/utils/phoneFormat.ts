export const formatPhoneNumber = (value: string) => {
  const numbers = value.replace(/\D/g, "");
  let formatted = "+380";

  if (numbers.length > 3) {
    formatted += ` (${numbers.slice(3, 5)}`;
  }
  if (numbers.length > 5) {
    formatted += `) ${numbers.slice(5, 8)}`;
  }
  if (numbers.length > 8) {
    formatted += ` ${numbers.slice(8, 10)}`;
  }
  if (numbers.length > 10) {
    formatted += ` ${numbers.slice(10, 12)}`;
  }

  return formatted;
};
