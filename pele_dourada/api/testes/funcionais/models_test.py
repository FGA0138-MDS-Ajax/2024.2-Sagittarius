import unittest
from datetime import datetime

from django.test import TestCase

from ...models import (Billing, Client, Order, Product, User, delete_billing,
                       delete_client_name, delete_order, delete_product_name,
                       delete_user, get_all_billing, get_billing, get_client,
                       get_order, get_product, get_user, insert_billing,
                       insert_client, insert_order, insert_product,
                       insert_user, update_client_name, update_order,
                       update_product_name, update_user_username)


class TestModels(unittest.TestCase):

    def setUp(self):
        self.user = User("testuser", "testpassword")
        self.product = Product("testproduct", 10.0, 5)
        self.order = Order([self.product.to_dict()], "testorder", "type1", "payment1")
        self.client = Client("testclient", "123456789", "test address")
        self.billing = Billing([self.order.to_dict()])

    def test_user_to_dict(self):
        self.assertEqual(self.user.to_dict(), {'username': 'testuser', 'password': 'testpassword'})

    def test_product_to_dict(self):
        self.assertEqual(self.product.to_dict(), {'name': 'testproduct', 'price': 10.0, 'qtd': 5})

    def test_order_to_dict(self):
        self.assertEqual(self.order.to_dict(), {
            'tipe': 'type1',
            'number': self.order.number,
            'name': 'testorder',
            'total': 10.0,
            'date': self.order.date,
            'payment': 'payment1',
            'products': [self.product.to_dict()],
            'confirm': False
        })

    def test_client_to_dict(self):
        self.assertEqual(self.client.to_dict(), {'name': 'testclient', 'phone': '123456789', 'address': 'test address'})

    def test_billing_to_dict(self):
        self.assertEqual(self.billing.to_dict(), {
            'date': self.billing.date_to_int(),
            'orders': [self.order.to_dict()],
            'total': 10.0
        })

    def test_insert_product(self):
        insert_product(self.product)
        self.assertIsNotNone(get_product(self.product.name))

    def test_insert_client(self):
        insert_client(self.client)
        self.assertIsNotNone(get_client(self.client.phone))

    def test_insert_order(self):
        insert_order(self.order)
        self.assertIsNotNone(get_order(self.order.number))

    def test_insert_user(self):
        insert_user(self.user)
        self.assertIsNotNone(get_user(self.user.username))

    def test_insert_billing(self):
        insert_billing(self.billing)
        self.assertIsNotNone(get_all_billing())

    def test_update_user(self):
        # insert_user(self.user)
        update_user_username(self.user.username, new_username="updateduser")
        self.assertIsNotNone(get_user("updateduser"))

    def test_update_client(self):
        # insert_client(self.client)
        update_client_name(self.client.name, new_name="updatedclient")
        self.assertIsNotNone(get_client(self.client.phone))

    def test_update_product(self):
        # insert_product(self.product)
        update_product_name(self.product.name, new_name="updatedproduct")
        self.assertIsNotNone(get_product("updatedproduct"))

    def test_update_order(self):
        # insert_order(self.order)
        update_order(self.order.number, new_name="updatedorder")
        self.assertIsNotNone(get_order(self.order.number))

    def test_delete_user(self):
        delete_user(self.user.username)
        self.assertIsNone(get_user(self.user.username))

    def test_delete_client(self):
        delete_client_name(self.client.name)
        self.assertIsNone(get_client(self.client.name))

    def test_delete_product(self):
        delete_product_name(self.product.name)
        self.assertIsNone(get_product(self.product.name))

    def test_delete_order(self):
        delete_order(self.order.number)
        self.assertIsNone(get_order(self.order.number))

    def test_delete_billing(self):
        delete_billing(self.billing.date)
        self.assertIsNone(get_billing(self.billing.date))

if __name__ == '__main__':
    unittest.main()