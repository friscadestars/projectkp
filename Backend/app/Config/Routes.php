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

    $routes->get('agen-distributor/by-distributor/(:num)', 'AgentDistributorController::agentsByDistributor/$1');
    // $routes->get('agent-distributor/by-distributor/(:num)', 'AgentDistributorController::agentsByDistributor/$1');
    $routes->get('agen-distributor/(:num)', 'AgentDistributorController::show/$1');

    //Tambahan route untuk distributor-pabrik
    $routes->get('distributor-pabrik/by-pabrik/(:num)', 'DistributorPabrikController::distributorsByPabrik/$1');
    $routes->get('distributor-pabrik/(:num)', 'DistributorPabrikController::show/$1');

    $routes->put('users/(:num)/active', 'UserController::setActive/$1');
    $routes->resource('users', ['controller' => 'UserController']);

    // Orders
    $routes->get('orders', 'OrderController::index');

    // letakkan semua path “spesifik” SEBELUM (:segment) supaya tidak ketabrak
    $routes->get('orders/find/by-agen-no', 'OrderController::findByAgenAndNo');
    $routes->get('orders/last', 'OrderController::countAgen');
    $routes->get('orders/last/(:num)', 'OrderController::countAgen/$1');

    // Detail order (bisa id numerik ATAU order_code) – taruh PALING BAWAH
    $routes->post('orders/move-to-history/(:num)', 'OrderController::moveToHistory/$1');
    $routes->get('orders/(:segment)', 'OrderController::show/$1');
    $routes->post('orders', 'OrderController::create');
    // update & update-item-price: kita tetap pakai (:num) karena kita akan kirim ID numerik dari FE
    $routes->put('orders/(:num)', 'OrderController::update/$1');
    $routes->put('orders/(:num)/update-item-price', 'OrderController::updateItemPrice/$1');
    $routes->delete('orders/(:num)', 'OrderController::delete/$1');

    $routes->resource('order-items');

    $routes->get('invoices/getByDistributor/(:num)', 'InvoiceController::getByDistributor/$1');
    $routes->get('api/invoices/order/(:num)', 'InvoiceController::getByOrderId/$1');
    $routes->post('invoices/(:num)/confirm-payment', 'InvoiceController::confirmPayment/$1');
    $routes->get('invoices/agent/(:num)', 'InvoiceController::getByAgent/$1');
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

$routes->options('(:any)', function () {
    return service('response')
        ->setHeader('Access-Control-Allow-Origin', '*')
        ->setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        ->setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
        ->setStatusCode(200);
});
