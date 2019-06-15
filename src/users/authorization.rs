use crate::users::user::UserId;
use crate::MONGODB_CLIENT;
use actix_web::{
    middleware::{Middleware, Started},
    HttpRequest, Result,
};
use mongodb::{db::ThreadedDatabase, ordered::OrderedDocument, ThreadedClient};

// Enum for Authorization Information
enum AuthInfo {
    NotLoggedIn,
    LoggedIn(UserId),
}

// This middleware checks if there is an auth cookie,
// and if there is one, it validates it.
// After that, Authorization Information gets
// injected into the request and the request
// gets passed along to the next middleware/function.
pub struct AuthMiddleware;

impl<S> Middleware<S> for AuthMiddleware {
    fn start(&self, req: &HttpRequest<S>) -> Result<Started> {
        match req.cookie("token") {
            Some(tokencookie) => {
                let coll = MONGODB_CLIENT.db("azuma").collection("sessions");
                let mut filter = OrderedDocument::new();
                filter.insert("token", tokencookie.name_value().1);

                match coll.find_one(Some(filter), None).unwrap() {
                    Some(object) => {
                        let mut extensions = req.extensions_mut();
                        let user = UserId {
                            id: object
                                .get("user")
                                .unwrap()
                                .as_str()
                                .unwrap()
                                .parse::<u64>()
                                .unwrap(),
                        };
                        extensions.insert(AuthInfo::LoggedIn(user));
                    }

                    None => {
                        let mut extensions = req.extensions_mut();
                        extensions.insert(AuthInfo::NotLoggedIn);
                    }
                }
            }

            None => {
                let mut extensions = req.extensions_mut();
                extensions.insert(AuthInfo::NotLoggedIn);
            }
        }

        Ok(Started::Done)
    }
}
