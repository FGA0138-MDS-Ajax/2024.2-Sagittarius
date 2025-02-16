import os
from datetime import datetime

import pytz
from bson import ObjectId
from dotenv import find_dotenv, load_dotenv
from pymongo import MongoClient

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
        tz_brasilia = pytz.timezone('America/Sao_Paulo')  # Fuso horário de Brasília
        data = datetime.now(tz_brasilia).strftime('%d%m%Y-%H%M%S')  # Hora de Brasília
        return f"{data}-{cls.contador:06d}"  # Exemplo: 18022025-141234-000001

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
    def __init__(self, products, name, type, payment):
        self.number = self.gerar_codigo_pedido()
        self.name = name
        self.type = type
        self.payment = payment
        self.products = products
        self.confirm = False
        self.date = datetime.today()

    def total_price(self):
        order_price = 0
        for products in self.products:
            order_price += products['price'] * products['quantidade']
        return order_price
    
    def to_dict(self):
        return{'tipe' : self.type,
               'number' : self.number,
               'name' : self.name,
               'total' : self.total_price(),
               'date' : self.date,
               'payment' : self.payment,
               'products' : self.products,
               'confirm' : self.confirm}

class Client():
    def __init__(self, name, phone, address):
        self.name = name
        self.phone = phone
        self.address = address

    def to_dict(self):
        return {'name': self.name,
                'phone': self.phone,
                'address': self.address}

class Billing():
    def __init__(self, orders):
        self.orders = orders
        self.date = datetime.today()

    def date_to_int(self):
        date_string = self.date.strftime('%Y%m%d')
        date_string = date_string.replace('-', '')
        date_string = date_string[:8]
        return int(date_string)
    
    def total_billing(self):
        billing_price = 0
        for orders in self.orders:
            billing_price += orders['total']
        return billing_price
    
    def to_dict(self):
        return {'date' : self.date_to_int(),
                'orders' : self.orders,
                'total' : self.total_billing()}


# collections
stock_collection = db.stock
order_collection = db.order
user_collection = db.user
client_collection = db.clients
billing_collection = db.billing

# CRUD
# criar documentos
def insert_product(doc):
    if(get_product(doc.name) == None):
        stock_collection.insert_one(doc.to_dict())
        return
    return print('produto ja existe')

def insert_client(doc):
    if get_client(doc.phone) is None:  # Verifica se o cliente já existe pelo número de telefone
        client_collection.insert_one(doc.to_dict())
        print(f"Cliente {doc.phone} inserido com sucesso!")
    else:
        print(f"Cliente {doc.phone} já existe!")
        raise Exception("Cliente já existe")
    return

def insert_order(doc):
    if(get_order(doc.number) == None):
        order_collection.insert_one(doc.to_dict())
        return
    order_collection.insert_one(doc.to_dict())  
    return print('Pedido ja existe')

def insert_user(doc):
    if(get_user(doc.username) == None):
        user_collection.insert_one(doc.to_dict())
        return
    return print('produto ja existe')

def insert_billing(doc):
    billing_collection.insert_one(doc.to_dict())
    return

# ler documentos
def get_user(username):
    return user_collection.find_one({'username' : username})

def get_client(phone):
    return client_collection.find_one({'phone' : phone})

def get_client_by_id(client_id):
    return client_collection.find_one(ObjectId(client_id))

def get_all_clients():
    return list(client_collection.find())

def get_product(name):
    return stock_collection.find_one({'name' : name})

def get_product_by_id(product_id):
    return stock_collection.find_one(ObjectId(product_id))

def get_all_products():
    return list(stock_collection.find())

def get_order(number):
    return order_collection.find_one({'number' : number})

def get_all_orders():
    return list(order_collection.find())

def get_billing(date):
    return billing_collection.find_one({'date' : date})

def get_all_billing():
    return list(billing_collection.find())

def get_billing_date_interval(data_inicial, data_final):
    faturamento = db.billing.find({
        'date': {
            '$gte': data_inicial,
            '$lte': data_final
        }
    })

    faturamento_list = []
    for faturamento in faturamento:
        faturamento['_id'] = str(faturamento['_id'])
        faturamento_list.append(faturamento)
    return faturamento

# atualizar documentos
def update_user(username, new_username=None, new_pwd=None):
    update = {
        '$set': {}
    }
    if new_username is not None:
        update['$set']['username'] = new_username
    if new_pwd is not None:
        update['$set']['password'] = new_pwd
    user_collection.update_one({'username': username}, update)
    return

def update_user_username(username, new_username=None, new_pwd=None):
    update = {
        '$set': {}
    }
    if new_username is not None:
        update['$set']['username'] = new_username
    if new_pwd is not None:
        update['$set']['password'] = new_pwd
    user_collection.update_one({'username': username}, update)
    return

def update_client(client_id, new_name=None, new_phone=None, new_address=None):
    client = get_client_by_id(ObjectId(client_id))

    if not client:
        return None

    update_fields = {
        '$set': {}
    }
    if new_phone:
        update_fields['$set']["phone"] = new_phone
    if new_address:
        update_fields['$set']["address"] = new_address
    if new_name:
        update_fields['$set']["name"] = new_name

    if update_fields['$set']:
        client_collection.update_one({"_id": ObjectId(client_id)}, update_fields)
    return client

def update_client_name(name, new_name=None, new_phone=None, new_address=None):
    client = get_client(name)
    print(client)

    if not client:
        return None

    update_fields = {
        '$set': {}
    }
    if new_phone is not None:
        update_fields['$set']["phone"] = new_phone
    if new_address is not None:
        update_fields['$set']["address"] = new_address
    if new_name is not None:
        update_fields['$set']["name"] = new_name

    if update_fields['$set']:
        client_collection.update_one({"name": name}, update_fields)
    return client

def update_product(product_id, new_name=None, new_price=None, new_qtd=None):
    update = {
        '$set': {}
    }
    if new_name is not None:
        update['$set']['name'] = new_name
    if new_price is not None:
        update['$set']['price'] = new_price
    if new_qtd is not None:
        update['$set']['qtd'] = new_qtd
    stock_collection.update_one({'_id' : ObjectId(product_id)}, update)
    return

def update_product_name(name, new_name=None, new_price=None, new_qtd=None):
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

def update_order(number, index=None, new_product=None, new_price=None, new_qtd=None, new_name=None, new_tipe=None, new_payment=None, new_confirm=None, new_total=None):
    update = {
        '$set': {}
    }
    # if index is not None:
    if new_product is not None:
        for i, product in enumerate(new_product):
            update['$set'][f'products.{i}.name'] = product['name']
            update['$set'][f'products.{i}.price'] = product['price']
            update['$set'][f'products.{i}.quantidade'] = product['quantidade']
        #     update['$set']['products.'+str(index)+'.name'] = new_product
        # if new_price is not None:
        #     update['$set']['products.'+str(index)+'.price'] = new_price
        # if new_qtd is not None:
        #     update['$set']['products.'+str(index)+'.qtd'] = new_qtd        
    if new_name is not None:
        update['$set']['name'] = new_name
    if new_tipe is not None:
        update['$set']['tipe'] = new_tipe
    if new_payment is not None:
        update['$set']['payment'] = new_payment
    if new_price is not None:
        update['$set']['total'] = new_price
    if new_confirm is not None:
        update['$set']['confirm'] = new_confirm
    if new_total is not None:
        update['$set']['total'] = new_total
     
    order_collection.update_one({'number': number}, update)
    return

#deletar documentos
def delete_user(username):
    user_collection.delete_one({'username' : username})
    return

def delete_client(client_id):
    result = client_collection.delete_one({'_id': ObjectId(client_id)})
    if result.deleted_count > 0:
        print(f"Cliente {client_id} deletado com sucesso!")
    else:
        print(f"Cliente {client_id} não encontrado.")
    return

def delete_client_name(name):
    result = client_collection.delete_one({'name': name})
    if result.deleted_count > 0:
        print(f"Cliente {name} deletado com sucesso!")
    else:
        print(f"Cliente {name} não encontrado.")
    return

def delete_product(product_id):
    stock_collection.delete_one({'_id' : ObjectId(product_id)})
    return

def delete_product_name(name):
    stock_collection.delete_one({'name' : name})
    return

def decrease_product_qtd(product_id):
    product = get_product_by_id(product_id)
    if product['qtd'] == 1:
        delete_product(product_id)
    else:
        update_product(product_id, new_qtd=product['qtd']-1)

def delete_order(number):
    order_collection.delete_one({'number' : number})
    return

def delete_billing(date):
    billing_collection.delete_one({'date' : date})
    return


