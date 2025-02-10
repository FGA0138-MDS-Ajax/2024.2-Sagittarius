import pytest
import mongomock
from rest_framework.test import APIClient
from api.models import order_collection

@pytest.fixture
def mock_db():
    """Cria um banco MongoDB simulado com mongomock"""
    client = mongomock.MongoClient()
    return client.pele_dourada

@pytest.fixture
def client():
    """Retorna um cliente de testes do Django REST Framework"""
    return APIClient()

@pytest.fixture
def mock_order():
    """Cria um pedido fictício para testes"""
    return {
        "name": "Cliente Teste",
        "tipe": "Delivery",
        "payment": "Cartão",
        "products": ["Produto 1", "Produto 2"],
        "total_price": 200.0
    }

def test_create_order(mock_db, client, mock_order):
    """Teste para criar um pedido"""
    order_collection = mock_db.order_collection

    order_collection.delete_many({})

    response = client.post("/api/orders/register/", mock_order, format="json")
    assert response.status_code == 201
    assert "Pedido registrado com sucesso" in response.data

def test_get_orders(mock_db, client, mock_order):
    """Teste para listar pedidos"""
    order_collection = mock_db.order_collection

    order_collection.delete_many({})
    order_collection.insert_one(mock_order)

    response = client.get("/api/orders/", format="json")
    
    assert response.status_code == 200
    assert len(response.data["orders"]) == 1
    assert response.data["orders"][0]["name"] == mock_order["name"]

def test_update_order(mock_db, client, mock_order):
    """Teste para atualizar um pedido"""
    order_collection = mock_db.order_collection

    order_collection.delete_many({})
    order_id = order_collection.insert_one(mock_order).inserted_id

    updated_data = {
        "number": str(order_id),
        "index": 0,
        "new_product": "Produto Atualizado",
        "new_price": 150.0,
        "new_qtd": 5,
        "new_name": "Cliente Atualizado",
        "new_tipe": "Retirada",
        "new_payment": "Dinheiro",
        "new_confirm": "Confirmado"
    }
    response = client.post("/api/orders/update/", updated_data, format="json")
    
    assert response.status_code == 200
    assert "Pedido atualizado com sucesso" in response.data

def test_delete_order(mock_db, client, mock_order):
    """Teste para deletar um pedido"""
    order_collection = mock_db.order_collection

    order_collection.delete_many({})
    order_id = order_collection.insert_one(mock_order).inserted_id

    response = client.post("/api/orders/delete/", {"number": str(order_id)}, format="json")
    assert response.status_code == 200
    assert "Pedido deletado com sucesso" in response.data
    assert order_collection.find_one({"_id": order_id}) is None