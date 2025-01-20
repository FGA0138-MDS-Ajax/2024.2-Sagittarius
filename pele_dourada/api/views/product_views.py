from api.models import *
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from pele_dourada.settings import SECRET_KEY


class RegisterProductView(APIView):
    @swagger_auto_schema(
        operation_description="Registra um novo produto",
        responses={201: openapi.Response('Produto registrado com sucesso')},
        manual_parameters=[
            openapi.Parameter('name', openapi.IN_QUERY, description="Nome do produto", type=openapi.TYPE_STRING),
            openapi.Parameter('price', openapi.IN_QUERY, description="Preço do produto", type=openapi.TYPE_NUMBER),
            openapi.Parameter('qtd', openapi.IN_QUERY, description="Quantidade do produto", type=openapi.TYPE_INTEGER),
        ],
    )

    def post(self, request):
        name = request.data.get("name")
        price = request.data.get("price")
        qtd = request.data.get("qtd")

        if not name or not qtd or not price:
            return Response({
                'error': 'Por favor, insira todos os campos',
            }, status=status.HTTP_400_BAD_REQUEST
            )

        new_product = Product(name, price, qtd)

        product = get_product(new_product.name)

        if product:
            try:
                update_product(name, new_qtd=qtd+product['qtd'])

                return Response({
                    'Produto atualizado com sucesso',
                }, status=status.HTTP_200_OK
                )
            except Exception as e:
                print(e)
                return Response({
                    'error': 'Erro ao atualizar produto',
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        try:
            insert_doc(stock_collection, new_product)
        except Exception as e:
            return Response({
                'error': 'Erro ao registrar produto',
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response({
            "Produto registrado com sucesso"
        }, status=status.HTTP_201_CREATED
        )
    

class UpdateProductView(APIView):
    @swagger_auto_schema(
        operation_description="Atualiza um produto",
        responses={200: openapi.Response('Produto atualizado com sucesso')},
        manual_parameters=[
            openapi.Parameter('name', openapi.IN_QUERY, description="Nome do produto", type=openapi.TYPE_STRING),
            openapi.Parameter('price', openapi.IN_QUERY, description="Preço do produto", type=openapi.TYPE_NUMBER),
            openapi.Parameter('qtd', openapi.IN_QUERY, description="Quantidade do produto", type=openapi.TYPE_INTEGER),
        ],
    )
    
    def post(self, request):
        name = request.data.get("name")
        price = request.data.get("price")
        qtd = request.data.get("qtd")

        if not name or not price or not qtd:
            return Response({
                'error': 'Por favor, insira todos os campos',
            }, status=status.HTTP_400_BAD_REQUEST
            )
        
        product = get_product(Product(name, price, qtd))

        if not product:
            return Response({
                'error': 'Produto não encontrado',
            }, status=status.HTTP_404_NOT_FOUND
            )
        
        try:
            update_product(name, new_price=price, new_qtd=qtd)
        except Exception as e:
            return Response({
                'error': 'Erro ao atualizar produto',
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        return Response({
            'Produto atualizado com sucesso',
        }, status=status.HTTP_200_OK
        )


class DeleteProductView(APIView):
    @swagger_auto_schema(
        operation_description="Deleta um produto",
        responses={200: openapi.Response('Produto deletado com sucesso')},
        manual_parameters=[
            openapi.Parameter('name', openapi.IN_QUERY, description="Nome do produto", type=openapi.TYPE_STRING),
        ],
    )

    def post(self, request):
        name = request.data.get("name")

        if not name:
            return Response({
                'error': 'Por favor, insira o nome do produto',
            }, status=status.HTTP_400_BAD_REQUEST
            )

        product = Product(name, 0, 0)

        product = get_product(product.name)

        if not product:
            return Response({
                'error': 'Produto não encontrado',
            }, status=status.HTTP_404_NOT_FOUND
            )
        
        try:
            delete_product(product.name)
        except Exception as e:
            print(e)
            return Response({
                'error': 'Erro ao deletar produto',
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response({
            'Produto deletado com sucesso',
        }, status=status.HTTP_200_OK
        )
   

class ListProductView(APIView):
    def get(self, request):
        products = []
        for product in stock_collection.find():
            products.append({
                'id': str(product['_id']),
                'name': product['name'],
                'price': product['price'],
                'qtd': product['qtd']
            })
        return Response({
            'products': products
        }, status=status.HTTP_200_OK
        )