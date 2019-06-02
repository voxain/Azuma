extern crate actix_web;
extern crate redis;

use actix_web::{server, App, HttpResponse};

fn main() {
    // The actix server is started here.
    // Mutiple Apps are used, one for the api, one for the websockets and one for the frontend.
    server::new(|| {
        vec![
            App::new()
                .prefix("/api")
                .resource("/", |r| r.f(|_r| HttpResponse::Ok())),
            App::new()
                .prefix("/ws")
                .resource("/", |r| r.f(|_r| HttpResponse::Ok())),
            App::new()
                .prefix("/")
                .resource("/", |r| r.f(|_r| HttpResponse::Ok())),
        ]
    })
    .bind("127.0.0.1:3467")
    .unwrap()
    .run();
}
