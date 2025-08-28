export function decodeFareRule(fareRule) {
  const ruleParts = fareRule.split("|");
  const decodedRule = {
    "CANCEL-BEF": [],
    "CHANGE-BEF": [],
    EMTFee: 0,
  };

  for (const part of ruleParts) {
    const [ruleType, ruleValue] = part.split(" ");
    if (ruleType.startsWith("EMTFee")) {
      const [ruleValue1] = ruleType.split("-");
      decodedRule["EMTFee"] = parseInt(ruleValue1) || 0;
    } else if (ruleType === "CAN-BEF" || ruleType === "CHANGE-BEF") {
      const [hours, charge] = ruleValue.split(":");
      const key = ruleType === "CAN-BEF" ? "CANCEL-BEF" : "CHANGE-BEF";

      const message = getMessage(hours, charge);
      decodedRule[key].push({
        charge: parseInt(charge) || 0,
        message,
      });
    }
  }

  return decodedRule;
}

function getMessage(hours, charge) {
  // Customize the messages based on your requirements
  const [part1, part2] = hours.split("_");
  if (part1.length > 2) {
    return `Before ${part2} hours of departure`;
  } else if (part1.length <= 2) {
    return `Within ${part1} hours & before ${part2} hours of departure`;
  }
}
