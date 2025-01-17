from pymongo import MongoClient
from dotenv import load_dotenv, find_dotenv
import os
load_dotenv(find_dotenv())

# conexao cliente servidor
password = os.getenv('MONGO_PASSWORD')
connection_string = f'mongodb+srv://testeuser:TesteUser@teste00.sxs09.mongodb.net/?retryWrites=true&w=majority&appName=Teste00'
client = MongoClient(connection_string)
db = client.testeDB

# Create your models here.
class Product():
    def __init__(self, name, price, qtd):
        self.name = name
        self.price = price
        self.qtd = qtd

    def __dict__(self):
        return {'nome' : self.name,
                'preço' : self.price,
                'qtd' : self.qtd}
    
class Pedido():
    pass

# collection
estoque_collection = db.estoque

# CRUD
produto = Product('batata', 5, 100)

def insert_doc(collection, doc):
    return collection.insert_one(doc.__dict__())

def get_doc(collection, doc):
    return collection.find_one({'nome' : doc.name})

def update_produto(name, new_name=None, new_price=None, new_qtd=None):
    update = {
        '$set' : {'nome' : new_name, 'preço' : new_price, 'qtd' : new_qtd}
    }
    estoque_collection.update_one({'nome' : name}, update)
    return

def delete(collection, doc):
    collection.delete_one({'nome' : doc.name})
    return