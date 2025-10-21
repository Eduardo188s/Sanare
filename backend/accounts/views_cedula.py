from rest_framework.decorators import api_view
from rest_framework.response import Response
import json, os
from django.conf import settings

@api_view(["GET"])
def validar_cedula(request, cedula):
    mock_path = os.path.join(settings.BASE_DIR, "mock_cedulas.json")

    if not os.path.exists(mock_path):
        return Response({"valid": False, "error": "Archivo de cédulas no encontrado."}, status=500)

    try:
        with open(mock_path, "r", encoding="utf-8") as f:
            data = json.load(f)
    except Exception as e:
        return Response({"valid": False, "error": str(e)}, status=500)

    cedula_encontrada = next((c for c in data if str(c["cedula"]) == str(cedula)), None)

    if not cedula_encontrada:
        return Response({"valid": False, "error": "Cédula no encontrada."}, status=404)

    return Response({
        "valid": True,
        "nombre": cedula_encontrada["nombre"],
        "especialidad": cedula_encontrada["especialidad"],
        "sexo": cedula_encontrada["sexo"]
    })
