from api.models import *
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from pele_dourada.settings import SECRET_KEY

class RegisterClientView(APIView):
    @swagger_auto_schema(
        operation_description="Registra um novo cliente",
        responses={201: openapi.Response('Cliente registrado com sucesso')},
        manual_parameters=[
            openapi.Parameter('name', openapi.IN_QUERY, description="Nome do cliente", type=openapi.TYPE_STRING),
            openapi.Parameter('number', openapi.IN_QUERY, description="Número de telefone do cliente", type=openapi.TYPE_STRING),
            openapi.Parameter('endereco', openapi.IN_QUERY, description="Endereço do cliente", type=openapi.TYPE_STRING),
        ]
    )

    def post(self, request):
        name = request.data.get("name"),
        number = request.data.get("number"),
        endereco = request.data.get("endereco"),

        if not name or not number or not endereco:
            return Response({
                'error': 'Por favor, insira todos os campos',
            }, status=status.HTTP_400_BAD_REQUEST
            )
        
        new_client = Client(name, number, endereco)

        try:
            insert_doc(client_collection, new_client)
        except Exception as e:
            return Response({
                'error': 'Erro ao registrar cliente',
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        return Response({
            "Cliente registrado com sucesso"
        }, status=status.HTTP_201_CREATED
        )
    
class UpdateClientView(APIView):
    @swagger_auto_schema(
        operation_description="Atualiza um cliente",
        responses={200: openapi.Response('Cliente atualizado com sucesso')},
        manual_parameters=[
            openapi.Parameter('name', openapi.IN_QUERY, description="Nome do cliente", type=openapi.TYPE_STRING),
            openapi.Parameter('number', openapi.IN_QUERY, description="Número do cliente", type=openapi.TYPE_NUMBER),
            openapi.Parameter('endereco', openapi.IN_QUERY, description="Endereço do cliente", type=openapi.TYPE_INTEGER),
        ],
    )
    
    def post(self, request):
        name = request.data.get("name")
        number = request.data.get("number")
        endereco = request.data.get("endereco")

        if not name or not number or not endereco:
            return Response({
                'error': 'Por favor, insira todos os campos',
            }, status=status.HTTP_400_BAD_REQUEST
            )
        
        client = get_client(Client(name, number, endereco))

        if not client:
            return Response({
                'error': 'Cliente não encontrado',
            }, status=status.HTTP_404_NOT_FOUND
            )
        
        try:
            update_product(name, new_number=number, new_endereco=endereco)
        except Exception as e:
            return Response({
                'error': 'Erro ao atualizar cliente',
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        return Response({
            'Cliente atualizado com sucesso',
        }, status=status.HTTP_200_OK
        )

class DeleteClientView(APIView):
    def post(self, request):
        name = request.data.get("name")

        if not name:
            return Response({
                'error': 'Por favor, insira o nome do cliente',
            }, status=status.HTTP_400_BAD_REQUEST
            )

        client = client(name, 0, 0)

        client = get_client(client)

        if not client:
            return Response({
                'error': 'Cliente não encontrado',
            }, status=status.HTTP_404_NOT_FOUND
            )
        
        try:
            delete_client(client)
        except Exception as e:
            print(e)
            return Response({
                'error': 'Erro ao deletar cliente',
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response({
            'Cliente deletado com sucesso',
        }, status=status.HTTP_200_OK
        )
    
class GetClientView(APIView):
    def get(self, request):
        name = request.data.get("name"),
        number = request.data.get("number")

        if not name and not number:
            return Response({
                'error': 'Por favor, insira o nome ou número do cliente',
            }, status=status.HTTP_400_BAD_REQUEST
            )
        
        client = get_client(Client(name, number, 0))

        if not client:
            return Response({
                'error': 'Cliente não encontrado',
            }, status=status.HTTP_404_NOT_FOUND
            )
        
        return Response({
            'name': client.name,
            'number': client.number,
            'endereco': client.endereco,    
        }, status=status.HTTP_200_OK
        )