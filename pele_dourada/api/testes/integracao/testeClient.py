import pytest
import mongomock
from unittest.mock import patch
from rest_framework.test import APIClient
from api import models
from bson import ObjectId

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
def mock_cliente():
    """Cria um cliente fictício para testes"""
    return {"nome": "Cliente Teste", "numero": "61999999999", "endereco": "Rua Teste, 123"}

@pytest.fixture
def auth_client(client, mock_db):
    """Autentica o cliente de testes e retorna o cliente autenticado"""
    # Criar usuário fictício
    user_data = {
        "username": "testuser",
        "password": "testpassword"
    }
    client.post("/api/register/", user_data, format="json")
    
    # Login com o usuário fictício
    response = client.post("/api/login/", user_data, format="json")
    assert response.status_code == 200  # Certifica que o login foi bem-sucedido
    token = response.data.get("token")
    assert token, "Erro: Token não foi retornado no login."

    # Configura o cliente autenticado
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
    return client

@pytest.fixture
def mock_client_collection(mock_db):
    """Mocka a coleção do MongoDB"""
    with patch("api.models.client_collection", mock_db.client_collection):
        yield mock_db.client_collection

def test_create_cliente(mock_client_collection, auth_client, mock_cliente):
    """Teste para criar um cliente"""
    mock_client_collection.delete_many({})

    response = auth_client.post("/api/clientes/", mock_cliente, format="json")
    assert response.status_code == 201
    assert "cliente_id" in response.data

def test_get_cliente(mock_client_collection, auth_client, mock_cliente):
    """Teste para ler um cliente"""
    mock_client_collection.delete_many({})
    cliente_id = str(mock_client_collection.insert_one(mock_cliente).inserted_id)  # Converter ObjectId para string

    response = auth_client.get(f"/api/clientes/{cliente_id}/", format="json")
    
    assert response.status_code == 200
    assert response.data["nome"] == mock_cliente["nome"]

def test_update_cliente(mock_client_collection, auth_client, mock_cliente):
    """Teste para atualizar um cliente"""
    mock_client_collection.delete_many({})
    cliente_id = str(mock_client_collection.insert_one(mock_cliente).inserted_id)  # Converter ObjectId para string

    updated_data = {"nome": "Cliente Atualizado", "numero": "61988888888", "endereco": "Rua Atualizada, 456"}
    response = auth_client.put(f"/api/clientes/{cliente_id}/", updated_data, format="json")
    
    assert response.status_code == 200
    assert response.data["nome"] == updated_data["nome"]
    assert response.data["numero"] == updated_data["numero"]
    assert response.data["endereco"] == updated_data["endereco"]

def test_delete_cliente(mock_client_collection, auth_client, mock_cliente):
    """Teste para deletar um cliente"""
    mock_client_collection.delete_many({})
    cliente_id = str(mock_client_collection.insert_one(mock_cliente).inserted_id)  # Converter ObjectId para string

    response = auth_client.delete(f"/api/clientes/{cliente_id}/", format="json")
    assert response.status_code == 204
    assert mock_client_collection.find_one({"_id": ObjectId(cliente_id)}) is None
