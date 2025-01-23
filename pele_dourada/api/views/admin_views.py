from datetime import datetime, timedelta

import bcrypt
import jwt
from api.models import *
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from pele_dourada.settings import SECRET_KEY


# Create your views here.
class LoginView(APIView):
    @swagger_auto_schema(
        operation_description="Realiza login de usuário",
        responses={200: openapi.Response('Token de autenticação', openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'token': openapi.Schema(type=openapi.TYPE_STRING)
            }
        ))},
        manual_parameters=[
            openapi.Parameter('username', openapi.IN_QUERY, description="Nome de usuário", type=openapi.TYPE_STRING),
            openapi.Parameter('password', openapi.IN_QUERY, description="Senha do usuário", type=openapi.TYPE_STRING),
        ],
    )

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
       
        if not username or not password:
            return Response({
                'error': 'Por favor, insira nome de usuário e senha',
            }, status=status.HTTP_400_BAD_REQUEST
            )

        new_user = User(username, password)

        user = get_user(new_user.username)

        if not user:
            return Response({
                'error': 'Usuário não encontrado',
            }, status=status.HTTP_404_NOT_FOUND
            )
        
        if not bcrypt.checkpw(password.encode('utf-8'), user['password']):
            return Response({
                'error': 'Senha inválida',
            }, status=status.HTTP_400_BAD_REQUEST
            )

        payload = {
            'id': str(user['_id']),
            'username': username,
            'exp': datetime.now() + timedelta(days=1),
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')


        return Response({'token': token}, status=status.HTTP_200_OK)


class RegisterView(APIView):
    @swagger_auto_schema(
        operation_description="Cria um novo usuário",
        responses={201: openapi.Response('Usuário criado com sucesso', openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'success': openapi.Schema(type=openapi.TYPE_STRING),
                'user_id': openapi.Schema(type=openapi.TYPE_STRING)
            }
        ))},
        manual_parameters=[
            openapi.Parameter('username', openapi.IN_QUERY, description="Nome de usuário", type=openapi.TYPE_STRING),
            openapi.Parameter('password', openapi.IN_QUERY, description="Senha do usuário", type=openapi.TYPE_STRING),
            openapi.Parameter('password2', openapi.IN_QUERY, description="Confirmação de senha", type=openapi.TYPE_STRING),
        ],
    )   

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        password2 = request.data.get("password2")
        
        # if password != password2:
        #     return Response({
        #         'error': 'As senhas não coincidem',
        #     }, status=status.HTTP_400_BAD_REQUEST
        #     )
        
        hash_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        
        if user_collection.find_one({"username": username}):
            return Response({
                'error': 'Nome de usuário já existe',
            }, status=status.HTTP_400_BAD_REQUEST
            )

        user_body = {
            'username': username,
            'password': hash_password
        }


        try:
            user = user_collection.insert_one(user_body)
        except:
            return Response({
                'error': 'Erro ao criar usuário',
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        return Response({
            'success': 'Usuário criado com sucesso',
            'user_id': str(user.inserted_id),
        }, status=status.HTTP_201_CREATED
        )


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    
    @swagger_auto_schema(
        operation_description="Realiza logout de usuário",
        responses={200: openapi.Response('Logout realizado com sucesso', openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'success': openapi.Schema(type=openapi.TYPE_STRING)
            }
        ))},
    )

    def post(self, request):
        request.user.auth_token.delete()
        return Response({
            'success': 'Logout realizado com sucesso',
        }, status=status.HTTP_200_OK
        )


class UpdatePasswordView(APIView):
    @swagger_auto_schema(
        operation_description="Atualiza a senha do usuário",
        responses={200: openapi.Response('Senha atualizada com sucesso', openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'success': openapi.Schema(type=openapi.TYPE_STRING)
            }
        ))},
        manual_parameters=[
            openapi.Parameter('old_password', openapi.IN_QUERY, description="Senha antiga do usuário", type=openapi.TYPE_STRING),
            openapi.Parameter('new_password', openapi.IN_QUERY, description="Nova senha do usuário", type=openapi.TYPE_STRING),
            openapi.Parameter('new_password2', openapi.IN_QUERY, description="Confirmação da nova senha", type=openapi.TYPE_STRING),
        ],
    )

    def post(self, request):
        user = request.user
        username = request.data.get("username")
        old_password = request.data.get("password")
        new_password = request.data.get("confirmPassword")

        if old_password != new_password:
            return Response({
                'error': 'As senhas não coincidem',
            }, status=status.HTTP_400_BAD_REQUEST
            )

        # if not bcrypt.checkpw(old_password.encode('utf-8'), user.password.encode('utf-8')):
        #     return Response({
        #         'error': 'Senha antiga inválida',
        #     }, status=status.HTTP_400_BAD_REQUEST
        #     )

        hash_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())
        try:
            update_user(username, new_pwd=hash_password)
        except Exception as e:
            print(e)
            return Response({
                'error': 'Erro ao atualizar senha',
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        

        return Response({
            'success': 'Senha atualizada com sucesso',
        }, status=status.HTTP_200_OK
        )