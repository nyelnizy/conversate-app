<?php
use App\Actions\AuthActions;
use App\Actions\PostActions;
/**
 * Add all api actions here
 * Parameter 1 -> Action Name required
 * Parameter 2 -> Class Instance required
 * Parameter 3 -> Function Name required
 * Parameter 4 -> Requires Auth, default is false
 * Conversate::addAction('get-users',UsersService::class,'getUsers',false);
 */
Conversate::addAction('register',AuthActions::class,'register',false);
Conversate::addAction('login',AuthActions::class,'login',false);
Conversate::addAction('create-post',PostActions::class,'createPost',true);
Conversate::addAction('get-posts',PostActions::class,'getPosts',false);