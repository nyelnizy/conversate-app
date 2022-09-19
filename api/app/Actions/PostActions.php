<?php

namespace App\Actions;
use Illuminate\Support\Facades\Validator;
use App\Models\Post;

class PostActions{

public function getPosts(Request $request): ActionResult
{
    return $request->complete(Post::orderBy("created_at","desc")->limit(100)->get());
}
public function createPost(Request $request): ActionResult
{
    $validator = Validator::make($request->parameter,[
        "body"=>"required"
    ]);
    $data = $validator->validated();
    $data["user_id"] = $request->user_id;

    if($validator->fails()){
        return $request->complete($validator->messages()->get('*'),422);
    }
    return $request->complete(Post::create($request->parameter),201);
}
}