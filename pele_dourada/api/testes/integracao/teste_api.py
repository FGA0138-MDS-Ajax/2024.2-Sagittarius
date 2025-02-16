import pytest
import bcrypt
import mongomock
from rest_framework.test import APIClient
from api.models import user_collection
from pele_dourada.settings import SECRET_KEY

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
def mock_user():
    """Cria um usuário fictício para testes"""
    #add .decode('utf-8') para corrigir erro de tipo de dados
    password = bcrypt.hashpw("testpassword".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    return {"username": "testuser", "password": password}


def test_register_user(mock_db, client):
    #sobrescrever a colecao de usuarios com a colecao simulada
    from api import models
    models.user_collection = mock_db.user_collection

    #limpar a colecao simulada
    mock_db.user_collection.delete_many({})

    user_data = {
        "username": "testuser",
        "password": "testpassword",
        "password2": "testpassword"
    }
    
    response = client.post("/api/register/", user_data, format="json")
    
    assert response.status_code == 201
    assert "user_id" in response.data


def test_login_user(mock_db, client, mock_user):
    """Teste para verificar o login de um usuário"""
    mock_db.user_collection.insert_one(mock_user)

    login_data = {
        "username": "testuser",
        "password": "testpassword"
    }
    
    response = client.post("/api/login/", login_data, format="json")
    
    assert response.status_code == 200
    assert "token" in response.data

def test_invalid_login(mock_db, client):
    """Teste de login com credenciais erradas"""
    login_data = {
        "username": "wronguser",
        "password": "wrongpassword"
    }
    
    response = client.post("/api/login/", login_data, format="json")
    
    assert response.status_code == 404
    assert response.data["error"] == "Usuário não encontrado"
    
def test_invalid_register(mock_db, client):
    """Teste de registro com senha de confirmação errada"""
    mock_db.user_collection.delete_many({})
    user_data = {
        "username": "user",
        "password": "testpassword",
        "password2": "wrongpassword"
    }
    
    response = client.post("/api/register/", user_data, format="json")
    
    assert response.status_code == 400
    assert response.data["error"] == "As senhas não coincidem"