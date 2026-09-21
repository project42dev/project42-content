function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function inspectResponse(response) {
  if (!isRecord(response) || !Array.isArray(response.output)) {
    return { malformed: true, output: [], text: "", functionItems: [] };
  }

  let malformed = false;
  let text = "";
  const functionItems = [];

  for (const item of response.output) {
    if (!isRecord(item) || typeof item.type !== "string") {
      malformed = true;
      continue;
    }

    if (item.type === "message") {
      if (!Array.isArray(item.content)) {
        malformed = true;
        continue;
      }
      for (const part of item.content) {
        if (!isRecord(part) || typeof part.type !== "string") {
          malformed = true;
          continue;
        }
        if (part.type === "output_text") {
          if (typeof part.text !== "string") malformed = true;
          else text += part.text;
        } else if (part.type === "refusal" && typeof part.refusal !== "string") {
          malformed = true;
        }
      }
    } else if (item.type === "function_call") {
      functionItems.push(item);
      if (typeof item.call_id !== "string" || item.call_id.length === 0 ||
          typeof item.name !== "string" || item.name.length === 0 ||
          typeof item.arguments !== "string") {
        malformed = true;
      }
    }
  }

  return { malformed, output: response.output, text, functionItems };
}

function hasRefusal(output) {
  return output.some((item) =>
    isRecord(item) && item.type === "message" && Array.isArray(item.content) &&
    item.content.some((part) => isRecord(part) && part.type === "refusal")
  );
}

function hasMessage(output) {
  return output.some((item) => isRecord(item) && item.type === "message");
}

export function adaptOpenAIResponse(response, model = "fixture-model") {
  const inspected = inspectResponse(response);
  const status = isRecord(response) && typeof response.status === "string"
    ? response.status
    : null;
  const reason = isRecord(response?.incomplete_details) &&
    typeof response.incomplete_details.reason === "string"
    ? response.incomplete_details.reason
    : null;
  const rawStop = reason ?? status;

  let outcome = "other";
  let toolCalls = [];

  if (inspected.malformed) {
    outcome = "other";
  } else if (status === "incomplete") {
    outcome = reason === "max_output_tokens" ? "truncated" : "other";
  } else if (status === "completed" && inspected.functionItems.length > 0) {
    outcome = "tool_request";
    toolCalls = inspected.functionItems.map((item) => ({
      id: item.call_id,
      name: item.name,
      args: item.arguments
    }));
  } else if (status === "completed" && hasRefusal(inspected.output)) {
    outcome = "refused";
  } else if (status === "completed" && hasMessage(inspected.output)) {
    outcome = "complete";
  }

  return {
    provider: "openai",
    surface: "responses",
    model,
    outcome,
    text: inspected.text,
    toolCalls,
    rawStop,
    rawUsage: isRecord(response?.usage) ? response.usage : {}
  };
}
