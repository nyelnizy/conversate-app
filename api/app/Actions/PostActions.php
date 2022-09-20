<?php

namespace App\Actions;
use Illuminate\Support\Facades\Validator;
use App\Models\Post;
use Amot\Conversate\ActionResult;
use Amot\Conversate\Request;
use Exception;

class PostActions{

public function getPosts(Request $request): ActionResult
{
    return $request->complete(Post::orderBy("created_at","desc")->get());
}
public function createPost(Request $request): ActionResult
{
    try{
        $validator = Validator::make($request->parameter,[
            "body"=>"required"
        ]);
        $data = $validator->validated();
        $data["user_id"] = $request->user_id;
    
        if($validator->fails()){
            return $request->complete($validator->messages()->get('*'),422);
        }
        $post = Post::create($data);
        $post = Post::find($post->id);
        return $request->complete($post,201);
    }catch(Exception $e){
        logger($e->getMessage());
        return $request->complete("Internal server error",500);  
    }
}
}