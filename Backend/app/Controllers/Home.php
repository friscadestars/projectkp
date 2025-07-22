<?php

namespace App\Controllers;

class Home extends BaseController
{
    public function options()
    {
        return $this->response->setStatusCode(200);
    }
}
