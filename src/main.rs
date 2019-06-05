extern crate actix_web;
extern crate bson;
extern crate lazy_static;
extern crate mongodb;

mod users;

use actix_web::{server, App, HttpResponse};
use lazy_static::lazy_static;
use mongodb::{Client, ThreadedClient};
use users::authorization::AuthMiddleware;

lazy_static! {
    pub static ref MONGODB_CLIENT: Client =
        Client::connect("localhost", 27017).expect("Failed to initialize MongoDB client.");
}

fn main() {
    // The actix server is started here.
    // Mutiple Apps are used, one for the api, one for the websockets and one for the frontend.
    server::new(|| {
        vec![
            App::new()
                .prefix("/api")
                .middleware(AuthMiddleware)
                .resource("/", |r| r.f(|_r| HttpResponse::Ok())),
            App::new()
                .prefix("/ws")
                .middleware(AuthMiddleware)
                .resource("/", |r| r.f(|_r| HttpResponse::Ok())),
            App::new()
                .prefix("/")
                .middleware(AuthMiddleware)
                .resource("/", |r| r.f(|_r| HttpResponse::Ok())),
        ]
    })
    .bind("127.0.0.1:3467")
    .unwrap()
    .run();
}
