<?php

class AuthController extends Controller
{

    public function __construct()
    {
        parent::__construct();
        $this->verify_authentication();
    }

}
