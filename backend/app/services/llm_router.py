from app.services.llm_local import generate_local_response
from app.services.llm_groq import generate_groq_response

def route_request(req):
    if req.provider == "groq":
        return generate_groq_response(req)
    return generate_local_response(req)