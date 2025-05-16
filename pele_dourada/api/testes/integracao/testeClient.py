import pytest
import mongomock
import bcrypt
from unittest.mock import patch
from rest_framework.test import APIClient

@pytest.fixture()
def mock_db():
    client = mongomock.MongoClient()
    return client.pele_dourada

@pytest.fixture()
def api_client():
    return APIClient()

@pytest.fixture()
def auth_client(api_client, mock_db):
    password = "testpassword"
    hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
    user_data = {"username": "testuser", "password": hashed_password}

    patcher = patch("api.models.user_collection", mock_db.users)
    patcher.start()
    mock_db.users.insert_one(user_data)

    response = api_client.post(
        "/api/login/",
        {"username": "testuser", "password": "testpassword"},
        format="json"
    )
    assert response.status_code == 200, f"Erro no login: {response.json()}"
    token = response.json().get("token")
    assert token, "Erro: Token não foi retornado no login."

    api_client.credentials(HTTP_AUTHORIZATION=f"JWT {token}")

    yield api_client
    patcher.stop()

@pytest.fixture()
def mock_client_collection(mock_db):
    with patch("api.models.client_collection", mock_db.client_collection):
        yield mock_db.client_collection

@pytest.fixture()
def mock_cliente():
    return {"name": "Cliente Teste", "number": "61999999999", "endereco": "Rua Teste, 123"}

@pytest.fixture()
def client_db_document(mock_cliente):
    return {
        "name": mock_cliente["name"],
        "phone": mock_cliente["number"],
        "address": mock_cliente["endereco"],
    }

def test_register_cliente(auth_client, mock_client_collection):
    new_client = {"name": "Cliente Novo", "phone": "61977777777", "address": "Rua Nova, 456"}
    response = auth_client.post("/api/client/register/", new_client, format="json")
    assert response.status_code == 201, f"Erro ao criar cliente: {response.json()}"
    assert response.json().get("message") == "Cliente registrado com sucesso"
    
    client_data = mock_client_collection.find_one({"name": new_client["name"]})
    assert client_data is not None, "Cliente novo não foi salvo no banco"

def test_get_cliente(auth_client, mock_client_collection, client_db_document):
    """
    Testa a listagem de clientes utilizando o cliente
    """
    mock_client_collection.insert_one(client_db_document)
    
    response = auth_client.get("/api/client/get/", format="json")
    assert response.status_code == 200, f"Erro ao obter clientes: {response.json()}"
    
    clientes = response.json().get("clients", [])
    found = any(c.get("name") == client_db_document["name"] for c in clientes)
    assert found, "Cliente não encontrado na lista"

def test_update_cliente(auth_client, mock_client_collection, client_db_document):
    """
    Testa a atualização do cliente
    """
    client_id = mock_client_collection.insert_one(client_db_document).inserted_id
    updated_data = {
        "name": "Novo nome",  
        "phone": "61988888888",
        "address": "Rua Atualizada, 456",
        "id": str(client_id)
    }
    response = auth_client.put("/api/client/update/", updated_data, format="json")
    assert response.status_code == 200, f"Erro ao atualizar cliente: {response.json()}"

    client_data = mock_client_collection.find_one({"name": "Novo nome"})
    assert client_data is not None, "Cliente não encontrado após atualização"
    assert client_data.get("phone") == "61988888888", "Número do cliente não foi atualizado"

def test_delete_cliente(auth_client, mock_client_collection, client_db_document):
    """
    Testa a deleção do cliente 
    """
    
    client_id = mock_client_collection.insert_one(client_db_document).inserted_id
    
    response = auth_client.delete("/api/client/delete/", data={"id": str(client_id)}, format="json")
    assert response.status_code == 200, f"Erro ao deletar cliente: {response.json()}"

    client_data = mock_client_collection.find_one({"name": client_db_document["name"]})
    assert client_data is None, "Cliente ainda existe após deleção"