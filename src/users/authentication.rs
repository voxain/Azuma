use crate::{
    utils::{azflake::AzFlake, generic_responses::ErrorBody},
    MONGODB_CLIENT,
};
use actix_web::{http, HttpResponse, Json};
use bcrypt::verify;
use mongodb::{db::ThreadedDatabase, ordered::OrderedDocument, ThreadedClient};
use rsgen::{gen_random_string, OutputCharsType};
use serde_derive::{Deserialize, Serialize};

#[derive(Deserialize, Serialize)]
pub struct LoginData {
    username: String,
    password: String,
}

pub fn login(login_data: Json<LoginData>) -> HttpResponse {
    let login_data = login_data.into_inner();
    match check_login(login_data.username, login_data.password) {
        Ok(user_id) => {
            let session_token = gen_random_string(
                64,
                OutputCharsType::LatinAlphabetAndNumeric {
                    use_upper_case: true,
                    use_lower_case: true,
                },
            );

            let coll = MONGODB_CLIENT.db("azuma").collection("sessions");
            let mut session = OrderedDocument::new();
            session.insert("session_id", AzFlake::new(1).id);
            session.insert("token", &session_token);
            session.insert("user", user_id);
            coll.insert_one(session, None).unwrap();

            HttpResponse::Ok()
                .cookie(
                    http::Cookie::build("token", session_token)
                        .secure(true)
                        .finish(),
                )
                .finish()
        }

        Err(why) => HttpResponse::Unauthorized().json(ErrorBody { error: why }),
    }
}

fn check_login(username: String, password: String) -> Result<u64, String> {
    let coll = MONGODB_CLIENT.db("azuma").collection("users");
    let mut filter = OrderedDocument::new();
    filter.insert("username", username);

    match coll.find_one(Some(filter), None).unwrap() {
        Some(object) => {
            let hashed_password = object.get("password").unwrap().as_str().unwrap();
            if verify(password, &hashed_password).unwrap() {
                Ok(object
                    .get("user_id")
                    .unwrap()
                    .as_str()
                    .unwrap()
                    .parse::<u64>()
                    .unwrap())
            } else {
                Err("Invalid Password".to_string())
            }
        }

        None => Err("Invalid Username".to_string()),
    }
}
