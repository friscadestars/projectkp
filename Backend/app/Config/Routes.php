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

    $routes->get('agen-distributor/(:num)', 'AgentDistributorController::show/$1');
    $routes->put('users/(:num)/active', 'UserController::setActive/$1');
    $routes->resource('users', ['controller' => 'UserController']);

    $routes->get('orders', 'OrderController::index');          // GET semua order
    $routes->get('orders/(:num)', 'OrderController::show/$1'); // GET by id
    $routes->post('orders', 'OrderController::create');        // POST buat order
    $routes->put('orders/(:num)', 'OrderController::update/$1'); // PUT update
    $routes->delete('orders/(:num)', 'OrderController::delete/$1'); // DELETE order
    $routes->put('orders/(:num)/update-item-price', 'OrderController::updateItemPrice/$1'); // ✅ Tambahan ini

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

    $routes->get('orders/last', 'OrderController::countAgen');         // via query string ?agen_id=
    $routes->get('orders/last/(:num)', 'OrderController::countAgen/$1');
});

$routes->options('(:any)', function () {
    return service('response')
        ->setHeader('Access-Control-Allow-Origin', '*')
        ->setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        ->setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
        ->setStatusCode(200);
});
