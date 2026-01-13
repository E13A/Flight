from typing import Dict, Any


def map_event(contract_name: str, decoded_event: Dict[str, Any]) -> Dict[str, Any]:
    """
    Map a generic decoded event to a JSON-serializable payload.
    If later you want domain-specific tables, you can switch here based on
    (contract_name, event_name).
    """
    event_name = decoded_event["event"]
    args = decoded_event["args"]

    payload = {
        "event_name": event_name,
        "args": {},
    }

    # Convert all args to plain Python / str
    for k, v in args.items():
        if hasattr(v, "hex"):
            payload["args"][k] = v.hex()
        else:
            try:
                payload["args"][k] = int(v)
            except (TypeError, ValueError):
                payload["args"][k] = str(v)

    return payload
