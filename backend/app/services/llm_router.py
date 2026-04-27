from app.services.llm_local import generate_local_response
from app.services.llm_groq import generate_groq_response
from app.services.llm_custom import generate_custom_response
from app.core.database import settings_col


async def route_request(req):
    settings = await settings_col.find_one({"id": "global"})

    fallback_enabled = settings.get("fallback_enabled", True) if settings else True

    # 🔥 mapa de providers
    providers_map = {
        "groq": generate_groq_response,
        "local": generate_local_response,
        "custom": generate_custom_response,
    }

    primary = req.provider

    # 🔥 orden de fallback
    fallback_order = ["groq", "local", "custom"]

    # 🔥 construimos lista de intentos
    providers_to_try = [primary]

    if fallback_enabled:
        for p in fallback_order:
            if p != primary:
                providers_to_try.append(p)

    last_error = None
    
    custom_configured = (
        settings.get("custom_api_url") and
        settings.get("custom_model")
    ) if settings else False
    
    for provider in providers_to_try:
        if provider == "custom" and not custom_configured:
            print("Skipping custom provider (not configured)")
            continue

        try:
            print(f"Trying provider: {provider}")

            result = await providers_map[provider](req)

            # 🔥 AQUÍ ESTÁ LA MAGIA
            result["provider_used"] = provider
            result["fallback"] = (provider != primary)

            return result

        except Exception as e:
            print(f"Provider {provider} failed:", str(e))
            last_error = e
            continue

    # ❌ si todos fallan
    raise Exception(f"All providers failed. Last error: {str(last_error)}")