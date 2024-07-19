export function toNormalizedJsonString(payload: object) {
  // GitHub sends its JSON with an indentation of 2 spaces and a line break at the end
  const payloadString = JSON.stringify(payload, null, 2) + "\n";
  return payloadString.replace(/[^\\]\\u[\da-f]{4}/g, (s) => {
    return s.substr(0, 3) + s.substr(3).toUpperCase();
  });
}
