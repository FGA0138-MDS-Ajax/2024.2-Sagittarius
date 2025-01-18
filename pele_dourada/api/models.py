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

    def __dict__(self):
        return {'username' : self.username,
                'password' : self.pwd}
    
class Product():
    def __init__(self, name, price, qtd):
        self.name = name
        self.price = price
        self.qtd = qtd

    def __dict__(self):
        return {'name' : self.name,
                'price' : self.price,
                'qtd' : self.qtd}
    
class Order(PedidoIDGenerator):
    def __init__(self, products):
        self.number = self.gerar_codigo_pedido()
        self.products = products

    def total_price(self):
        order_price = 0
        for products in self.products:
            order_price += products['price']
        return order_price
    
    def __dict__(self):
        return{'number' : self.number, 
               'products' : self.products,
               'total' : self.total_price()}

# collections
stock_collection = db.stock
order_collection = db.order
user_collection = db.user

# CRUD
produto1 = Product('batata', 5, 2)
produto2 = Product('frango', 10, 1)
pedido = Order([produto1.__dict__(),produto2.__dict__()])
user = User('testuser', 'testpwd')

# criar documentos
def insert_doc(collection, doc):
    collection.insert_one(doc.__dict__())
    return

# ler documentos
def get_user(doc):
    return user_collection.find_one({'username' : doc.username})

def get_product(doc):
    return stock_collection.find_one({'name' : doc.name})

def get_order(doc):
    return order_collection.find_one({'number' : doc.number})

# atualizar documentos
def update_user(username, new_username=None, new_pwd=None):
    update = {
        '$set' : {'username' : new_username, 'password' : new_pwd}
    }
    stock_collection.update_one({'username' : username}, update)
    return

def update_product(name, new_name=None, new_price=None, new_qtd=None):
    update = {
        '$set' : {'name' : new_name, 'price' : new_price, 'qtd' : new_qtd}
    }
    stock_collection.update_one({'name' : name}, update)
    return

def update_order(number, products_list):
    for i in range(0, len(products_list)):
        update = {
        '$set' : {'name' : products_list[i]['name'], 'price' : products_list[i]['price'], 'qtd' : products_list[i]['qtd']}
        }
        order_collection.update_one({'number' : number, 'products' : i}, update)
    return

#deletar documentos
def delete_user(doc):
    user_collection.delete_one({'username' : doc.username})
    return

def delete_product(doc):
    stock_collection.delete_one({'name' : doc.name})
    return

def delete_order(doc):
    order_collection.delete_one({'number' : doc.number})
    return
