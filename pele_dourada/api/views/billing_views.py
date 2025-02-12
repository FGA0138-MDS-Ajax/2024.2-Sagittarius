import csv

from api.models import *
from django.http import HttpResponse
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
            openapi.Parameter('data_inicial', openapi.IN_QUERY, description="Data inicial do intervalo no formato 'Ano-Mês-Dia", type=openapi.TYPE_STRING),
            openapi.Parameter('data_final', openapi.IN_QUERY, description="Data final do intervalo no formato 'Ano-Mês-Dia", type=openapi.TYPE_STRING),
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
        
        data_inicial = data_inicial.replace("-", "")
        data_final = data_final.replace("-", "")

        data_inicial = int(data_inicial)
        data_final = int(data_final)

        billings = get_billing_date_interval(data_inicial, data_final)

        if not billings:
            return Response({
                'error': 'Faturamento não encontrado',
            }, status=status.HTTP_404_NOT_FOUND
            )

        return Response({
            "Faturamento": billings
        }, status=status.HTTP_200_OK
        )
    

class GenerateBillingReportView(APIView):
    @swagger_auto_schema(
        operation_description="Gera um relatório de faturamento",
        responses={200: openapi.Response('Relatório gerado com sucesso')},
        manual_parameters=[
            openapi.Parameter('data_inicial', openapi.IN_QUERY, description="Data inicial do intervalo no formato", type=openapi.TYPE_STRING),
            openapi.Parameter('data_final', openapi.IN_QUERY, description="Data final do intervalo", type=openapi.TYPE_STRING),
        ],
    )

    def post(self, request):
        data_inicial = request.data.get("data_inicial")
        data_final = request.data.get("data_final")

        if not data_inicial or not data_final:
            return Response({
                'error': 'Por favor, insira todos os campos',
            }, status=status.HTTP_400_BAD_REQUEST
            )
        
        billings = get_billing_date_interval(data_inicial, data_final)
        
        if not billings:
            return Response({
                'error': 'Faturamentos não encontrados no intervalo',
            }, status=status.HTTP_404_NOT_FOUND
            )

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="faturamento_{data_inicial.strftime("%Y%m%d")}_{data_final.strftime("%Y%m%d")}.csv"'

        writer = csv.writer(response)

        writer.writerow(['date', 'orders', 'total'])

        for billing in billings:
            writer.writerow([billing['date'], billing['orders'], f'R${billing['total']:.2f}'.replace('.', ',')])

        return response