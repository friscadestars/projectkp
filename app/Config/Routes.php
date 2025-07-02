<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');
$routes->get('/Agen', 'DashboardController::agen');
$routes->get('/Pabrik', 'DashboardController::pabrik');
$routes->get('/Distributor', 'DashboardController::distributor');

$routes->get('login', 'Auth::login');
$routes->post('login', 'Auth::loginPost');
$routes->post('loginPost', 'Auth::loginPost');


$routes->get('register', 'Auth::register');
$routes->post('register', 'Auth::registerPost');
$routes->post('registerPost', 'Auth::registerPost');


$routes->get('logout', 'Auth::logout');


$routes->get('products', 'ProductController::index');
$routes->get('products/create', 'ProductController::create');
$routes->post('products/store', 'ProductController::store');
$routes->get('products/edit/(:num)', 'ProductController::edit/$1');
$routes->post('products/update/(:num)', 'ProductController::update/$1');
$routes->get('products/delete/(:num)', 'ProductController::delete/$1');


$routes->get('orders', 'OrderController::index');
$routes->get('orders/create', 'OrderController::create');
$routes->post('orders/store', 'OrderController::store');
$routes->get('orders/edit/(:num)', 'OrderController::edit/$1');
$routes->post('orders/update/(:num)', 'OrderController::update/$1');
$routes->get('orders/delete/(:num)', 'OrderController::delete/$1');



$routes->get('order-items/(:num)', 'OrderItemController::index/$1');
$routes->get('order-items/create/(:num)', 'OrderItemController::create/$1');
$routes->post('order-items/store/(:num)', 'OrderItemController::store/$1');
$routes->get('order-items/edit/(:num)', 'OrderItemController::edit/$1');
$routes->post('order-items/update/(:num)', 'OrderItemController::update/$1');
$routes->get('order-items/delete/(:num)', 'OrderItemController::delete/$1');
$routes->resource('order-items', ['controller' => 'OrderItemController']);



$routes->get('invoices', 'InvoiceController::index');
$routes->get('invoices/create', 'InvoiceController::create');
$routes->post('invoices/store', 'InvoiceController::store');
$routes->get('invoices/edit/(:num)', 'InvoiceController::edit/$1');
$routes->post('invoices/update/(:num)', 'InvoiceController::update/$1');
$routes->get('invoices/delete/(:num)', 'InvoiceController::delete/$1');



$routes->get('shipments', 'ShipmentController::index');
$routes->get('shipments/create', 'ShipmentController::create');
$routes->post('shipments/store', 'ShipmentController::store');
$routes->get('shipments/edit/(:num)', 'ShipmentController::edit/$1');
$routes->post('shipments/update/(:num)', 'ShipmentController::update/$1');
$routes->get('shipments/delete/(:num)', 'ShipmentController::delete/$1');



$routes->get('daftar-harga', 'ProductPriceController::index');
$routes->post('daftar-harga/tambah', 'ProductPriceController::store');
$routes->post('daftar-harga/update/(:num)', 'ProductPriceController::update/$1');
$routes->get('daftar-harga/hapus/(:num)', 'ProductPriceController::delete/$1');
