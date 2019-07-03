use crate::{
    utils::{azflake::AzFlake, generic_responses::ErrorBody},
    MONGODB_CLIENT,
};
use actix_web::{HttpResponse, Json};
use bcrypt::{hash, DEFAULT_COST};
use mongodb::{db::ThreadedDatabase, ordered::OrderedDocument, ThreadedClient};
use serde_derive::{Deserialize, Serialize};

#[derive(Deserialize, Serialize)]
pub struct LoginData {
    username: String,
    password: String,
}

pub fn register(register_data: Json<LoginData>) -> HttpResponse {
    let register_data = register_data.into_inner();
    match register_user(register_data.username, register_data.password) {
        Ok(_) => HttpResponse::Ok().finish(),
        Err(why) => HttpResponse::Unauthorized().json(ErrorBody { error: why }),
    }
}

fn register_user(username: String, password: String) -> Result<AzFlake, String> {
    let coll = MONGODB_CLIENT.db("azuma").collection("users");
    let mut filter = OrderedDocument::new();
    filter.insert("username", username.clone());

    match coll.find_one(Some(filter), None).unwrap() {
        Some(_) => Err("This user already exists.".to_string()),

        None => {
            if password.len() < 8 {
                Err("This password is too short.".to_string())
            } else {
                match hash(password, DEFAULT_COST) {
                    Ok(hashed_password) => {
                        let id = AzFlake::new(1);
                        let mut user = OrderedDocument::new();
                        user.insert("user_id", id.id.to_string());
                        user.insert("username", username);
                        user.insert("password", hashed_password);
                        user.insert("user_groups", Vec::new());
                        user.insert("status", "online");
                        coll.insert_one(user, None).unwrap();
                        Ok(id)
                    }
                    Err(_) => Err("There was an error while processing your password.".to_string()),
                }
            }
        }
    }
}
