from pymongo import MongoClient

client = MongoClient('mongodb+srv://testeuser:TesteUser@teste00.sxs09.mongodb.net/?retryWrites=true&w=majority&appName=Teste00')
db = client['testeDB']