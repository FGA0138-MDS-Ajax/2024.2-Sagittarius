import jwt
from api.models import user_collection
from bson.objectid import ObjectId
from django.http import JsonResponse
from django.utils.deprecation import MiddlewareMixin

from pele_dourada.settings import SECRET_KEY


class JwtAuthentication(MiddlewareMixin):
    public_routes = ["/api/login/", "/api/register/", "/swagger/", "/redoc/", "/admin/", "/api/updatepwd/",
                     "/api/product/register/", "/api/product/update/", "/api/products", "/api/products/", "/api/product/delete/",
                     "/api/product/update", "/api/order/register/", "/api/order/update/", "/api/order/delete/", "/api/order/update",
                     "/swagger", "/redoc", "/api/client/register/", "/api/client/update/", "/api/client/delete/", "/api/client/get/",
                     "/api/billing/register/", "/api/billing/update/", "/api/billing/delete/", "/api/billing/update", "/api/billing/get/",
                     "/api/orders/"]
    
    def process_request(self, request):
        print(request.path)
        # Ignorar rotas públicas
        if request.path in self.public_routes:
            return None
        
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return JsonResponse({"error": "Token não fornecido"}, status=401)
        
        try:
            token = auth_header
            payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            user_id = payload['id']

            user = user_collection.find_one({"_id": ObjectId(user_id)})
            if not user:
                return JsonResponse({"error": "Usuário não encontrado"}, status=404)
            
            request.user = user

        except jwt.ExpiredSignatureError:
            return JsonResponse({"error": "Token expirado"}, status=401)
        except jwt.InvalidTokenError:
            return JsonResponse({"error": "Token inválido"}, status=401)