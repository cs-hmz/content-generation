<?php

/*
|--------------------------------------------------------------------------
| Test Case
|--------------------------------------------------------------------------
|
| The closure you return from your test case provides a way to setup
| your application and database for each test. Typically, you will
| setup the database by migrating and seeding it for each test run.
|
*/

uses(Tests\TestCase::class)
    ->in('Feature');

uses(Tests\TestCase::class)
    ->in('Unit');
