from pymongo import MongoClient
from dotenv import load_dotenv, find_dotenv
import os
import pprint
load_dotenv(find_dotenv())

# conexoes de mafia
password = os.getenv('MONGO_PASSWORD')
connection_string = f'mongodb+srv://testeuser:TesteUser@teste00.sxs09.mongodb.net/?retryWrites=true&w=majority&appName=Teste00'
client = MongoClient(connection_string)
db = client['testeDB']

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

# collection
estoque_collection = db['estoque']


