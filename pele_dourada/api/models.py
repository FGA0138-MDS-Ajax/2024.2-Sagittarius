from django.db import models
from ..db_connection import db

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


