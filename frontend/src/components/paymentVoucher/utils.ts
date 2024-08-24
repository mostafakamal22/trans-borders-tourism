export function formatID(id: number): string {
  const idString = id.toString();

  // Ensure the ID is at least 5 digits long by padding with zeros
  const paddedID = idString.padStart(5, "0");

  return paddedID;
}
