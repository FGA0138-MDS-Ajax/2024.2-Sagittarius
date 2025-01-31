from pymongo import MongoClient
from dotenv import load_dotenv, find_dotenv
import os
from datetime import datetime
load_dotenv(find_dotenv())

# conexao cliente servidor
password = os.getenv('MONGO_PASSWORD')
connection_string = f'mongodb+srv://testeuser:TesteUser@teste00.sxs09.mongodb.net/?retryWrites=true&w=majority&appName=Teste00'
client = MongoClient(connection_string)
db = client.testeDB

#gerador de id para pedidos
class PedidoIDGenerator:
    contador = 0  # Inicializa o contador no início

    @classmethod
    def gerar_codigo_pedido(cls):
        cls.contador += 1
        data = datetime.now().strftime('%d%m%Y')  # DiaMesAno
        return f"{data}-{cls.contador:06d}"  # Exemplo: 20250118-000001

# modelo de documentos.
class User():
    def __init__(self, username, pwd):
        self.username = username
        self.pwd = pwd

    def to_dict(self):
        return {'username' : self.username,
                'password' : self.pwd}
    
class Product():
    def __init__(self, name, price, qtd):
        self.name = name
        self.price = price
        self.qtd = qtd

    def to_dict(self):
        return {'name' : self.name,
                'price' : self.price,
                'qtd' : self.qtd}
    
class Order(PedidoIDGenerator):
    def __init__(self, products, name, tipe, payment):
        self.number = self.gerar_codigo_pedido()
        self.name = name
        self.tipe = tipe
        self.payment = payment
        self.products = products
        self.date = datetime.now().strftime('%H:%M:%S')

    def total_price(self):
        order_price = 0
        for products in self.products:
            order_price += products['price']
        return order_price
    
    def to_dict(self):
        return{'tipe' : self.tipe,
               'number' : self.number,
               'name' : self.name,
               'total' : self.total_price(),
               'date' : self.date,
               'payment' : self.payment,
               'products' : self.products}
    

class Client():
    def __init__(self, name, phone, address):
        self.name = name
        self.phone = phone
        self.address = address

    def to_dict(self):
        return {'name': self.name,
                'phone': self.phone,
                'address': self.address}

# collections
stock_collection = db.stock
order_collection = db.order
user_collection = db.user
client_collection = db.client
# CRUD
user = User('admin', 'admin')
# criar documentos
def insert_product(doc):
    if(get_product(doc.name) == None):
        stock_collection.insert_one(doc.to_dict())
        return
    return print('produto ja existe')

def insert_order(doc):
    if(get_product(doc.number) == None):
        order_collection.insert_one(doc.to_dict())
        return
    return print('produto ja existe')

def insert_user(doc):
    if(get_product(doc.username) == None):
        user_collection.insert_one(doc.to_dict())
        return
    return print('produto ja existe')

# ler documentos
def get_user(username):
    return user_collection.find_one({'username' : username})

def get_product(name):
    return stock_collection.find_one({'name' : name})

def get_all_products():
    return list(stock_collection.find())

def get_order(number):
    return order_collection.find_one({'number' : number})

def get_all_orders():
    return list(order_collection.find())

# atualizar documentos
def update_user(username, new_username=None, new_pwd=None):
    update = {
        '$set': {}
    }
    if new_username is not None:
        update['$set']['username'] = new_username
    if new_pwd is not None:
        update['$set']['password'] = new_pwd
    user_collection.update_one({'username' : username}, update)
    return

def update_product(name, new_name=None, new_price=None, new_qtd=None):
    update = {
        '$set': {}
    }
    if new_name is not None:
        update['$set']['name'] = new_name
    if new_price is not None:
        update['$set']['price'] = new_price
    if new_qtd is not None:
        update['$set']['qtd'] = new_qtd
    stock_collection.update_one({'name' : name}, update)
    return

def update_order(number, index=None, new_product=None, new_price=None, new_qtd=None, new_name=None, new_tipe=None, new_payment=None):
    update = {
        '$set': {}
    }
    if index is not None:
        if new_product is not None:
            update['$set']['products.'+str(index)+'.name'] = new_product
        if new_price is not None:
            update['$set']['products.'+str(index)+'.price'] = new_price
        if new_qtd is not None:
            update['$set']['products.'+str(index)+'.qtd'] = new_qtd        
    if new_name is not None:
        update['$set']['name'] = new_name
    if new_tipe is not None:
        update['$set']['tipe'] = new_tipe
    if new_payment is not None:
        update['$set']['payment'] = new_payment
     
    order_collection.update_one({'number': number}, update)
    return

#deletar documentos
def delete_user(username):
    user_collection.delete_one({'username' : username})
    return

def delete_product(name):
    stock_collection.delete_one({'name' : name})
    return

def delete_order(number):
    order_collection.delete_one({'number' : number})
    return

insert_user(user)


# Criar Cliente
def insert_client(doc):
    if get_client(doc.name) is None:  # Verifica se o cliente já existe pelo nome
        client_collection.insert_one(doc.to_dict())
        print(f"Cliente {doc.name} inserido com sucesso!")
    else:
        print(f"Cliente {doc.name} já existe!")

# Ler Cliente
def get_client(name):
    return client_collection.find_one({'name': name})

# Ler Todos os Clientes
def get_all_clients():
    return list(client_collection.find())

# Atualizar Cliente
def update_client(name, new_name=None, new_phone=None, new_address=None):
    update = {'$set': {}}
    if new_name is not None:
        update['$set']['name'] = new_name
    if new_phone is not None:
        update['$set']['phone'] = new_phone
    if new_address is not None:
        update['$set']['address'] = new_address
    
    result = client_collection.update_one({'name': name}, update)
    if result.modified_count > 0:
        print(f"Cliente {name} atualizado com sucesso!")
    else:
        print(f"Nenhuma atualização feita para o cliente {name}.")

# Deletar Cliente
def delete_client(name):
    result = client_collection.delete_one({'name': name})
    if result.deleted_count > 0:
        print(f"Cliente {name} deletado com sucesso!")
    else:
        print(f"Cliente {name} não encontrado.")

# Testando 

# Registrar um Cliente
new_client = client(name="João Paulo", phone="123456789", address="Rua A, 123")
insert_client(new_client)

# Ler um Cliente
client = get_client("João Paulo")
print(client)

# Atualizar um Cliente
update_client("João Paulo", new_phone="987654321", new_address="Rua B, 456")

# Ler todos os Clientes
clients = get_all_clients()
print(clients)

# Deletar um Cliente
delete_client("João Paulo")


