from django.utils.deprecation import MiddlewareMixin
from django.http import JsonResponse
from bson.objectid import ObjectId
from pele_dourada.settings import SECRET_KEY
import jwt

class JwtAuthentication(MiddlewareMixin):
    public_routes = ["/api/login/", "/api/register/", "/swagger/", "/redoc/", "/admin/", "/api/updatepwd/"]
    
    def process_request(self, request):
        print(request.path)
        # Ignorar rotas públicas
        if request.path in self.public_routes:
            return None
        
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return JsonResponse({"error": "Token não fornecido"}, status=401)
        
        try:
            token = auth_header.split(' ')[1]
            payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            user_id = payload['id']

            user = users_collection.find_one({"_id": ObjectId(user_id)})
            if not user:
                return JsonResponse({"error": "Usuário não encontrado"}, status=404)
            
            request.user = user

        except jwt.ExpiredSignatureError:
            return JsonResponse({"error": "Token expirado"}, status=401)
        except jwt.InvalidTokenError:
            return JsonResponse({"error": "Token inválido"}, status=401)