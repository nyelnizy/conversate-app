<?php

namespace App\Actions;

use Amot\Conversate\ActionResult;
use Amot\Conversate\Facades\Conversate;
use Amot\Conversate\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Exception;

class AuthActions {

    public function register(Request $request): ActionResult
    {
        try{
            $validator = Validator::make($request->parameter,[
                "name"=>"required",
                "email"=>"required|email|unique:users,email",
                "password"=>"required|min:6|confirmed",
            ]);
            if($validator->fails()){
                return $request->complete($validator->messages()->get('*'),422);
            }
            $data = $validator->validated();
            $data["password"] = Hash::make($data["password"]);
            $user = User::create($data);
            return $request->complete($user,201);
        }catch(Exception $e){
            logger($e->getMessage());
            return $request->complete("Internal Server Error",500);
        }
    }
    public function login(Request $request): ActionResult
    {
        try{
            $validator = Validator::make($request->parameter,[
                "email"=>"required",
                "password"=>"required",
            ]);
            if($validator->fails()){
                return $request->complete($validator->messages()->get('*'),422);
            }
            $data = $validator->validated();
            $user = User::where("email",$data["email"])->first();
            if(!is_null($user)){
                if(Hash::check($data["password"],$user->password)){
                    $token = Conversate::generateToken($user->id);
                    return $request->complete($token,200);
                }  
            }
            return $request->complete("Invalid email or password",400);
        }catch(Exception $e){
            logger($e->getMessage());
            return $request->complete("Internal server error",500); 
        }
    }
}