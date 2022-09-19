<?php

namespace App\Actions;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthActions {

    public function register(Request $request): ActionResult
    {
        $validator = Validator::make($request->parameter,[
            "name"=>"required",
            "email"=>"required|email",
            "password"=>"required|min:6|confirmed",
        ]);
        if($validator->fails()){
            return $request->complete($validator->messages()->get('*'),422);
        }
        $data = $validator->validated();
        $data["password"] = Hash::make($data["password"]);
        $user = User::create($request->paramenter);
        return $request->complete($user,201);
    }
    public function login(Request $request): ActionResult
    {
        $$validator = Validator::make($request->parameter,[
            "email"=>"required",
            "password"=>"required",
        ]);
        if($validator->fails()){
            return $request->complete($validator->messages()->get('*'),422);
        }
        $user = User::where("email",$data["email"])->first();
        if(!is_null(user)){
            if(Hash::check($data["password"],$user->password)){
                $token = Conversate::generateToken($user->id);
                return $request->complete($token,200);
            }  
        }
        return $request->complete("Invalid email or password",400);
    }
}