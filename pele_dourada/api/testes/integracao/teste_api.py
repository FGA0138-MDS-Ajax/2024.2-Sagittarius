import pytest
import bcrypt
import jwt
import mongomock
import time
from rest_framework.test import APIClient
from api.models import user_collection
from pele_dourada.settings import SECRET_KEY

@pytest.fixture
def mock_db():
    """Cria um banco MongoDB simulado com mongomock"""
    client = mongomock.MongoClient()
    return client.pele_dourada_test


@pytest.fixture
def client():
    """Retorna um cliente de testes do Django REST Framework"""
    return APIClient()

@pytest.fixture
def mock_user():
    """Cria um usuário fictício para testes"""
    password = bcrypt.hashpw("testpassword".encode('utf-8'), bcrypt.gensalt())
    return {"username": "testuser", "password": password}

def test_register_user(mock_db, client):
    """Teste para verificar o registro de um usuário"""
    mock_db.user_collection.delete_many({})

    unique_username = f"testuser_{int(time.time())}"

    user_data = {
        "username": unique_username,
        "password": "testando",
        "password2": "testando"
    }

    response = client.post("/api/register/", user_data, format="json")
    assert response.status_code == 201
    assert "user_id" in response.data

def test_login_user(mock_db, client, mock_user):
    """Teste para verificar o login de um usuário"""
    user_collection = mock_db.user_collection
    user_collection.insert_one(mock_user)

    login_data = {
        "username": "testuser",
        "password": "testpassword"
    }
    print("Dados", login_data)
    
    response = client.post("/api/login/", login_data, format="json")
    print("resposta", response.data)
    assert response.status_code == 200
    assert "token" in response.data


