from api.models import *
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView


class RegisterBillingView(APIView):
    @swagger_auto_schema(
        operation_description="Registra um novo faturamento",
        responses={201: openapi.Response('Faturamento registrado com sucesso')},
        manual_parameters=[
            openapi.Parameter('Data', openapi.IN_QUERY, description="Data do faturamento", type=openapi.TYPE_STRING),
            openapi.Parameter('Total', openapi.IN_QUERY, description="Valor do faturamento", type=openapi.TYPE_NUMBER),
            openapi.Parameter('Pedidos', openapi.IN_QUERY, description="Lista de pedidos", type=openapi.TYPE_ARRAY, items=openapi.Items(type=openapi.TYPE_STRING)),
        ],
    )

    def post(self, request):
        pedidos = request.data.get("pedidos")

        if not pedidos:
            return Response({
                'error': 'Por favor, insira todos os campos',
            }, status=status.HTTP_400_BAD_REQUEST
            )

        new_billing = Billing(pedidos)

        try:
            insert_billing(new_billing)
        except Exception as e:
            print(e)
            return Response({
                'error': 'Erro ao registrar faturamento',
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response({
            "Faturamento registrado com sucesso"
        }, status=status.HTTP_201_CREATED
        )
    

class GetBillingView(APIView):
    @swagger_auto_schema(
        operation_description="Retorna um faturamento",
        responses={200: openapi.Response('Faturamento retornado com sucesso')},
        manual_parameters=[
            openapi.Parameter('data_inicial', openapi.IN_QUERY, description="Data inicial do intervalo no formato", type=openapi.TYPE_STRING),
            openapi.Parameter('data_final', openapi.IN_QUERY, description="Data final do intervalo", type=openapi.TYPE_STRING),
        ],
    )

    def get(self, request):
        data_inicial = request.data.get("data_inicial")
        data_final = request.data.get("data_final")

        if not data_inicial or not data_final:
            return Response({
                'error': 'Por favor, insira todos os campos',
            }, status=status.HTTP_400_BAD_REQUEST
            )

        data_final = datetime.strptime(data_final, "%Y-%m-%d")
        data_inicial = datetime.strptime(data_inicial, "%Y-%m-%d")
        billing = get_billing_date_interval("2025-02-08", data_final)

        if not billing:
            return Response({
                'error': 'Faturamento não encontrado',
            }, status=status.HTTP_404_NOT_FOUND
            )

        return Response({
            "Faturamento": billing
        }, status=status.HTTP_200_OK
        )