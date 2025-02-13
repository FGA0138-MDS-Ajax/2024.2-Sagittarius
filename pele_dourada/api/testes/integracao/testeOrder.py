import pytest
import mongomock
from rest_framework.test import APIClient
from api.models import order_collection
import bcrypt
from unittest.mock import patch

@pytest.fixture
def mock_db():
    """Cria um banco MongoDB simulado com mongomock"""
    client = mongomock.MongoClient()
    return client.pele_dourada

@pytest.fixture
def client():
    """Retorna um cliente de testes do Django REST Framework"""
    return APIClient()

@pytest.fixture()
def auth_client(client, mock_db):
    """Autentica o cliente de testes e retorna o cliente autenticado"""
    
    password = "testpassword"
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    user_data = {
        "username": "testuser",
        "password": hashed_password
    }
    patcher = patch("api.models.user_collection", mock_db.users)
    patcher.start()
    with patch("api.models.user_collection", mock_db.users):
        mock_db.users.insert_one(user_data)

        response = client.post(
            "/api/login/",
            {"username": "testuser", "password": password},
            format="json"
        )

        assert response.status_code == 200, f"Erro no login: {response.content.decode()}"
        
        token = response.json().get("token")
        assert token, "Erro: Token não foi retornado no login."

        client.credentials(HTTP_AUTHORIZATION=token)

        yield client
        patcher.stop()


@pytest.fixture
def mock_order():
    """Cria um pedido fictício para testes"""
    return {
        "number": "1",
        "name": "Matheus",
        "tipe": "Delivery",
        "payment": "Cartão",
        "products": [
            {"name": "Produto 1", "price": 100.0},
            {"name": "Produto 2", "price": 100.0}
        ],
        "total": 200.0,
        "confirm": True
    }


def test_create_order(mock_db, auth_client, mock_order):
    """Teste para criar um pedido"""
    order_collection = mock_db.order_collection

    order_collection.delete_many({})

    response = auth_client.post("/api/order/register/", mock_order, format="json")
    
    assert response.status_code == 201

def test_get_orders(mock_db, auth_client, mock_order):
    """Teste para listar pedidos"""
    order_collection = mock_db.order_collection

    order_collection.delete_many({})
    order_collection.insert_one(mock_order)

    response = auth_client.get("/api/orders/", format="json")
    

    assert response.status_code == 200
    #assert len(response.data["orders"]) == 1
    assert response.data["orders"][0]["name"] == mock_order["name"]

def test_update_order(mock_db, auth_client, mock_order):
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
    response = auth_client.post("/api/order/update/", updated_data, format="json")
    
    
    assert response.status_code == 200
    assert "Pedido atualizado com sucesso" in response.data

def test_delete_order(mock_db, auth_client, mock_order):
    """Teste para deletar um pedido"""
    order_collection = mock_db.order_collection

    order_collection.delete_many({})
    order_id = order_collection.insert_one(mock_order).inserted_id

    response = auth_client.post("/api/order/delete/", {"number": str(order_id)}, format="json")
    print(response.json())

    assert response.status_code == 200
    assert "Pedido deletado com sucesso" in response.data
    #assert order_collection.find_one({"_id": order_id}) is None