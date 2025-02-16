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
def mock_product():
    """Cria um produto fictício para testes"""
    return {"name": "Produto Teste", "price": 100.0, "qtd": 10}

def test_create_product(mock_db, auth_client, mock_product):
    """Teste para criar um produto"""
    stock_collection = mock_db.stock_collection

    stock_collection.delete_many({})

    response = auth_client.post("/api/product/register/", mock_product, format="json")
    assert response.status_code == 201
    assert "Produto registrado com sucesso" in response.data

def test_get_products(mock_db, auth_client, mock_product):
    """Teste para listar produtos"""
    stock_collection = mock_db.stock_collection

    stock_collection.delete_many({})
    stock_collection.insert_one(mock_product)

    response = auth_client.get("/api/products/", format="json")
    
    assert response.status_code == 200
    assert len(response.data["products"]) == 1
    assert response.data["products"][0]["name"] == mock_product["name"]

def test_update_product(mock_db, auth_client, mock_product):
    """Teste para atualizar um produto"""
    stock_collection = mock_db.stock_collection

    stock_collection.delete_many({})
    stock_collection.insert_one(mock_product)

    updated_data = {"name": "Produto Atualizado", "price": 150.0}
    response = auth_client.post("/api/products/update/", updated_data, format="json")
    
    assert response.status_code == 200
    assert "Produto atualizado com sucesso" in response.data

def test_delete_product(mock_db, auth_client, mock_product):
    """Teste para deletar um produto"""
    stock_collection = mock_db.stock_collection

    stock_collection.delete_many({})
    stock_collection.insert_one(mock_product)

    response = auth_client.post("/api/products/delete/", {"name": mock_product["name"]}, format="json")
    assert response.status_code == 200
    assert "Produto deletado com sucesso" in response.data
    assert stock_collection.find_one({"name": mock_product["name"]}) is None