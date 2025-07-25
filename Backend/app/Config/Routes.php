<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */


$routes->options('api/(:any)', 'Home::options');


$routes->group('api', function ($routes) {
    $routes->post('login', 'AuthController::login');
    $routes->post('register', 'AuthController::register');
});


$routes->group('api', ['filter' => 'auth'], function ($routes) {

    $routes->put('users/(:num)/active', 'UserController::setActive/$1');
    $routes->resource('users', ['controller' => 'UserController']);
    $routes->get('orders', 'OrderController::index');          // GET semua order
    $routes->get('orders/(:num)', 'OrderController::show/$1'); // GET by id
    $routes->post('orders', 'OrderController::create');        // POST buat order
    $routes->put('orders/(:num)', 'OrderController::update/$1'); // PUT update
    $routes->delete('orders/(:num)', 'OrderController::delete/$1'); // ✅ Tambahkan ini

    $routes->resource('order-items');

    $routes->get('invoices', 'InvoiceController::index');
    $routes->get('invoices/(:num)', 'InvoiceController::show/$1');
    $routes->post('invoices', 'InvoiceController::create');
    $routes->put('invoices/(:num)', 'InvoiceController::update/$1');
    $routes->delete('invoices/(:num)', 'InvoiceController::delete/$1');

    $routes->get('shipments', 'ShipmentController::index');
    $routes->get('shipments/(:num)', 'ShipmentController::show/$1');
    $routes->post('shipments', 'ShipmentController::create');
    $routes->put('shipments/(:num)', 'ShipmentController::update/$1');
    $routes->delete('shipments/(:num)', 'ShipmentController::delete/$1');

    $routes->resource('riwayat', ['controller' => 'RiwayatOrderController']);

    $routes->resource('prices', ['controller' => 'ProductPriceController']);

    $routes->resource('notifications', ['controller' => 'NotificationController']);
});
