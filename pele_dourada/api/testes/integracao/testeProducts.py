import pytest
import mongomock
from rest_framework.test import APIClient
from api.models import stock_collection

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
def mock_product():
    """Cria um produto fictício para testes"""
    return {"name": "Produto Teste", "price": 100.0, "qtd": 10}

def test_create_product(mock_db, client, mock_product):
    """Teste para criar um produto"""
    stock_collection = mock_db.stock_collection

    stock_collection.delete_many({})

    response = client.post("/api/products/register/", mock_product, format="json")
    assert response.status_code == 201
    assert "Produto registrado com sucesso" in response.data

def test_get_products(mock_db, client, mock_product):
    """Teste para listar produtos"""
    stock_collection = mock_db.stock_collection

    stock_collection.delete_many({})
    stock_collection.insert_one(mock_product)

    response = client.get("/api/products/", format="json")
    
    assert response.status_code == 200
    assert len(response.data["products"]) == 1
    assert response.data["products"][0]["name"] == mock_product["name"]

def test_update_product(mock_db, client, mock_product):
    """Teste para atualizar um produto"""
    stock_collection = mock_db.stock_collection

    stock_collection.delete_many({})
    stock_collection.insert_one(mock_product)

    updated_data = {"name": "Produto Atualizado", "price": 150.0}
    response = client.post("/api/products/update/", updated_data, format="json")
    
    assert response.status_code == 200
    assert "Produto atualizado com sucesso" in response.data

def test_delete_product(mock_db, client, mock_product):
    """Teste para deletar um produto"""
    stock_collection = mock_db.stock_collection

    stock_collection.delete_many({})
    stock_collection.insert_one(mock_product)

    response = client.post("/api/products/delete/", {"name": mock_product["name"]}, format="json")
    assert response.status_code == 200
    assert "Produto deletado com sucesso" in response.data
    assert stock_collection.find_one({"name": mock_product["name"]}) is None