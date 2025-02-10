"""
URL configuration for pele_dourada project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from api.views.admin_views import (LoginView, LogoutView, RegisterView,
                                   UpdatePasswordView)
from api.views.billing_views import (GenerateBillingReportView, GetBillingView,
                                     RegisterBillingView)
from api.views.client_views import (DeleteClientView, GetClientsView,
                                    RegisterClientView, UpdateClientView)
from api.views.order_views import (DeleteOrderView, ListOrdersView,
                                   RegisterOrderView, UpdateOrderView)
from api.views.product_views import (DeleteProductView, ListProductView,
                                     RegisterProductView, UpdateProductView)
from django.contrib import admin
from django.urls import path, re_path
from django.views.generic import TemplateView
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework.permissions import AllowAny

schema_view = get_schema_view(
    openapi.Info(
        title="Pele Dourada API",
        default_version='v1',
        description="API para o projeto Pele Dourada",
        terms_of_service="https://www.google.com/policies/terms/",
        license = openapi.License(name="BSD License"),
    ),
    public = True,
    permission_classes = (AllowAny,),
)

urlpatterns = [
    # Rotas da API
    path('admin/', admin.site.urls),
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/logout/', LogoutView.as_view(), name='logout'),
    path('api/updatepwd/', UpdatePasswordView.as_view(), name='update'),
    path('api/product/register/', RegisterProductView.as_view(), name='register_product'),
    path('api/product/update/', UpdateProductView.as_view(), name='update_product'),
    path('api/products/', ListProductView.as_view(), name='list_products'),
    path('api/product/delete/', DeleteProductView.as_view(), name='delete_product'),
    path('api/client/register/', RegisterClientView.as_view(), name='register_client'),
    path('api/client/update/', UpdateClientView.as_view(), name='update_client'),
    path('api/client/delete/', DeleteClientView.as_view(), name='delete_client'),
    path('api/client/get/', GetClientsView.as_view(), name='get_clients'),
    path('api/order/register/', RegisterOrderView.as_view(), name='register_order'),
    path('api/billing/register/', RegisterBillingView.as_view(), name='register_billing'),
    path('api/billing/get/', GetBillingView.as_view(), name='get_billing'),
    path('api/billing/export/', GenerateBillingReportView.as_view(), name='export_billing'),
    path('api/order/delete/', DeleteOrderView.as_view(), name='delete_order'),
    path('api/orders/', ListOrdersView.as_view(), name='list_orders'),
    path('api/order/update/', UpdateOrderView.as_view(), name='update_order'),

    # Documentação da API
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
