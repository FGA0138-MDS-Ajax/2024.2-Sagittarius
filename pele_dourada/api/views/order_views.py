from api.models import *
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from pele_dourada.settings import SECRET_KEY


class RegisterOrderView(APIView):
    @swagger_auto_schema(
        operation_description="Registra um novo pedido",
        responses={201: openapi.Response('Pedido registrado com sucesso!')},
        manual_parameters=[
            openapi.Parameter('name', openapi.IN_QUERY, description="ID do cliente", type=openapi.TYPE_STRING),
            openapi.Parameter('tipe', openapi.IN_QUERY, description="Tipo de pedido", type=openapi.TYPE_STRING),
            openapi.Parameter('payment', openapi.IN_QUERY, description="Forma de pagamento", type=openapi.TYPE_STRING),
            openapi.Parameter('products', openapi.IN_QUERY, description="Lista de produtos", type=openapi.TYPE_ARRAY, items=openapi.Items(type=openapi.TYPE_STRING)),
            openapi.Parameter('total_price', openapi.IN_QUERY, description="Preço total do pedido", type=openapi.TYPE_NUMBER),
        ]
    )

    def post(self, request):
        name = request.data.get("name")
        tipe = request.data.get("tipe")
        payment = request.data.get("payment")
        products = request.data.get("products")

        if not name or not products or not tipe or not payment:
            return Response({
                'error': 'Por favor, insira todos os campos',
            }, status=status.HTTP_400_BAD_REQUEST
            )

        new_order = Order(products, name, tipe, payment)

        try:
            insert_order(new_order)
        except Exception as e:
            print(e)
            return Response({
                'error': 'Erro ao registrar pedido',
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response({
            "Pedido registrado com sucesso"
        }, status=status.HTTP_201_CREATED
        )
    

class DeleteOrderView(APIView):
    @swagger_auto_schema(
        operation_description="Deleta um pedido",
        responses={200: openapi.Response('Pedido deletado com sucesso!')},
        manual_parameters=[
            openapi.Parameter('order_id', openapi.IN_QUERY, description="ID do pedido", type=openapi.TYPE_STRING),
        ]
    )

    def delete(self, request):
        number = request.data.get("number")

        if not number:
            return Response({
                'error': 'Por favor, insira o ID do pedido',
            }, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            delete_order(number)
        except Exception as e:
            return Response({
                'error': 'Erro ao deletar pedido',
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response({
            "Pedido deletado com sucesso"
        }, status=status.HTTP_200_OK
        )


class UpdateOrderView(APIView):
    @swagger_auto_schema(
        operation_description="Atualiza um pedido",
        responses={200: openapi.Response('Pedido atualizado com sucesso')},
        manual_parameters=[
            openapi.Parameter('number', openapi.IN_QUERY, description="ID do pedido", type=openapi.TYPE_STRING),
            openapi.Parameter('index', openapi.IN_QUERY, description="Índice do produto", type=openapi.TYPE_INTEGER),
            openapi.Parameter('new_product', openapi.IN_QUERY, description="Nome do produto", type=openapi.TYPE_STRING),
            openapi.Parameter('new_price', openapi.IN_QUERY, description="Preço do produto", type=openapi.TYPE_NUMBER),
            openapi.Parameter('new_qtd', openapi.IN_QUERY, description="Quantidade do produto", type=openapi.TYPE_INTEGER),
            openapi.Parameter('new_name', openapi.IN_QUERY, description="ID do cliente", type=openapi.TYPE_STRING),
            openapi.Parameter('new_tipe', openapi.IN_QUERY, description="Tipo de pedido", type=openapi.TYPE_STRING),
            openapi.Parameter('new_payment', openapi.IN_QUERY, description="Forma de pagamento", type=openapi.TYPE_STRING),
            openapi.Parameter('new_confirm', openapi.IN_QUERY, description="Status do pedido", type=openapi.TYPE_STRING),
        ],
    )

    def put(self, request):
        number = request.data.get("number")
        index = request.data.get("index")
        new_product = request.data.get("new_product")
        new_price = request.data.get("new_price")
        new_qtd = request.data.get("new_qtd")
        new_name = request.data.get("new_name")
        new_tipe = request.data.get("new_tipe")
        new_payment = request.data.get("new_payment")
        new_confirm = request.data.get("new_confirm")

        if not number:
            return Response({
                'error': 'Por favor, insira o ID do pedido',
            }, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            update_order(number, index=index, new_product=new_product, new_price=new_price, new_qtd=new_qtd, new_name=new_name, new_tipe=new_tipe, new_payment=new_payment, new_confirm=new_confirm)
        except Exception as e:
            return Response({
                'error': 'Erro ao atualizar pedido',
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response({
            'Pedido atualizado com sucesso',
        }, status=status.HTTP_200_OK
        )
    

class ListOrdersView(APIView):
    @swagger_auto_schema(
        operation_description="Lista todos os pedidos",
        responses={200: openapi.Response('Pedidos listados com sucesso')},
    )

    def get(self, request):
        orders = []
        
        try:
            orders_list = get_all_orders()
        except Exception as e:
            print(e)
            return Response({
                'error': 'Erro ao listar pedidos',
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        for order in orders_list:
            orders.append({
                'number': order['number'],
                'products': order['products'],
                'name': order['name'],
                'tipe': order['tipe'],
                'payment': order['payment'],
                'confirm': order['confirm']
            })

        return Response({
            'orders': orders
        }, status=status.HTTP_200_OK
        )